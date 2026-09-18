package chat.repository;

import chat.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {

    List<Group> findAllByOrderByCreatedAtDesc();

    List<Group> findByMembersContaining(String userId);

    boolean existsByNameIgnoreCase(String name);
}
