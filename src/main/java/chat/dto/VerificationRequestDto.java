package chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class VerificationRequestDto {

    @NotBlank(message = "Verification verdict cannot be blank")
    @Pattern(regexp = "^(?i)(VERIFIED|NOT_VERIFIED|REMOVE)$", message = "Verdict must be VERIFIED, NOT_VERIFIED, or REMOVE")
    private String verdict;

    @Size(max = 1000, message = "Reason cannot exceed 1000 characters")
    private String reason;

    @Size(max = 1000, message = "Evidence URL cannot exceed 1000 characters")
    private String evidenceUrl;

    public VerificationRequestDto() {
    }

    public VerificationRequestDto(String verdict, String reason, String evidenceUrl) {
        this.verdict = verdict;
        this.reason = reason;
        this.evidenceUrl = evidenceUrl;
    }

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getEvidenceUrl() {
        return evidenceUrl;
    }

    public void setEvidenceUrl(String evidenceUrl) {
        this.evidenceUrl = evidenceUrl;
    }
}
