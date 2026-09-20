package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "post_views")
@CompoundIndex(name = "post_user_unique_idx", def = "{'postId': 1, 'userId': 1}", unique = true)
public class PostView {

    @Id
    private String id;

    @Indexed
    private String postId;

    @Indexed
    private String userId;

    private Instant viewedAt;

    public PostView() {
        this.viewedAt = Instant.now();
    }

    public PostView(String postId, String userId) {
        this();
        this.postId = postId;
        this.userId = userId;
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

    public Instant getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(Instant viewedAt) {
        this.viewedAt = viewedAt;
    }
}
