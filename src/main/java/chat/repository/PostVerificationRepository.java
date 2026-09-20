package chat.repository;

import chat.model.PostVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostVerificationRepository extends MongoRepository<PostVerification, String> {

    Optional<PostVerification> findByPostIdAndUserId(String postId, String userId);

    List<PostVerification> findByPostIdInAndUserId(Collection<String> postIds, String userId);

    List<PostVerification> findByPostIdOrderByCreatedAtDesc(String postId);

    long countByPostIdAndVerdict(String postId, String verdict);

    void deleteByPostId(String postId);

    void deleteByPostIdAndUserId(String postId, String userId);
}
