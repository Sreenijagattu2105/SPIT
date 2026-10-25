package com.spit.repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

/**
 * Handles database operations for job and internship opportunities.
 *
 * Supports retrieving, creating, updating, and deleting opportunities.
 */
@Repository
public class OpportunityRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Initializes the repository with JdbcTemplate.
     *
     * @param jdbcTemplate helper for executing SQL queries
     */
    public OpportunityRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Maps an opportunity database row to a response-friendly map.
     */
    private final RowMapper<Map<String, Object>> rowMapper =
            (rs, rowNum) -> {
                Map<String, Object> row = new LinkedHashMap<>();

                row.put("id", rs.getLong("opportunity_id"));
                row.put("title", rs.getString("title"));
                row.put("company", rs.getString("company_name"));
                row.put(
                        "companyDescription",
                        rs.getString("company_description")
                );
                row.put("description", rs.getString("job_description"));
                row.put("type", rs.getString("opportunity_type"));
                row.put("location", rs.getString("location"));
                row.put("salaryStipend", rs.getString("salary_stipend"));
                row.put("skills", rs.getString("skills"));
                row.put("eligibility", rs.getString("eligibility"));
                row.put("companyWebsite", rs.getString("company_website"));

                Date deadline = rs.getDate("deadline");

                row.put(
                        "deadline",
                        deadline == null ? null : deadline.toString()
                );

                row.put("status", rs.getString("status"));
                row.put("createdBy", rs.getLong("created_by"));

                return row;
            };

    /**
     * Retrieves all published opportunities for students.
     *
     * @return list of published opportunities
     */
    public List<Map<String, Object>> findAllPublished() {

        String sql = """
                SELECT *
                FROM opportunities
                WHERE status = 'PUBLISHED'
                ORDER BY created_at DESC
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Retrieves all opportunities created by a coordinator.
     *
     * @param coordinatorId ID of the coordinator
     * @return list of opportunities owned by the coordinator
     */
    public List<Map<String, Object>> findAllForCoordinator(
            long coordinatorId) {

        String sql = """
                SELECT *
                FROM opportunities
                WHERE created_by = ?
                ORDER BY created_at DESC
                """;

        return jdbcTemplate.query(sql, rowMapper, coordinatorId);
    }

    /**
     * Finds an opportunity belonging to a specific coordinator.
     *
     * @param id opportunity ID
     * @param coordinatorId ID of the coordinator
     * @return opportunity details, or null if not found
     */
    public Map<String, Object> findByIdForCoordinator(
            long id,
            long coordinatorId) {

        String sql = """
                SELECT *
                FROM opportunities
                WHERE opportunity_id = ?
                  AND created_by = ?
                """;

        List<Map<String, Object>> results =
                jdbcTemplate.query(
                        sql,
                        rowMapper,
                        id,
                        coordinatorId
                );

        return results.isEmpty() ? null : results.get(0);
    }

    /**
     * Creates a new opportunity for a coordinator.
     *
     * @return generated opportunity ID
     */
    public long createOpportunity(
            String title,
            String company,
            String companyDescription,
            String description,
            String type,
            String location,
            String salaryStipend,
            String skills,
            String eligibility,
            String companyWebsite,
            Date deadline,
            String status,
            long coordinatorId) {

        String sql = """
                INSERT INTO opportunities (
                    title,
                    company_name,
                    company_description,
                    job_description,
                    opportunity_type,
                    location,
                    salary_stipend,
                    skills,
                    eligibility,
                    company_website,
                    deadline,
                    status,
                    created_by
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );

            statement.setString(1, title);
            statement.setString(2, company);
            statement.setString(3, companyDescription);
            statement.setString(4, description);
            statement.setString(5, type);
            statement.setString(6, location);
            statement.setString(7, salaryStipend);
            statement.setString(8, skills);
            statement.setString(9, eligibility);
            statement.setString(10, companyWebsite);
            statement.setDate(11, deadline);
            statement.setString(12, status);
            statement.setLong(13, coordinatorId);

            return statement;
        }, keyHolder);

        Number key = keyHolder.getKey();

        if (key == null) {
            throw new IllegalStateException(
                    "Opportunity was inserted, but its generated ID "
                            + "was not returned.");
        }

        return key.longValue();
    }

    /**
     * Updates an opportunity owned by the specified coordinator.
     *
     * @param id opportunity ID
     * @param coordinatorId ID of the coordinator
     * @return true if at least one row was updated
     */
    public boolean updateOpportunity(
            long id,
            long coordinatorId,
            String title,
            String company,
            String companyDescription,
            String description,
            String type,
            String location,
            String salaryStipend,
            String skills,
            String eligibility,
            String companyWebsite,
            Date deadline,
            String status) {

        String sql = """
                UPDATE opportunities
                SET title = ?,
                    company_name = ?,
                    company_description = ?,
                    job_description = ?,
                    opportunity_type = ?,
                    location = ?,
                    salary_stipend = ?,
                    skills = ?,
                    eligibility = ?,
                    company_website = ?,
                    deadline = ?,
                    status = ?
                WHERE opportunity_id = ?
                  AND created_by = ?
                """;

        int rowsUpdated = jdbcTemplate.update(
                sql,
                title,
                company,
                companyDescription,
                description,
                type,
                location,
                salaryStipend,
                skills,
                eligibility,
                companyWebsite,
                deadline,
                status,
                id,
                coordinatorId
        );

        return rowsUpdated > 0;
    }

    /**
     * Deletes an opportunity owned by the specified coordinator.
     *
     * @param id opportunity ID
     * @param coordinatorId ID of the coordinator
     * @return number of rows deleted
     */
    public int deleteOpportunity(
            long id,
            long coordinatorId) {

        String sql = """
                DELETE FROM opportunities
                WHERE opportunity_id = ?
                  AND created_by = ?
                """;

        return jdbcTemplate.update(sql, id, coordinatorId);
    }
}
