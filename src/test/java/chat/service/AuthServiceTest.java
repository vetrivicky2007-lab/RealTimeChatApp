package chat.service;

import chat.dto.AuthResponse;
import chat.dto.LoginRequest;
import chat.dto.RegisterRequest;
import chat.model.User;
import chat.repository.UserRepository;
import chat.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, tokenProvider);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("vetrivel", "vetri@example.com", "password123");

        when(userRepository.existsByUsernameIgnoreCase("vetrivel")).thenReturn(false);
        when(userRepository.existsByEmailIgnoreCase("vetri@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_pw");

        User savedUser = new User("vetrivel", "vetri@example.com", "hashed_pw");
        savedUser.setId("user123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateToken("user123", "vetrivel", "vetri@example.com")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("vetrivel", response.getUser().getUsername());
        assertEquals("vetri@example.com", response.getUser().getEmail());
        assertEquals("user123", response.getUser().getId());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateUsername() {
        RegisterRequest request = new RegisterRequest("existingUser", "user@example.com", "password123");
        when(userRepository.existsByUsernameIgnoreCase("existingUser")).thenReturn(true);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> authService.register(request));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Username is already taken"));
    }

    @Test
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("newUser", "existing@example.com", "password123");
        when(userRepository.existsByUsernameIgnoreCase("newUser")).thenReturn(false);
        when(userRepository.existsByEmailIgnoreCase("existing@example.com")).thenReturn(true);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> authService.register(request));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Email is already registered"));
    }

    @Test
    void testLoginWithUsernameSuccess() {
        LoginRequest request = new LoginRequest("vetrivel", "password123");
        User user = new User("vetrivel", "vetri@example.com", "hashed_pw");
        user.setId("user123");

        when(userRepository.findByUsernameIgnoreCase("vetrivel")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed_pw")).thenReturn(true);
        when(tokenProvider.generateToken("user123", "vetrivel", "vetri@example.com")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("vetrivel", response.getUser().getUsername());
    }

    @Test
    void testLoginWithEmailSuccess() {
        LoginRequest request = new LoginRequest("vetri@example.com", "password123");
        User user = new User("vetrivel", "vetri@example.com", "hashed_pw");
        user.setId("user123");

        when(userRepository.findByEmailIgnoreCase("vetri@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed_pw")).thenReturn(true);
        when(tokenProvider.generateToken("user123", "vetrivel", "vetri@example.com")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("vetrivel", response.getUser().getUsername());
    }

    @Test
    void testLoginWrongPassword() {
        LoginRequest request = new LoginRequest("vetrivel", "wrongpass");
        User user = new User("vetrivel", "vetri@example.com", "hashed_pw");

        when(userRepository.findByUsernameIgnoreCase("vetrivel")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "hashed_pw")).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> authService.login(request));
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }
}
