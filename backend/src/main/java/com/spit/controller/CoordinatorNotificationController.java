package com.spit.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.spit.repository.CoordinatorNotificationPreferenceRepository;
import com.spit.repository.CoordinatorNotificationRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/coordinator/notifications")
public class CoordinatorNotificationController {

    private final CoordinatorNotificationPreferenceRepository preferenceRepository;
    private final CoordinatorNotificationRepository notificationRepository;

    public CoordinatorNotificationController(
            CoordinatorNotificationRepository notificationRepository,
            CoordinatorNotificationPreferenceRepository preferenceRepository) {

        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
    }

    /**
     * Retrieves and validates the logged-in coordinator's ID.
     */
    private Long getCoordinatorId(HttpSession session) {

        Object userId = session.getAttribute("userId");
        Object role = session.getAttribute("userRole");

        if (!(userId instanceof Number)
                || !"COORDINATOR".equals(role)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in as a coordinator."
            );
        }

        return ((Number) userId).longValue();
    }

    /**
     * Retrieves all notifications and the unread notification count.
     */
    @GetMapping
    public Map<String, Object> getNotifications(HttpSession session) {

        Long coordinatorId = getCoordinatorId(session);

        Map<String, Object> result = new LinkedHashMap<>();

        List<Map<String, Object>> notifications =
                notificationRepository.getNotifications(coordinatorId);

        result.put("notifications", notifications);
        result.put(
                "unreadCount",
                notificationRepository.getUnreadCount(coordinatorId)
        );

        return result;
    }

    /**
     * Creates a notification for the logged-in coordinator.
     */
    @PostMapping
    public Map<String, String> createNotification(
            @RequestBody Map<String, Object> request,
            HttpSession session) {

        Long coordinatorId = getCoordinatorId(session);

        String type = request.get("type") instanceof String
                ? ((String) request.get("type")).trim()
                : "";

        String message = request.get("message") instanceof String
                ? ((String) request.get("message")).trim()
                : "";

        if (type.isEmpty() || message.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Notification type and message are required."
            );
        }

        int created = notificationRepository.createNotification(
                coordinatorId,
                type,
                message,
                getOptionalId(request, "studentId"),
                getOptionalId(request, "opportunityId"),
                getOptionalId(request, "applicationId")
        );

        if (created != 1) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not create notification."
            );
        }

        return Map.of(
                "message",
                "Notification created successfully."
        );
    }

    /**
     * Extracts an optional positive ID from the request.
     */
    private Long getOptionalId(
            Map<String, Object> request,
            String key) {

        Object value = request.get(key);

        if (value == null || "".equals(value)) {
            return null;
        }

        if (value instanceof Number) {
            long id = ((Number) value).longValue();

            if (id > 0) {
                return id;
            }
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid " + key + "."
        );
    }

    /**
     * Marks one notification as read.
     */
    @PostMapping("/{notificationId}/read")
    public Map<String, String> markAsRead(
            @PathVariable("notificationId") Long notificationId,
            HttpSession session) {

        Long coordinatorId = getCoordinatorId(session);

        int updated = notificationRepository.markAsRead(
                coordinatorId,
                notificationId
        );

        if (updated == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Notification not found or already read."
            );
        }

        return Map.of(
                "message",
                "Notification marked as read."
        );
    }

    /**
     * Marks all notifications as read for the logged-in coordinator.
     */
    @PostMapping("/read-all")
    public Map<String, String> markAllAsRead(HttpSession session) {

        Long coordinatorId = getCoordinatorId(session);

        notificationRepository.markAllAsRead(coordinatorId);

        return Map.of(
                "message",
                "All notifications marked as read."
        );
    }

    /**
     * Deletes one notification belonging to the coordinator.
     */
    @DeleteMapping("/{notificationId}")
    public Map<String, String> deleteNotification(
            @PathVariable("notificationId") Long notificationId,
            HttpSession session) {

        Long coordinatorId = getCoordinatorId(session);

        int deleted = notificationRepository.deleteNotification(
                coordinatorId,
                notificationId
        );

        if (deleted == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Notification not found."
            );
        }

        return Map.of(
                "message",
                "Notification deleted successfully."
        );
    }

    /**
     * Retrieves notification preferences for the coordinator.
     */
    @GetMapping("/preferences")
    public Map<String, Object> getPreferences(HttpSession session) {

        Long coordinatorId = getCoordinatorId(session);

        return preferenceRepository.getPreferences(coordinatorId);
    }

    /**
     * Saves notification preferences for the coordinator.
     */
    @PutMapping("/preferences")
    public Map<String, String> savePreferences(
            @RequestBody Map<String, Boolean> preferences,
            HttpSession session) {

        Long coordinatorId = getCoordinatorId(session);

        preferenceRepository.savePreferences(
                coordinatorId,
                preferences
        );

        return Map.of(
                "message",
                "Notification preferences saved successfully."
        );
    }
}
