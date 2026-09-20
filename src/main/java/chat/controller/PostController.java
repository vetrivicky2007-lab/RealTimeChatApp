package chat.controller;

import chat.dto.*;
import chat.security.UserPrincipal;
import chat.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // ============================================================
    // COMMUNITY POSTS FEED & CREATION
    // Dual paths: /api/communities/{id}/posts and /api/groups/{id}/posts
    // ============================================================

    @PostMapping(value = {
            "/api/communities/{communityId}/posts",
            "/api/groups/{communityId}/posts"
    }, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> createPostMultipart(
            @PathVariable String communityId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "externalUrl", required = false) String externalUrl,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        CreatePostDto dto = new CreatePostDto(title, content, externalUrl, category, tags);
        PostResponseDto created = postService.createPost(communityId, userPrincipal.getId(), dto, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping(value = {
            "/api/communities/{communityId}/posts",
            "/api/groups/{communityId}/posts"
    }, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PostResponseDto> createPostJson(
            @PathVariable String communityId,
            @Valid @RequestBody CreatePostDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        PostResponseDto created = postService.createPost(communityId, userPrincipal.getId(), dto, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping({
            "/api/communities/{communityId}/posts",
            "/api/groups/{communityId}/posts"
    })
    public ResponseEntity<Page<PostResponseDto>> getCommunityPosts(
            @PathVariable String communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<PostResponseDto> posts = postService.getCommunityPosts(communityId, userId, page, size, category, tag);
        return ResponseEntity.ok(posts);
    }

    // ============================================================
    // SINGLE POST CRUD
    // ============================================================

    @GetMapping("/api/posts/{postId}")
    public ResponseEntity<PostResponseDto> getPostById(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        PostResponseDto post = postService.getPostById(postId, userId);
        return ResponseEntity.ok(post);
    }

    @PutMapping("/api/posts/{postId}")
    public ResponseEntity<PostResponseDto> updatePost(
            @PathVariable String postId,
            @Valid @RequestBody UpdatePostDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        PostResponseDto updated = postService.updatePost(postId, userPrincipal.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/api/posts/{postId}")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        postService.deletePost(postId, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully", "postId", postId));
    }

    // ============================================================
    // REACTIONS (LIKE / DISLIKE)
    // ============================================================

    @PostMapping("/api/posts/{postId}/react")
    public ResponseEntity<Map<String, Object>> reactToPost(
            @PathVariable String postId,
            @Valid @RequestBody ReactionRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        Map<String, Object> result = postService.reactToPost(postId, userPrincipal.getId(), dto.getType());
        return ResponseEntity.ok(result);
    }

    // ============================================================
    // COMMUNITY VERIFICATION
    // ============================================================

    @PostMapping("/api/posts/{postId}/verify")
    public ResponseEntity<Map<String, Object>> verifyPost(
            @PathVariable String postId,
            @Valid @RequestBody VerificationRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        Map<String, Object> result = postService.verifyPost(postId, userPrincipal.getId(), dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/posts/{postId}/verifications")
    public ResponseEntity<VerificationDetailsDto> getVerificationDetails(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        VerificationDetailsDto details = postService.getVerificationDetails(postId, userId);
        return ResponseEntity.ok(details);
    }

    // ============================================================
    // COMMENTS
    // ============================================================

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<Page<CommentResponseDto>> getComments(
            @PathVariable String postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<CommentResponseDto> comments = postService.getComments(postId, userId, page, size);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/api/posts/{postId}/comments")
    public ResponseEntity<CommentResponseDto> addComment(
            @PathVariable String postId,
            @Valid @RequestBody CreateCommentDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        CommentResponseDto comment = postService.addComment(postId, userPrincipal.getId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @DeleteMapping("/api/posts/{postId}/comments/{commentId}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        postService.deleteComment(postId, commentId, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully", "commentId", commentId));
    }

    // ============================================================
    // BOOKMARKS / SAVED POSTS
    // ============================================================

    @PostMapping("/api/posts/{postId}/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        Map<String, Object> result = postService.toggleBookmark(postId, userPrincipal.getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/users/me/bookmarks")
    public ResponseEntity<Page<PostResponseDto>> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        Page<PostResponseDto> saved = postService.getUserBookmarks(userPrincipal.getId(), page, size);
        return ResponseEntity.ok(saved);
    }

    // ============================================================
    // REPORTS & VIEWS
    // ============================================================

    @PostMapping("/api/posts/{postId}/report")
    public ResponseEntity<Map<String, String>> reportPost(
            @PathVariable String postId,
            @Valid @RequestBody ReportRequestDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        ensureAuthenticated(userPrincipal);
        postService.reportPost(postId, userPrincipal.getId(), dto);
        return ResponseEntity.ok(Map.of("message", "Post reported successfully. Thank you for keeping the community safe."));
    }

    @PostMapping("/api/posts/{postId}/view")
    public ResponseEntity<Void> trackView(
            @PathVariable String postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        String userId = userPrincipal != null ? userPrincipal.getId() : null;
        postService.trackPostView(postId, userId);
        return ResponseEntity.ok().build();
    }

    private void ensureAuthenticated(UserPrincipal userPrincipal) {
        if (userPrincipal == null || userPrincipal.getId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required");
        }
    }
}
