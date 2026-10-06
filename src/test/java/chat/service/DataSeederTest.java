package chat.service;

import chat.model.Group;
import chat.model.Post;
import chat.model.User;
import chat.repository.GroupRepository;
import chat.repository.PostCommentRepository;
import chat.repository.PostRepository;
import chat.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataSeederTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private PostCommentRepository commentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private DataSeeder dataSeeder;

    @BeforeEach
    void setUp() {
        dataSeeder = new DataSeeder(userRepository, groupRepository, postRepository, commentRepository, passwordEncoder);
        when(passwordEncoder.encode(anyString())).thenReturn("mockHashedPassword");
    }

    @Test
    void testSeedAllSuccessfullyCreatesCommunitiesUsersAndPosts() {
        // Mock user lookups (initial empty, then saved with IDs)
        when(userRepository.findByUsernameIgnoreCase(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId("id_" + u.getUsername());
            return u;
        });

        // Mock group lookups (initial empty, then saved with IDs)
        when(groupRepository.findByNameIgnoreCase(anyString())).thenReturn(Optional.empty());
        when(groupRepository.save(any(Group.class))).thenAnswer(invocation -> {
            Group g = invocation.getArgument(0);
            if (g.getId() == null) {
                g.setId("grp_" + Math.abs(g.getName().hashCode()));
            }
            return g;
        });

        // Mock post saves
        when(postRepository.countByCommunityId(anyString())).thenReturn(0L);
        when(postRepository.save(any(Post.class))).thenAnswer(invocation -> {
            Post p = invocation.getArgument(0);
            p.setId("post_" + UUID.randomUUID().toString().substring(0, 8));
            return p;
        });

        // Run seed
        Map<String, Object> report = dataSeeder.seedAll(false);

        assertNotNull(report);
        assertEquals("SUCCESS", report.get("status"));
        assertEquals(7, report.get("totalCommunities"));
        assertEquals(7, report.get("totalDemoUsers")); // amudavikki + 6 demo users
        assertTrue((Integer) report.get("totalPosts") >= 70);
        assertTrue((Boolean) report.get("amudavikkiMemberInAllCommunities"));

        // Verify amudavikki was created
        verify(userRepository, atLeastOnce()).save(argThat(user -> "amudavikki".equals(user.getUsername())));

        // Verify all 7 communities were saved
        verify(groupRepository, times(7)).save(any(Group.class));

        // Verify posts were created
        verify(postRepository, atLeast(70)).save(any(Post.class));
    }
}
