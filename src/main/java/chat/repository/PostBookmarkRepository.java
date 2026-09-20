package chat.repository;

import chat.model.PostBookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostBookmarkRepository extends MongoRepository<PostBookmark, String> {

    Optional<PostBookmark> findByUserIdAndPostId(String userId, String postId);

    Page<PostBookmark> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    List<PostBookmark> findByPostIdInAndUserId(Collection<String> postIds, String userId);

    boolean existsByUserIdAndPostId(String userId, String postId);

    void deleteByUserIdAndPostId(String userId, String postId);

    void deleteByPostId(String postId);
}
