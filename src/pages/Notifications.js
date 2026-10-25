import { useState, useEffect, useCallback } from "react";
import { Trash2, Check } from "lucide-react";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(
        notification => !notification.read
    ).length;
    const getLoggedInEmail = () => {
        try {
            const currentUser = JSON.parse(
                localStorage.getItem("currentUser") || "null"
            );

            const registeredUser = JSON.parse(
                localStorage.getItem("registeredUser") || "null"
            );

            return String(
                currentUser?.email || registeredUser?.email || ""
            ).trim().toLowerCase();
        } catch {
            return "";
        }
    };


    const loadNotifications = useCallback(async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/notifications",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Unable to load notifications (${response.status}).`
                );
            }

            const data = await response.json();

            const studentNotifications = (Array.isArray(data) ? data : [])
                .filter(
                    notification =>
                        notification.notificationType !== "opportunity-saved"
                )
                .map(notification => ({
                    id: notification.notificationId,
                    type: notification.notificationType,
                    message: notification.message,
                    opportunityId: notification.opportunityId,
                    applicationId: notification.applicationId,
                    interviewRoundId: notification.interviewRoundId,
                    reminderDaysLeft: notification.reminderDaysLeft,
                    deadline: notification.deadlineDate,
                    read:
                        notification.isRead === true ||
                        notification.isRead === 1,
                    date: notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString()
                        : ""
                }));

            setNotifications(studentNotifications);
        } catch (error) {
            console.error("Error loading notifications:", error);
            setNotifications([]);
        }
    }, []);


    useEffect(() => {
        const initializeNotifications = async () => {
            try {
                await fetch(
                    "http://localhost:8080/spit-backend/api/notifications/deadline-reminders",
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );
            } catch (error) {
                console.error("Could not check deadline reminders:", error);
            }

            await loadNotifications();
        };

        initializeNotifications();

        window.addEventListener(
            "notificationsChange",
            loadNotifications
        );
        window.addEventListener("storage", loadNotifications);

        return () => {
            window.removeEventListener(
                "notificationsChange",
                loadNotifications
            );
            window.removeEventListener("storage", loadNotifications);
        };
    }, [loadNotifications]);

    const updateStudentNotifications = (updatedStudentNotifications) => {
        const email = getLoggedInEmail();

        if (!email) return;

        try {
            const stored = JSON.parse(
                localStorage.getItem("notifications") || "[]"
            );

            const allNotifications = Array.isArray(stored) ? stored : [];

            // Preserve notifications belonging to other students
            // and hidden saved-opportunity notifications.
            const otherNotifications = allNotifications.filter(
                notification =>
                    String(notification.studentEmail || "")
                        .trim()
                        .toLowerCase() !== email ||
                    notification.type === "opportunity-saved"
            );

            localStorage.setItem(
                "notifications",
                JSON.stringify([
                    ...otherNotifications,
                    ...updatedStudentNotifications
                ])
            );

            setNotifications(updatedStudentNotifications);

            window.dispatchEvent(
                new Event("notificationsChange")
            );
        } catch {
            alert("Unable to update notifications.");
        }
    };


    const markAsRead = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:8080/spit-backend/api/notifications/${id}/read`,
                {
                    method: "PUT",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to mark notification as read."
                );
            }

            setNotifications(previous =>
                previous.map(notification =>
                    notification.id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );
            window.dispatchEvent(new Event("notificationsChange"));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            alert(error.message || "Unable to mark notification as read.");
        }
    };


    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/notifications/read-all",
                {
                    method: "PUT",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to mark all notifications as read."
                );
            }

            setNotifications(previous =>
                previous.map(notification => ({
                    ...notification,
                    read: true
                }))
            );
            window.dispatchEvent(new Event("notificationsChange"));
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            alert(error.message || "Unable to mark all notifications as read.");
        }
    };

    const handleDelete = async (id) => {
        const notificationToDelete = notifications.find(
            notification => notification.id === id
        );

        if (!notificationToDelete) return;

        try {
            const response = await fetch(
                `http://localhost:8080/spit-backend/api/notifications/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to delete notification."
                );
            }

            // Remember deleted deadline reminders.
            if (notificationToDelete.type === "deadline-reminder") {
                const email = getLoggedInEmail();
                const deletedRemindersKey =
                    `deletedDeadlineReminders:${email}`;

                let deletedReminders = [];

                try {
                    const stored = JSON.parse(
                        localStorage.getItem(deletedRemindersKey) || "[]"
                    );

                    deletedReminders = Array.isArray(stored) ? stored : [];
                } catch {
                    deletedReminders = [];
                }

                const reminderKey =
                    `${notificationToDelete.opportunityId}-${notificationToDelete.reminderDaysLeft}-${notificationToDelete.deadline}`;

                if (!deletedReminders.includes(reminderKey)) {
                    deletedReminders.push(reminderKey);
                }

                localStorage.setItem(
                    deletedRemindersKey,
                    JSON.stringify(deletedReminders)
                );
            }

            setNotifications(previous =>
                previous.filter(notification => notification.id !== id)
            );
            window.dispatchEvent(new Event("notificationsChange"));
        } catch (error) {
            console.error("Error deleting notification:", error);
            alert(error.message || "Unable to delete notification.");
        }
    };

    return (
        <div className="notifications-page">
            <div className="notifications-container"
                style={{
                    position: "relative",
                    top: "-95px"
                }}
            >
                <h1>NOTIFICATIONS</h1>

                <div className="notifications-description-box">
                    <p>
                        View updates about opportunities and your applications.
                    </p>
                </div>

                <div className="student-unread-notifications">
                    <p>
                        Unread notifications: <strong>{unreadCount}</strong>
                    </p>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                        >
                            <Check size={16} />
                            Mark All as Read
                        </button>
                    )}
                </div>

                <div className="notifications-list">
                    {notifications.length === 0 ? (
                        <div className="notification-empty">
                            <h2>No Notifications</h2>
                            <p>
                                You don't have any notifications right now.
                            </p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={`${notification.studentEmail}-${notification.id}`}
                                className={`notification-card ${notification.read ? "read" : "unread"
                                    }`}
                            >
                                <div>
                                    <h3>{notification.message}</h3>
                                    <p>
                                        {notification.date}
                                    </p>
                                </div>

                                <div className="notification-actions">
                                    {!notification.read && (
                                        <button
                                            type="button"
                                            aria-label="Mark notification as read"
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        aria-label="Delete notification"
                                        onClick={() =>
                                            handleDelete(notification.id)
                                        }
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notifications;
