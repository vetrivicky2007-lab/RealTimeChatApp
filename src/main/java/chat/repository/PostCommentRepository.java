package chat.repository;

import chat.model.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostCommentRepository extends MongoRepository<PostComment, String> {

    Page<PostComment> findByPostIdOrderByCreatedAtAsc(String postId, Pageable pageable);

    long countByPostId(String postId);

    void deleteByPostId(String postId);
}
