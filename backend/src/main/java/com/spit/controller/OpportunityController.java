package com.spit.controller;

import java.sql.Date;
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

import com.spit.repository.OpportunityRepository;

@RestController
@RequestMapping("/api")
public class OpportunityController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final OpportunityRepository opportunityRepository;

    public OpportunityController(
            OpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    // Coordinator: view opportunities created by the logged-in coordinator
    @GetMapping("/coordinator/opportunities")
    public ResponseEntity<?> getCoordinatorOpportunities(
            HttpSession session) {

        Object userId = session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        long coordinatorId = Long.parseLong(userId.toString());

        List<Map<String, Object>> opportunities =
                opportunityRepository.findAllForCoordinator(coordinatorId);

        return ResponseEntity.ok(opportunities);
    }

    // Student: view published opportunities only
    @GetMapping("/student/opportunities")
    public ResponseEntity<List<Map<String, Object>>> getPublishedOpportunities() {

        List<Map<String, Object>> opportunities =
                opportunityRepository.findAllPublished();

        return ResponseEntity.ok(opportunities);
    }

    @PostMapping("/coordinator/opportunities")
    public ResponseEntity<?> createOpportunity(
            @RequestBody Map<String, Object> body,
            HttpSession session) {

        Object userId = session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        try {
            String title = value(body, "title");
            String company = value(body, "company");
            String location = value(body, "location");
            String description = value(body, "description");

            if (title.isBlank() || company.isBlank()
                    || location.isBlank() || description.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Title, company, location and description are required."
                        ));
            }

            String type = value(body, "type").toUpperCase();

            if (!type.equals("JOB") && !type.equals("INTERNSHIP")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid opportunity type."));
            }

            String status = value(body, "status").toUpperCase();

            if (!status.equals("DRAFT")
                    && !status.equals("PUBLISHED")
                    && !status.equals("UNPUBLISHED")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid opportunity status."));
            }

            String deadlineText = value(body, "deadline");
            Date deadline = deadlineText.isBlank()
                    ? null
                    : Date.valueOf(deadlineText);

            long coordinatorId = Long.parseLong(userId.toString());

            long id = opportunityRepository.createOpportunity(
                    title,
                    company,
                    value(body, "companyDescription"),
                    description,
                    type,
                    location,
                    value(body, "salaryStipend"),
                    value(body, "skills"),
                    value(body, "eligibility"),
                    value(body, "companyWebsite"),
                    deadline,
                    status,
                    coordinatorId
            );

            if ("PUBLISHED".equals(status)) {
                notifyStudentsAboutOpportunity(id, title, company);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Opportunity created successfully.",
                            "id", id
                    )
            );

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Invalid deadline or request data."
                    ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Unable to create opportunity."));
        }
    }

    @PutMapping("/coordinator/opportunities/{id}")
    public ResponseEntity<?> updateOpportunity(
            @PathVariable("id") long id,
            @RequestBody Map<String, Object> body,
            HttpSession session) {

        Object userId = session.getAttribute("userId");
        Object userRole = session.getAttribute("userRole");

        if (userId == null || userRole == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in first."));
        }

        if (!"COORDINATOR".equals(userRole.toString())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Coordinator access only."));
        }

        try {
            String title = value(body, "title");
            String company = value(body, "company");
            String location = value(body, "location");
            String description = value(body, "description");
            String type = value(body, "type").toUpperCase();
            String status = value(body, "status").toUpperCase();

            if (title.isBlank() || company.isBlank()
                    || location.isBlank() || description.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Title, company, location and description are required."
                        ));
            }

            if (!type.equals("JOB") && !type.equals("INTERNSHIP")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid opportunity type."));
            }

            if (!status.equals("DRAFT")
                    && !status.equals("PUBLISHED")
                    && !status.equals("UNPUBLISHED")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid opportunity status."));
            }

            String deadlineText = value(body, "deadline");
            Date deadline = deadlineText.isBlank()
                    ? null
                    : Date.valueOf(deadlineText);

            long coordinatorId = Long.parseLong(userId.toString());

            Map<String, Object> oldOpportunity =
                    opportunityRepository.findByIdForCoordinator(
                            id, coordinatorId);

            if (oldOpportunity == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Opportunity not found or not owned by this coordinator."
                        ));
            }

            boolean updated = opportunityRepository.updateOpportunity(
                    id,
                    coordinatorId,
                    title,
                    company,
                    value(body, "companyDescription"),
                    description,
                    type,
                    location,
                    value(body, "salaryStipend"),
                    value(body, "skills"),
                    value(body, "eligibility"),
                    value(body, "companyWebsite"),
                    deadline,
                    status
            );

            if (!updated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Opportunity not found or not owned by this coordinator."
                        ));
            }

            StringBuilder changes = new StringBuilder();

            addChange(changes, "Title",
                    oldOpportunity.get("title"), title);

            addChange(changes, "Company",
                    oldOpportunity.get("company"), company);

            addChange(changes, "Company Description",
                    oldOpportunity.get("companyDescription"),
                    value(body, "companyDescription"));

            addChange(changes, "Description",
                    oldOpportunity.get("description"), description);

            addChange(changes, "Type",
                    oldOpportunity.get("type"), type);

            addChange(changes, "Location",
                    oldOpportunity.get("location"), location);

            addChange(changes, "Salary/Stipend",
                    oldOpportunity.get("salaryStipend"),
                    value(body, "salaryStipend"));

            addChange(changes, "Skills",
                    oldOpportunity.get("skills"), value(body, "skills"));

            addChange(changes, "Eligibility",
                    oldOpportunity.get("eligibility"), value(body, "eligibility"));

            addChange(changes, "Company Website",
                    oldOpportunity.get("companyWebsite"),
                    value(body, "companyWebsite"));

            addChange(changes, "Deadline",
                    oldOpportunity.get("deadline"), deadline);

            addChange(changes, "Status",
                    oldOpportunity.get("status"), status);

            if (changes.length() > 0) {
                notifyStudentsAboutOpportunityUpdate(
                        id, title, company, changes.toString());
            }

            return ResponseEntity.ok(
                    Map.of("message", "Opportunity updated successfully.")
            );

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Invalid deadline or request data."
                    ));
        } catch (Exception ex) {
            ex.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Unable to update opportunity."));
        }
    }

    private void notifyStudentsAboutOpportunity(
            long opportunityId,
            String title,
            String company) {

        String message = "New opportunity published: "
                + title + " at " + company + ".";

        jdbcTemplate.update(
                """
                INSERT INTO notifications
                    (recipient_user_id, notification_type, message,
                     opportunity_id, is_read)
                SELECT u.user_id, ?, ?, ?, 0
                FROM users u
                LEFT JOIN student_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'STUDENT'
                  AND u.is_active = 1
                  AND COALESCE(p.opportunity_published, 1) = 1
                """,
                "NEW_OPPORTUNITY",
                message,
                opportunityId
        );
    }

    private void notifyStudentsAboutOpportunityUpdate(
            long opportunityId,
            String title,
            String company,
            String changes) {

        String message = "Opportunity updated: "
                + title + " at " + company + "\n"
                + changes;

        jdbcTemplate.update(
                """
                INSERT INTO notifications
                    (recipient_user_id, notification_type, message,
                     opportunity_id, is_read)
                SELECT u.user_id, ?, ?, ?, 0
                FROM users u
                LEFT JOIN student_notification_preferences p
                    ON p.user_id = u.user_id
                WHERE u.role = 'STUDENT'
                  AND u.is_active = 1
                  AND COALESCE(p.opportunity_updated, 1) = 1
                """,
                "OPPORTUNITY_UPDATED",
                message,
                opportunityId
        );
    }

    private void addChange(
            StringBuilder changes,
            String fieldName,
            Object oldValue,
            Object newValue) {

        String oldText = oldValue == null
                ? ""
                : oldValue.toString().trim();

        String newText = newValue == null
                ? ""
                : newValue.toString().trim();

        if (!oldText.equals(newText)) {
            if (changes.length() > 0) {
                changes.append("\n");
            }

            changes.append(fieldName)
                    .append(": ")
                    .append(oldText.isEmpty() ? "(empty)" : oldText)
                    .append(" → ")
                    .append(newText.isEmpty() ? "(empty)" : newText);
        }
    }

    private String value(Map<String, Object> body, String key) {
        Object value = body.get(key);
        return value == null ? "" : value.toString().trim();
    }

    @DeleteMapping("/coordinator/opportunities/{id}")
    public ResponseEntity<?> deleteOpportunity(
            @PathVariable("id") long id,
            HttpSession session) {

        Object userId = session.getAttribute("userId");
        Object userRole = session.getAttribute("userRole");

        if (userId == null || userRole == null
                || !"COORDINATOR".equals(userRole.toString())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Coordinator login required."));
        }

        long coordinatorId = Long.parseLong(userId.toString());

        int deleted = opportunityRepository.deleteOpportunity(
                id, coordinatorId);

        if (deleted == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Opportunity not found or you do not have permission to delete it."
                    ));
        }

        return ResponseEntity.ok(
                Map.of("message", "Opportunity deleted successfully.")
        );
    }
}
