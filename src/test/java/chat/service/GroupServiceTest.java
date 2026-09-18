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
    void testCreateGroupSuccess() {
        CreateGroupRequest request = new CreateGroupRequest("CSE-A", "CSE A discussion group");
        User creator = new User("vetrivel", "vetri@example.com", "hash");
        creator.setId("creatorId");

        when(groupRepository.existsByNameIgnoreCase("CSE-A")).thenReturn(false);
        when(userRepository.findById("creatorId")).thenReturn(Optional.of(creator));

        Group savedGroup = new Group("CSE-A", "CSE A discussion group", "creatorId");
        savedGroup.setId("groupId123");
        when(groupRepository.save(any(Group.class))).thenReturn(savedGroup);

        GroupResponseDto result = groupService.createGroup(request, "creatorId");

        assertNotNull(result);
        assertEquals("CSE-A", result.getName());
        assertEquals("CSE A discussion group", result.getDescription());
        assertEquals("creatorId", result.getCreatedBy());
        assertTrue(result.isAdmin());
        assertTrue(result.isMember());
        assertEquals(1, result.getMemberCount());
    }

    @Test
    void testJoinGroup() {
        Group group = new Group("Gaming", "Gaming chat", "adminUser");
        group.setId("group1");

        when(groupRepository.findById("group1")).thenReturn(Optional.of(group));
        when(groupRepository.save(any(Group.class))).thenAnswer(i -> i.getArgument(0));

        GroupResponseDto result = groupService.joinGroup("group1", "newUser");

        assertTrue(result.isMember());
        assertEquals(2, result.getMemberCount());
        assertTrue(group.hasMember("newUser"));
    }

    @Test
    void testLeaveGroup() {
        Group group = new Group("Gaming", "Gaming chat", "adminUser");
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
        Group group = new Group("Gaming", "Gaming chat", "adminUser");
        group.setId("group1");

        when(groupRepository.findById("group1")).thenReturn(Optional.of(group));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> groupService.deleteGroup("group1", "nonAdminUser"));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        verify(groupRepository, never()).deleteById(anyString());
    }

    @Test
    void testAdminCanDeleteGroup() {
        Group group = new Group("Gaming", "Gaming chat", "adminUser");
        group.setId("group1");

        when(groupRepository.findById("group1")).thenReturn(Optional.of(group));

        assertDoesNotThrow(() -> groupService.deleteGroup("group1", "adminUser"));
        verify(groupRepository, times(1)).deleteById("group1");
        verify(messageRepository, times(1)).deleteByGroupId("group1");
    }
}
