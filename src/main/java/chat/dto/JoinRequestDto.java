package chat.dto;

import java.time.Instant;

public class JoinRequestDto {

    private String id;
    private String groupId;
    private String userId;
    private String username;
    private String status;
    private Instant requestedAt;

    public JoinRequestDto() {
    }

    public JoinRequestDto(String id, String groupId, String userId, String username, String status, Instant requestedAt) {
        this.id = id;
        this.groupId = groupId;
        this.userId = userId;
        this.username = username;
        this.status = status;
        this.requestedAt = requestedAt;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(Instant requestedAt) {
        this.requestedAt = requestedAt;
    }
}
