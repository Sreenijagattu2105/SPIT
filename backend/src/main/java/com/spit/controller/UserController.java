package com.spit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spit.model.User;
import com.spit.repository.CoordinatorNotificationRepository;
import com.spit.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final JdbcTemplate jdbcTemplate;
    private final CoordinatorNotificationRepository notificationRepository;

    public UserController(
            UserService userService,
            JdbcTemplate jdbcTemplate,
            CoordinatorNotificationRepository notificationRepository) {

        this.userService = userService;
        this.jdbcTemplate = jdbcTemplate;
        this.notificationRepository = notificationRepository;
    }

    /**
     * Registers a new student account.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @RequestBody User user) {

        try {
            userService.registerStudent(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message",
                            "Student registered successfully."
                    ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Authenticates a user and creates an authenticated session.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest,
            HttpSession session) {

        try {
            String email = request.get("email");
            String password = request.get("password");

            User user = userService.login(email, password);

            httpRequest.changeSessionId();

            // Store the authenticated identity on the server.
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userRole", user.getRole());

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful.",
                    "userId", user.getUserId().toString(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Changes the password of the logged-in student.
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody Map<String, String> request,
            HttpSession session) {

        Object userIdValue = session.getAttribute("userId");
        Object roleValue = session.getAttribute("userRole");

        if (userIdValue == null || !"STUDENT".equals(roleValue)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Please log in as a student to change your password."
                    ));
        }

        Long userId = Long.valueOf(userIdValue.toString());

        try {
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            // Change the password.
            userService.changePassword(
                    userId,
                    currentPassword,
                    newPassword
            );

            // Check whether the student has enabled password-update notifications.
            Boolean passwordNotificationEnabled = jdbcTemplate.queryForObject(
                    """
                    SELECT COALESCE(
                        (
                            SELECT password_updated
                            FROM student_notification_preferences
                            WHERE user_id = ?
                        ),
                        TRUE
                    )
                    """,
                    Boolean.class,
                    userId
            );

            // Create a notification only for this student when enabled.
            if (Boolean.TRUE.equals(passwordNotificationEnabled)) {
                jdbcTemplate.update(
                        """
                        INSERT INTO notifications
                            (recipient_user_id, notification_type, message,
                             opportunity_id, application_id, is_read)
                        VALUES (?, ?, ?, NULL, NULL, FALSE)
                        """,
                        userId,
                        "PASSWORD_UPDATED",
                        "Your password has been updated successfully."
                );
            }

            return ResponseEntity.ok(Map.of(
                    "message",
                    "Password changed successfully."
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Unable to change password. Please try again."
                    ));
        }
    }

    /**
     * Checks whether the current session is authenticated.
     */
    @GetMapping("/session")
    public ResponseEntity<Map<String, String>> checkSession(
            HttpSession session) {

        Object userId = session.getAttribute("userId");
        Object userRole = session.getAttribute("userRole");

        if (userId == null || userRole == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Not authenticated."));
        }

        return ResponseEntity.ok(Map.of(
                "userId", userId.toString(),
                "role", userRole.toString()
        ));
    }

    /**
     * Logs out the current user by invalidating the session.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok(Map.of(
                "message",
                "Logout successful."
        ));
    }

    /**
     * Deactivates the logged-in student's own account.
     */
    @DeleteMapping("/account")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteOwnAccount(
            HttpSession session) {

        Object userIdValue = session.getAttribute("userId");
        Object roleValue = session.getAttribute("userRole");

        if (userIdValue == null || !"STUDENT".equals(roleValue)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Please log in as a student."
                    ));
        }

        try {
            Long studentId = Long.valueOf(userIdValue.toString());

            // Retrieve the student's details before deactivation.
            List<Map<String, Object>> students = jdbcTemplate.queryForList(
                    """
                    SELECT full_name
                    FROM users
                    WHERE user_id = ?
                      AND role = 'STUDENT'
                      AND is_active = 1
                    """,
                    studentId
            );

            if (students.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Student account not found or already inactive."
                        ));
            }

            String studentName =
                    String.valueOf(students.get(0).get("full_name"));

            int updatedRows = jdbcTemplate.update(
                    """
                    UPDATE users
                    SET is_active = 0
                    WHERE user_id = ?
                      AND role = 'STUDENT'
                      AND is_active = 1
                    """,
                    studentId
            );

            if (updatedRows != 1) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Student account not found or already inactive."
                        ));
            }

            String notificationMessage =
                    "Student account deactivated: " + studentName
                    + " (Student ID: " + studentId
                    + ") deleted their own SPIT account.";

            for (Long coordinatorId :
                    notificationRepository
                            .getCoordinatorsForDeletedAccountNotifications()) {

                notificationRepository.createNotification(
                        coordinatorId,
                        "DELETED_ACCOUNT",
                        notificationMessage,
                        studentId,
                        null,
                        null
                );
            }

            // Invalidate the student's session after successful deactivation.
            session.invalidate();

            return ResponseEntity.ok(Map.of(
                    "message",
                    "Your account has been deactivated successfully."
            ));

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Unable to deactivate your account. Please try again."
                    ));
        }
    }
}
