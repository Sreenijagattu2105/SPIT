package com.spit.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spit.repository.CoordinatorNotificationRepository;

/**
 * Handles notification operations for the SPIT coordinator dashboard.
 *
 * Supports retrieving notifications, checking unread counts,
 * marking notifications as read, and deleting notifications.
 */
@Service
public class CoordinatorNotificationService {

    private final CoordinatorNotificationRepository notificationRepository;

    /**
     * Creates the service with its required repository.
     *
     * @param notificationRepository repository for coordinator notifications
     */
    public CoordinatorNotificationService(
            CoordinatorNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Retrieves notifications and the current unread count.
     *
     * @param coordinatorId ID of the coordinator
     * @return a map containing notifications and unreadCount
     */
    public Map<String, Object> getNotifications(Long coordinatorId) {

        List<Map<String, Object>> notifications =
                notificationRepository.getNotifications(coordinatorId);

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("notifications", notifications);
        result.put(
                "unreadCount",
                notificationRepository.getUnreadCount(coordinatorId)
        );

        return result;
    }

    /**
     * Marks one notification as read.
     *
     * @param coordinatorId ID of the coordinator
     * @param notificationId ID of the notification
     */
    @Transactional
    public void markAsRead(
            Long coordinatorId,
            Long notificationId) {

        notificationRepository.markAsRead(
                coordinatorId,
                notificationId
        );
    }

    /**
     * Marks all notifications belonging to a coordinator as read.
     *
     * @param coordinatorId ID of the coordinator
     */
    @Transactional
    public void markAllAsRead(Long coordinatorId) {

        notificationRepository.markAllAsRead(coordinatorId);
    }

    /**
     * Deletes a notification for the specified coordinator.
     *
     * @param coordinatorId ID of the coordinator
     * @param notificationId ID of the notification
     */
    @Transactional
    public void deleteNotification(
            Long coordinatorId,
            Long notificationId) {

        notificationRepository.deleteNotification(
                coordinatorId,
                notificationId
        );
    }
}
