package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "post_bookmarks")
@CompoundIndexes({
        @CompoundIndex(name = "user_post_bookmark_idx", def = "{'userId': 1, 'postId': 1}", unique = true)
})
public class PostBookmark {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String postId;

    private Instant createdAt;

    public PostBookmark() {
        this.createdAt = Instant.now();
    }

    public PostBookmark(String userId, String postId) {
        this();
        this.userId = userId;
        this.postId = postId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
