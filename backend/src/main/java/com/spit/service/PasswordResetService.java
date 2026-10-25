package com.spit.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spit.model.User;
import com.spit.repository.UserRepository;

@Service
public class PasswordResetService {

    private static final int TOKEN_VALIDITY_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ContactEmailService contactEmailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ContactEmailService contactEmailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.contactEmailService = contactEmailService;
    }

    public void requestPasswordReset(String email)
            throws Exception {

        if (email == null || email.isBlank()) {
            return;
        }

        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail);

        // Do not reveal whether an account exists.
        if (user == null || !user.isActive()) {
            return;
        }

        // Generate a cryptographically secure random token.
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        // Store only the SHA-256 hash, never the raw token.
        String tokenHash = sha256(rawToken);

        Timestamp expiresAt = Timestamp.from(
                Instant.now().plusSeconds(
                        TOKEN_VALIDITY_MINUTES * 60L));

        userRepository.savePasswordResetToken(
                user.getUserId(), tokenHash, expiresAt);

        String resetLink =
                "http://localhost:3000/reset-password?token="
                + rawToken;

        contactEmailService.sendPasswordResetEmail(
        		 "spitofficial241026@gmail.com", resetLink);
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException(
                    "Invalid or expired reset link.");
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters.");
        }

        if (newPassword.length() > 72) {
            throw new IllegalArgumentException(
                    "Password cannot exceed 72 characters.");
        }

        String tokenHash = sha256(rawToken);

        Map<String, Object> token =
                userRepository.findValidPasswordResetToken(tokenHash);

        if (token == null) {
            throw new IllegalArgumentException(
                    "Invalid or expired reset link.");
        }

        // Atomically claim the token before changing the password.
        int claimed = userRepository.markPasswordResetTokenUsed(
                tokenHash);

        if (claimed != 1) {
            throw new IllegalArgumentException(
                    "Invalid or expired reset link.");
        }

        Object userIdValue = token.get("user_id");
        Long userId = ((Number) userIdValue).longValue();

        String passwordHash = passwordEncoder.encode(newPassword);

        int updated = userRepository.updatePassword(
                userId, passwordHash);

        if (updated != 1) {
            throw new IllegalStateException(
                    "Could not update the password.");
        }
    }

    private String sha256(String value) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    value.getBytes(StandardCharsets.UTF_8));

            return java.util.HexFormat.of().formatHex(hash);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Could not process reset token.", e);
        }
    }
}
