package chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentDto {

    @NotBlank(message = "Comment content cannot be empty")
    @Size(max = 1000, message = "Comment content cannot exceed 1000 characters")
    private String content;

    public CreateCommentDto() {
    }

    public CreateCommentDto(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
