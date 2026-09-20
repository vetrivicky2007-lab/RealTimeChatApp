package chat.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class PostResponseDto {

    private String id;
    private String communityId;
    private String authorId;
    private String authorUsername;

    private String title;
    private String content;

    private String mediaUrl;
    private String mediaType;

    private String externalUrl;
    private String category;
    private List<String> tags = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;
    private boolean edited;

    private int likeCount;
    private int dislikeCount;
    private int commentCount;

    // Community Verification aggregated stats
    private int verifiedCount;
    private int notVerifiedCount;
    private int totalVerifications;
    private int verifiedPercent;
    private int notVerifiedPercent;

    private int viewCount;

    // User-specific interaction state
    private String userReaction; // "LIKE", "DISLIKE", or null
    private String userVerification; // "VERIFIED", "NOT_VERIFIED", or null
    private boolean isBookmarked;
    private boolean canEdit;
    private boolean canDelete;

    public PostResponseDto() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCommunityId() {
        return communityId;
    }

    public void setCommunityId(String communityId) {
        this.communityId = communityId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getExternalUrl() {
        return externalUrl;
    }

    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags != null ? tags : new ArrayList<>();
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

    public boolean isEdited() {
        return edited;
    }

    public void setEdited(boolean edited) {
        this.edited = edited;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public int getDislikeCount() {
        return dislikeCount;
    }

    public void setDislikeCount(int dislikeCount) {
        this.dislikeCount = dislikeCount;
    }

    public int getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

    public int getVerifiedCount() {
        return verifiedCount;
    }

    public void setVerifiedCount(int verifiedCount) {
        this.verifiedCount = verifiedCount;
        calculateVerificationStats();
    }

    public int getNotVerifiedCount() {
        return notVerifiedCount;
    }

    public void setNotVerifiedCount(int notVerifiedCount) {
        this.notVerifiedCount = notVerifiedCount;
        calculateVerificationStats();
    }

    public int getTotalVerifications() {
        return totalVerifications;
    }

    public void setTotalVerifications(int totalVerifications) {
        this.totalVerifications = totalVerifications;
    }

    public int getVerifiedPercent() {
        return verifiedPercent;
    }

    public void setVerifiedPercent(int verifiedPercent) {
        this.verifiedPercent = verifiedPercent;
    }

    public int getNotVerifiedPercent() {
        return notVerifiedPercent;
    }

    public void setNotVerifiedPercent(int notVerifiedPercent) {
        this.notVerifiedPercent = notVerifiedPercent;
    }

    public void calculateVerificationStats() {
        this.totalVerifications = this.verifiedCount + this.notVerifiedCount;
        if (this.totalVerifications > 0) {
            this.verifiedPercent = Math.round((float) this.verifiedCount * 100 / this.totalVerifications);
            this.notVerifiedPercent = 100 - this.verifiedPercent;
        } else {
            this.verifiedPercent = 0;
            this.notVerifiedPercent = 0;
        }
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public String getUserReaction() {
        return userReaction;
    }

    public void setUserReaction(String userReaction) {
        this.userReaction = userReaction;
    }

    public String getUserVerification() {
        return userVerification;
    }

    public void setUserVerification(String userVerification) {
        this.userVerification = userVerification;
    }

    public boolean isBookmarked() {
        return isBookmarked;
    }

    public void setBookmarked(boolean bookmarked) {
        isBookmarked = bookmarked;
    }

    public boolean isCanEdit() {
        return canEdit;
    }

    public void setCanEdit(boolean canEdit) {
        this.canEdit = canEdit;
    }

    public boolean isCanDelete() {
        return canDelete;
    }

    public void setCanDelete(boolean canDelete) {
        this.canDelete = canDelete;
    }
}
