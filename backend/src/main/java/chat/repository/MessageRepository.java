package chat.repository;

import chat.model.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findByGroupIdOrderByTimestampAsc(String groupId, Pageable pageable);

    List<Message> findByGroupIdOrderByTimestampDesc(String groupId, Pageable pageable);

    void deleteByGroupId(String groupId);
}
