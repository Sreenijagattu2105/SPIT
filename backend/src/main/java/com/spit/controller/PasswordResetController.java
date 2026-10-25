package com.spit.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spit.service.PasswordResetService;

@RestController
@RequestMapping("/api/auth/password")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Please enter your email address."));
        }

        try {
            passwordResetService.requestPasswordReset(email);

            // Use the same response whether or not the account exists.
            return ResponseEntity.ok(Map.of(
                    "message",
                    "If an active account exists for that email, reset instructions will be sent."
            ));

        } catch (Exception e) {
            System.err.println(
                    "Password reset email request failed: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Unable to process your request right now. Please try again later."
                    ));
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> request) {

        String token = request.get("token");
        String newPassword = request.get("newPassword");

        try {
            passwordResetService.resetPassword(token, newPassword);

            return ResponseEntity.ok(Map.of(
                    "message", "Your password has been reset successfully."
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage()
            ));

        } catch (Exception e) {
            System.err.println(
                    "Password reset failed: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Unable to reset your password. Please try again later."
                    ));
        }
    }
}
