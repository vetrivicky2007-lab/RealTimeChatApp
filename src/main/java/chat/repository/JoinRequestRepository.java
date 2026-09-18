package chat.repository;

import chat.model.JoinRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoinRequestRepository extends MongoRepository<JoinRequest, String> {

    List<JoinRequest> findByGroupIdAndStatusOrderByRequestedAtDesc(String groupId, String status);

    Optional<JoinRequest> findByGroupIdAndUserIdAndStatus(String groupId, String userId, String status);

    boolean existsByGroupIdAndUserIdAndStatus(String groupId, String userId, String status);

    List<JoinRequest> findByUserIdAndStatus(String userId, String status);

    void deleteByGroupId(String groupId);
}
