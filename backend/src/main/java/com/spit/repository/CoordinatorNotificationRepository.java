package com.spit.repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CoordinatorNotificationRepository {

    private final JdbcTemplate jdbcTemplate;

    public CoordinatorNotificationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieves notifications for a specific coordinator.
     */
    public List<Map<String, Object>> getNotifications(Long coordinatorId) {

        String sql = """
                SELECT
                    notification_id AS id,
                    notification_type AS type,
                    message,
                    student_id AS studentId,
                    opportunity_id AS opportunityId,
                    application_id AS applicationId,
                    is_read AS `read`,
                    created_at AS createdAt
                FROM coordinator_notifications
                WHERE coordinator_id = ?
                ORDER BY created_at DESC, notification_id DESC
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> notification = new LinkedHashMap<>();

            notification.put("id", rs.getLong("id"));
            notification.put("type", rs.getString("type"));
            notification.put("message", rs.getString("message"));
            notification.put("studentId", rs.getObject("studentId"));
            notification.put("opportunityId", rs.getObject("opportunityId"));
            notification.put("applicationId", rs.getObject("applicationId"));
            notification.put("read", rs.getBoolean("read"));
            notification.put("createdAt", rs.getTimestamp("createdAt"));

            return notification;
        }, coordinatorId);
    }

    /**
     * Creates a notification for a coordinator.
     */
    public int createNotification(
            Long coordinatorId,
            String notificationType,
            String message,
            Long studentId,
            Long opportunityId,
            Long applicationId) {

        String sql = """
                INSERT INTO coordinator_notifications
                    (coordinator_id, notification_type, message,
                     student_id, opportunity_id, application_id)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                coordinatorId,
                notificationType,
                message,
                studentId,
                opportunityId,
                applicationId
        );
    }

    /**
     * Marks one notification as read for the specified coordinator.
     */
    public int markAsRead(Long coordinatorId, Long notificationId) {

        String sql = """
                UPDATE coordinator_notifications
                SET is_read = TRUE
                WHERE notification_id = ?
                  AND coordinator_id = ?
                  AND is_read = FALSE
                """;

        return jdbcTemplate.update(sql, notificationId, coordinatorId);
    }

    /**
     * Marks all notifications as read for the specified coordinator.
     */
    public int markAllAsRead(Long coordinatorId) {

        String sql = """
                UPDATE coordinator_notifications
                SET is_read = TRUE
                WHERE coordinator_id = ?
                  AND is_read = FALSE
                """;

        return jdbcTemplate.update(sql, coordinatorId);
    }

    /**
     * Deletes one notification belonging to the specified coordinator.
     */
    public int deleteNotification(Long coordinatorId, Long notificationId) {

        String sql = """
                DELETE FROM coordinator_notifications
                WHERE notification_id = ?
                  AND coordinator_id = ?
                """;

        return jdbcTemplate.update(sql, notificationId, coordinatorId);
    }

    /**
     * Returns the number of unread notifications for a coordinator.
     */
    public int getUnreadCount(Long coordinatorId) {

        String sql = """
                SELECT COUNT(*)
                FROM coordinator_notifications
                WHERE coordinator_id = ?
                  AND is_read = FALSE
                """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                coordinatorId
        );

        return count == null ? 0 : count;
    }

    /**
     * Retrieves coordinators who have enabled new-account notifications.
     */
    public List<Long> getCoordinatorsForRegistrationNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.registered_account, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }

    /**
     * Retrieves coordinators who have enabled student profile-update notifications.
     */
    public List<Long> getCoordinatorsForProfileUpdateNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.profile_updated, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }

    /**
     * Retrieves coordinators who have enabled resume-upload notifications.
     */
    public List<Long> getCoordinatorsForResumeUploadedNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.resume_uploaded, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }

    /**
     * Retrieves coordinators who have enabled resume-deletion notifications.
     */
    public List<Long> getCoordinatorsForResumeDeletedNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.resume_deleted, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }

    /**
     * Retrieves coordinators who have enabled new-application notifications.
     */
    public List<Long> getCoordinatorsForNewApplicationNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.new_applications, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }

    /**
     * Retrieves coordinators who have enabled overall interview-status notifications.
     */
    public List<Long> getCoordinatorsForOverallInterviewStatusNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.overall_interview_status_updated, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }

    /**
     * Retrieves coordinators who have enabled interview-round-added notifications.
     */
    public List<Long> getCoordinatorsForInterviewRoundAddedNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.interview_round_added, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }

    /**
     * Retrieves coordinators who have enabled interview-round-status notifications.
     */
    public List<Long> getCoordinatorsForInterviewRoundStatusUpdateNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.interview_round_status_updated, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }

    /**
     * Retrieves coordinators who have enabled student-account-deletion notifications.
     */
    public List<Long> getCoordinatorsForDeletedAccountNotifications() {

        String sql = """
                SELECT u.user_id
                FROM users u
                LEFT JOIN coordinator_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'COORDINATOR'
                  AND COALESCE(p.deleted_account, TRUE) = TRUE
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getLong("user_id")
        );
    }
}
