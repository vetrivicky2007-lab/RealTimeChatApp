package chat.repository;

import chat.model.PostReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostReportRepository extends MongoRepository<PostReport, String> {

    List<PostReport> findByCommunityIdOrderByCreatedAtDesc(String communityId);

    void deleteByPostId(String postId);
}
