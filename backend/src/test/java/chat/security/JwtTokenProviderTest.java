package chat.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        // Use a 32+ char secret for test
        tokenProvider = new JwtTokenProvider("this_is_a_very_secure_test_secret_key_1234567890", 3600000);
    }

    @Test
    void testGenerateAndValidateToken() {
        String token = tokenProvider.generateToken("user123", "vetrivel", "vetri@example.com");
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("user123", tokenProvider.getUserIdFromToken(token));
        assertEquals("vetrivel", tokenProvider.getUsernameFromToken(token));
        assertEquals("vetri@example.com", tokenProvider.getEmailFromToken(token));
    }

    @Test
    void testInvalidTokenFails() {
        assertFalse(tokenProvider.validateToken("invalid.jwt.token"));
    }

    @Test
    void testShortSecretKeyDerivedGracefully() {
        // Test that secrets shorter than 32 bytes do not crash and generate valid keys
        JwtTokenProvider shortKeyProvider = new JwtTokenProvider("shortkey", 3600000);
        String token = shortKeyProvider.generateToken("user456", "alice", "alice@example.com");
        assertTrue(shortKeyProvider.validateToken(token));
        assertEquals("alice", shortKeyProvider.getUsernameFromToken(token));
    }
}
