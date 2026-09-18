package chat.dto;

import java.time.Instant;

public class MessageDto {

    private String id;
    private String groupId;
    private String senderId;
    private String senderUsername;
    private String content;
    private Instant timestamp;
    private String messageType;
    private String status = "SENT";
    private String conversationType = "GROUP";

    public MessageDto() {
    }

    public MessageDto(String id, String groupId, String senderId, String senderUsername, String content, Instant timestamp, String messageType) {
        this.id = id;
        this.groupId = groupId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.timestamp = timestamp;
        this.messageType = messageType;
        this.status = "SENT";
        this.conversationType = "GROUP";
    }

    public MessageDto(String id, String groupId, String senderId, String senderUsername, String content, Instant timestamp, String messageType, String status) {
        this.id = id;
        this.groupId = groupId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.timestamp = timestamp;
        this.messageType = messageType;
        this.status = status;
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
}
