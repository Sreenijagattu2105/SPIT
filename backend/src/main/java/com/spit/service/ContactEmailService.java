package com.spit.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;

/**
 * Handles email delivery for the SPIT application.
 *
 * Supports:
 * 1. Contact form messages.
 * 2. Password reset emails.
 *
 * Requires the RESEND_API_KEY environment variable.
 */
@Service
public class ContactEmailService {

    private static final String RESEND_URL =
            "https://api.resend.com/emails";

    private static final String SPIT_EMAIL =
            "spitofficial241026@gmail.com";

    private final HttpClient httpClient =
            HttpClient.newHttpClient();

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    /**
     * Sends a message submitted through the SPIT contact form.
     *
     * @param name    sender's name
     * @param email   sender's email address
     * @param subject message subject
     * @param message contact message
     * @throws IOException          if email delivery fails
     * @throws InterruptedException if the request is interrupted
     */
    public void sendContactEmail(
            String name,
            String email,
            String subject,
            String message)
            throws IOException, InterruptedException {

        String apiKey = System.getenv("RESEND_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "RESEND_API_KEY environment variable is missing.");
        }

        // Escape user-provided content before placing it in HTML.
        String html = """
                <h2>New SPIT Contact Message</h2>
                <p><strong>Name:</strong> %s</p>
                <p><strong>Email:</strong> %s</p>
                <p><strong>Subject:</strong> %s</p>
                <p><strong>Message:</strong></p>
                <p>%s</p>
                """.formatted(
                        escapeHtml(name),
                        escapeHtml(email),
                        escapeHtml(subject),
                        escapeHtml(message).replace("\n", "<br>")
                );

        // Prepare the request payload for Resend.
        Map<String, Object> payload = Map.of(
                "from", "SPIT Contact <onboarding@resend.dev>",
                "to", List.of(SPIT_EMAIL),
                "reply_to", email,
                "subject", "SPIT Contact: " + subject,
                "html", html
        );

        String requestBody =
                objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(RESEND_URL))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        // Treat non-2xx responses as email delivery failures.
        if (response.statusCode() < 200
                || response.statusCode() >= 300) {

            throw new IOException(
                    "Resend rejected the email. HTTP status: "
                            + response.statusCode());
        }
    }

    /**
     * Sends a password reset email to the configured test recipient.
     *
     * Note: This method currently uses SPIT_RESET_TEST_EMAIL.
     * Configure the actual recipient before production use.
     *
     * @param recipientEmail intended recipient's email address
     * @param resetLink      password reset URL
     * @throws IOException          if email delivery fails
     * @throws InterruptedException if the request is interrupted
     */
    public void sendPasswordResetEmail(
            String recipientEmail,
            String resetLink)
            throws IOException, InterruptedException {

        String apiKey = System.getenv("RESEND_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "RESEND_API_KEY environment variable is missing.");
        }

        // Use the configured test recipient during development.
        String testRecipient =
                System.getenv("SPIT_RESET_TEST_EMAIL");

        if (testRecipient == null || testRecipient.isBlank()) {
            throw new IllegalStateException(
                    "SPIT_RESET_TEST_EMAIL environment variable is missing.");
        }

        String html = """
                <h2>Reset Your SPIT Password</h2>
                <p>We received a request to reset your SPIT account password.</p>
                <p>Click the link below to choose a new password:</p>
                <p><a href="%s">Reset My Password</a></p>
                <p>This link expires in 15 minutes and can be used only once.</p>
                <p>If you did not request this, you can ignore this email.</p>
                """.formatted(escapeHtml(resetLink));

        Map<String, Object> payload = Map.of(
                "from", "SPIT Contact <onboarding@resend.dev>",
                "to", List.of(testRecipient),
                "subject", "Reset Your SPIT Password [TEST]",
                "html", html
        );

        String requestBody =
                objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(RESEND_URL))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        // Include the response body to help diagnose Resend failures.
        if (response.statusCode() < 200
                || response.statusCode() >= 300) {

            throw new IOException(
                    "Resend rejected the password-reset email. HTTP status: "
                            + response.statusCode()
                            + ". Response: " + response.body());
        }
    }

    /**
     * Escapes special characters to prevent HTML injection.
     *
     * @param value text to escape
     * @return escaped text safe for HTML content
     */
    private String escapeHtml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
