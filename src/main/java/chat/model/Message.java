package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    @Indexed
    private String groupId;

    private String senderId;
    private String senderUsername;
    private String content;
    private Instant timestamp;
    private String messageType; // "TEXT", "SYSTEM"
    private String status = "SENT"; // "SENT", "DELIVERED", "READ"
    private String conversationType = "GROUP"; // "GROUP", "PRIVATE"
    private String recipientId; // For private 1-to-1 messaging extensibility

    public Message() {
        this.timestamp = Instant.now();
        this.messageType = "TEXT";
        this.status = "SENT";
        this.conversationType = "GROUP";
    }

    public Message(String groupId, String senderId, String senderUsername, String content, String messageType) {
        this();
        this.groupId = groupId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.messageType = (messageType != null) ? messageType : "TEXT";
    }

    public Message(String id, String groupId, String senderId, String senderUsername, String content, Instant timestamp, String messageType, String status) {
        this.id = id;
        this.groupId = groupId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.timestamp = (timestamp != null) ? timestamp : Instant.now();
        this.messageType = (messageType != null) ? messageType : "TEXT";
        this.status = (status != null) ? status : "SENT";
        this.conversationType = "GROUP";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
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

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getConversationType() {
        return conversationType;
    }

    public void setConversationType(String conversationType) {
        this.conversationType = conversationType;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }
}
