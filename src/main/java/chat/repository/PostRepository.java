package chat.repository;

import chat.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    Page<Post> findByCommunityIdOrderByCreatedAtDesc(String communityId, Pageable pageable);

    Page<Post> findByCommunityIdAndCategoryIgnoreCaseOrderByCreatedAtDesc(String communityId, String category, Pageable pageable);

    Page<Post> findByCommunityIdAndTagsContainingIgnoreCaseOrderByCreatedAtDesc(String communityId, String tag, Pageable pageable);

    List<Post> findByIdIn(Collection<String> ids);

    long countByCommunityId(String communityId);
}
