package chat.dto;

import jakarta.validation.constraints.NotBlank;

public class JoinPrivateGroupRequest {

    @NotBlank(message = "Invite code is required")
    private String inviteCode;

    public JoinPrivateGroupRequest() {
    }

    public JoinPrivateGroupRequest(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }
}
