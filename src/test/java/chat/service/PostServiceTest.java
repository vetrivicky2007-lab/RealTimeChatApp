package chat.service;

import chat.dto.*;
import chat.model.*;
import chat.repository.*;
import chat.websocket.ChatWebSocketHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private PostCommentRepository commentRepository;

    @Mock
    private PostReactionRepository reactionRepository;

    @Mock
    private PostVerificationRepository verificationRepository;

    @Mock
    private PostBookmarkRepository bookmarkRepository;

    @Mock
    private PostReportRepository reportRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private ChatWebSocketHandler webSocketHandler;

    private PostService postService;

    private User testUser;
    private Group publicGroup;
    private Group privateGroup;

    @BeforeEach
    void setUp() {
        postService = new PostService(
                postRepository,
                commentRepository,
                reactionRepository,
                verificationRepository,
                bookmarkRepository,
                reportRepository,
                groupRepository,
                userRepository,
                cloudinaryService,
                webSocketHandler
        );

        testUser = new User("vetrivel", "vetri@unihive.edu", "hashed_password");
        testUser.setId("user123");

        publicGroup = new Group("AI & Machine Learning Club", "Discussion on ML algorithms", "user123", "PUBLIC", null);
        publicGroup.setId("group-pub-1");
        publicGroup.addMember("user123");

        privateGroup = new Group("Advanced Capstone Group", "Confidential capstone project", "admin999", "PRIVATE", "INVITE-123");
        privateGroup.setId("group-priv-1");
        privateGroup.addMember("admin999");
    }

    @Test
    void testCreatePostSuccessInPublicGroup() {
        when(groupRepository.findById("group-pub-1")).thenReturn(Optional.of(publicGroup));
        when(userRepository.findById("user123")).thenReturn(Optional.of(testUser));

        Post savedPost = new Post("group-pub-1", "user123", "vetrivel", "Transformers Explained", "Deep dive into self-attention");
        savedPost.setId("post-101");
        savedPost.setCreatedAt(Instant.now());
        savedPost.setCategory("AI");
        savedPost.setTags(List.of("AI", "Transformers"));

        when(postRepository.save(any(Post.class))).thenReturn(savedPost);

        CreatePostDto dto = new CreatePostDto("Transformers Explained", "Deep dive into self-attention", "https://arxiv.org", "AI", List.of("AI", "Transformers"));
        PostResponseDto result = postService.createPost("group-pub-1", "user123", dto, null);

        assertNotNull(result);
        assertEquals("post-101", result.getId());
        assertEquals("group-pub-1", result.getCommunityId());
        assertEquals("vetrivel", result.getAuthorUsername());
        assertEquals("Transformers Explained", result.getTitle());
        assertEquals("AI", result.getCategory());
        assertTrue(result.getTags().contains("AI"));

        verify(webSocketHandler).broadcastPostCreated(eq("group-pub-1"), eq("post-101"), eq("vetrivel"), eq("Transformers Explained"));
    }

    @Test
    void testCreatePostFailsInPrivateGroupIfNotMember() {
        when(groupRepository.findById("group-priv-1")).thenReturn(Optional.of(privateGroup));

        CreatePostDto dto = new CreatePostDto("Sneak Peak", "Secret data", null, "General", Collections.emptyList());

        assertThrows(ResponseStatusException.class,
                () -> postService.createPost("group-priv-1", "user123", dto, null));
    }

    @Test
    void testGetCommunityPostsReturnsPagedFeed() {
        when(groupRepository.findById("group-pub-1")).thenReturn(Optional.of(publicGroup));

        Post p1 = new Post("group-pub-1", "user123", "vetrivel", "Post 1", "Content 1");
        p1.setId("p1");
        p1.setCreatedAt(Instant.now());

        Page<Post> mockPage = new PageImpl<>(List.of(p1));
        when(postRepository.findByCommunityIdOrderByCreatedAtDesc(eq("group-pub-1"), any(Pageable.class)))
                .thenReturn(mockPage);

        Page<PostResponseDto> page = postService.getCommunityPosts("group-pub-1", "user123", 0, 20, null, null);

        assertNotNull(page);
        assertEquals(1, page.getContent().size());
        assertEquals("Post 1", page.getContent().get(0).getTitle());
    }

    @Test
    void testReactionToggleLike() {
        Post post = new Post("group-pub-1", "author1", "author", "Test Post", "Content");
        post.setId("post-1");
        post.setLikeCount(0);
        post.setDislikeCount(0);

        when(postRepository.findById("post-1")).thenReturn(Optional.of(post));
        when(groupRepository.findById("group-pub-1")).thenReturn(Optional.of(publicGroup));
        when(reactionRepository.findByPostIdAndUserId("post-1", "user123")).thenReturn(Optional.empty());
        when(reactionRepository.countByPostIdAndType("post-1", "LIKE")).thenReturn(1L, 0L);
        when(reactionRepository.countByPostIdAndType("post-1", "DISLIKE")).thenReturn(0L);

        // First Like
        Map<String, Object> res1 = postService.reactToPost("post-1", "user123", "LIKE");
        assertEquals(1, res1.get("likeCount"));
        assertEquals(0, res1.get("dislikeCount"));
        assertEquals("LIKE", res1.get("userReaction"));

        // When user already liked and clicks LIKE again, it removes reaction
        PostReaction existingReaction = new PostReaction("post-1", "user123", "LIKE");
        when(reactionRepository.findByPostIdAndUserId("post-1", "user123")).thenReturn(Optional.of(existingReaction));

        Map<String, Object> res2 = postService.reactToPost("post-1", "user123", "LIKE");
        assertEquals(0, res2.get("likeCount"));
        assertNull(res2.get("userReaction"));
    }

    @Test
    void testVerificationVoteAndAggregatedGauge() {
        Post post = new Post("group-pub-1", "author1", "author", "Breaking News", "New framework released");
        post.setId("post-verify-1");
        post.setVerifiedCount(0);
        post.setNotVerifiedCount(0);

        when(postRepository.findById("post-verify-1")).thenReturn(Optional.of(post));
        when(userRepository.findById("user123")).thenReturn(Optional.of(testUser));
        when(groupRepository.findById("group-pub-1")).thenReturn(Optional.of(publicGroup));
        when(verificationRepository.findByPostIdAndUserId("post-verify-1", "user123")).thenReturn(Optional.empty());
        when(verificationRepository.countByPostIdAndVerdict("post-verify-1", "VERIFIED")).thenReturn(1L);
        when(verificationRepository.countByPostIdAndVerdict("post-verify-1", "NOT_VERIFIED")).thenReturn(0L);

        VerificationRequestDto dto = new VerificationRequestDto("VERIFIED", "Checked official docs", "https://docs.unihive.edu");
        Map<String, Object> verifiedResult = postService.verifyPost("post-verify-1", "user123", dto);

        assertNotNull(verifiedResult);
        assertEquals(1, verifiedResult.get("verifiedCount"));
        assertEquals(0, verifiedResult.get("notVerifiedCount"));
        assertEquals(100, verifiedResult.get("verifiedPercent"));
        assertEquals("VERIFIED", verifiedResult.get("userVerification"));
    }

    @Test
    void testVerificationDetailsBreakdown() {
        Post post = new Post("group-pub-1", "author1", "author", "Post", "Content");
        post.setId("post-1");
        post.setVerifiedCount(1);
        post.setNotVerifiedCount(1);

        when(postRepository.findById("post-1")).thenReturn(Optional.of(post));
        when(groupRepository.findById("group-pub-1")).thenReturn(Optional.of(publicGroup));

        PostVerification v1 = new PostVerification("post-1", "user1", "alice", "VERIFIED", "Official source confirms", "https://official.org");
        v1.setCreatedAt(Instant.now());

        PostVerification v2 = new PostVerification("post-1", "user2", "bob", "NOT_VERIFIED", "Contradicts benchmark", null);
        v2.setCreatedAt(Instant.now());

        when(verificationRepository.findByPostIdOrderByCreatedAtDesc("post-1")).thenReturn(List.of(v1, v2));

        VerificationDetailsDto details = postService.getVerificationDetails("post-1", "user123");

        assertNotNull(details);
        assertEquals(2, details.getTotalAssessments());
        assertEquals(1, details.getVerifiedCount());
        assertEquals(1, details.getNotVerifiedCount());
        assertEquals(50, details.getVerifiedPercent());
        assertEquals(50, details.getNotVerifiedPercent());
        assertEquals(2, details.getAssessments().size());
        assertEquals("alice", details.getAssessments().get(0).getUsername());
        assertEquals("VERIFIED", details.getAssessments().get(0).getVerdict());
    }

    @Test
    void testAddCommentAndGetComments() {
        Post post = new Post("group-pub-1", "author1", "author", "Post", "Content");
        post.setId("post-comment-1");
        post.setCommentCount(0);

        when(postRepository.findById("post-comment-1")).thenReturn(Optional.of(post));
        when(userRepository.findById("user123")).thenReturn(Optional.of(testUser));
        when(groupRepository.findById("group-pub-1")).thenReturn(Optional.of(publicGroup));

        PostComment savedComment = new PostComment("post-comment-1", "group-pub-1", "user123", "vetrivel", "Insightful writeup!");
        savedComment.setId("comm-1");
        savedComment.setCreatedAt(Instant.now());

        when(commentRepository.save(any(PostComment.class))).thenReturn(savedComment);

        CreateCommentDto dto = new CreateCommentDto("Insightful writeup!");
        CommentResponseDto commentRes = postService.addComment("post-comment-1", "user123", dto);

        assertNotNull(commentRes);
        assertEquals("comm-1", commentRes.getId());
        assertEquals("vetrivel", commentRes.getAuthorUsername());
        assertEquals("Insightful writeup!", commentRes.getContent());
    }

    @Test
    void testBookmarkToggle() {
        Post post = new Post("group-pub-1", "user123", "vetrivel", "Post", "Content");
        post.setId("post-100");

        when(postRepository.findById("post-100")).thenReturn(Optional.of(post));
        when(bookmarkRepository.findByUserIdAndPostId("user123", "post-100")).thenReturn(Optional.empty());

        Map<String, Object> res1 = postService.toggleBookmark("post-100", "user123");
        assertTrue((Boolean) res1.get("bookmarked"));
        verify(bookmarkRepository).save(any(PostBookmark.class));

        // When bookmarked again, it removes bookmark
        PostBookmark bm = new PostBookmark("user123", "post-100");
        when(bookmarkRepository.findByUserIdAndPostId("user123", "post-100")).thenReturn(Optional.of(bm));

        Map<String, Object> res2 = postService.toggleBookmark("post-100", "user123");
        assertFalse((Boolean) res2.get("bookmarked"));
        verify(bookmarkRepository).delete(bm);
    }

    @Test
    void testReportPost() {
        Post post = new Post("group-pub-1", "author1", "author", "Post", "Content");
        post.setId("post-report-1");

        when(postRepository.findById("post-report-1")).thenReturn(Optional.of(post));
        when(userRepository.findById("user123")).thenReturn(Optional.of(testUser));

        ReportRequestDto reportDto = new ReportRequestDto("MISINFORMATION", "False statistics claimed in section 2");
        assertDoesNotThrow(() -> postService.reportPost("post-report-1", "user123", reportDto));
        verify(reportRepository).save(any(PostReport.class));
    }
}
