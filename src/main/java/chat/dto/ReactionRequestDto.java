package chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ReactionRequestDto {

    @NotBlank(message = "Reaction type cannot be blank")
    @Pattern(regexp = "^(?i)(LIKE|DISLIKE|REMOVE)$", message = "Reaction type must be LIKE, DISLIKE, or REMOVE")
    private String type;

    public ReactionRequestDto() {
    }

    public ReactionRequestDto(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
