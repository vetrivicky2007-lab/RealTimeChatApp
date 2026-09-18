package chat.controller;

import chat.dto.CreateGroupRequest;
import chat.dto.GroupResponseDto;
import chat.dto.MessageDto;
import chat.dto.UserSummaryDto;
import chat.security.UserPrincipal;
import chat.service.GroupService;
import chat.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;
    private final MessageService messageService;

    public GroupController(GroupService groupService, MessageService messageService) {
        this.groupService = groupService;
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<List<GroupResponseDto>> getAllGroups(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<GroupResponseDto> groups = groupService.getAllGroups(userId);
        return ResponseEntity.ok(groups);
    }

    @PostMapping
    public ResponseEntity<GroupResponseDto> createGroup(
            @Valid @RequestBody CreateGroupRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ensureAuthenticated(userPrincipal);
        GroupResponseDto group = groupService.createGroup(request, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(group);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupResponseDto> getGroup(
            @PathVariable String groupId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        GroupResponseDto group = groupService.getGroupById(groupId, userId);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<GroupResponseDto> joinGroup(
            @PathVariable String groupId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ensureAuthenticated(userPrincipal);
        GroupResponseDto group = groupService.joinGroup(groupId, userPrincipal.getId());
        return ResponseEntity.ok(group);
    }

    @PostMapping("/{groupId}/leave")
    public ResponseEntity<GroupResponseDto> leaveGroup(
            @PathVariable String groupId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ensureAuthenticated(userPrincipal);
        GroupResponseDto group = groupService.leaveGroup(groupId, userPrincipal.getId());
        return ResponseEntity.ok(group);
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<UserSummaryDto>> getGroupMembers(
            @PathVariable String groupId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ensureAuthenticated(userPrincipal);
        List<UserSummaryDto> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<MessageDto>> getGroupMessages(
            @PathVariable String groupId,
            @RequestParam(defaultValue = "50") int limit,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ensureAuthenticated(userPrincipal);
        if (!groupService.isMember(groupId, userPrincipal.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a member to view group messages");
        }
        List<MessageDto> messages = messageService.getGroupMessages(groupId, limit);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable String groupId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ensureAuthenticated(userPrincipal);
        if (!groupService.isMember(groupId, userPrincipal.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a member to send messages to this group");
        }
        String content = payload.get("content");
        MessageDto message = messageService.saveMessage(groupId, userPrincipal.getId(), userPrincipal.getUsername(), content, "TEXT");
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Map<String, String>> deleteGroup(
            @PathVariable String groupId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ensureAuthenticated(userPrincipal);
        groupService.deleteGroup(groupId, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("message", "Group deleted successfully"));
    }

    @DeleteMapping("/{groupId}/members/{targetUserId}")
    public ResponseEntity<Map<String, String>> removeMember(
            @PathVariable String groupId,
            @PathVariable String targetUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ensureAuthenticated(userPrincipal);
        groupService.removeMember(groupId, targetUserId, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("message", "Member removed successfully"));
    }

    private void ensureAuthenticated(UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
    }
}
