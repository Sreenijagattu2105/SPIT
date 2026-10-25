package com.spit.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Long getUserId(HttpSession session) {
        Object userId = session.getAttribute("userId");

        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        }

        return null;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(HttpSession session) {
        Long userId = getUserId(session);

        System.out.println("Session ID: " + session.getId());
        System.out.println("Session userId: " + session.getAttribute("userId"));
        System.out.println("Session userRole: " + session.getAttribute("userRole"));

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        List<Map<String, Object>> notifications =
                jdbcTemplate.queryForList(
                        "SELECT notification_id AS notificationId, "
                                + "notification_type AS notificationType, "
                                + "message, opportunity_id AS opportunityId, "
                                + "application_id AS applicationId, "
                                + "interview_round_id AS interviewRoundId, "
                                + "reminder_days_left AS reminderDaysLeft, "
                                + "deadline_date AS deadlineDate, "
                                + "is_read AS isRead, created_at AS createdAt "
                                + "FROM notifications "
                                + "WHERE recipient_user_id = ? "
                                + "ORDER BY created_at DESC",
                        userId
                );

        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable("notificationId") Long notificationId,
            HttpSession session) {

        Long userId = getUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        int updated = jdbcTemplate.update(
                "UPDATE notifications SET is_read = TRUE "
                        + "WHERE notification_id = ? AND recipient_user_id = ?",
                notificationId,
                userId
        );

        if (updated == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Notification not found."));
        }

        return ResponseEntity.ok(
                Map.of("message", "Notification marked as read.")
        );
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(HttpSession session) {
        Long userId = getUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        jdbcTemplate.update(
                "UPDATE notifications SET is_read = TRUE "
                        + "WHERE recipient_user_id = ? AND is_read = FALSE",
                userId
        );

        return ResponseEntity.ok(
                Map.of("message", "All notifications marked as read.")
        );
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable("notificationId") Long notificationId,
            HttpSession session) {

        Long userId = getUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        int deleted = jdbcTemplate.update(
                "DELETE FROM notifications "
                        + "WHERE notification_id = ? AND recipient_user_id = ?",
                notificationId,
                userId
        );

        if (deleted == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Notification not found."));
        }

        return ResponseEntity.ok(
                Map.of("message", "Notification deleted.")
        );
    }

    @PostMapping
    public ResponseEntity<?> createNotification(
            @RequestBody Map<String, Object> request,
            HttpSession session) {

        Long userId = getUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        String type = String.valueOf(
                request.getOrDefault("notificationType", "")
        ).trim();

        String message = String.valueOf(
                request.getOrDefault("message", "")
        ).trim();

        if (type.isEmpty() || message.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Notification type and message are required."
                    ));
        }

        Object opportunityId = request.get("opportunityId");
        Object applicationId = request.get("applicationId");
        Object interviewRoundId = request.get("interviewRoundId");
        Object reminderDaysLeft = request.get("reminderDaysLeft");
        Object deadlineDate = request.get("deadlineDate");

        jdbcTemplate.update(
                "INSERT INTO notifications "
                        + "(recipient_user_id, notification_type, message, "
                        + "opportunity_id, application_id, interview_round_id, "
                        + "reminder_days_left, deadline_date, is_read) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)",
                userId,
                type,
                message,
                opportunityId,
                applicationId,
                interviewRoundId,
                reminderDaysLeft,
                deadlineDate
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Notification created successfully."));
    }

    @PostMapping("/deadline-reminders")
    public ResponseEntity<?> createDeadlineReminders(HttpSession session) {
        Long userId = getUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        try {
            // Ensure this student has a preferences row.
            jdbcTemplate.update(
                    """
                    INSERT INTO student_notification_preferences (user_id)
                    VALUES (?)
                    ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)
                    """,
                    userId
            );

            // Load this student's deadline reminder preferences.
            Map<String, Object> preferences = jdbcTemplate.queryForMap(
                    """
                    SELECT
                        deadline_7_days AS deadline7Days,
                        deadline_3_days AS deadline3Days,
                        deadline_1_day AS deadline1Day,
                        deadline_day AS deadlineDay
                    FROM student_notification_preferences
                    WHERE user_id = ?
                    """,
                    userId
            );

            List<Map<String, Object>> opportunities =
                    jdbcTemplate.queryForList(
                            """
                            SELECT opportunity_id, title, company_name, deadline
                            FROM opportunities
                            WHERE status = 'PUBLISHED'
                              AND deadline IS NOT NULL
                            """
                    );

            LocalDate today = LocalDate.now();
            int created = 0;

            for (Map<String, Object> opportunity : opportunities) {
                Object deadlineValue = opportunity.get("deadline");

                if (deadlineValue == null) {
                    continue;
                }

                LocalDate deadline;

                if (deadlineValue instanceof java.sql.Date) {
                    deadline = ((java.sql.Date) deadlineValue).toLocalDate();
                } else {
                    deadline = LocalDate.parse(deadlineValue.toString());
                }

                long daysLeft = java.time.temporal.ChronoUnit.DAYS
                        .between(today, deadline);

                if (daysLeft != 7 && daysLeft != 3
                        && daysLeft != 1 && daysLeft != 0) {
                    continue;
                }

                String preferenceKey;

                if (daysLeft == 7) {
                    preferenceKey = "deadline7Days";
                } else if (daysLeft == 3) {
                    preferenceKey = "deadline3Days";
                } else if (daysLeft == 1) {
                    preferenceKey = "deadline1Day";
                } else {
                    preferenceKey = "deadlineDay";
                }

                Object preferenceValue = preferences.get(preferenceKey);

                boolean enabled =
                        Boolean.TRUE.equals(preferenceValue)
                                || (preferenceValue instanceof Number
                                && ((Number) preferenceValue).intValue() == 1);

                if (!enabled) {
                    continue;
                }

                long opportunityId =
                        ((Number) opportunity.get("opportunity_id")).longValue();

                String title = String.valueOf(opportunity.get("title"));
                String company = String.valueOf(opportunity.get("company_name"));

                Integer exists = jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM notifications
                        WHERE recipient_user_id = ?
                          AND notification_type = 'DEADLINE_REMINDER'
                          AND opportunity_id = ?
                          AND reminder_days_left = ?
                          AND deadline_date = ?
                        """,
                        Integer.class,
                        userId,
                        opportunityId,
                        (int) daysLeft,
                        java.sql.Date.valueOf(deadline)
                );

                if (exists != null && exists > 0) {
                    continue;
                }

                String message;

                if (daysLeft == 0) {
                    message = "Deadline today! Apply for \"" + title
                            + "\" at " + company + ".";
                } else if (daysLeft == 1) {
                    message = "Last day tomorrow! Apply for \"" + title
                            + "\" at " + company + ".";
                } else {
                    message = "Reminder: \"" + title + "\" at " + company
                            + " has " + daysLeft + " days left to apply.";
                }

                jdbcTemplate.update(
                        """
                        INSERT INTO notifications (
                            recipient_user_id,
                            notification_type,
                            message,
                            opportunity_id,
                            reminder_days_left,
                            deadline_date,
                            is_read
                        )
                        VALUES (?, 'DEADLINE_REMINDER', ?, ?, ?, ?, FALSE)
                        """,
                        userId,
                        message,
                        opportunityId,
                        (int) daysLeft,
                        java.sql.Date.valueOf(deadline)
                );

                created++;
            }

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Deadline reminders checked successfully.",
                            "created", created
                    )
            );

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("DEADLINE REMINDER ERROR: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Could not create deadline reminders.",
                            "error", String.valueOf(e.getMessage())
                    ));
        }
    }
}
