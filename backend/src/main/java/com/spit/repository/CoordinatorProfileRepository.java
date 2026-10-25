package com.spit.repository;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CoordinatorProfileRepository {

    private final JdbcTemplate jdbcTemplate;

    public CoordinatorProfileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieves the profile details of an active coordinator.
     *
     * @param userId the coordinator's user ID
     * @return a map containing the coordinator's profile details
     */
    public Map<String, Object> getProfile(Long userId) {

        String sql = """
                SELECT
                    user_id,
                    full_name,
                    email,
                    phone
                FROM users
                WHERE user_id = ?
                  AND role = 'COORDINATOR'
                  AND is_active = 1
                """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Map<String, Object> profile = new LinkedHashMap<>();

            profile.put("userId", rs.getLong("user_id"));
            profile.put("name", rs.getString("full_name"));
            profile.put("email", rs.getString("email"));
            profile.put("phone", rs.getString("phone"));

            return profile;
        }, userId);
    }

    /**
     * Updates the profile details of an active coordinator.
     *
     * @param userId the coordinator's user ID
     * @param name the coordinator's name
     * @param email the coordinator's email address
     * @param phone the coordinator's phone number
     * @return the number of rows updated
     */
    public int updateProfile(
            Long userId,
            String name,
            String email,
            String phone) {

        String sql = """
                UPDATE users
                SET full_name = ?,
                    email = ?,
                    phone = ?
                WHERE user_id = ?
                  AND role = 'COORDINATOR'
                  AND is_active = 1
                """;

        return jdbcTemplate.update(
                sql,
                name,
                email,
                phone,
                userId
        );
    }
}
