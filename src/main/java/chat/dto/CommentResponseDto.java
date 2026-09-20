package chat.dto;

import java.time.Instant;

public class CommentResponseDto {

    private String id;
    private String postId;
    private String communityId;
    private String authorId;
    private String authorUsername;
    private String content;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean canDelete;
    private String parentCommentId;
    private boolean edited;

    public CommentResponseDto() {
    }

    public CommentResponseDto(String id, String postId, String communityId, String authorId, String authorUsername, String content, Instant createdAt, Instant updatedAt, boolean canDelete) {
        this.id = id;
        this.postId = postId;
        this.communityId = communityId;
        this.authorId = authorId;
        this.authorUsername = authorUsername;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.canDelete = canDelete;
    }
    
    public CommentResponseDto(String id, String postId, String communityId, String authorId, String authorUsername, String content, Instant createdAt, Instant updatedAt, boolean canDelete, String parentCommentId, boolean edited) {
        this(id, postId, communityId, authorId, authorUsername, content, createdAt, updatedAt, canDelete);
        this.parentCommentId = parentCommentId;
        this.edited = edited;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public boolean isCanDelete() {
        return canDelete;
    }

    public void setCanDelete(boolean canDelete) {
        this.canDelete = canDelete;
    }

    public String getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(String parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public boolean isEdited() {
        return edited;
    }

    public void setEdited(boolean edited) {
        this.edited = edited;
    }
}
