package com.spit.controller;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spit.repository.CoordinatorNotificationRepository;

@RestController
@RequestMapping("/api/student/interview-progress")
public class InterviewProgressController {

    private final JdbcTemplate jdbcTemplate;
    private final CoordinatorNotificationRepository notificationRepository;

    public InterviewProgressController(
            JdbcTemplate jdbcTemplate,
            CoordinatorNotificationRepository notificationRepository) {

        this.jdbcTemplate = jdbcTemplate;
        this.notificationRepository = notificationRepository;
    }

    private Long getStudentId(HttpSession session) {
        Object userId = session.getAttribute("userId");
        Object role = session.getAttribute("userRole");

        if (userId == null || !"STUDENT".equals(role)) {
            return null;
        }

        return Long.valueOf(userId.toString());
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return "UPCOMING";
        }

        return status.trim()
                .toUpperCase()
                .replace(' ', '_');
    }

    @GetMapping
    public ResponseEntity<?> getInterviewProgress(HttpSession session) {

        Long studentId = getStudentId(session);

        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in as a student."));
        }

        List<Map<String, Object>> rounds = jdbcTemplate.queryForList(
                """
                SELECT
                    ir.round_id AS roundId,
                    ir.application_id AS applicationId,
                    a.opportunity_id AS opportunityId,
                    o.title,
                    o.company_name AS company,
                    ir.round_name AS name,
                    ir.round_number AS roundNumber,
                    DATE_FORMAT(ir.scheduled_at, '%Y-%m-%dT%H:%i:%s') AS scheduledAt,
                    ir.round_status AS status,
                    ir.notes,
                    DATE_FORMAT(ir.created_at, '%Y-%m-%dT%H:%i:%s') AS createdAt,
                    DATE_FORMAT(ir.updated_at, '%Y-%m-%dT%H:%i:%s') AS updatedAt
                FROM interview_rounds ir
                JOIN applications a
                    ON ir.application_id = a.application_id
                JOIN opportunities o
                    ON a.opportunity_id = o.opportunity_id
                WHERE a.student_id = ?
                ORDER BY ir.application_id, ir.round_number
                """,
                studentId
        );

        return ResponseEntity.ok(rounds);
    }

    // Add an interview round to an existing application.
    @PostMapping
    @Transactional
    public ResponseEntity<?> addInterviewRound(
            @RequestBody Map<String, Object> request,
            HttpSession session) {

        Long studentId = getStudentId(session);

        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in as a student."));
        }

        try {
            Object applicationValue = request.get("applicationId");
            Object nameValue = request.get("name");

            if (applicationValue == null || nameValue == null
                    || nameValue.toString().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Application and round name are required."
                        ));
            }

            long applicationId = Long.parseLong(applicationValue.toString());

            Integer ownedApplication = jdbcTemplate.queryForObject(
                    """
                    SELECT COUNT(*)
                    FROM applications
                    WHERE application_id = ?
                      AND student_id = ?
                    """,
                    Integer.class,
                    applicationId,
                    studentId
            );

            if (ownedApplication == null || ownedApplication == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Application not found."));
            }

            String name = nameValue.toString().trim();

            String status = normalizeStatus(
                    request.get("status") == null
                            ? "UPCOMING"
                            : request.get("status").toString()
            );

            Integer nextRoundNumber = jdbcTemplate.queryForObject(
                    """
                    SELECT COALESCE(MAX(round_number), 0) + 1
                    FROM interview_rounds
                    WHERE application_id = ?
                    """,
                    Integer.class,
                    applicationId
            );

            Object dateValue = request.get("date");
            Date scheduledDate = null;

            if (dateValue != null && !dateValue.toString().isBlank()) {
                scheduledDate = Date.valueOf(dateValue.toString());
            }

            Object notesValue = request.get("notes");
            String notes = notesValue == null ? null : notesValue.toString();

            jdbcTemplate.update(
                    """
                    INSERT INTO interview_rounds (
                        application_id,
                        round_name,
                        round_number,
                        scheduled_at,
                        round_status,
                        notes
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    applicationId,
                    name,
                    nextRoundNumber,
                    scheduledDate,
                    status,
                    notes
            );

            // Get the student and opportunity details for the notification.
            Map<String, Object> details = jdbcTemplate.queryForMap(
                    """
                    SELECT
                        u.full_name AS studentName,
                        o.title AS opportunityTitle,
                        o.company_name AS companyName,
                        a.opportunity_id AS opportunityId
                    FROM users u
                    JOIN applications a ON a.student_id = u.user_id
                    JOIN opportunities o ON o.opportunity_id = a.opportunity_id
                    WHERE u.user_id = ?
                      AND a.application_id = ?
                    """,
                    studentId,
                    applicationId
            );

            String studentName = String.valueOf(details.get("studentName"));
            String opportunityTitle =
                    String.valueOf(details.get("opportunityTitle"));
            String companyName = String.valueOf(details.get("companyName"));

            Long opportunityId =
                    ((Number) details.get("opportunityId")).longValue();

            String notificationMessage =
                    studentName + " added the " + name
                            + " interview round for " + opportunityTitle
                            + " at " + companyName + ".";

            for (Long coordinatorId : notificationRepository
                    .getCoordinatorsForInterviewRoundAddedNotifications()) {

                notificationRepository.createNotification(
                        coordinatorId,
                        "INTERVIEW_ROUND_ADDED",
                        notificationMessage,
                        studentId,
                        opportunityId,
                        applicationId
                );
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message",
                            "Interview round added successfully."
                    ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Please check the application ID, date, and status."
                    ));
        }
    }

    // Update the status and notes of a round.
    @PutMapping("/{roundId}")
    public ResponseEntity<?> updateInterviewRound(
            @PathVariable("roundId") long roundId,
            @RequestBody Map<String, Object> request,
            HttpSession session) {

        Long studentId = getStudentId(session);

        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in as a student."));
        }

        Integer ownedRound = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM interview_rounds ir
                JOIN applications a
                    ON ir.application_id = a.application_id
                WHERE ir.round_id = ?
                  AND a.student_id = ?
                """,
                Integer.class,
                roundId,
                studentId
        );

        if (ownedRound == null || ownedRound == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Interview round not found."));
        }

        // Capture the current round details before updating.
        Map<String, Object> roundDetails = jdbcTemplate.queryForMap(
                """
                SELECT
                    ir.round_status AS oldStatus,
                    ir.round_name AS roundName,
                    a.application_id AS applicationId,
                    a.opportunity_id AS opportunityId,
                    o.title AS opportunityTitle,
                    o.company_name AS companyName,
                    u.full_name AS studentName
                FROM interview_rounds ir
                JOIN applications a
                    ON ir.application_id = a.application_id
                JOIN opportunities o
                    ON a.opportunity_id = o.opportunity_id
                JOIN users u
                    ON a.student_id = u.user_id
                WHERE ir.round_id = ?
                  AND a.student_id = ?
                """,
                roundId,
                studentId
        );

        String oldStatus = normalizeStatus(
                String.valueOf(roundDetails.get("oldStatus"))
        );

        if (request.containsKey("status")) {
            String status = normalizeStatus(
                    String.valueOf(request.get("status"))
            );

            jdbcTemplate.update(
                    """
                    UPDATE interview_rounds
                    SET round_status = ?
                    WHERE round_id = ?
                    """,
                    status,
                    roundId
            );
        }

        if (request.containsKey("notes")) {
            Object value = request.get("notes");

            jdbcTemplate.update(
                    """
                    UPDATE interview_rounds
                    SET notes = ?
                    WHERE round_id = ?
                    """,
                    value == null ? null : value.toString(),
                    roundId
            );
        }

        // Notify coordinators only when the status actually changes.
        if (request.containsKey("status")) {

            String newStatus = normalizeStatus(
                    String.valueOf(request.get("status"))
            );

            if (!oldStatus.equals(newStatus)) {

                String studentName =
                        String.valueOf(roundDetails.get("studentName"));
                String roundName =
                        String.valueOf(roundDetails.get("roundName"));
                String opportunityTitle =
                        String.valueOf(roundDetails.get("opportunityTitle"));
                String companyName =
                        String.valueOf(roundDetails.get("companyName"));

                Long applicationId =
                        ((Number) roundDetails.get("applicationId")).longValue();

                Long opportunityId =
                        ((Number) roundDetails.get("opportunityId")).longValue();

                String notificationMessage =
                        studentName + " updated the " + roundName
                                + " interview round status from "
                                + oldStatus + " to " + newStatus
                                + " for " + opportunityTitle
                                + " at " + companyName + ".";

                for (Long coordinatorId : notificationRepository
                        .getCoordinatorsForInterviewRoundStatusUpdateNotifications()) {

                    notificationRepository.createNotification(
                            coordinatorId,
                            "INTERVIEW_ROUND_STATUS_UPDATED",
                            notificationMessage,
                            studentId,
                            opportunityId,
                            applicationId
                    );
                }
            }
        }

        return ResponseEntity.ok(
                Map.of("message", "Interview round updated successfully.")
        );
    }

    // Delete a round belonging to the logged-in student.
    @DeleteMapping("/{roundId}")
    public ResponseEntity<?> deleteInterviewRound(
            @PathVariable("roundId") long roundId,
            HttpSession session) {

        Long studentId = getStudentId(session);

        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in as a student."));
        }

        int deleted = jdbcTemplate.update(
                """
                DELETE ir
                FROM interview_rounds ir
                JOIN applications a
                    ON ir.application_id = a.application_id
                WHERE ir.round_id = ?
                  AND a.student_id = ?
                """,
                roundId,
                studentId
        );

        if (deleted == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Interview round not found."));
        }

        return ResponseEntity.ok(
                Map.of("message", "Interview round deleted successfully.")
        );
    }
}
