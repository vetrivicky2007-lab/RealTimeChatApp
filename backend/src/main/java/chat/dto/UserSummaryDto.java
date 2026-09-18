package chat.dto;

import java.time.Instant;

public class UserSummaryDto {

    private String id;
    private String username;
    private String email;
    private Instant createdAt;
    private String status;

    public UserSummaryDto() {
    }

    public UserSummaryDto(String id, String username, String email, Instant createdAt, String status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = createdAt;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
