package chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateGroupRequest {

    @NotBlank(message = "Group name is required")
    @Size(min = 2, max = 50, message = "Group name must be between 2 and 50 characters")
    private String name;

    @Size(max = 250, message = "Description cannot exceed 250 characters")
    private String description;

    private String privacy = "PUBLIC"; // "PUBLIC" or "PRIVATE"

    public CreateGroupRequest() {
    }

    public CreateGroupRequest(String name, String description) {
        this.name = name;
        this.description = description;
        this.privacy = "PUBLIC";
    }

    public CreateGroupRequest(String name, String description, String privacy) {
        this.name = name;
        this.description = description;
        this.privacy = (privacy != null && privacy.equalsIgnoreCase("PRIVATE")) ? "PRIVATE" : "PUBLIC";
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
}
