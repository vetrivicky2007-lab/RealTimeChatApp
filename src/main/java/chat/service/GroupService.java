package chat.service;

import chat.dto.CreateGroupRequest;
import chat.dto.GroupResponseDto;
import chat.dto.UserSummaryDto;
import chat.model.Group;
import chat.model.User;
import chat.repository.GroupRepository;
import chat.repository.MessageRepository;
import chat.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public GroupService(
            GroupRepository groupRepository,
            UserRepository userRepository,
            MessageRepository messageRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    public GroupResponseDto createGroup(CreateGroupRequest request, String creatorId) {
        String name = request.getName().trim();
        if (groupRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A group with this name already exists");
        }

        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String privacy = (request.getPrivacy() != null && request.getPrivacy().equalsIgnoreCase("PRIVATE"))
                ? "PRIVATE" : "PUBLIC";

        String inviteCode = null;
        if ("PRIVATE".equals(privacy)) {
            inviteCode = generateUniqueInviteCode(name);
        }

        Group group = new Group(
                name,
                request.getDescription() != null ? request.getDescription().trim() : "",
                creatorId,
                privacy,
                inviteCode
        );
        group.setCreatedAt(Instant.now());
        group.setUpdatedAt(Instant.now());

        Group saved = groupRepository.save(group);
        return toDto(saved, creatorId, creator.getUsername());
    }

    public List<GroupResponseDto> getAllGroups(String currentUserId) {
        List<Group> groups = groupRepository.findAllByOrderByCreatedAtDesc();
        Map<String, String> usernameCache = buildUsernameCache(groups);

        return groups.stream()
                .map(g -> toDto(g, currentUserId, usernameCache.get(g.getCreatedBy())))
                .collect(Collectors.toList());
    }

    public GroupResponseDto getGroupById(String groupId, String currentUserId) {
        Group group = findGroupOrThrow(groupId);
        String creatorUsername = userRepository.findById(group.getCreatedBy())
                .map(User::getUsername)
                .orElse("Unknown");
        return toDto(group, currentUserId, creatorUsername);
    }

    public GroupResponseDto joinGroup(String groupId, String userId) {
        Group group = findGroupOrThrow(groupId);

        if (group.isPrivate()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This is a private group. Please use an invite code to join.");
        }

        if (!group.hasMember(userId)) {
            group.addMember(userId);
            group = groupRepository.save(group);
        }

        String creatorUsername = userRepository.findById(group.getCreatedBy())
                .map(User::getUsername)
                .orElse("Unknown");
        return toDto(group, userId, creatorUsername);
    }

    public GroupResponseDto joinPrivateGroup(String groupId, String inviteCode, String userId) {
        Group group;

        if (groupId != null && !groupId.trim().isEmpty()) {
            group = findGroupOrThrow(groupId);
        } else if (inviteCode != null && !inviteCode.trim().isEmpty()) {
            group = groupRepository.findByInviteCode(inviteCode.trim().toUpperCase())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid invite code. No group found."));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invite code is required.");
        }

        if (!group.isPrivate()) {
            // If group is actually public, allow joining directly
            return joinGroup(group.getId(), userId);
        }

        if (inviteCode == null || !inviteCode.trim().equalsIgnoreCase(group.getInviteCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid invite code for this group.");
        }

        if (!group.hasMember(userId)) {
            group.addMember(userId);
            group = groupRepository.save(group);
        }

        String creatorUsername = userRepository.findById(group.getCreatedBy())
                .map(User::getUsername)
                .orElse("Unknown");
        return toDto(group, userId, creatorUsername);
    }

    public GroupResponseDto leaveGroup(String groupId, String userId) {
        Group group = findGroupOrThrow(groupId);

        if (!group.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You are not a member of this group");
        }

        if (group.isAdmin(userId) && group.getMemberCount() > 1) {
            // Reassign admin to another member if admin leaves
            String newAdmin = group.getMembers().stream()
                    .filter(m -> !m.equals(userId))
                    .findFirst()
                    .orElse(null);
            group.setCreatedBy(newAdmin);
        }

        group.removeMember(userId);

        if (group.getMembers().isEmpty()) {
            groupRepository.deleteById(groupId);
            messageRepository.deleteByGroupId(groupId);
            Group emptyGroup = new Group();
            emptyGroup.setId(groupId);
            emptyGroup.setName(group.getName());
            return toDto(emptyGroup, userId, "None");
        }

        group = groupRepository.save(group);
        String creatorUsername = userRepository.findById(group.getCreatedBy())
                .map(User::getUsername)
                .orElse("Unknown");
        return toDto(group, userId, creatorUsername);
    }

    public List<UserSummaryDto> getGroupMembers(String groupId) {
        Group group = findGroupOrThrow(groupId);
        List<User> users = userRepository.findByIdIn(group.getMembers());
        return users.stream()
                .map(u -> new UserSummaryDto(u.getId(), u.getUsername(), u.getEmail(), u.getCreatedAt(), u.getStatus()))
                .collect(Collectors.toList());
    }

    public void deleteGroup(String groupId, String requestingUserId) {
        Group group = findGroupOrThrow(groupId);

        if (!group.isAdmin(requestingUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the group administrator can delete the group");
        }

        groupRepository.deleteById(groupId);
        messageRepository.deleteByGroupId(groupId);
    }

    public void removeMember(String groupId, String targetUserId, String requestingUserId) {
        Group group = findGroupOrThrow(groupId);

        if (!group.isAdmin(requestingUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the group administrator can remove members");
        }

        if (targetUserId.equals(group.getCreatedBy())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Administrator cannot be removed from the group");
        }

        group.removeMember(targetUserId);
        groupRepository.save(group);
    }

    public boolean isMember(String groupId, String userId) {
        return groupRepository.findById(groupId)
                .map(g -> g.hasMember(userId))
                .orElse(false);
    }

    public Group findGroupOrThrow(String groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
    }

    private String generateUniqueInviteCode(String groupName) {
        String prefix = groupName.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        if (prefix.length() > 4) {
            prefix = prefix.substring(0, 4);
        } else if (prefix.isEmpty()) {
            prefix = "UNI";
        }

        String code;
        int attempts = 0;
        do {
            int randomPart = 10000 + secureRandom.nextInt(90000);
            code = prefix + "-" + randomPart;
            attempts++;
            if (attempts > 50) {
                code = prefix + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
                break;
            }
        } while (groupRepository.existsByInviteCode(code));

        return code;
    }

    private Map<String, String> buildUsernameCache(List<Group> groups) {
        Set<String> creatorIds = groups.stream()
                .map(Group::getCreatedBy)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        return userRepository.findByIdIn(creatorIds).stream()
                .collect(Collectors.toMap(User::getId, User::getUsername));
    }

    private GroupResponseDto toDto(Group group, String currentUserId, String creatorUsername) {
        GroupResponseDto dto = new GroupResponseDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setPrivacy(group.getPrivacy() != null ? group.getPrivacy() : "PUBLIC");
        dto.setCreatedBy(group.getCreatedBy());
        dto.setCreatorUsername(creatorUsername != null ? creatorUsername : "Unknown");
        dto.setCreatedAt(group.getCreatedAt());
        dto.setUpdatedAt(group.getUpdatedAt());
        dto.setMemberCount(group.getMemberCount());
        dto.setMembers(group.getMembers());

        boolean isMember = currentUserId != null && group.hasMember(currentUserId);
        boolean isAdmin = currentUserId != null && group.isAdmin(currentUserId);
        dto.setMember(isMember);
        dto.setAdmin(isAdmin);

        // Security: only expose invite code to members or administrator of private groups
        if (group.isPrivate() && (isMember || isAdmin)) {
            dto.setInviteCode(group.getInviteCode());
        } else {
            dto.setInviteCode(null);
        }

        return dto;
    }
}
