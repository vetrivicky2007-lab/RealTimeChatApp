package chat.service;

import chat.dto.AuthResponse;
import chat.dto.LoginRequest;
import chat.dto.RegisterRequest;
import chat.dto.UserSummaryDto;
import chat.model.User;
import chat.repository.UserRepository;
import chat.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = new User(username, email, passwordHash);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());

        UserSummaryDto userSummary = toUserSummary(savedUser);
        return new AuthResponse(token, userSummary);
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();
        Optional<User> userOpt;

        if (identifier.contains("@")) {
            userOpt = userRepository.findByEmailIgnoreCase(identifier.toLowerCase());
        } else {
            userOpt = userRepository.findByUsernameIgnoreCase(identifier);
        }

        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username/email or password");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username/email or password");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getUsername(), user.getEmail());
        UserSummaryDto userSummary = toUserSummary(user);
        return new AuthResponse(token, userSummary);
    }

    public UserSummaryDto getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toUserSummary(user);
    }

    public UserSummaryDto toUserSummary(User user) {
        return new UserSummaryDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getStatus()
        );
    }
}
