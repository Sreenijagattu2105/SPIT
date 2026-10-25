package com.spit.repository;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CoordinatorNotificationPreferenceRepository {

    private final JdbcTemplate jdbcTemplate;

    public CoordinatorNotificationPreferenceRepository(
            JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Loads notification preferences for a coordinator.
     * Returns default preferences if no record exists.
     */
    public Map<String, Object> getPreferences(Long userId) {

        String sql = """
                SELECT
                    registered_account,
                    deleted_account,
                    profile_updated,
                    resume_uploaded,
                    resume_deleted,
                    new_applications,
                    overall_interview_status_updated,
                    interview_round_added,
                    interview_round_status_updated
                FROM coordinator_notification_preferences
                WHERE user_id = ?
                """;

        return jdbcTemplate.query(sql, rs -> {
            if (!rs.next()) {
                return createDefaultPreferences();
            }

            Map<String, Object> preferences = new LinkedHashMap<>();

            preferences.put(
                    "registeredAccount",
                    rs.getBoolean("registered_account")
            );
            preferences.put(
                    "deletedAccount",
                    rs.getBoolean("deleted_account")
            );
            preferences.put(
                    "profileUpdated",
                    rs.getBoolean("profile_updated")
            );
            preferences.put(
                    "resumeUploaded",
                    rs.getBoolean("resume_uploaded")
            );
            preferences.put(
                    "resumeDeleted",
                    rs.getBoolean("resume_deleted")
            );
            preferences.put(
                    "newApplications",
                    rs.getBoolean("new_applications")
            );
            preferences.put(
                    "overallInterviewStatusUpdated",
                    rs.getBoolean("overall_interview_status_updated")
            );
            preferences.put(
                    "interviewRoundAdded",
                    rs.getBoolean("interview_round_added")
            );
            preferences.put(
                    "interviewRoundStatusUpdated",
                    rs.getBoolean("interview_round_status_updated")
            );

            return preferences;
        }, userId);
    }

    /**
     * Saves coordinator notification preferences.
     * Creates a record if one does not already exist.
     */
    public int savePreferences(
            Long userId,
            Map<String, Boolean> preferences) {

        String sql = """
                INSERT INTO coordinator_notification_preferences (
                    user_id,
                    registered_account,
                    deleted_account,
                    profile_updated,
                    resume_uploaded,
                    resume_deleted,
                    new_applications,
                    overall_interview_status_updated,
                    interview_round_added,
                    interview_round_status_updated
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    registered_account = VALUES(registered_account),
                    deleted_account = VALUES(deleted_account),
                    profile_updated = VALUES(profile_updated),
                    resume_uploaded = VALUES(resume_uploaded),
                    resume_deleted = VALUES(resume_deleted),
                    new_applications = VALUES(new_applications),
                    overall_interview_status_updated =
                        VALUES(overall_interview_status_updated),
                    interview_round_added = VALUES(interview_round_added),
                    interview_round_status_updated =
                        VALUES(interview_round_status_updated)
                """;

        return jdbcTemplate.update(
                sql,
                userId,
                preferenceValue(preferences, "registeredAccount"),
                preferenceValue(preferences, "deletedAccount"),
                preferenceValue(preferences, "profileUpdated"),
                preferenceValue(preferences, "resumeUploaded"),
                preferenceValue(preferences, "resumeDeleted"),
                preferenceValue(preferences, "newApplications"),
                preferenceValue(preferences, "overallInterviewStatusUpdated"),
                preferenceValue(preferences, "interviewRoundAdded"),
                preferenceValue(preferences, "interviewRoundStatusUpdated")
        );
    }

    /**
     * Returns the preference value.
     * Defaults to true when the value is null or missing.
     */
    private boolean preferenceValue(
            Map<String, Boolean> preferences,
            String key) {

        Boolean value = preferences.get(key);

        return value == null || value;
    }

    /**
     * Creates the default notification preferences.
     * All notification preferences are enabled by default.
     */
    private Map<String, Object> createDefaultPreferences() {

        Map<String, Object> defaults = new LinkedHashMap<>();

        defaults.put("registeredAccount", true);
        defaults.put("deletedAccount", true);
        defaults.put("profileUpdated", true);
        defaults.put("resumeUploaded", true);
        defaults.put("resumeDeleted", true);
        defaults.put("newApplications", true);
        defaults.put("overallInterviewStatusUpdated", true);
        defaults.put("interviewRoundAdded", true);
        defaults.put("interviewRoundStatusUpdated", true);

        return defaults;
    }
}
