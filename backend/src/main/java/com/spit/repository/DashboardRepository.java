package com.spit.repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieves statistics for the Coordinator Dashboard.
     */
    public Map<String, Object> getDashboardStats() {

        String sql = """
                SELECT
                    (SELECT COUNT(*)
                     FROM users
                     WHERE role = 'STUDENT'
                       AND is_active = 1)
                        AS totalStudents,

                    (SELECT COUNT(*)
                     FROM opportunities)
                        AS totalOpportunities,

                    (SELECT COUNT(*)
                     FROM opportunities
                     WHERE status = 'PUBLISHED')
                        AS publishedOpportunities,

                    (SELECT COUNT(*)
                     FROM opportunities
                     WHERE status = 'DRAFT')
                        AS draftOpportunities,

                    (SELECT COUNT(*)
                     FROM opportunities
                     WHERE status = 'UNPUBLISHED')
                        AS unpublishedOpportunities,

                    (SELECT COUNT(*)
                     FROM applications)
                        AS totalApplications,

                    (SELECT COUNT(*)
                     FROM opportunities
                     WHERE opportunity_type = 'JOB')
                        AS totalJobs,

                    (SELECT COUNT(*)
                     FROM opportunities
                     WHERE opportunity_type = 'INTERNSHIP')
                        AS totalInternships,

                    (SELECT COUNT(*)
                     FROM applications
                     WHERE application_status IN ('SELECTED', 'PLACED'))
                        AS selectedOrPlacedApplications,

                    (SELECT COUNT(*)
                     FROM applications
                     WHERE application_status IN ('APPLIED', 'IN_PROGRESS'))
                        AS awaitingReviewApplications
                """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Map<String, Object> stats = new LinkedHashMap<>();

            stats.put("totalStudents", rs.getInt("totalStudents"));
            stats.put("totalOpportunities", rs.getInt("totalOpportunities"));
            stats.put("publishedOpportunities", rs.getInt("publishedOpportunities"));
            stats.put("draftOpportunities", rs.getInt("draftOpportunities"));
            stats.put("unpublishedOpportunities", rs.getInt("unpublishedOpportunities"));
            stats.put("totalApplications", rs.getInt("totalApplications"));
            stats.put("totalJobs", rs.getInt("totalJobs"));
            stats.put("totalInternships", rs.getInt("totalInternships"));
            stats.put(
                    "selectedOrPlacedApplications",
                    rs.getInt("selectedOrPlacedApplications")
            );
            stats.put(
                    "awaitingReviewApplications",
                    rs.getInt("awaitingReviewApplications")
            );

            return stats;
        });
    }

    /**
     * Retrieves applications displayed on the Coordinator's Track Applications page.
     */
    public List<Map<String, Object>> getCoordinatorApplications() {

        String sql = """
                SELECT
                    a.application_id AS applicationId,
                    a.student_id AS studentId,
                    u.full_name AS studentName,
                    u.email AS studentEmail,
                    a.opportunity_id AS opportunityId,
                    o.title AS title,
                    o.company_name AS company,
                    a.applied_at AS appliedDate,
                    a.application_status AS status
                FROM applications a
                JOIN users u
                    ON a.student_id = u.user_id
                JOIN opportunities o
                    ON a.opportunity_id = o.opportunity_id
                ORDER BY a.applied_at DESC
                """;

        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Retrieves statistics for Placement Reports.
     */
    public Map<String, Object> getPlacementReportStats() {

        String sql = """
                SELECT
                    (SELECT COUNT(DISTINCT a.student_id)
                     FROM applications a
                     JOIN users u
                        ON a.student_id = u.user_id
                     WHERE u.role = 'STUDENT')
                        AS totalStudents,

                    (SELECT COUNT(*)
                     FROM opportunities)
                        AS totalOpportunities,

                    (SELECT COUNT(*)
                     FROM opportunities
                     WHERE opportunity_type = 'JOB')
                        AS totalJobs,

                    (SELECT COUNT(*)
                     FROM opportunities
                     WHERE opportunity_type = 'INTERNSHIP')
                        AS totalInternships,

                    (SELECT COUNT(*)
                     FROM applications)
                        AS totalApplications,

                    (SELECT COUNT(DISTINCT student_id)
                     FROM applications
                     WHERE application_status IN ('SELECTED', 'PLACED'))
                        AS selectedStudents
                """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Map<String, Object> stats = new LinkedHashMap<>();

            stats.put("totalStudents", rs.getInt("totalStudents"));
            stats.put("totalOpportunities", rs.getInt("totalOpportunities"));
            stats.put("totalJobs", rs.getInt("totalJobs"));
            stats.put("totalInternships", rs.getInt("totalInternships"));
            stats.put("totalApplications", rs.getInt("totalApplications"));
            stats.put("selectedStudents", rs.getInt("selectedStudents"));

            return stats;
        });
    }
}
