-- ============================================================
-- SPIT: Student Placement and Interview Tracker
-- Database schema setup
--
-- Source: Latest structure export from the local spit_db database.
-- Purpose: Create missing tables without dropping existing tables.
--
-- IMPORTANT:
--   * This script uses CREATE TABLE IF NOT EXISTS.
--   * It does not delete existing tables or existing records.
--   * It does not create sample/test users or opportunities.
--   * The seven predefined round names are inserted separately below.
--   * Review and back up the database before changing production data.
-- ============================================================

CREATE DATABASE IF NOT EXISTS `spit_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `spit_db`;


-- ============================================================
-- 1. USER ACCOUNTS
-- Stores student and coordinator login accounts.
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `role` enum('STUDENT','COORDINATOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STUDENT',
    `is_active` tinyint(1) NOT NULL DEFAULT '1',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uq_users_email` (`email`),
    KEY `idx_users_role_active` (`role`,`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2. CONTACT MESSAGES
-- Stores messages submitted through the contact form.
-- ============================================================
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `contact_message_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `sender_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `sender_email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
    `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
    `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`contact_message_id`),
    KEY `idx_contact_messages_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. PASSWORD RESET TOKENS
-- Stores hashed, time-limited password-reset tokens; not user passwords.
-- ============================================================
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `token_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `user_id` bigint unsigned NOT NULL,
    `token_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `expires_at` datetime NOT NULL,
    `used_at` datetime DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`token_id`),
    UNIQUE KEY `uq_password_reset_token_hash` (`token_hash`),
    KEY `idx_password_reset_user_expiry` (`user_id`,`expires_at`),
    CONSTRAINT `fk_reset_token_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 4. STUDENT PROFILES
-- Stores additional student education, skills, and profile details.
-- ============================================================
CREATE TABLE IF NOT EXISTS `student_profiles` (
    `user_id` bigint unsigned NOT NULL,
    `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `department` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `graduation_year` smallint unsigned DEFAULT NULL,
    `highest_qualification` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `institution_university` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `skills` text COLLATE utf8mb4_unicode_ci,
    `projects` text COLLATE utf8mb4_unicode_ci,
    `certifications` text COLLATE utf8mb4_unicode_ci,
    `linkedin_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `github_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    CONSTRAINT `fk_student_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 5. STUDENT NOTIFICATIONS
-- Stores notifications delivered to users, including application-related alerts.
-- ============================================================
CREATE TABLE IF NOT EXISTS `notifications` (
    `notification_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `recipient_user_id` bigint unsigned NOT NULL,
    `notification_type` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
    `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `opportunity_id` bigint unsigned DEFAULT NULL,
    `application_id` bigint unsigned DEFAULT NULL,
    `interview_round_id` bigint unsigned DEFAULT NULL,
    `reminder_days_left` tinyint DEFAULT NULL,
    `deadline_date` date DEFAULT NULL,
    `is_read` tinyint(1) NOT NULL DEFAULT '0',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`notification_id`),
    UNIQUE KEY `uq_deadline_reminder` (`recipient_user_id`,`opportunity_id`,`reminder_days_left`,`deadline_date`,`notification_type`),
    KEY `idx_notifications_recipient_read_date` (`recipient_user_id`,`is_read`,`created_at`),
    KEY `idx_notifications_type` (`notification_type`),
    KEY `fk_notifications_opportunity` (`opportunity_id`),
    KEY `fk_notifications_application` (`application_id`),
    KEY `fk_notifications_round` (`interview_round_id`),
    CONSTRAINT `fk_notifications_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_notifications_opportunity` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`opportunity_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_notifications_recipient` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_notifications_round` FOREIGN KEY (`interview_round_id`) REFERENCES `interview_rounds` (`round_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 6. STUDENT NOTIFICATION PREFERENCES
-- Stores notification settings for student accounts.
-- ============================================================
CREATE TABLE IF NOT EXISTS `student_notification_preferences` (
    `user_id` bigint unsigned NOT NULL,
    `opportunity_published` tinyint(1) NOT NULL DEFAULT '1',
    `opportunity_updated` tinyint(1) NOT NULL DEFAULT '1',
    `deadline_7_days` tinyint(1) NOT NULL DEFAULT '1',
    `deadline_3_days` tinyint(1) NOT NULL DEFAULT '1',
    `deadline_1_day` tinyint(1) NOT NULL DEFAULT '1',
    `deadline_day` tinyint(1) NOT NULL DEFAULT '1',
    `application_added` tinyint(1) NOT NULL DEFAULT '1',
    `application_deleted` tinyint(1) NOT NULL DEFAULT '1',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `password_updated` tinyint(1) NOT NULL DEFAULT '1',
    PRIMARY KEY (`user_id`),
    CONSTRAINT `fk_student_preferences_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 7. PREDEFINED INTERVIEW ROUND NAMES
-- Configuration list used when creating interview rounds.
-- ============================================================
CREATE TABLE IF NOT EXISTS `round_names` (
    `round_name_id` smallint unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `is_active` tinyint(1) NOT NULL DEFAULT '1',
    `display_order` smallint unsigned NOT NULL DEFAULT '0',
    PRIMARY KEY (`round_name_id`),
    UNIQUE KEY `uq_round_names_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- DEFAULT INTERVIEW ROUND NAMES
-- Insert the standard round names only when they do not already exist.
-- Existing round-name records and IDs are preserved.
-- ============================================================

INSERT INTO `round_names` (`name`, `display_order`)
VALUES
    ('Online Assessment', 1),
    ('Aptitude Test', 2),
    ('Technical Interview', 3),
    ('Coding Round', 4),
    ('HR Interview', 5),
    ('Managerial Interview', 6),
    ('Other', 7)
ON DUPLICATE KEY UPDATE
    `display_order` = VALUES(`display_order`);


-- ============================================================
-- 8. INTERVIEW PROGRESS ROUNDS
-- Tracks each interview round associated with an application.
-- ============================================================
CREATE TABLE IF NOT EXISTS `interview_rounds` (
    `round_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `application_id` bigint unsigned NOT NULL,
    `round_name_id` smallint unsigned DEFAULT NULL,
    `round_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `round_number` smallint unsigned NOT NULL,
    `scheduled_at` datetime DEFAULT NULL,
    `round_status` enum('UPCOMING','SCHEDULED','IN_PROGRESS','SHORTLISTED','COMPLETED','CLEARED','NOT_CLEARED','RESCHEDULED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UPCOMING',
    `notes` text COLLATE utf8mb4_unicode_ci,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`round_id`),
    UNIQUE KEY `uq_interview_application_round` (`application_id`,`round_number`),
    KEY `idx_interview_scheduled_status` (`scheduled_at`,`round_status`),
    KEY `fk_interview_round_name` (`round_name_id`),
    CONSTRAINT `fk_interview_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_interview_round_name` FOREIGN KEY (`round_name_id`) REFERENCES `round_names` (`round_name_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 9. SAVED OPPORTUNITIES
-- Tracks opportunities saved by students.
-- ============================================================
CREATE TABLE IF NOT EXISTS `saved_opportunities` (
    `saved_opportunity_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_id` bigint unsigned NOT NULL,
    `opportunity_id` bigint unsigned NOT NULL,
    `saved_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`saved_opportunity_id`),
    UNIQUE KEY `uq_saved_student_opportunity` (`student_id`,`opportunity_id`),
    KEY `idx_saved_opportunity` (`opportunity_id`),
    CONSTRAINT `fk_saved_opportunity` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`opportunity_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 10. RESUMES
-- Stores metadata and paths for uploaded resume files.
-- ============================================================
CREATE TABLE IF NOT EXISTS `resumes` (
    `resume_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_id` bigint unsigned NOT NULL,
    `original_file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `stored_file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `storage_path` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
    `content_type` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
    `file_size_bytes` bigint unsigned DEFAULT NULL,
    `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`resume_id`),
    UNIQUE KEY `uq_resume_student` (`student_id`),
    CONSTRAINT `fk_resumes_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 11. OPPORTUNITIES
-- Job and internship opportunities published by coordinators.
-- ============================================================
CREATE TABLE IF NOT EXISTS `opportunities` (
    `opportunity_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
    `company_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
    `company_description` text COLLATE utf8mb4_unicode_ci,
    `job_description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
    `opportunity_type` enum('JOB','INTERNSHIP') COLLATE utf8mb4_unicode_ci NOT NULL,
    `location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `salary_stipend` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `skills` text COLLATE utf8mb4_unicode_ci,
    `eligibility` text COLLATE utf8mb4_unicode_ci,
    `company_website` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `deadline` date DEFAULT NULL,
    `status` enum('DRAFT','PUBLISHED','UNPUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
    `created_by` bigint unsigned NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`opportunity_id`),
    KEY `idx_opportunities_status_deadline` (`status`,`deadline`),
    KEY `idx_opportunities_company` (`company_name`),
    KEY `idx_opportunities_type` (`opportunity_type`),
    KEY `fk_opportunities_creator` (`created_by`),
    CONSTRAINT `fk_opportunities_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 12. APPLICATIONS
-- Tracks student applications to opportunities.
-- ============================================================
CREATE TABLE IF NOT EXISTS `applications` (
    `application_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `student_id` bigint unsigned NOT NULL,
    `opportunity_id` bigint unsigned NOT NULL,
    `application_status` enum('APPLIED','IN_PROGRESS','SHORTLISTED','SELECTED','REJECTED','WITHDRAWN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'APPLIED',
    `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `student_confirmed_external_application` tinyint(1) NOT NULL DEFAULT '0',
    `notes` text COLLATE utf8mb4_unicode_ci,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`application_id`),
    UNIQUE KEY `uq_application_student_opportunity` (`student_id`,`opportunity_id`),
    KEY `idx_applications_status` (`application_status`),
    KEY `idx_applications_opportunity` (`opportunity_id`),
    CONSTRAINT `fk_applications_opportunity` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`opportunity_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_applications_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 13. COORDINATOR PROFILES
-- Additional profile details for coordinator accounts.
-- ============================================================
CREATE TABLE IF NOT EXISTS `coordinator_profiles` (
    `user_id` bigint unsigned NOT NULL,
    `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    CONSTRAINT `fk_coordinator_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 14. COORDINATOR NOTIFICATIONS
-- Stores notifications delivered to coordinators.
-- ============================================================
CREATE TABLE IF NOT EXISTS `coordinator_notifications` (
    `notification_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `coordinator_id` bigint unsigned NOT NULL,
    `notification_type` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
    `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `student_id` bigint unsigned DEFAULT NULL,
    `opportunity_id` bigint unsigned DEFAULT NULL,
    `application_id` bigint unsigned DEFAULT NULL,
    `is_read` tinyint(1) NOT NULL DEFAULT '0',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`notification_id`),
    KEY `idx_coord_notifications_read_date` (`coordinator_id`,`is_read`,`created_at`),
    KEY `fk_coord_notifications_student` (`student_id`),
    KEY `fk_coord_notifications_opportunity` (`opportunity_id`),
    KEY `fk_coord_notifications_application` (`application_id`),
    CONSTRAINT `fk_coord_notifications_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_coord_notifications_coordinator` FOREIGN KEY (`coordinator_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_coord_notifications_opportunity` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities` (`opportunity_id`) ON DELETE SET NULL,
    CONSTRAINT `fk_coord_notifications_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 15. COORDINATOR NOTIFICATION PREFERENCES
-- Stores coordinator notification preference settings.
-- ============================================================
CREATE TABLE IF NOT EXISTS `coordinator_notification_preferences` (
    `user_id` bigint unsigned NOT NULL,
    `registered_account` tinyint(1) NOT NULL DEFAULT '1',
    `deleted_account` tinyint(1) NOT NULL DEFAULT '1',
    `profile_updated` tinyint(1) NOT NULL DEFAULT '1',
    `resume_uploaded` tinyint(1) NOT NULL DEFAULT '1',
    `resume_deleted` tinyint(1) NOT NULL DEFAULT '1',
    `new_applications` tinyint(1) NOT NULL DEFAULT '1',
    `overall_interview_status_updated` tinyint(1) NOT NULL DEFAULT '1',
    `interview_round_added` tinyint(1) NOT NULL DEFAULT '1',
    `interview_round_status_updated` tinyint(1) NOT NULL DEFAULT '1',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    CONSTRAINT `fk_coordinator_preferences_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 16. AUDIT LOGS
-- Records system actions for auditing.
-- ============================================================
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `audit_log_id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `actor_user_id` bigint unsigned DEFAULT NULL,
    `action_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `entity_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `entity_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `details` json DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`audit_log_id`),
    KEY `idx_audit_actor_date` (`actor_user_id`,`created_at`),
    KEY `idx_audit_entity` (`entity_type`,`entity_id`),
    CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- End of SPIT database schema setup
-- ============================================================