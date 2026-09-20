package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "post_verifications")
@CompoundIndexes({
        @CompoundIndex(name = "post_user_verification_idx", def = "{'postId': 1, 'userId': 1}", unique = true)
})
public class PostVerification {

    @Id
    private String id;

    @Indexed
    private String postId;

    @Indexed
    private String userId;
    private String username;

    private String verdict; // "VERIFIED", "NOT_VERIFIED"
    private String reason;
    private String evidenceUrl;

    private Instant createdAt;
    private Instant updatedAt;

    public PostVerification() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public PostVerification(String postId, String userId, String username, String verdict, String reason, String evidenceUrl) {
        this();
        this.postId = postId;
        this.userId = userId;
        this.username = username;
        this.verdict = verdict;
        this.reason = reason;
        this.evidenceUrl = evidenceUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
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

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getEvidenceUrl() {
        return evidenceUrl;
    }

    public void setEvidenceUrl(String evidenceUrl) {
        this.evidenceUrl = evidenceUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
