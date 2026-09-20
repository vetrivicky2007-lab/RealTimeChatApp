package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "post_reports")
public class PostReport {

    @Id
    private String id;

    @Indexed
    private String postId;

    @Indexed
    private String communityId;

    @Indexed
    private String reporterId;
    private String reporterUsername;

    private String reason;
    private String details;
    private String status = "PENDING"; // "PENDING", "RESOLVED", "DISMISSED"

    private Instant createdAt;

    public PostReport() {
        this.createdAt = Instant.now();
        this.status = "PENDING";
    }

    public PostReport(String postId, String communityId, String reporterId, String reporterUsername, String reason, String details) {
        this();
        this.postId = postId;
        this.communityId = communityId;
        this.reporterId = reporterId;
        this.reporterUsername = reporterUsername;
        this.reason = reason;
        this.details = details;
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

    public String getCommunityId() {
        return communityId;
    }

    public void setCommunityId(String communityId) {
        this.communityId = communityId;
    }

    public String getReporterId() {
        return reporterId;
    }

    public void setReporterId(String reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterUsername() {
        return reporterUsername;
    }

    public void setReporterUsername(String reporterUsername) {
        this.reporterUsername = reporterUsername;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
