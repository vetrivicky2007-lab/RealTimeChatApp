package chat.controller;

import chat.security.UserPrincipal;
import chat.service.CloudinaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
public class UploadController {

    private final CloudinaryService cloudinaryService;

    public UploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping(value = "/api/upload/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "unihive/general") String folder,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required to upload images");
        }

        String secureUrl = cloudinaryService.uploadImage(file, folder);
        return ResponseEntity.ok(Map.of(
                "url", secureUrl,
                "mediaType", "IMAGE"
        ));
    }
}
