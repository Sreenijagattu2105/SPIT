package com.spit.controller;

import com.spit.repository.CoordinatorNotificationRepository;
import java.util.Map;
import java.util.List;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.sql.PreparedStatement;
import java.sql.Statement;

import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

@RestController
@RequestMapping("/api/student")
public class StudentController {

	private final JdbcTemplate jdbcTemplate;
	private final CoordinatorNotificationRepository notificationRepository;

	public StudentController(JdbcTemplate jdbcTemplate, CoordinatorNotificationRepository notificationRepository) {
		this.jdbcTemplate = jdbcTemplate;
		this.notificationRepository = notificationRepository;
	}

	// Test endpoint
	@GetMapping("/test")
	public Map<String, String> test() {
		return Map.of("message", "Student API accessed successfully.");
	}

	// Get the logged-in student's profile
	@GetMapping("/profile")
	public ResponseEntity<?> getProfile(HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			Map<String, Object> profile = jdbcTemplate.queryForMap("""
					SELECT
					    u.user_id,
					    u.full_name,
					    u.email,
					    u.role,
					    u.is_active,
					    sp.phone,
					    sp.address,
					    sp.department,
					    sp.graduation_year,
					    sp.highest_qualification,
					    sp.institution_university,
					    sp.skills,
					    sp.projects,
					    sp.certifications,
					    sp.linkedin_url,
					    sp.github_url
					FROM users u
					LEFT JOIN student_profiles sp
					    ON u.user_id = sp.user_id
					WHERE u.user_id = ?
					  AND u.role = 'STUDENT'
					""", userId);

			return ResponseEntity.ok(profile);

		} catch (org.springframework.dao.EmptyResultDataAccessException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student profile not found."));
		}
	}

	// Update the logged-in student's profile
	@PutMapping("/profile")
	@Transactional
	public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> request, HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			String fullName = text(request, "fullName");
			String phone = text(request, "phone");
			String address = text(request, "address");
			String department = text(request, "department");
			String qualification = text(request, "highestQualification");
			String institution = text(request, "institutionUniversity");
			String skills = text(request, "skills");
			String projects = text(request, "projects");
			String certifications = text(request, "certifications");
			String linkedin = text(request, "linkedinUrl");
			String github = text(request, "githubUrl");
			// Get the student's existing profile before updating it.
			Map<String, Object> oldProfile = jdbcTemplate.queryForMap("""
					SELECT
					    u.full_name AS fullName,
					    sp.phone AS phone,
					    sp.address AS address,
					    sp.department AS department,
					    sp.graduation_year AS graduationYear,
					    sp.highest_qualification AS highestQualification,
					    sp.institution_university AS institutionUniversity,
					    sp.skills AS skills,
					    sp.projects AS projects,
					    sp.certifications AS certifications,
					    sp.linkedin_url AS linkedinUrl,
					    sp.github_url AS githubUrl
					FROM users u
					LEFT JOIN student_profiles sp
					    ON u.user_id = sp.user_id
					WHERE u.user_id = ?
					  AND u.role = 'STUDENT'
					""", userId);
			if (fullName == null || fullName.isBlank()) {
				return ResponseEntity.badRequest().body(Map.of("message", "Full name is required."));
			}

			if (!fullName.matches("[A-Za-z]+(?: [A-Za-z]+)*") || fullName.length() > 50) {
				return ResponseEntity.badRequest().body(Map.of("message", "Please enter a valid full name."));
			}

			if (phone == null || !phone.matches("[0-9]{10}")) {
				return ResponseEntity.badRequest()
						.body(Map.of("message", "Phone number must contain exactly 10 digits."));
			}

			Integer graduationYear = null;
			String yearText = text(request, "graduationYear");

			if (yearText != null && !yearText.isBlank()) {
				if (!yearText.matches("[0-9]{4}")) {
					return ResponseEntity.badRequest()
							.body(Map.of("message", "Graduation year must contain 4 digits."));
				}
				graduationYear = Integer.valueOf(yearText);
			}

			jdbcTemplate.update("""
					UPDATE users
					SET full_name = ?
					WHERE user_id = ?
					  AND role = 'STUDENT'
					""", fullName.trim(), userId);

			jdbcTemplate.update("""
					INSERT INTO student_profiles (
					    user_id, phone, address, department,
					    graduation_year, highest_qualification,
					    institution_university, skills, projects,
					    certifications, linkedin_url, github_url
					)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					ON DUPLICATE KEY UPDATE
					    phone = VALUES(phone),
					    address = VALUES(address),
					    department = VALUES(department),
					    graduation_year = VALUES(graduation_year),
					    highest_qualification = VALUES(highest_qualification),
					    institution_university = VALUES(institution_university),
					    skills = VALUES(skills),
					    projects = VALUES(projects),
					    certifications = VALUES(certifications),
					    linkedin_url = VALUES(linkedin_url),
					    github_url = VALUES(github_url)
					""", userId, phone, address, department, graduationYear, qualification, institution, skills,
					projects, certifications, linkedin, github);

			// Notify coordinators only when profile fields have changed.
			StringBuilder changes = new StringBuilder();

			addProfileChange(changes, "Full Name", oldProfile.get("fullName"), fullName.trim());

			addProfileChange(changes, "Phone", oldProfile.get("phone"), phone);

			addProfileChange(changes, "Address", oldProfile.get("address"), address);

			addProfileChange(changes, "Department", oldProfile.get("department"), department);

			addProfileChange(changes, "Graduation Year", oldProfile.get("graduationYear"), graduationYear);

			addProfileChange(changes, "Highest Qualification", oldProfile.get("highestQualification"), qualification);

			addProfileChange(changes, "Institution / University", oldProfile.get("institutionUniversity"), institution);

			addProfileChange(changes, "Skills", oldProfile.get("skills"), skills);

			addProfileChange(changes, "Projects", oldProfile.get("projects"), projects);

			addProfileChange(changes, "Certifications", oldProfile.get("certifications"), certifications);

			addProfileChange(changes, "LinkedIn", oldProfile.get("linkedinUrl"), linkedin);

			addProfileChange(changes, "GitHub", oldProfile.get("githubUrl"), github);

			if (changes.length() > 0) {
				Long studentId = Long.parseLong(userId.toString());

				String notificationMessage = "Student profile updated: " + fullName.trim() + "\nChanges:\n" + changes;

				for (Long coordinatorId : notificationRepository.getCoordinatorsForProfileUpdateNotifications()) {

					notificationRepository.createNotification(coordinatorId, "PROFILE_UPDATED", notificationMessage,
							studentId, null, null);
				}
			}

			return ResponseEntity.ok(Map.of("message", "Profile updated successfully."));

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not update the profile."));
		}
	}

	private void addProfileChange(StringBuilder changes, String field, Object oldValue, Object newValue) {

		String oldText = oldValue == null ? "" : oldValue.toString().trim();

		String newText = newValue == null ? "" : newValue.toString().trim();

		if (!oldText.equals(newText)) {
			changes.append(field).append(": ").append(oldText.isEmpty() ? "(empty)" : oldText).append(" -> ")
					.append(newText.isEmpty() ? "(empty)" : newText).append("\n");
		}
	}

	private String text(Map<String, Object> request, String key) {
		Object value = request.get(key);
		if (value == null) {
			return null;
		}

		String result = value.toString().trim();
		return result.isEmpty() ? null : result;
	}

	// Get the logged-in student's notification preferences
	@GetMapping("/notification-preferences")
	public ResponseEntity<?> getNotificationPreferences(HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			long studentId = Long.parseLong(userId.toString());

			jdbcTemplate.update("""
					INSERT INTO student_notification_preferences (user_id)
					VALUES (?)
					ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)
					""", studentId);

			Map<String, Object> preferences = jdbcTemplate.queryForMap("""
					SELECT
					    opportunity_published AS opportunityPublished,
					    opportunity_updated AS opportunityUpdated,
					    deadline_7_days AS deadline7Days,
					    deadline_3_days AS deadline3Days,
					    deadline_1_day AS deadline1Day,
					    deadline_day AS deadlineDay,
					    application_added AS applicationAdded,
					    application_deleted AS applicationDeleted,
					    password_updated AS passwordUpdated
					FROM student_notification_preferences
					WHERE user_id = ?
					""", studentId);

			return ResponseEntity.ok(preferences);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not load notification preferences."));
		}
	}

	// Save the logged-in student's notification preferences
	@PutMapping("/notification-preferences")
	public ResponseEntity<?> updateNotificationPreferences(@RequestBody Map<String, Object> request,
			HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			long studentId = Long.parseLong(userId.toString());

			String[] keys = { "opportunityPublished", "opportunityUpdated", "deadline7Days", "deadline3Days",
					"deadline1Day", "deadlineDay", "applicationAdded", "applicationDeleted", "passwordUpdated" };

			String[] columns = { "opportunity_published", "opportunity_updated", "deadline_7_days", "deadline_3_days",
					"deadline_1_day", "deadline_day", "application_added", "application_deleted", "password_updated" };

			boolean[] values = new boolean[keys.length];

			for (int i = 0; i < keys.length; i++) {
				Object value = request.get(keys[i]);

				if (!(value instanceof Boolean)) {
					return ResponseEntity.badRequest()
							.body(Map.of("message", "Missing or invalid preference: " + keys[i]));
				}

				values[i] = (Boolean) value;
			}

			jdbcTemplate.update("""
					                    INSERT INTO student_notification_preferences (
					    user_id,
					    opportunity_published,
					    opportunity_updated,
					    deadline_7_days,
					    deadline_3_days,
					    deadline_1_day,
					    deadline_day,
					    application_added,
					    application_deleted,
					    password_updated
					)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					ON DUPLICATE KEY UPDATE
					    opportunity_published = VALUES(opportunity_published),
					    opportunity_updated = VALUES(opportunity_updated),
					    deadline_7_days = VALUES(deadline_7_days),
					    deadline_3_days = VALUES(deadline_3_days),
					    deadline_1_day = VALUES(deadline_1_day),
					    deadline_day = VALUES(deadline_day),
					    application_added = VALUES(application_added),
					    application_deleted = VALUES(application_deleted),
					    password_updated = VALUES(password_updated)
					                    """, studentId, values[0], values[1], values[2], values[3], values[4],
					values[5], values[6], values[7], values[8]);

			return ResponseEntity.ok(Map.of("message", "Notification preferences saved successfully."));

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not save notification preferences."));
		}
	}

	@GetMapping("/dashboard-stats")
	public ResponseEntity<?> getDashboardStats(HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			Long studentId = Long.valueOf(userId.toString());

			Integer applicationCount = jdbcTemplate
					.queryForObject("SELECT COUNT(*) FROM applications WHERE student_id = ?", Integer.class, studentId);

			Integer savedCount = jdbcTemplate.queryForObject(
					"SELECT COUNT(*) FROM saved_opportunities WHERE student_id = ?", Integer.class, studentId);

			Map<String, Object> stats = Map.of("applicationCount", applicationCount, "savedCount", savedCount);

			return ResponseEntity.ok(stats);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not load dashboard statistics."));
		}
	}

	@PostMapping("/saved-opportunities")
	@Transactional
	public ResponseEntity<?> saveOpportunity(@RequestBody Map<String, Object> request, HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			long studentId = Long.parseLong(userId.toString());
			Object opportunityValue = request.get("opportunityId");

			if (opportunityValue == null) {
				return ResponseEntity.badRequest().body(Map.of("message", "Opportunity ID is required."));
			}

			long opportunityId = Long.parseLong(opportunityValue.toString());

			Integer exists = jdbcTemplate.queryForObject("""
					SELECT COUNT(*)
					FROM opportunities
					WHERE opportunity_id = ?
					  AND status = 'PUBLISHED'
					""", Integer.class, opportunityId);

			if (exists == null || exists == 0) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("message", "Published opportunity not found."));
			}

			Integer alreadySaved = jdbcTemplate.queryForObject("""
					SELECT COUNT(*)
					FROM saved_opportunities
					WHERE student_id = ? AND opportunity_id = ?
					""", Integer.class, studentId, opportunityId);

			if (alreadySaved != null && alreadySaved > 0) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Opportunity already saved."));
			}

			jdbcTemplate.update("""
					INSERT INTO saved_opportunities (student_id, opportunity_id)
					VALUES (?, ?)
					""", studentId, opportunityId);

			return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Opportunity saved successfully."));

		} catch (NumberFormatException e) {
			return ResponseEntity.badRequest().body(Map.of("message", "Invalid opportunity ID."));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not save the opportunity."));
		}
	}

	@GetMapping("/saved-opportunities")
	public ResponseEntity<?> getSavedOpportunities(HttpSession session) {
		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			long studentId = Long.parseLong(userId.toString());

			var saved = jdbcTemplate.queryForList("""
					SELECT
					    o.opportunity_id AS id,
					    o.title,
					    o.company_name AS company,
					    o.location,
					    o.opportunity_type AS type,
					    o.salary_stipend AS salaryStipend,
					    o.skills,
					    o.deadline,
					    o.company_website AS companyWebsite,
					    o.company_description AS companyDescription,
					    o.job_description AS description,
					    o.status
					FROM saved_opportunities so
					JOIN opportunities o
					    ON so.opportunity_id = o.opportunity_id
					WHERE so.student_id = ?
					ORDER BY so.saved_at DESC
					""", studentId);

			return ResponseEntity.ok(saved);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not load saved opportunities."));
		}
	}

	@DeleteMapping("/saved-opportunities/{opportunityId}")
	public ResponseEntity<?> removeSavedOpportunity(@PathVariable("opportunityId") long opportunityId,
			HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			long studentId = Long.parseLong(userId.toString());

			int deleted = jdbcTemplate.update("""
					DELETE FROM saved_opportunities
					WHERE student_id = ? AND opportunity_id = ?
					""", studentId, opportunityId);

			if (deleted == 0) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("message", "Saved opportunity not found."));
			}

			return ResponseEntity.ok(Map.of("message", "Opportunity removed from saved list."));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not remove the saved opportunity."));
		}
	}

	@PostMapping("/applications")
	@Transactional
	public ResponseEntity<?> applyForOpportunity(@RequestBody Map<String, Object> request, HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			long studentId = Long.parseLong(userId.toString());
			Object opportunityValue = request.get("opportunityId");

			if (opportunityValue == null) {
				return ResponseEntity.badRequest().body(Map.of("message", "Opportunity ID is required."));
			}

			long opportunityId = Long.parseLong(opportunityValue.toString());

			Integer exists = jdbcTemplate.queryForObject("""
					SELECT COUNT(*)
					FROM opportunities
					WHERE opportunity_id = ?
					  AND status = 'PUBLISHED'
					""", Integer.class, opportunityId);

			if (exists == null || exists == 0) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("message", "Published opportunity not found."));
			}

			Integer alreadyApplied = jdbcTemplate.queryForObject("""
					SELECT COUNT(*)
					FROM applications
					WHERE student_id = ? AND opportunity_id = ?
					""", Integer.class, studentId, opportunityId);

			if (alreadyApplied != null && alreadyApplied > 0) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body(Map.of("message", "You have already applied for this opportunity."));
			}

			// Save the application and retrieve its generated ID.
			KeyHolder keyHolder = new GeneratedKeyHolder();

			jdbcTemplate.update(connection -> {
				PreparedStatement statement = connection.prepareStatement("""
						INSERT INTO applications (
						    student_id,
						    opportunity_id,
						    application_status,
						    student_confirmed_external_application
						)
						VALUES (?, ?, 'APPLIED', 1)
						""", Statement.RETURN_GENERATED_KEYS);

				statement.setLong(1, studentId);
				statement.setLong(2, opportunityId);

				return statement;
			}, keyHolder);

			Number generatedId = keyHolder.getKey();

			if (generatedId == null) {
				throw new IllegalStateException("Application ID was not generated.");
			}

			long applicationId = generatedId.longValue();

			// Get opportunity details for the confirmation message.
			Map<String, Object> opportunity = jdbcTemplate.queryForMap("""
					SELECT title, company_name
					FROM opportunities
					WHERE opportunity_id = ?
					""", opportunityId);

			String title = String.valueOf(opportunity.get("title"));
			String company = String.valueOf(opportunity.get("company_name"));

			// Ensure the student's notification preference row exists.
			jdbcTemplate.update("""
					INSERT INTO student_notification_preferences (user_id)
					VALUES (?)
					ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)
					""", studentId);

			// Check whether the student enabled application-added notifications.
			Integer notificationEnabled = jdbcTemplate.queryForObject("""
					SELECT application_added
					FROM student_notification_preferences
					WHERE user_id = ?
					""", Integer.class, studentId);

			// Create the notification only when the preference is enabled.
			if (notificationEnabled != null && notificationEnabled == 1) {
				jdbcTemplate.update("""
						INSERT INTO notifications (
						    recipient_user_id,
						    notification_type,
						    message,
						    opportunity_id,
						    application_id,
						    is_read
						)
						VALUES (?, ?, ?, ?, ?, FALSE)
						""", studentId, "APPLICATION_ADDED",
						"Application submitted successfully for " + title + " at " + company + ".", opportunityId,
						applicationId);
			}

			// Notify coordinators who enabled New Applications notifications.
			String studentName = jdbcTemplate.queryForObject("SELECT full_name FROM users WHERE user_id = ?",
					String.class, studentId);

			String notificationMessage = studentName + " applied for " + title + " at " + company + ".";

			for (Long coordinatorId : notificationRepository.getCoordinatorsForNewApplicationNotifications()) {

				notificationRepository.createNotification(coordinatorId, "NEW_APPLICATION", notificationMessage,
						studentId, opportunityId, applicationId);
			}
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(Map.of("message", "Application recorded successfully."));

		} catch (NumberFormatException e) {
			return ResponseEntity.badRequest().body(Map.of("message", "Invalid opportunity ID."));
		} catch (Exception e) {
			e.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not record the application."));
		}
	}

	@GetMapping("/applications")
	public ResponseEntity<?> getApplications(HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			long studentId = Long.parseLong(userId.toString());

			var applications = jdbcTemplate.queryForList("""
					SELECT
					    a.application_id AS applicationId,
					    a.student_id AS studentId,
					    o.opportunity_id AS id,
					    o.title,
					    o.company_name AS company,
					    o.location,
					    o.opportunity_type AS type,
					    o.deadline,
					    o.salary_stipend AS salaryStipend,
					    o.company_website AS companyWebsite,
					    a.application_status AS status,
					    a.applied_at AS appliedAt,
					    a.notes
					FROM applications a
					JOIN opportunities o
					    ON a.opportunity_id = o.opportunity_id
					WHERE a.student_id = ?
					ORDER BY a.applied_at DESC
					""", studentId);

			return ResponseEntity.ok(applications);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Could not load your applications."));
		}
	}

	@PutMapping("/applications/{applicationId}/status")
	public ResponseEntity<?> updateApplicationStatus(

			@PathVariable("applicationId") long applicationId, @RequestBody Map<String, String> request,
			HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		String status = request.get("status");

		if (status == null || !java.util.Set
				.of("APPLIED", "IN_PROGRESS", "SHORTLISTED", "SELECTED", "REJECTED", "WITHDRAWN").contains(status)) {
			return ResponseEntity.badRequest().body(Map.of("message", "Invalid application status."));
		}

		try {

			long studentId = Long.parseLong(userId.toString());

// Get the previous status and opportunity details.
// This also verifies that the application belongs to this student.
			List<Map<String, Object>> applicationDetails = jdbcTemplate.queryForList("""
					SELECT
					    a.application_status AS previousStatus,
					    a.student_id AS studentId,
					    a.opportunity_id AS opportunityId,
					    o.title AS opportunityTitle,
					    o.company_name AS companyName,
					    u.full_name AS studentName
					FROM applications a
					JOIN opportunities o
					    ON o.opportunity_id = a.opportunity_id
					JOIN users u
					    ON u.user_id = a.student_id
					WHERE a.application_id = ?
					  AND a.student_id = ?
					""", applicationId, studentId);

			if (applicationDetails.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Application not found."));
			}

			Map<String, Object> details = applicationDetails.get(0);

			String previousStatus = String.valueOf(details.get("previousStatus"));

			Long opportunityId = ((Number) details.get("opportunityId")).longValue();

			String opportunityTitle = String.valueOf(details.get("opportunityTitle"));

			String companyName = String.valueOf(details.get("companyName"));

			String studentName = String.valueOf(details.get("studentName"));

// Update the application status.
			int updated = jdbcTemplate.update("""
					UPDATE applications
					SET application_status = ?, updated_at = CURRENT_TIMESTAMP
					WHERE application_id = ? AND student_id = ?
					""", status, applicationId, studentId);

			if (updated == 0) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Application not found."));
			}

// Notify coordinators only when the status actually changes.
			if (!previousStatus.equals(status)) {

				String notificationMessage = studentName + " updated their application status for " + opportunityTitle
						+ " at " + companyName + " from " + previousStatus + " to " + status + ".";

				for (Long coordinatorId : notificationRepository
						.getCoordinatorsForOverallInterviewStatusNotifications()) {

					notificationRepository.createNotification(coordinatorId, "OVERALL_APPLICATION_STATUS_UPDATED",
							notificationMessage, studentId, opportunityId, applicationId);
				}
			}

			if (updated == 0) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Application not found."));
			}

			return ResponseEntity.ok(Map.of("message", "Application status updated successfully.", "status", status));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Failed to update application status."));
		}
	}

	@DeleteMapping("/applications/{applicationId}")
	public ResponseEntity<?> deleteApplication(@PathVariable("applicationId") long applicationId, HttpSession session) {

		Object userId = session.getAttribute("userId");
		Object role = session.getAttribute("userRole");

		if (userId == null || !"STUDENT".equals(role)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			long studentId = Long.parseLong(userId.toString());

			// Get application details before deleting the application.
			List<Map<String, Object>> results = jdbcTemplate.queryForList("""
					SELECT a.opportunity_id, o.title, o.company_name
					FROM applications a
					JOIN opportunities o
					    ON a.opportunity_id = o.opportunity_id
					WHERE a.application_id = ?
					  AND a.student_id = ?
					""", applicationId, studentId);

			if (results.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Application not found."));
			}

			Map<String, Object> application = results.get(0);

			Object opportunityValue = application.get("opportunity_id");
			long opportunityId = ((Number) opportunityValue).longValue();

			String title = String.valueOf(application.get("title"));
			String company = String.valueOf(application.get("company_name"));

			int deleted = jdbcTemplate.update("""
					DELETE FROM applications
					WHERE application_id = ? AND student_id = ?
					""", applicationId, studentId);

			if (deleted == 0) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Application not found."));
			}

			// Ensure the student's preference row exists.
			jdbcTemplate.update("""
					INSERT INTO student_notification_preferences (user_id)
					VALUES (?)
					ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)
					""", studentId);

			// Check whether the student enabled application-deleted notifications.
			Integer notificationEnabled = jdbcTemplate.queryForObject("""
					SELECT application_deleted
					FROM student_notification_preferences
					WHERE user_id = ?
					""", Integer.class, studentId);

			// Create the notification only when the preference is enabled.
			if (notificationEnabled != null && notificationEnabled == 1) {
				jdbcTemplate.update("""
						INSERT INTO notifications (
						    recipient_user_id,
						    notification_type,
						    message,
						    opportunity_id,
						    is_read
						)
						VALUES (?, ?, ?, ?, FALSE)
						""", studentId, "APPLICATION_DELETED",
						"Your application for " + title + " at " + company + " was removed successfully.",
						opportunityId);
			}

			return ResponseEntity.ok(Map.of("message", "Application removed successfully."));

		} catch (Exception e) {
			e.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Failed to remove application."));
		}
	}

}
