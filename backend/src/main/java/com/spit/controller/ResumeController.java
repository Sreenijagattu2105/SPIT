package com.spit.controller;

import com.spit.repository.CoordinatorNotificationRepository;
import java.io.IOException;
import org.springframework.web.bind.annotation.RequestHeader;
import com.spit.repository.UserRepository;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import java.util.HashMap;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student/resume")

public class ResumeController {

	private static final Path RESUME_DIRECTORY = Paths.get("E:/spit/backend-uploads/resumes");

	private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

	private final JdbcTemplate jdbcTemplate;
	private final UserRepository userRepository;
	private final CoordinatorNotificationRepository notificationRepository;

	public ResumeController(JdbcTemplate jdbcTemplate, UserRepository userRepository,
			CoordinatorNotificationRepository notificationRepository) {

		this.jdbcTemplate = jdbcTemplate;
		this.userRepository = userRepository;
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

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file, HttpSession session) {

		Long studentId = getStudentId(session);

		if (studentId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		if (file == null || file.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("message", "Please select a resume file."));
		}

		if (file.getSize() > MAX_FILE_SIZE) {
			return ResponseEntity.badRequest().body(Map.of("message", "Resume size must not exceed 5 MB."));
		}

		String originalName = Paths.get(file.getOriginalFilename() == null ? "resume" : file.getOriginalFilename())
				.getFileName().toString();

		String lowerName = originalName.toLowerCase();

		if (!(lowerName.endsWith(".pdf") || lowerName.endsWith(".doc") || lowerName.endsWith(".docx"))) {
			return ResponseEntity.badRequest().body(Map.of("message", "Only PDF, DOC and DOCX files are allowed."));
		}

		String contentType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();

		String storedName = UUID.randomUUID() + "_" + originalName;
		Path destination = RESUME_DIRECTORY.resolve(storedName).normalize();

		if (!destination.startsWith(RESUME_DIRECTORY)) {
			return ResponseEntity.badRequest().body(Map.of("message", "Invalid file name."));
		}

		String oldPath = null;

		try {
			Files.createDirectories(RESUME_DIRECTORY);

			var existing = jdbcTemplate.query("SELECT storage_path FROM resumes WHERE student_id = ?",
					(rs, rowNum) -> rs.getString("storage_path"), studentId);

			if (!existing.isEmpty()) {
				oldPath = existing.get(0);
			}

			file.transferTo(destination);

			if (existing.isEmpty()) {
				jdbcTemplate.update("""
						INSERT INTO resumes
						(student_id, original_file_name, stored_file_name,
						 storage_path, content_type, file_size_bytes)
						VALUES (?, ?, ?, ?, ?, ?)
						""", studentId, originalName, storedName, destination.toString(), contentType, file.getSize());
			} else {
				jdbcTemplate.update("""
						UPDATE resumes
						SET original_file_name = ?,
						    stored_file_name = ?,
						    storage_path = ?,
						    content_type = ?,
						    file_size_bytes = ?,
						    updated_at = CURRENT_TIMESTAMP
						WHERE student_id = ?
						""", originalName, storedName, destination.toString(), contentType, file.getSize(), studentId);
			}

			if (oldPath != null && !oldPath.equals(destination.toString())) {
				try {
					Files.deleteIfExists(Paths.get(oldPath));
				} catch (IOException ex) {
					System.err.println("Could not remove old resume file: " + ex.getMessage());
				}
			}
			// Notify coordinators who enabled Resume Uploaded notifications.
			String studentName = jdbcTemplate.queryForObject("SELECT full_name FROM users WHERE user_id = ?",
					String.class, studentId);

			String notificationMessage = "Resume uploaded by " + studentName + ": " + originalName;

			for (Long coordinatorId : notificationRepository.getCoordinatorsForResumeUploadedNotifications()) {

				notificationRepository.createNotification(coordinatorId, "RESUME_UPLOADED", notificationMessage,
						studentId, null, null);
			}
			return ResponseEntity.ok(Map.of("message", "Resume uploaded successfully.", "name", originalName,
					"contentType", contentType, "size", file.getSize()));

		} catch (Exception ex) {
			try {
				Files.deleteIfExists(destination);
			} catch (IOException ignored) {
				// Keep the original error.
			}

			ex.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Unable to save resume."));
		}
	}

	@GetMapping
	public ResponseEntity<?> getResume(HttpSession session) {

		Long studentId = getStudentId(session);

		if (studentId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			var resumes = jdbcTemplate.query("""
					SELECT original_file_name, content_type, file_size_bytes
					FROM resumes
					WHERE student_id = ?
					""", (rs, rowNum) -> {
				Map<String, Object> resume = new HashMap<>();
				resume.put("name", rs.getString("original_file_name"));
				resume.put("contentType", rs.getString("content_type"));
				resume.put("size", rs.getLong("file_size_bytes"));
				return resume;
			}, studentId);

			Map<String, Object> response = new HashMap<>();
			response.put("resume", resumes.isEmpty() ? null : resumes.get(0));

			return ResponseEntity.ok(response);

		} catch (Exception ex) {
			ex.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Unable to retrieve resume."));
		}
	}

	@GetMapping("/file")
	public ResponseEntity<?> downloadResume(HttpSession session) {

		Long studentId = getStudentId(session);

		if (studentId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			var records = jdbcTemplate.query("""
					SELECT original_file_name, content_type, storage_path
					FROM resumes
					WHERE student_id = ?
					""", (rs, rowNum) -> new ResumeFile(rs.getString("original_file_name"),
					rs.getString("content_type"), rs.getString("storage_path")), studentId);

			if (records.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "No resume uploaded."));
			}

			ResumeFile record = records.get(0);
			Path path = Paths.get(record.storagePath()).normalize();

			if (!Files.isRegularFile(path)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("message", "Resume file is missing from storage."));
			}

			String safeName = record.originalName().replace("\"", "");

			return ResponseEntity.ok().contentType(MediaType.parseMediaType(record.contentType()))
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + safeName + "\"")
					.body(Files.readAllBytes(path));

		} catch (Exception ex) {
			ex.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Unable to retrieve resume."));
		}
	}

	@DeleteMapping
	public ResponseEntity<?> deleteResume(HttpSession session) {

		Long studentId = getStudentId(session);

		if (studentId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Please log in as a student."));
		}

		try {
			var records = jdbcTemplate.query("""
					SELECT storage_path, original_file_name
					FROM resumes
					WHERE student_id = ?
					""", (rs, rowNum) -> Map.of("storagePath", rs.getString("storage_path"), "fileName",
					rs.getString("original_file_name")), studentId);

			if (records.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "No resume found."));
			}

			jdbcTemplate.update("DELETE FROM resumes WHERE student_id = ?", studentId);

			try {
				Files.deleteIfExists(Paths.get((String) records.get(0).get("storagePath")));
			} catch (IOException ex) {
				System.err.println("Could not remove resume file: " + ex.getMessage());
			}
			// Notify coordinators who enabled Resume Deleted notifications.
			String studentName = jdbcTemplate.queryForObject("SELECT full_name FROM users WHERE user_id = ?",
					String.class, studentId);

			String fileName = (String) records.get(0).get("fileName");

			String notificationMessage = "Resume deleted by " + studentName + ": " + fileName;

			for (Long coordinatorId : notificationRepository.getCoordinatorsForResumeDeletedNotifications()) {

				notificationRepository.createNotification(coordinatorId, "RESUME_DELETED", notificationMessage,
						studentId, null, null);
			}
			return ResponseEntity.ok(Map.of("message", "Resume deleted successfully."));

		} catch (Exception ex) {
			ex.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Unable to delete resume."));
		}
	}

	@GetMapping("/coordinator/{studentId}")
	public ResponseEntity<?> getStudentResumeForCoordinator(@PathVariable("studentId") Long studentId,
			HttpSession session) {

		Object sessionUserId = session.getAttribute("userId");
		Object sessionRole = session.getAttribute("userRole");

		if (sessionUserId == null || !"COORDINATOR".equals(sessionRole)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "Only coordinators can view student resumes."));
		}

		if (studentId == null || studentId <= 0) {
			return ResponseEntity.badRequest().body(Map.of("message", "Invalid student ID."));
		}

		try {
			var students = userRepository.findById(studentId);

			if (students == null || !"STUDENT".equals(students.getRole())) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student not found."));
			}

			var resumes = jdbcTemplate.query("""
					SELECT original_file_name, content_type,
					       file_size_bytes, storage_path
					FROM resumes
					WHERE student_id = ?
					""", (rs, rowNum) -> new ResumeFile(rs.getString("original_file_name"),
					rs.getString("content_type"), rs.getString("storage_path")), studentId);

			if (resumes.isEmpty()) {
				Map<String, Object> response = new HashMap<>();
				response.put("resume", null);
				return ResponseEntity.ok(response);
			}

			ResumeFile resume = resumes.get(0);
			Path path = Paths.get(resume.storagePath()).normalize();

			Map<String, Object> resumeDetails = new HashMap<>();
			resumeDetails.put("name", resume.originalName());
			resumeDetails.put("contentType", resume.contentType());
			resumeDetails.put("fileUrl", "/api/student/resume/coordinator/" + studentId + "/file");

			return ResponseEntity.ok(Map.of("resume", resumeDetails));

		} catch (Exception ex) {
			ex.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Unable to retrieve student resume."));
		}
	}

	@GetMapping("/coordinator/{studentId}/file")
	public ResponseEntity<?> downloadStudentResumeForCoordinator(@PathVariable("studentId") Long studentId,
			HttpSession session) {

		Object sessionUserId = session.getAttribute("userId");
		Object sessionRole = session.getAttribute("userRole");

		if (sessionUserId == null || !"COORDINATOR".equals(sessionRole)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "Only coordinators can view student resumes."));
		}

		if (studentId == null || studentId <= 0) {
			return ResponseEntity.badRequest().body(Map.of("message", "Invalid student ID."));
		}

		try {
			var student = userRepository.findById(studentId);

			if (student == null || !"STUDENT".equals(student.getRole())) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student not found."));
			}

			var records = jdbcTemplate.query("""
					SELECT original_file_name, content_type, storage_path
					FROM resumes
					WHERE student_id = ?
					""", (rs, rowNum) -> new ResumeFile(rs.getString("original_file_name"),
					rs.getString("content_type"), rs.getString("storage_path")), studentId);

			if (records.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "No resume uploaded."));
			}

			ResumeFile record = records.get(0);
			Path path = Paths.get(record.storagePath()).normalize();

			if (!Files.isRegularFile(path)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body(Map.of("message", "Resume file is missing from storage."));
			}

			String safeName = record.originalName().replace("\"", "");

			return ResponseEntity.ok().contentType(MediaType.parseMediaType(record.contentType()))
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + safeName + "\"")
					.body(Files.readAllBytes(path));

		} catch (Exception ex) {
			ex.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Unable to retrieve student resume."));
		}
	}

	private record ResumeFile(String originalName, String contentType, String storagePath) {
	}
}
