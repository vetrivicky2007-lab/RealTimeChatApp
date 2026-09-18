package chat.service;

import chat.dto.MessageDto;
import chat.model.Message;
import chat.repository.MessageRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public MessageDto saveMessage(String groupId, String senderId, String senderUsername, String content, String messageType) {
        if (content == null || content.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message content cannot be empty");
        }

        String trimmedContent = content.trim();
        if (trimmedContent.length() > 2000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message content cannot exceed 2000 characters");
        }

        Message message = new Message(
                groupId,
                senderId,
                senderUsername,
                trimmedContent,
                messageType != null ? messageType : "TEXT"
        );
        message.setTimestamp(Instant.now());
        message.setStatus("SENT");

        Message saved = messageRepository.save(message);
        return toDto(saved);
    }

    public MessageDto savePreGeneratedMessage(
            String messageId,
            String groupId,
            String senderId,
            String senderUsername,
            String content,
            Instant timestamp,
            String messageType) {

        if (content == null || content.trim().isEmpty()) {
            return null;
        }

        Message message = new Message(
                messageId,
                groupId,
                senderId,
                senderUsername,
                content.trim(),
                timestamp != null ? timestamp : Instant.now(),
                messageType != null ? messageType : "TEXT",
                "SENT"
        );

        Message saved = messageRepository.save(message);
        return toDto(saved);
    }

    public List<MessageDto> getGroupMessages(String groupId, int limit) {
        int cappedLimit = Math.min(Math.max(limit, 1), 100);
        Pageable pageable = PageRequest.of(0, cappedLimit);

        // Fetch descending by timestamp (latest first), then reverse so output is chronological
        List<Message> latestMessages = messageRepository.findByGroupIdOrderByTimestampDesc(groupId, pageable);
        Collections.reverse(latestMessages);

        return latestMessages.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MessageDto toDto(Message message) {
        return new MessageDto(
                message.getId(),
                message.getGroupId(),
                message.getSenderId(),
                message.getSenderUsername(),
                message.getContent(),
                message.getTimestamp(),
                message.getMessageType(),
                message.getStatus() != null ? message.getStatus() : "SENT"
        );
    }
}
