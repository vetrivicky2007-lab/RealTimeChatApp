package chat.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public boolean isConfigured() {
        return cloudinary.config.cloudName != null && !cloudinary.config.cloudName.trim().isEmpty()
                && cloudinary.config.apiKey != null && !cloudinary.config.apiKey.trim().isEmpty();
    }

    public String uploadImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required and cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file size exceeds maximum limit of 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image format. Allowed formats: JPEG, PNG, WEBP, GIF");
        }

        if (!isConfigured()) {
            logger.error("Cloudinary upload failed: CLOUDINARY_URL environment variable is not configured.");
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Cloudinary image service is not configured. Please set CLOUDINARY_URL in your environment.");
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder != null ? folder : "unihive/general",
                            "resource_type", "image",
                            "overwrite", false
                    )
            );

            Object secureUrl = uploadResult.get("secure_url");
            if (secureUrl != null) {
                return secureUrl.toString();
            }

            Object url = uploadResult.get("url");
            if (url != null) {
                return url.toString();
            }

            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve secure URL from Cloudinary");
        } catch (IOException e) {
            logger.error("Cloudinary upload I/O error: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image to Cloudinary: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Cloudinary unexpected upload error: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Image upload failed: " + e.getMessage());
        }
    }
}
