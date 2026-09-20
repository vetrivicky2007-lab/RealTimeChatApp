package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "post_reactions")
@CompoundIndexes({
        @CompoundIndex(name = "post_user_reaction_idx", def = "{'postId': 1, 'userId': 1}", unique = true)
})
public class PostReaction {

    @Id
    private String id;

    @Indexed
    private String postId;

    @Indexed
    private String userId;

    private String type; // "LIKE", "DISLIKE"
    private Instant createdAt;

    public PostReaction() {
        this.createdAt = Instant.now();
    }

    public PostReaction(String postId, String userId, String type) {
        this();
        this.postId = postId;
        this.userId = userId;
        this.type = type;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
