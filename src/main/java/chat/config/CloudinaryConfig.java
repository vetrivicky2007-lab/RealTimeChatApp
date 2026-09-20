package chat.config;

import com.cloudinary.Cloudinary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;

@Configuration
public class CloudinaryConfig {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Value("${cloudinary.url:}")
    private String cloudinaryUrl;

    @Bean
    public Cloudinary cloudinary() {
        String url = cloudinaryUrl;
        if (url == null || url.trim().isEmpty()) {
            url = System.getenv("CLOUDINARY_URL");
        }

        if (url != null && !url.trim().isEmpty()) {
            logger.info("Cloudinary configured successfully from environment.");
            return new Cloudinary(url.trim());
        }

        logger.warn("CLOUDINARY_URL is not set. Image uploads will require Cloudinary credentials to be configured.");
        return new Cloudinary(new HashMap<>());
    }
}
