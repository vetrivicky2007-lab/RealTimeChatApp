package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "join_requests")
@CompoundIndexes({
        @CompoundIndex(name = "group_user_idx", def = "{'groupId': 1, 'userId': 1}")
})
public class JoinRequest {

    @Id
    private String id;

    @Indexed
    private String groupId;

    @Indexed
    private String userId;

    private String username;

    // Status: PENDING, APPROVED, REJECTED
    @Indexed
    private String status = "PENDING";

    private Instant requestedAt;
    private Instant reviewedAt;
    private String reviewedBy;

    public JoinRequest() {
        this.requestedAt = Instant.now();
        this.status = "PENDING";
    }

    public JoinRequest(String groupId, String userId, String username) {
        this();
        this.groupId = groupId;
        this.userId = userId;
        this.username = username;
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

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(Instant reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
}
