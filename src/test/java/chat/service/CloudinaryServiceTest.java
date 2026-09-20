package chat.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CloudinaryServiceTest {

    @Mock
    private Uploader uploader;

    @Test
    void testIsConfiguredFalseWhenEmpty() {
        Cloudinary cloudinary = new Cloudinary();
        CloudinaryService service = new CloudinaryService(cloudinary);
        assertFalse(service.isConfigured());
    }

    @Test
    void testIsConfiguredTrueWhenConfigPresent() {
        Cloudinary cloudinary = new Cloudinary(Map.of(
                "cloud_name", "test-cloud",
                "api_key", "test-key",
                "api_secret", "test-secret"
        ));
        CloudinaryService service = new CloudinaryService(cloudinary);
        assertTrue(service.isConfigured());
    }

    @Test
    void testUploadEmptyFileFails() {
        Cloudinary cloudinary = new Cloudinary();
        CloudinaryService service = new CloudinaryService(cloudinary);

        MockMultipartFile emptyFile = new MockMultipartFile("file", "empty.png", "image/png", new byte[0]);
        assertThrows(ResponseStatusException.class,
                () -> service.uploadImage(emptyFile, "test-folder"));
    }

    @Test
    void testUploadInvalidContentTypeFails() {
        Cloudinary cloudinary = new Cloudinary();
        CloudinaryService service = new CloudinaryService(cloudinary);

        MockMultipartFile textFile = new MockMultipartFile("file", "doc.txt", "text/plain", "Hello".getBytes());
        assertThrows(ResponseStatusException.class,
                () -> service.uploadImage(textFile, "test-folder"));
    }

    @Test
    void testUploadWhenServiceNotConfiguredFails() {
        Cloudinary cloudinary = new Cloudinary();
        CloudinaryService service = new CloudinaryService(cloudinary);

        MockMultipartFile validFile = new MockMultipartFile("file", "test.png", "image/png", "sample data".getBytes());
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.uploadImage(validFile, "test-folder"));
        assertTrue(ex.getMessage().contains("CLOUDINARY_URL"));
    }

    @Test
    void testUploadSuccess() throws IOException {
        Cloudinary cloudinary = spy(new Cloudinary(Map.of(
                "cloud_name", "test-cloud",
                "api_key", "test-key",
                "api_secret", "test-secret"
        )));
        doReturn(uploader).when(cloudinary).uploader();

        Map<String, Object> result = Map.of(
                "secure_url", "https://res.cloudinary.com/test-cloud/image/upload/v1/test.png",
                "public_id", "test_id"
        );
        when(uploader.upload(any(byte[].class), anyMap())).thenReturn(result);

        CloudinaryService service = new CloudinaryService(cloudinary);
        MockMultipartFile validFile = new MockMultipartFile("file", "test.png", "image/png", "valid image bytes".getBytes());
        String url = service.uploadImage(validFile, "unihive/test");

        assertNotNull(url);
        assertEquals("https://res.cloudinary.com/test-cloud/image/upload/v1/test.png", url);
    }
}
