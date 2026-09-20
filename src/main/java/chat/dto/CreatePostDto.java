package chat.dto;

import java.util.ArrayList;
import java.util.List;

public class CreatePostDto {

    private String title;
    private String content;
    private String externalUrl;
    private String category;
    private List<String> tags = new ArrayList<>();

    public CreatePostDto() {
    }

    public CreatePostDto(String title, String content, String externalUrl, String category, List<String> tags) {
        this.title = title;
        this.content = content;
        this.externalUrl = externalUrl;
        this.category = category;
        this.tags = tags != null ? tags : new ArrayList<>();
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
}
