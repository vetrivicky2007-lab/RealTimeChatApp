package chat.config;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class StartupEventListener {

    private static final Logger logger = LoggerFactory.getLogger(StartupEventListener.class);

    private final MongoTemplate mongoTemplate;

    public StartupEventListener(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        try {
            mongoTemplate.executeCommand(new Document("ping", 1));
            System.out.println("MongoDB connection established.");
        } catch (Exception e) {
            System.err.println("MongoDB connection failed: " + e.getMessage());
            System.err.println("Ensure SPRING_DATA_MONGODB_URI is set correctly in environment variables.");
        }
    }
}
