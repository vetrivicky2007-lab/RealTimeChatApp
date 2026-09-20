package chat.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class VerificationDetailsDto {

    private int totalAssessments;
    private int verifiedCount;
    private int notVerifiedCount;
    private int verifiedPercent;
    private int notVerifiedPercent;
    private List<VerificationItemDto> assessments = new ArrayList<>();

    public VerificationDetailsDto() {
    }

    public static class VerificationItemDto {
        private String username;
        private String verdict;
        private String reason;
        private String evidenceUrl;
        private Instant createdAt;

        public VerificationItemDto() {
        }

        public VerificationItemDto(String username, String verdict, String reason, String evidenceUrl, Instant createdAt) {
            this.username = username;
            this.verdict = verdict;
            this.reason = reason;
            this.evidenceUrl = evidenceUrl;
            this.createdAt = createdAt;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
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

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }

    public int getTotalAssessments() {
        return totalAssessments;
    }

    public void setTotalAssessments(int totalAssessments) {
        this.totalAssessments = totalAssessments;
    }

    public int getVerifiedCount() {
        return verifiedCount;
    }

    public void setVerifiedCount(int verifiedCount) {
        this.verifiedCount = verifiedCount;
    }

    public int getNotVerifiedCount() {
        return notVerifiedCount;
    }

    public void setNotVerifiedCount(int notVerifiedCount) {
        this.notVerifiedCount = notVerifiedCount;
    }

    public int getVerifiedPercent() {
        return verifiedPercent;
    }

    public void setVerifiedPercent(int verifiedPercent) {
        this.verifiedPercent = verifiedPercent;
    }

    public int getNotVerifiedPercent() {
        return notVerifiedPercent;
    }

    public void setNotVerifiedPercent(int notVerifiedPercent) {
        this.notVerifiedPercent = notVerifiedPercent;
    }

    public List<VerificationItemDto> getAssessments() {
        return assessments;
    }

    public void setAssessments(List<VerificationItemDto> assessments) {
        this.assessments = assessments != null ? assessments : new ArrayList<>();
    }
}
