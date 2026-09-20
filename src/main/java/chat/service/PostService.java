package chat.service;

import chat.dto.*;
import chat.model.*;
import chat.repository.*;
import chat.websocket.ChatWebSocketHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final PostReactionRepository reactionRepository;
    private final PostVerificationRepository verificationRepository;
    private final PostBookmarkRepository bookmarkRepository;
    private final PostReportRepository reportRepository;
    private final PostViewRepository viewRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final ChatWebSocketHandler webSocketHandler;

    public PostService(
            PostRepository postRepository,
            PostCommentRepository commentRepository,
            PostReactionRepository reactionRepository,
            PostVerificationRepository verificationRepository,
            PostBookmarkRepository bookmarkRepository,
            PostReportRepository reportRepository,
            PostViewRepository viewRepository,
            GroupRepository groupRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService,
            ChatWebSocketHandler webSocketHandler) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.reactionRepository = reactionRepository;
        this.verificationRepository = verificationRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.reportRepository = reportRepository;
        this.viewRepository = viewRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.webSocketHandler = webSocketHandler;
    }

    public PostResponseDto createPost(String communityId, String userId, CreatePostDto dto, MultipartFile imageFile) {
        Group community = groupRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (!community.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only community members can create posts");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String mediaUrl = null;
        String mediaType = null;

        if (imageFile != null && !imageFile.isEmpty()) {
            mediaUrl = cloudinaryService.uploadImage(imageFile, "unihive/community-posts/" + communityId);
            mediaType = "IMAGE";
        }

        String title = dto.getTitle() != null ? dto.getTitle().trim() : null;
        String content = dto.getContent() != null ? dto.getContent().trim() : null;
        String externalUrl = sanitizeUrl(dto.getExternalUrl());
        String category = dto.getCategory() != null && !dto.getCategory().trim().isEmpty() ? dto.getCategory().trim() : "General";

        // A post may contain: text only, image only, text + image, text + link, image + link, text + image + link
        boolean hasText = (title != null && !title.isEmpty()) || (content != null && !content.isEmpty());
        boolean hasMedia = (mediaUrl != null && !mediaUrl.isEmpty());
        boolean hasLink = (externalUrl != null && !externalUrl.isEmpty());

        if (!hasText && !hasMedia && !hasLink) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Post must contain text, an image, or a valid link");
        }

        List<String> tags = parseTags(dto.getTags(), content);

        Post post = new Post(communityId, userId, user.getUsername(), title, content);
        post.setMediaUrl(mediaUrl);
        post.setMediaType(mediaType);
        post.setExternalUrl(externalUrl);
        post.setCategory(category);
        post.setTags(tags);
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());

        Post saved = postRepository.save(post);

        // Broadcast to WebSocket clients in the community room
        try {
            webSocketHandler.broadcastPostCreated(communityId, saved.getId(), user.getUsername(), saved.getTitle());
        } catch (Exception e) {
            logger.warn("Failed to broadcast POST_CREATED via WebSocket: {}", e.getMessage());
        }

        return toDto(saved, userId, community);
    }

    public Page<PostResponseDto> getCommunityPosts(String communityId, String userId, int page, int size, String category, String tag) {
        Group community = groupRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (community.isPrivate() && !community.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a member of this private community to view posts");
        }

        int cappedPage = Math.max(0, page);
        int cappedSize = Math.min(Math.max(1, size), 50);
        Pageable pageable = PageRequest.of(cappedPage, cappedSize);

        Page<Post> postsPage;
        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category.trim())) {
            postsPage = postRepository.findByCommunityIdAndCategoryIgnoreCaseOrderByCreatedAtDesc(communityId, category.trim(), pageable);
        } else if (tag != null && !tag.trim().isEmpty()) {
            String cleanTag = tag.trim().replace("#", "");
            postsPage = postRepository.findByCommunityIdAndTagsContainingIgnoreCaseOrderByCreatedAtDesc(communityId, cleanTag, pageable);
        } else {
            postsPage = postRepository.findByCommunityIdOrderByCreatedAtDesc(communityId, pageable);
        }

        List<Post> posts = postsPage.getContent();
        if (posts.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, postsPage.getTotalElements());
        }

        List<String> postIds = posts.stream().map(Post::getId).collect(Collectors.toList());

        // Batch fetch user reactions, verifications, bookmarks to prevent N+1 queries
        Map<String, String> userReactionsMap = new HashMap<>();
        Map<String, String> userVerificationsMap = new HashMap<>();
        Set<String> bookmarkedPostIds = new HashSet<>();

        if (userId != null) {
            reactionRepository.findByPostIdInAndUserId(postIds, userId)
                    .forEach(r -> userReactionsMap.put(r.getPostId(), r.getType()));

            verificationRepository.findByPostIdInAndUserId(postIds, userId)
                    .forEach(v -> userVerificationsMap.put(v.getPostId(), v.getVerdict()));

            bookmarkRepository.findByPostIdInAndUserId(postIds, userId)
                    .forEach(b -> bookmarkedPostIds.add(b.getPostId()));
        }

        List<PostResponseDto> dtos = posts.stream().map(post -> {
            PostResponseDto dto = toDto(post, userId, community);
            dto.setUserReaction(userReactionsMap.get(post.getId()));
            dto.setUserVerification(userVerificationsMap.get(post.getId()));
            dto.setBookmarked(bookmarkedPostIds.contains(post.getId()));
            return dto;
        }).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, postsPage.getTotalElements());
    }

    public PostResponseDto getPostById(String postId, String userId) {
        Post post = findPostOrThrow(postId);
        Group community = groupRepository.findById(post.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (community.isPrivate() && !community.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a member to view this post");
        }

        PostResponseDto dto = toDto(post, userId, community);

        if (userId != null) {
            reactionRepository.findByPostIdAndUserId(postId, userId)
                    .ifPresent(r -> dto.setUserReaction(r.getType()));
            verificationRepository.findByPostIdAndUserId(postId, userId)
                    .ifPresent(v -> dto.setUserVerification(v.getVerdict()));
            dto.setBookmarked(bookmarkRepository.existsByUserIdAndPostId(userId, postId));
        }

        return dto;
    }

    public PostResponseDto updatePost(String postId, String userId, UpdatePostDto dto) {
        Post post = findPostOrThrow(postId);

        if (!post.getAuthorId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the author can edit this post");
        }

        if (dto.getTitle() != null) post.setTitle(dto.getTitle().trim());
        if (dto.getContent() != null) post.setContent(dto.getContent().trim());
        if (dto.getExternalUrl() != null) post.setExternalUrl(sanitizeUrl(dto.getExternalUrl()));
        if (dto.getCategory() != null && !dto.getCategory().trim().isEmpty()) post.setCategory(dto.getCategory().trim());
        if (dto.getTags() != null) post.setTags(parseTags(dto.getTags(), post.getContent()));

        post.setEdited(true);
        post.setUpdatedAt(Instant.now());

        Post saved = postRepository.save(post);
        Group community = groupRepository.findById(post.getCommunityId()).orElse(null);
        return toDto(saved, userId, community);
    }

    public void deletePost(String postId, String userId) {
        Post post = findPostOrThrow(postId);
        Group community = groupRepository.findById(post.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        boolean isAuthor = post.getAuthorId().equals(userId);
        boolean isAdmin = community.isAdmin(userId);

        if (!isAuthor && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to delete this post");
        }

        postRepository.deleteById(postId);

        // Clean up associated resources asynchronously or directly
        try {
            commentRepository.deleteByPostId(postId);
            reactionRepository.deleteByPostId(postId);
            verificationRepository.deleteByPostId(postId);
            bookmarkRepository.deleteByPostId(postId);
            reportRepository.deleteByPostId(postId);
        } catch (Exception e) {
            logger.warn("Cleanup error after post deletion: {}", e.getMessage());
        }
    }

    public Map<String, Object> reactToPost(String postId, String userId, String reactionType) {
        Post post = findPostOrThrow(postId);
        Group community = groupRepository.findById(post.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (!community.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only community members can react to posts");
        }

        String type = reactionType.toUpperCase();
        Optional<PostReaction> existing = reactionRepository.findByPostIdAndUserId(postId, userId);

        String activeUserReaction = null;

        if ("REMOVE".equals(type)) {
            existing.ifPresent(reactionRepository::delete);
        } else if ("LIKE".equals(type) || "DISLIKE".equals(type)) {
            if (existing.isPresent()) {
                PostReaction current = existing.get();
                if (current.getType().equalsIgnoreCase(type)) {
                    // Clicking active reaction toggles it off
                    reactionRepository.delete(current);
                    activeUserReaction = null;
                } else {
                    // Switch reaction (LIKE -> DISLIKE or DISLIKE -> LIKE)
                    current.setType(type);
                    reactionRepository.save(current);
                    activeUserReaction = type;
                }
            } else {
                // New reaction
                PostReaction reaction = new PostReaction(postId, userId, type);
                reactionRepository.save(reaction);
                activeUserReaction = type;
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reaction type: " + reactionType);
        }

        long likes = reactionRepository.countByPostIdAndType(postId, "LIKE");
        long dislikes = reactionRepository.countByPostIdAndType(postId, "DISLIKE");

        post.setLikeCount((int) likes);
        post.setDislikeCount((int) dislikes);
        postRepository.save(post);

        Map<String, Object> result = new HashMap<>();
        result.put("likeCount", post.getLikeCount());
        result.put("dislikeCount", post.getDislikeCount());
        result.put("userReaction", activeUserReaction);
        return result;
    }

    public Map<String, Object> verifyPost(String postId, String userId, VerificationRequestDto dto) {
        Post post = findPostOrThrow(postId);
        Group community = groupRepository.findById(post.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (!community.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only community members can verify posts");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String verdict = dto.getVerdict().toUpperCase();
        Optional<PostVerification> existing = verificationRepository.findByPostIdAndUserId(postId, userId);

        String activeVerdict = null;

        if ("REMOVE".equals(verdict)) {
            existing.ifPresent(verificationRepository::delete);
        } else if ("VERIFIED".equals(verdict) || "NOT_VERIFIED".equals(verdict)) {
            String sanitizedEvidence = sanitizeUrl(dto.getEvidenceUrl());
            String sanitizedReason = dto.getReason() != null ? dto.getReason().trim() : null;

            if (existing.isPresent()) {
                PostVerification current = existing.get();
                current.setVerdict(verdict);
                current.setReason(sanitizedReason);
                current.setEvidenceUrl(sanitizedEvidence);
                current.setUpdatedAt(Instant.now());
                verificationRepository.save(current);
            } else {
                PostVerification newVerification = new PostVerification(
                        postId,
                        userId,
                        user.getUsername(),
                        verdict,
                        sanitizedReason,
                        sanitizedEvidence
                );
                verificationRepository.save(newVerification);
            }
            activeVerdict = verdict;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid verdict: " + verdict);
        }

        long verified = verificationRepository.countByPostIdAndVerdict(postId, "VERIFIED");
        long notVerified = verificationRepository.countByPostIdAndVerdict(postId, "NOT_VERIFIED");

        post.setVerifiedCount((int) verified);
        post.setNotVerifiedCount((int) notVerified);
        postRepository.save(post);

        int total = post.getVerifiedCount() + post.getNotVerifiedCount();
        int verifiedPercent = total > 0 ? Math.round((float) post.getVerifiedCount() * 100 / total) : 0;
        int notVerifiedPercent = total > 0 ? (100 - verifiedPercent) : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("verifiedCount", post.getVerifiedCount());
        result.put("notVerifiedCount", post.getNotVerifiedCount());
        result.put("totalVerifications", total);
        result.put("verifiedPercent", verifiedPercent);
        result.put("notVerifiedPercent", notVerifiedPercent);
        result.put("userVerification", activeVerdict);
        return result;
    }

    public VerificationDetailsDto getVerificationDetails(String postId, String userId) {
        Post post = findPostOrThrow(postId);
        Group community = groupRepository.findById(post.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (community.isPrivate() && !community.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a member to view verification details");
        }

        List<PostVerification> verifications = verificationRepository.findByPostIdOrderByCreatedAtDesc(postId);

        VerificationDetailsDto dto = new VerificationDetailsDto();
        dto.setVerifiedCount(post.getVerifiedCount());
        dto.setNotVerifiedCount(post.getNotVerifiedCount());
        int total = post.getVerifiedCount() + post.getNotVerifiedCount();
        dto.setTotalAssessments(total);
        if (total > 0) {
            int verifiedPct = Math.round((float) post.getVerifiedCount() * 100 / total);
            dto.setVerifiedPercent(verifiedPct);
            dto.setNotVerifiedPercent(100 - verifiedPct);
        }

        List<VerificationDetailsDto.VerificationItemDto> items = verifications.stream()
                .map(v -> new VerificationDetailsDto.VerificationItemDto(
                        v.getUsername(),
                        v.getVerdict(),
                        v.getReason(),
                        v.getEvidenceUrl(),
                        v.getCreatedAt()
                )).collect(Collectors.toList());

        dto.setAssessments(items);
        return dto;
    }

    public CommentResponseDto addComment(String postId, String userId, CreateCommentDto dto) {
        Post post = findPostOrThrow(postId);
        Group community = groupRepository.findById(post.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (!community.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only community members can comment on posts");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        PostComment comment = new PostComment(
                postId,
                post.getCommunityId(),
                userId,
                user.getUsername(),
                dto.getContent().trim()
        );
        if (dto.getParentCommentId() != null) {
            comment.setParentCommentId(dto.getParentCommentId());
        }

        PostComment saved = commentRepository.save(comment);

        long count = commentRepository.countByPostId(postId);
        post.setCommentCount((int) count);
        postRepository.save(post);

        return new CommentResponseDto(
                saved.getId(),
                saved.getPostId(),
                saved.getCommunityId(),
                saved.getAuthorId(),
                saved.getAuthorUsername(),
                saved.getContent(),
                saved.getCreatedAt(),
                saved.getUpdatedAt(),
                true,
                saved.getParentCommentId(),
                saved.isEdited()
        );
    }

    public PostComment editComment(String commentId, String userId, String newContent) {
        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getAuthorId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the author can edit this comment");
        }

        comment.setContent(newContent.trim());
        comment.setEdited(true);
        comment.setUpdatedAt(Instant.now());

        return commentRepository.save(comment);
    }

    public Page<CommentResponseDto> getComments(String postId, String userId, int page, int size) {
        Post post = findPostOrThrow(postId);
        Group community = groupRepository.findById(post.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (community.isPrivate() && !community.hasMember(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You must be a member to view comments");
        }

        int cappedPage = Math.max(0, page);
        int cappedSize = Math.min(Math.max(1, size), 50);
        Pageable pageable = PageRequest.of(cappedPage, cappedSize);

        Page<PostComment> commentsPage = commentRepository.findByPostIdOrderByCreatedAtAsc(postId, pageable);
        boolean isAdmin = community.isAdmin(userId);

        List<CommentResponseDto> dtos = commentsPage.getContent().stream().map(c -> {
            boolean canDelete = isAdmin || (userId != null && c.getAuthorId().equals(userId));
            return new CommentResponseDto(
                    c.getId(),
                    c.getPostId(),
                    c.getCommunityId(),
                    c.getAuthorId(),
                    c.getAuthorUsername(),
                    c.getContent(),
                    c.getCreatedAt(),
                    c.getUpdatedAt(),
                    canDelete,
                    c.getParentCommentId(),
                    c.isEdited()
            );
        }).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, commentsPage.getTotalElements());
    }

    public void deleteComment(String postId, String commentId, String userId) {
        PostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getPostId().equals(postId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment does not belong to this post");
        }

        Group community = groupRepository.findById(comment.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        boolean isAuthor = comment.getAuthorId().equals(userId);
        boolean isAdmin = community.isAdmin(userId);

        if (!isAuthor && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to delete this comment");
        }

        commentRepository.deleteById(commentId);

        Post post = findPostOrThrow(postId);
        long count = commentRepository.countByPostId(postId);
        post.setCommentCount((int) count);
        postRepository.save(post);
    }

    public Map<String, Object> toggleBookmark(String postId, String userId) {
        findPostOrThrow(postId);

        Optional<PostBookmark> existing = bookmarkRepository.findByUserIdAndPostId(userId, postId);
        boolean isBookmarked;

        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            isBookmarked = false;
        } else {
            PostBookmark bookmark = new PostBookmark(userId, postId);
            bookmarkRepository.save(bookmark);
            isBookmarked = true;
        }

        Map<String, Object> res = new HashMap<>();
        res.put("bookmarked", isBookmarked);
        return res;
    }

    public Page<PostResponseDto> getUserBookmarks(String userId, int page, int size) {
        int cappedPage = Math.max(0, page);
        int cappedSize = Math.min(Math.max(1, size), 50);
        Pageable pageable = PageRequest.of(cappedPage, cappedSize);

        Page<PostBookmark> bookmarkPage = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        List<String> postIds = bookmarkPage.getContent().stream()
                .map(PostBookmark::getPostId)
                .collect(Collectors.toList());

        if (postIds.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, bookmarkPage.getTotalElements());
        }

        List<Post> posts = postRepository.findByIdIn(postIds);
        Map<String, Post> postMap = posts.stream().collect(Collectors.toMap(Post::getId, p -> p));

        // Group cache
        Set<String> communityIds = posts.stream().map(Post::getCommunityId).collect(Collectors.toSet());
        Map<String, Group> groupMap = groupRepository.findAllById(communityIds).stream()
                .collect(Collectors.toMap(Group::getId, g -> g));

        List<PostResponseDto> dtos = new ArrayList<>();
        for (String pid : postIds) {
            Post post = postMap.get(pid);
            if (post != null) {
                Group community = groupMap.get(post.getCommunityId());
                PostResponseDto dto = toDto(post, userId, community);
                dto.setBookmarked(true);
                reactionRepository.findByPostIdAndUserId(post.getId(), userId)
                        .ifPresent(r -> dto.setUserReaction(r.getType()));
                verificationRepository.findByPostIdAndUserId(post.getId(), userId)
                        .ifPresent(v -> dto.setUserVerification(v.getVerdict()));
                dtos.add(dto);
            }
        }

        return new PageImpl<>(dtos, pageable, bookmarkPage.getTotalElements());
    }

    public void reportPost(String postId, String userId, ReportRequestDto dto) {
        Post post = findPostOrThrow(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        PostReport report = new PostReport(
                postId,
                post.getCommunityId(),
                userId,
                user.getUsername(),
                dto.getReason(),
                dto.getDetails()
        );
        reportRepository.save(report);
    }

    public long recordView(String postId, String userId) {
        Post post = findPostOrThrow(postId);
        if (userId != null) {
            try {
                viewRepository.save(new PostView(postId, userId));
            } catch (org.springframework.dao.DuplicateKeyException e) {
                // already viewed, ignore
            }
        }
        long count = viewRepository.countByPostId(postId);
        post.setViewCount((int) count);
        postRepository.save(post);
        return count;
    }

    public long getViewCount(String postId) {
        return viewRepository.countByPostId(postId);
    }

    public Post findPostOrThrow(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    }

    private PostResponseDto toDto(Post post, String currentUserId, Group community) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setCommunityId(post.getCommunityId());
        dto.setAuthorId(post.getAuthorId());
        dto.setAuthorUsername(post.getAuthorUsername());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setMediaUrl(post.getMediaUrl());
        dto.setMediaType(post.getMediaType());
        dto.setExternalUrl(post.getExternalUrl());
        dto.setCategory(post.getCategory() != null ? post.getCategory() : "General");
        dto.setTags(post.getTags());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setEdited(post.isEdited());

        dto.setLikeCount(post.getLikeCount());
        dto.setDislikeCount(post.getDislikeCount());
        dto.setCommentCount(post.getCommentCount());
        dto.setVerifiedCount(post.getVerifiedCount());
        dto.setNotVerifiedCount(post.getNotVerifiedCount());
        dto.setViewCount(post.getViewCount());

        boolean isAuthor = currentUserId != null && currentUserId.equals(post.getAuthorId());
        boolean isAdmin = community != null && currentUserId != null && community.isAdmin(currentUserId);
        dto.setCanEdit(isAuthor);
        dto.setCanDelete(isAuthor || isAdmin);

        return dto;
    }

    private String sanitizeUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return null;
        }
        String trimmed = url.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed;
        }
        // If user typed "example.com", assume https://
        if (!trimmed.contains("://") && trimmed.contains(".")) {
            return "https://" + trimmed;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "External link must be a valid http or https URL");
    }

    private List<String> parseTags(List<String> rawTags, String content) {
        Set<String> cleanTags = new LinkedHashSet<>();
        if (rawTags != null) {
            for (String tag : rawTags) {
                if (tag != null) {
                    for (String part : tag.split("[,\\s]+")) {
                        String cleaned = part.trim().replace("#", "");
                        if (!cleaned.isEmpty()) {
                            cleanTags.add(cleaned);
                        }
                    }
                }
            }
        }
        // Also extract hashtags from content if any
        if (content != null && content.contains("#")) {
            for (String word : content.split("\\s+")) {
                if (word.startsWith("#") && word.length() > 1) {
                    String cleaned = word.replaceAll("[^a-zA-Z0-9_]", "");
                    if (!cleaned.isEmpty()) {
                        cleanTags.add(cleaned);
                    }
                }
            }
        }
        return new ArrayList<>(cleanTags);
    }
}
