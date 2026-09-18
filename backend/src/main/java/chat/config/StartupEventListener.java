package chat.config;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class StartupEventListener {

    private static final Logger logger = LoggerFactory.getLogger(StartupEventListener.class);

    private final MongoTemplate mongoTemplate;
    private int serverPort = 8080;

    public StartupEventListener(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @EventListener
    public void onWebServerInitialized(WebServerInitializedEvent event) {
        this.serverPort = event.getWebServer().getPort();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("=================================================");
        System.out.println("UniHive server starting...");

        try {
            mongoTemplate.executeCommand(new Document("ping", 1));
            System.out.println("MongoDB connection established.");
        } catch (Exception e) {
            System.err.println("MongoDB connection failed: " + e.getMessage());
            System.err.println("Ensure SPRING_DATA_MONGODB_URI is set correctly in environment variables.");
        }

        System.out.println("WebSocket server started.");
        System.out.println("Server listening on port: " + serverPort);
        System.out.println("=================================================");
    }
}
