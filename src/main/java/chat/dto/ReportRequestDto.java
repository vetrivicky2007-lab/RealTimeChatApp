package chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ReportRequestDto {

    @NotBlank(message = "Report reason cannot be blank")
    private String reason;

    @Size(max = 1000, message = "Details cannot exceed 1000 characters")
    private String details;

    public ReportRequestDto() {
    }

    public ReportRequestDto(String reason, String details) {
        this.reason = reason;
        this.details = details;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
