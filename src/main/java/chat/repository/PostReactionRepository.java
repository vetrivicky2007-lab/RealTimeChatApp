package chat.repository;

import chat.model.PostReaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostReactionRepository extends MongoRepository<PostReaction, String> {

    Optional<PostReaction> findByPostIdAndUserId(String postId, String userId);

    List<PostReaction> findByPostIdInAndUserId(Collection<String> postIds, String userId);

    long countByPostIdAndType(String postId, String type);

    void deleteByPostId(String postId);

    void deleteByPostIdAndUserId(String postId, String userId);
}
