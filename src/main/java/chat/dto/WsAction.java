package chat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class WsAction {

    // Action types:
    // Incoming: AUTH, JOIN_GROUP, LEAVE_GROUP, SEND_MESSAGE, TYPING_START, TYPING_STOP
    // Outgoing: MESSAGE, ONLINE_USERS, TYPING_UPDATE, ERROR, AUTH_SUCCESS
    private String type;

    private String token;
    private String groupId;
    private String messageId;
    private String senderId;
    private String senderUsername;
    private String content;
    private Instant timestamp;
    private String status;
    private String messageType;
    private String mediaUrl;

    // Post notification fields
    private String postId;
    private String title;

    // Typing state
    private Boolean isTyping;
    private String username;

    // Group state
    private Integer onlineCount;
    private List<String> users;
    private String error;

    public WsAction() {
    }

    public static WsAction error(String error) {
        WsAction action = new WsAction();
        action.setType("ERROR");
        action.setError(error);
        return action;
    }

    public static WsAction authSuccess(String username) {
        WsAction action = new WsAction();
        action.setType("AUTH_SUCCESS");
        action.setUsername(username);
        return action;
    }

    public static WsAction message(String messageId, String groupId, String senderId, String senderUsername, String content, Instant timestamp, String status) {
        return message(messageId, groupId, senderId, senderUsername, content, timestamp, status, "TEXT", null);
    }

    public static WsAction message(String messageId, String groupId, String senderId, String senderUsername, String content, Instant timestamp, String status, String messageType, String mediaUrl) {
        WsAction action = new WsAction();
        action.setType("MESSAGE");
        action.setMessageId(messageId);
        action.setGroupId(groupId);
        action.setSenderId(senderId);
        action.setSenderUsername(senderUsername);
        action.setContent(content);
        action.setTimestamp(timestamp);
        action.setStatus(status != null ? status : "SENT");
        action.setMessageType(messageType != null ? messageType : "TEXT");
        action.setMediaUrl(mediaUrl);
        return action;
    }

    public static WsAction postCreated(String communityId, String postId, String authorUsername, String title) {
        WsAction action = new WsAction();
        action.setType("POST_CREATED");
        action.setGroupId(communityId);
        action.setPostId(postId);
        action.setSenderUsername(authorUsername);
        action.setTitle(title);
        action.setTimestamp(Instant.now());
        return action;
    }

    public static WsAction typingUpdate(String groupId, String username, boolean isTyping) {
        WsAction action = new WsAction();
        action.setType("TYPING_UPDATE");
        action.setGroupId(groupId);
        action.setUsername(username);
        action.setIsTyping(isTyping);
        return action;
    }

    public static WsAction onlineUsers(String groupId, int count, List<String> users) {
        WsAction action = new WsAction();
        action.setType("ONLINE_USERS");
        action.setGroupId(groupId);
        action.setOnlineCount(count);
        action.setUsers(users);
        return action;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public Boolean getIsTyping() {
        return isTyping;
    }

    public void setIsTyping(Boolean isTyping) {
        this.isTyping = isTyping;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getOnlineCount() {
        return onlineCount;
    }

    public void setOnlineCount(Integer onlineCount) {
        this.onlineCount = onlineCount;
    }

    public List<String> getUsers() {
        return users;
    }

    public void setUsers(List<String> users) {
        this.users = users;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
