package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "comments")
@CompoundIndexes({
        @CompoundIndex(name = "post_createdAt_idx", def = "{'postId': 1, 'createdAt': 1}")
})
public class PostComment {

    @Id
    private String id;

    @Indexed
    private String postId;

    private String communityId;

    @Indexed
    private String authorId;
    private String authorUsername;

    private String content;

    private Instant createdAt;
    private Instant updatedAt;

    private String parentCommentId;
    private boolean edited;

    public PostComment() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.edited = false;
    }

    public PostComment(String postId, String communityId, String authorId, String authorUsername, String content) {
        this();
        this.postId = postId;
        this.communityId = communityId;
        this.authorId = authorId;
        this.authorUsername = authorUsername;
        this.content = content;
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
}
