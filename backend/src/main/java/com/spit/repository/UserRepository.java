package com.spit.repository;

import java.sql.Timestamp;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.spit.model.User;

/**
 * Handles database operations related to SPIT user accounts.
 *
 * Includes student registration, coordinator registration,
 * authentication lookups, password management, and student records.
 */
@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Initializes the repository with JdbcTemplate.
     *
     * @param jdbcTemplate helper for executing SQL queries
     */
    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Checks whether an email address is already registered.
     *
     * @param email email address to check
     * @return true if the email exists; otherwise false
     */
    public boolean emailExists(String email) {

        String sql = """
                SELECT COUNT(*)
                FROM users
                WHERE email = ?
                """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                email
        );

        return count != null && count > 0;
    }

    /**
     * Saves a new student account with a hashed password.
     *
     * @param user student account details
     * @param passwordHash encoded password
     * @return number of rows affected
     */
    public int save(User user, String passwordHash) {

        String sql = """
                INSERT INTO users
                    (full_name, email, password_hash, role)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                user.getFullName(),
                user.getEmail(),
                passwordHash,
                "STUDENT"
        );
    }

    /**
     * Saves a new coordinator account with a hashed password.
     *
     * @param user coordinator account details
     * @param passwordHash encoded password
     * @return number of rows affected
     */
    public int saveCoordinator(User user, String passwordHash) {

        String sql = """
                INSERT INTO users
                    (full_name, email, password_hash, role)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                user.getFullName(),
                user.getEmail(),
                passwordHash,
                "COORDINATOR"
        );
    }

    /**
     * Retrieves a user account using its email address.
     *
     * @param email email address to search for
     * @return matching user, or null if not found
     */
    public User findByEmail(String email) {

        String sql = """
                SELECT
                    user_id,
                    full_name,
                    email,
                    password_hash,
                    role,
                    is_active
                FROM users
                WHERE email = ?
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    User user = new User();

                    user.setUserId(rs.getLong("user_id"));
                    user.setFullName(rs.getString("full_name"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password_hash"));
                    user.setRole(rs.getString("role"));
                    user.setActive(rs.getBoolean("is_active"));

                    return user;
                },
                email
        ).stream().findFirst().orElse(null);
    }

    /**
     * Saves the student's phone number in the student profile.
     *
     * @param userId student account ID
     * @param phone student's phone number
     */
    public void saveStudentPhone(Long userId, String phone) {

        String sql = """
                INSERT INTO student_profiles (user_id, phone)
                VALUES (?, ?)
                """;

        jdbcTemplate.update(sql, userId, phone);
    }

    /**
     * Retrieves a user account using its ID.
     *
     * @param userId account ID
     * @return matching user, or null if not found
     */
    public User findById(Long userId) {

        String sql = """
                SELECT
                    user_id,
                    full_name,
                    email,
                    password_hash,
                    role,
                    is_active
                FROM users
                WHERE user_id = ?
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    User user = new User();

                    user.setUserId(rs.getLong("user_id"));
                    user.setFullName(rs.getString("full_name"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password_hash"));
                    user.setRole(rs.getString("role"));
                    user.setActive(rs.getBoolean("is_active"));

                    return user;
                },
                userId
        ).stream().findFirst().orElse(null);
    }

    /**
     * Updates the password hash for a user account.
     *
     * @param userId account ID
     * @param passwordHash new encoded password
     * @return number of rows affected
     */
    public int updatePassword(Long userId, String passwordHash) {

        String sql = """
                UPDATE users
                SET password_hash = ?
                WHERE user_id = ?
                """;

        return jdbcTemplate.update(sql, passwordHash, userId);
    }

    /**
     * Retrieves all student accounts with their profile phone numbers.
     *
     * @return list of student details for coordinator use
     */
    public List<Map<String, Object>> findAllStudents() {

        String sql = """
                SELECT
                    u.user_id,
                    u.full_name,
                    u.email,
                    u.is_active,
                    p.phone
                FROM users u
                LEFT JOIN student_profiles p
                    ON p.user_id = u.user_id
                WHERE u.role = 'STUDENT'
                ORDER BY u.user_id DESC
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> student = new LinkedHashMap<>();

            student.put("id", rs.getLong("user_id"));
            student.put("fullName", rs.getString("full_name"));
            student.put("name", rs.getString("full_name"));
            student.put("email", rs.getString("email"));
            student.put("phone", rs.getString("phone"));
            student.put("active", rs.getBoolean("is_active"));

            return student;
        });
    }

    /**
     * Deactivates an active student account.
     *
     * @param studentId student account ID
     * @return number of rows affected
     */
    public int deactivateStudent(Long studentId) {

        String sql = """
                UPDATE users
                SET is_active = 0
                WHERE user_id = ?
                  AND role = 'STUDENT'
                  AND is_active = 1
                """;

        return jdbcTemplate.update(sql, studentId);
    }

    /**
     * Saves a password-reset token for a user.
     *
     * @param userId account ID
     * @param tokenHash hashed reset token
     * @param expiresAt token expiration timestamp
     * @return number of rows affected
     */
    public int savePasswordResetToken(
            Long userId,
            String tokenHash,
            Timestamp expiresAt) {

        String sql = """
                INSERT INTO password_reset_tokens
                    (user_id, token_hash, expires_at)
                VALUES (?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                userId,
                tokenHash,
                expiresAt
        );
    }

    /**
     * Finds an unused password-reset token that has not expired.
     *
     * @param tokenHash hashed reset token
     * @return token details, or null if no valid token exists
     */
    public Map<String, Object> findValidPasswordResetToken(
            String tokenHash) {

        String sql = """
                SELECT token_id, user_id
                FROM password_reset_tokens
                WHERE token_hash = ?
                  AND used_at IS NULL
                  AND expires_at > CURRENT_TIMESTAMP
                LIMIT 1
                """;

        List<Map<String, Object>> results =
                jdbcTemplate.queryForList(sql, tokenHash);

        return results.isEmpty() ? null : results.get(0);
    }

    /**
     * Marks an unused, unexpired password-reset token as used.
     *
     * @param tokenHash hashed reset token
     * @return number of rows affected
     */
    public int markPasswordResetTokenUsed(String tokenHash) {

        String sql = """
                UPDATE password_reset_tokens
                SET used_at = CURRENT_TIMESTAMP
                WHERE token_hash = ?
                  AND used_at IS NULL
                  AND expires_at > CURRENT_TIMESTAMP
                """;

        return jdbcTemplate.update(sql, tokenHash);
    }
}
