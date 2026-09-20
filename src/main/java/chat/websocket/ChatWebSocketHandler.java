package chat.websocket;

import chat.dto.WsAction;
import chat.security.JwtTokenProvider;
import chat.service.GroupService;
import chat.service.MessageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatWebSocketHandler.class);

    private final JwtTokenProvider tokenProvider;
    private final GroupService groupService;
    private final MessageService messageService;
    private final ObjectMapper objectMapper;

    // Map: SessionId -> UserSessionInfo
    private final Map<String, UserSessionInfo> sessionUsers = new ConcurrentHashMap<>();

    // Map: GroupId -> Set of active WebSocket sessions
    private final Map<String, Set<WebSocketSession>> groupRooms = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(
            JwtTokenProvider tokenProvider,
            GroupService groupService,
            MessageService messageService) {
        this.tokenProvider = tokenProvider;
        this.groupService = groupService;
        this.messageService = messageService;

        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        logger.info("WebSocket connection established: {}", session.getId());

        // Check if token is provided in query params: /ws?token=<jwt>
        String token = extractTokenFromQuery(session.getUri());
        if (token != null && tokenProvider.validateToken(token)) {
            String userId = tokenProvider.getUserIdFromToken(token);
            String username = tokenProvider.getUsernameFromToken(token);
            sessionUsers.put(session.getId(), new UserSessionInfo(userId, username));
            sendToSession(session, WsAction.authSuccess(username));
            logger.info("Session {} authenticated via query param as user: {}", session.getId(), username);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            String payload = message.getPayload();
            if (payload == null) return;

            // Support plain text protocol (JOIN:<username> and plain message broadcast)
            if (payload.startsWith("JOIN:")) {
                String username = payload.substring(5).trim();
                sessionUsers.put(session.getId(), new UserSessionInfo(session.getId(), username));
                logger.info("Session {} registered via plain JOIN as user: {}", session.getId(), username);
                try {
                    session.sendMessage(new TextMessage("USERS:" + username));
                } catch (Exception ignored) {}
                return;
            }

            if (!payload.trim().startsWith("{")) {
                TextMessage broadcastMsg = new TextMessage("MSG:" + payload);
                try {
                    session.sendMessage(broadcastMsg);
                } catch (Exception ignored) {}
                return;
            }

            WsAction action = objectMapper.readValue(payload, WsAction.class);

            if (action == null || action.getType() == null) {
                sendToSession(session, WsAction.error("Invalid action payload"));
                return;
            }

            switch (action.getType()) {
                case "AUTH" -> handleAuth(session, action);
                case "JOIN_GROUP" -> handleJoinGroup(session, action);
                case "LEAVE_GROUP" -> handleLeaveGroup(session, action);
                case "SEND_MESSAGE" -> handleSendMessage(session, action);
                case "TYPING_START" -> handleTyping(session, action, true);
                case "TYPING_STOP" -> handleTyping(session, action, false);
                default -> sendToSession(session, WsAction.error("Unknown action: " + action.getType()));
            }

        } catch (Exception e) {
            logger.error("Error processing WebSocket message for session {}: {}", session.getId(), e.getMessage());
            sendToSession(session, WsAction.error("Failed to process message"));
        }
    }

    private void handleAuth(WebSocketSession session, WsAction action) {
        String token = action.getToken();
        if (token != null && tokenProvider.validateToken(token)) {
            String userId = tokenProvider.getUserIdFromToken(token);
            String username = tokenProvider.getUsernameFromToken(token);
            sessionUsers.put(session.getId(), new UserSessionInfo(userId, username));
            sendToSession(session, WsAction.authSuccess(username));
            logger.info("Session {} authenticated via AUTH message as user: {}", session.getId(), username);
        } else {
            sendToSession(session, WsAction.error("Authentication failed: invalid token"));
        }
    }

    private void handleJoinGroup(WebSocketSession session, WsAction action) {
        UserSessionInfo user = sessionUsers.get(session.getId());
        if (user == null) {
            sendToSession(session, WsAction.error("Please authenticate first"));
            return;
        }

        String groupId = action.getGroupId();
        if (groupId == null || groupId.trim().isEmpty()) {
            sendToSession(session, WsAction.error("GroupId is required to join group"));
            return;
        }

        if (!groupService.isMember(groupId, user.userId)) {
            sendToSession(session, WsAction.error("You must join this group before accessing chat"));
            return;
        }

        // Leave any previous group room first
        if (user.currentGroupId != null && !user.currentGroupId.equals(groupId)) {
            leaveCurrentGroup(session, user);
        }

        user.currentGroupId = groupId;
        groupRooms.computeIfAbsent(groupId, k -> ConcurrentHashMap.newKeySet()).add(session);
        logger.info("User {} ({}) joined group room: {}", user.username, session.getId(), groupId);

        broadcastOnlineUsers(groupId);
    }

    private void handleLeaveGroup(WebSocketSession session, WsAction action) {
        UserSessionInfo user = sessionUsers.get(session.getId());
        if (user != null) {
            leaveCurrentGroup(session, user);
        }
    }

    private void handleSendMessage(WebSocketSession session, WsAction action) {
        UserSessionInfo user = sessionUsers.get(session.getId());
        if (user == null) {
            sendToSession(session, WsAction.error("Please authenticate first"));
            return;
        }

        String groupId = action.getGroupId();
        if (groupId == null || groupId.trim().isEmpty()) {
            groupId = user.currentGroupId;
        }

        // Ensure this session is in groupRooms so it immediately receives room broadcasts
        groupRooms.computeIfAbsent(groupId, k -> ConcurrentHashMap.newKeySet()).add(session);
        user.currentGroupId = groupId;

        String content = action.getContent();
        String mediaUrl = action.getMediaUrl();
        String messageType = action.getMessageType();
        if (messageType == null || messageType.trim().isEmpty()) {
            messageType = (mediaUrl != null && !mediaUrl.trim().isEmpty()) ? "IMAGE" : "TEXT";
        }

        if ((content == null || content.trim().isEmpty()) && (mediaUrl == null || mediaUrl.trim().isEmpty())) {
            sendToSession(session, WsAction.error("Message content or image attachment cannot be empty"));
            return;
        }

        // 1. Assign ID and timestamp immediately in-memory
        String messageId = UUID.randomUUID().toString();
        Instant now = Instant.now();
        String trimmedContent = content != null ? content.trim() : "";

        // 2. Build structured message frame matching requirement
        WsAction broadcastAction = WsAction.message(
                messageId,
                groupId,
                user.userId,
                user.username,
                trimmedContent,
                now,
                "SENT",
                messageType,
                mediaUrl
        );

        // 3. BROADCAST IMMEDIATELY to ALL active sessions in group room (including sender!)
        // Zero delay: Delivery occurs in-memory across active WebSockets
        broadcastToGroup(groupId, broadcastAction);

        // 4. PERSIST ASYNCHRONOUSLY to MongoDB Atlas in the background
        // Slow cloud database latency never blocks real-time delivery!
        final String finalGroupId = groupId;
        final String finalMessageType = messageType;
        final String finalMediaUrl = mediaUrl;
        CompletableFuture.runAsync(() -> {
            try {
                messageService.savePreGeneratedMessage(
                        messageId,
                        finalGroupId,
                        user.userId,
                        user.username,
                        trimmedContent,
                        now,
                        finalMessageType,
                        finalMediaUrl
                );
            } catch (Exception e) {
                logger.error("Async MongoDB persistence failed for message {}: {}", messageId, e.getMessage());
            }
        });
    }

    private void handleTyping(WebSocketSession session, WsAction action, boolean isTyping) {
        UserSessionInfo user = sessionUsers.get(session.getId());
        if (user == null) return;

        String groupId = action.getGroupId();
        if (groupId == null) groupId = user.currentGroupId;
        if (groupId == null) return;

        WsAction typingAction = WsAction.typingUpdate(groupId, user.username, isTyping);

        // Broadcast to group members excluding sender
        Set<WebSocketSession> sessions = groupRooms.get(groupId);
        if (sessions == null || sessions.isEmpty()) return;

        try {
            String json = objectMapper.writeValueAsString(typingAction);
            TextMessage textMessage = new TextMessage(json);

            for (WebSocketSession s : sessions) {
                if (s.isOpen() && !s.getId().equals(session.getId())) {
                    synchronized (s) {
                        try {
                            s.sendMessage(textMessage);
                        } catch (IOException e) {
                            logger.warn("Failed sending typing status to session {}: {}", s.getId(), e.getMessage());
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error broadcasting typing event: {}", e.getMessage());
        }
    }

    private void leaveCurrentGroup(WebSocketSession session, UserSessionInfo user) {
        String groupId = user.currentGroupId;
        if (groupId != null) {
            Set<WebSocketSession> sessions = groupRooms.get(groupId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    groupRooms.remove(groupId);
                }
            }
            user.currentGroupId = null;
            broadcastOnlineUsers(groupId);
            logger.info("User {} left group room: {}", user.username, groupId);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("WebSocket connection closed: {}", session.getId());
        UserSessionInfo user = sessionUsers.remove(session.getId());
        if (user != null && user.currentGroupId != null) {
            leaveCurrentGroup(session, user);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        logger.warn("WebSocket transport error for session {}: {}", session.getId(), exception.getMessage());
        try {
            session.close(CloseStatus.SERVER_ERROR);
        } catch (IOException ignored) {
        }
    }

    private void broadcastToGroup(String groupId, WsAction action) {
        Set<WebSocketSession> sessions = groupRooms.get(groupId);
        if (sessions == null || sessions.isEmpty()) {
            return;
        }

        try {
            String json = objectMapper.writeValueAsString(action);
            TextMessage textMessage = new TextMessage(json);

            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    synchronized (s) {
                        try {
                            s.sendMessage(textMessage);
                        } catch (IOException e) {
                            logger.warn("Failed to send message to session {}: {}", s.getId(), e.getMessage());
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error serializing group broadcast: {}", e.getMessage());
        }
    }

    public void broadcastPostCreated(String communityId, String postId, String authorUsername, String title) {
        WsAction action = WsAction.postCreated(communityId, postId, authorUsername, title);
        broadcastToGroup(communityId, action);
    }

    private void broadcastOnlineUsers(String groupId) {
        Set<WebSocketSession> sessions = groupRooms.get(groupId);
        if (sessions == null) {
            return;
        }

        List<String> usernames = sessions.stream()
                .map(s -> sessionUsers.get(s.getId()))
                .filter(Objects::nonNull)
                .map(u -> u.username)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        WsAction onlineAction = WsAction.onlineUsers(groupId, usernames.size(), usernames);
        broadcastToGroup(groupId, onlineAction);
    }

    private void sendToSession(WebSocketSession session, WsAction action) {
        if (!session.isOpen()) return;
        try {
            String json = objectMapper.writeValueAsString(action);
            synchronized (session) {
                session.sendMessage(new TextMessage(json));
            }
        } catch (IOException e) {
            logger.warn("Failed to send message to session {}: {}", session.getId(), e.getMessage());
        }
    }

    private String extractTokenFromQuery(URI uri) {
        if (uri == null || uri.getQuery() == null) return null;
        for (String param : uri.getQuery().split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2 && "token".equalsIgnoreCase(pair[0])) {
                return pair[1];
            }
        }
        return null;
    }

    private static class UserSessionInfo {
        final String userId;
        final String username;
        volatile String currentGroupId;

        UserSessionInfo(String userId, String username) {
            this.userId = userId;
            this.username = username;
        }
    }
}
