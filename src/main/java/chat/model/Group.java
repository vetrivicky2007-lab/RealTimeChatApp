package chat.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "groups")
public class Group {

    @Id
    private String id;

    private String name;
    private String description;
    private String privacy = "PUBLIC"; // "PUBLIC" or "PRIVATE"

    @Indexed(sparse = true)
    private String inviteCode; // Generated if privacy is PRIVATE

    private String createdBy; // userId of the administrator
    private Instant createdAt;
    private Instant updatedAt;
    private List<String> members = new ArrayList<>();
    private int memberCount;

    public Group() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.members = new ArrayList<>();
        this.memberCount = 0;
        this.privacy = "PUBLIC";
    }

    public Group(String name, String description, String createdBy, String privacy, String inviteCode) {
        this();
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.privacy = (privacy != null && privacy.equalsIgnoreCase("PRIVATE")) ? "PRIVATE" : "PUBLIC";
        this.inviteCode = inviteCode;
        if (createdBy != null) {
            this.members.add(createdBy);
            this.memberCount = 1;
        }
    }

    public void addMember(String userId) {
        if (!members.contains(userId)) {
            members.add(userId);
            this.memberCount = members.size();
            this.updatedAt = Instant.now();
        }
    }

    public void removeMember(String userId) {
        if (members.remove(userId)) {
            this.memberCount = members.size();
            this.updatedAt = Instant.now();
        }
    }

    public boolean hasMember(String userId) {
        return members != null && members.contains(userId);
    }

    public boolean isAdmin(String userId) {
        return createdBy != null && createdBy.equals(userId);
    }

    public boolean isPrivate() {
        return "PRIVATE".equalsIgnoreCase(this.privacy);
    }

    public boolean isPublic() {
        return !isPrivate();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrivacy() {
        return privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = (privacy != null && privacy.equalsIgnoreCase("PRIVATE")) ? "PRIVATE" : "PUBLIC";
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
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

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members != null ? members : new ArrayList<>();
        this.memberCount = this.members.size();
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }
}
