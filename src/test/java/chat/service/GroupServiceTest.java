package chat.service;

import chat.dto.CreateGroupRequest;
import chat.dto.GroupResponseDto;
import chat.model.Group;
import chat.model.User;
import chat.repository.GroupRepository;
import chat.repository.MessageRepository;
import chat.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GroupServiceTest {

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MessageRepository messageRepository;

    private GroupService groupService;

    @BeforeEach
    void setUp() {
        groupService = new GroupService(groupRepository, userRepository, messageRepository);
    }

    @Test
    void testCreatePublicGroupSuccess() {
        CreateGroupRequest request = new CreateGroupRequest("CSE-A", "CSE A discussion group", "PUBLIC");
        User creator = new User("vetrivel", "vetri@example.com", "hash");
        creator.setId("creatorId");

        when(groupRepository.existsByNameIgnoreCase("CSE-A")).thenReturn(false);
        when(userRepository.findById("creatorId")).thenReturn(Optional.of(creator));

        Group savedGroup = new Group("CSE-A", "CSE A discussion group", "creatorId", "PUBLIC", null);
        savedGroup.setId("groupId123");
        when(groupRepository.save(any(Group.class))).thenReturn(savedGroup);

        GroupResponseDto result = groupService.createGroup(request, "creatorId");

        assertNotNull(result);
        assertEquals("CSE-A", result.getName());
        assertEquals("CSE A discussion group", result.getDescription());
        assertEquals("creatorId", result.getCreatedBy());
        assertEquals("PUBLIC", result.getPrivacy());
        assertTrue(result.isAdmin());
        assertTrue(result.isMember());
        assertEquals(1, result.getMemberCount());
    }

    @Test
    void testCreatePrivateGroupSuccess() {
        CreateGroupRequest request = new CreateGroupRequest("Project Alpha", "Confidential", "PRIVATE");
        User creator = new User("vetrivel", "vetri@example.com", "hash");
        creator.setId("creatorId");

        when(groupRepository.existsByNameIgnoreCase("Project Alpha")).thenReturn(false);
        when(userRepository.findById("creatorId")).thenReturn(Optional.of(creator));
        when(groupRepository.existsByInviteCode(anyString())).thenReturn(false);

        when(groupRepository.save(any(Group.class))).thenAnswer(i -> {
            Group g = i.getArgument(0);
            g.setId("alpha123");
            return g;
        });

        GroupResponseDto result = groupService.createGroup(request, "creatorId");

        assertNotNull(result);
        assertEquals("PRIVATE", result.getPrivacy());
        assertNotNull(result.getInviteCode());
        assertTrue(result.isAdmin());
    }

    @Test
    void testJoinPublicGroup() {
        Group group = new Group("Gaming", "Gaming chat", "adminUser", "PUBLIC", null);
        group.setId("group1");

        when(groupRepository.findById("group1")).thenReturn(Optional.of(group));
        when(groupRepository.save(any(Group.class))).thenAnswer(i -> i.getArgument(0));

        GroupResponseDto result = groupService.joinGroup("group1", "newUser");

        assertTrue(result.isMember());
        assertEquals(2, result.getMemberCount());
        assertTrue(group.hasMember("newUser"));
    }

    @Test
    void testJoinPrivateGroupDirectlyFails() {
        Group group = new Group("Secret", "Secret chat", "adminUser", "PRIVATE", "SEC-12345");
        group.setId("secret1");

        when(groupRepository.findById("secret1")).thenReturn(Optional.of(group));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> groupService.joinGroup("secret1", "newUser"));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        assertTrue(ex.getReason().contains("private group"));
    }

    @Test
    void testJoinPrivateGroupWithValidInviteCode() {
        Group group = new Group("Secret", "Secret chat", "adminUser", "PRIVATE", "SEC-12345");
        group.setId("secret1");

        when(groupRepository.findById("secret1")).thenReturn(Optional.of(group));
        when(groupRepository.save(any(Group.class))).thenAnswer(i -> i.getArgument(0));

        GroupResponseDto result = groupService.joinPrivateGroup("secret1", "SEC-12345", "newUser");

        assertTrue(result.isMember());
        assertEquals(2, result.getMemberCount());
        assertTrue(group.hasMember("newUser"));
    }

    @Test
    void testJoinPrivateGroupWithInvalidInviteCodeFails() {
        Group group = new Group("Secret", "Secret chat", "adminUser", "PRIVATE", "SEC-12345");
        group.setId("secret1");

        when(groupRepository.findById("secret1")).thenReturn(Optional.of(group));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> groupService.joinPrivateGroup("secret1", "WRONG-CODE", "newUser"));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void testLeaveGroup() {
        Group group = new Group("Gaming", "Gaming chat", "adminUser", "PUBLIC", null);
        group.setId("group1");
        group.addMember("memberUser");

        when(groupRepository.findById("group1")).thenReturn(Optional.of(group));
        when(groupRepository.save(any(Group.class))).thenAnswer(i -> i.getArgument(0));

        GroupResponseDto result = groupService.leaveGroup("group1", "memberUser");

        assertFalse(result.isMember());
        assertEquals(1, result.getMemberCount());
        assertFalse(group.hasMember("memberUser"));
    }

    @Test
    void testNonAdminCannotDeleteGroup() {
        Group group = new Group("Gaming", "Gaming chat", "adminUser", "PUBLIC", null);
        group.setId("group1");

        when(groupRepository.findById("group1")).thenReturn(Optional.of(group));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> groupService.deleteGroup("group1", "nonAdminUser"));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        verify(groupRepository, never()).deleteById(anyString());
    }

    @Test
    void testAdminCanDeleteGroup() {
        Group group = new Group("Gaming", "Gaming chat", "adminUser", "PUBLIC", null);
        group.setId("group1");

        when(groupRepository.findById("group1")).thenReturn(Optional.of(group));

        assertDoesNotThrow(() -> groupService.deleteGroup("group1", "adminUser"));
        verify(groupRepository, times(1)).deleteById("group1");
        verify(messageRepository, times(1)).deleteByGroupId("group1");
    }
}
