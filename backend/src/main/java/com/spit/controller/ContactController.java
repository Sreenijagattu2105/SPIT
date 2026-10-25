package com.spit.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spit.service.ContactEmailService;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private final ContactEmailService contactEmailService;

    public ContactController(ContactEmailService contactEmailService) {
        this.contactEmailService = contactEmailService;
    }

    /**
     * Validates and sends a message submitted through the contact form.
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> sendContactMessage(
            @RequestBody Map<String, String> request) {

        String name = request.get("name");
        String email = request.get("email");
        String subject = request.get("subject");
        String message = request.get("message");

        // Validate required fields.
        if (isBlank(name)
                || isBlank(email)
                || isBlank(subject)
                || isBlank(message)) {

            return errorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Please fill in all contact form fields."
            );
        }

        // Trim surrounding whitespace.
        name = name.trim();
        email = email.trim();
        subject = subject.trim();
        message = message.trim();

        // Validate the name.
        if (name.length() > 100
                || !name.matches("^[\\p{L}\\p{M} .'-]+$")) {

            return errorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Please enter a valid name (maximum 100 characters)."
            );
        }

        // Validate the email address.
        if (email.length() > 254
                || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {

            return errorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Please enter a valid email address."
            );
        }

        // Validate the subject.
        if (subject.length() > 150) {
            return errorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Subject cannot exceed 150 characters."
            );
        }

        // Validate the message.
        if (message.length() > 5000) {
            return errorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot exceed 5000 characters."
            );
        }

        // Send the email only after validation succeeds.
        try {
            contactEmailService.sendContactEmail(
                    name,
                    email,
                    subject,
                    message
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Your message has been sent successfully!"
                    )
            );

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            return errorResponse(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Email sending was interrupted. Please try again."
            );

        } catch (IOException | IllegalStateException e) {
            System.err.println(
                    "SPIT contact email failed: " + e.getMessage()
            );

            return errorResponse(
                    HttpStatus.BAD_GATEWAY,
                    "We couldn't send your message. Please try again later."
            );
        }
    }

    /**
     * Checks whether a string is null, empty, or whitespace-only.
     */
    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    /**
     * Creates a standardized error response.
     */
    private ResponseEntity<Map<String, String>> errorResponse(
            HttpStatus status,
            String message) {

        return ResponseEntity.status(status)
                .body(Map.of("message", message));
    }
}
