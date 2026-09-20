package chat.repository;

import chat.model.PostView;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostViewRepository extends MongoRepository<PostView, String> {
    long countByPostId(String postId);
    boolean existsByPostIdAndUserId(String postId, String userId);
}
