package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
@CompoundIndexes({
        @CompoundIndex(name = "community_createdAt_idx", def = "{'communityId': 1, 'createdAt': -1}")
})
public class Post {

    @Id
    private String id;

    @Indexed
    private String communityId;

    @Indexed
    private String authorId;
    private String authorUsername;

    private String title;
    private String content;

    private String mediaUrl;
    private String mediaType; // "IMAGE"

    private String externalUrl;
    private String category;
    private List<String> tags = new ArrayList<>();

    @Indexed
    private Instant createdAt;
    private Instant updatedAt;
    private boolean edited = false;

    private int likeCount = 0;
    private int dislikeCount = 0;
    private int commentCount = 0;
    private int verifiedCount = 0;
    private int notVerifiedCount = 0;
    private int viewCount = 0;

    public Post() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.tags = new ArrayList<>();
    }

    public Post(String communityId, String authorId, String authorUsername, String title, String content) {
        this();
        this.communityId = communityId;
        this.authorId = authorId;
        this.authorUsername = authorUsername;
        this.title = title;
        this.content = content;
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
        this.likeCount = Math.max(0, likeCount);
    }

    public int getDislikeCount() {
        return dislikeCount;
    }

    public void setDislikeCount(int dislikeCount) {
        this.dislikeCount = Math.max(0, dislikeCount);
    }

    public int getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = Math.max(0, commentCount);
    }

    public int getVerifiedCount() {
        return verifiedCount;
    }

    public void setVerifiedCount(int verifiedCount) {
        this.verifiedCount = Math.max(0, verifiedCount);
    }

    public int getNotVerifiedCount() {
        return notVerifiedCount;
    }

    public void setNotVerifiedCount(int notVerifiedCount) {
        this.notVerifiedCount = Math.max(0, notVerifiedCount);
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = Math.max(0, viewCount);
    }
}
