package com.spit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spit.repository.CoordinatorNotificationRepository;
import com.spit.repository.UserRepository;

@RestController
@RequestMapping("/api/coordinator")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
public class CoordinatorStudentController {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;
    private final CoordinatorNotificationRepository notificationRepository;

    public CoordinatorStudentController(
            UserRepository userRepository,
            JdbcTemplate jdbcTemplate,
            CoordinatorNotificationRepository notificationRepository) {

        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.notificationRepository = notificationRepository;
    }

    /**
     * Retrieves all students.
     */
    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getAllStudents() {

        List<Map<String, Object>> students =
                userRepository.findAllStudents();

        return ResponseEntity.ok(students);
    }

    /**
     * Deactivates a student account and notifies coordinators
     * who have enabled deleted-account notifications.
     */
    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<Map<String, String>> deactivateStudent(
            @PathVariable("studentId") Long studentId) {

        if (studentId == null || studentId <= 0) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Invalid student ID.")
            );
        }

        // Retrieve the student's name before deactivation.
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of(
                            "message",
                            "Student not found or the account is already inactive."
                    )
            );
        }

        String studentName =
                String.valueOf(students.get(0).get("full_name"));

        int updatedRows = userRepository.deactivateStudent(studentId);

        if (updatedRows == 1) {

            String notificationMessage =
                    "Student account deactivated: " + studentName
                    + " (Student ID: " + studentId + ").";

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

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Student account deactivated successfully."
                    )
            );
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of(
                        "message",
                        "Student not found or the account is already inactive."
                )
        );
    }
}
