
import { useEffect, useState } from "react";
import { Trash2, CheckCheck, Check } from "lucide-react";

const NOTIFICATIONS_API =
    "http://localhost:8080/spit-backend/api/coordinator/notifications";

function CoordinatorNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load notifications from Spring MVC
    const loadNotifications = async () => {
        try {
            setError("");

            const response = await fetch(NOTIFICATIONS_API, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(
                    "Unable to load notifications. Please log in again if your session has expired."
                );
            }

            const data = await response.json();

            setNotifications(
                Array.isArray(data.notifications)
                    ? data.notifications
                    : []
            );

            setUnreadCount(data.unreadCount ?? 0);
        } catch (error) {
            console.error("Notification loading error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    // Mark one notification as read
    const markAsRead = async (id) => {
        try {
            const response = await fetch(
                `${NOTIFICATIONS_API}/${id}/read`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Unable to mark notification as read.");
            }

            await loadNotifications();
            window.dispatchEvent(
                new Event("coordinatorNotificationsChange")
            );
        } catch (error) {
            console.error("Mark-as-read error:", error);
            alert(error.message);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                `${NOTIFICATIONS_API}/read-all`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Unable to mark all notifications as read.");
            }

            await loadNotifications();
            window.dispatchEvent(
                new Event("coordinatorNotificationsChange")
            );
        } catch (error) {
            console.error("Mark-all-as-read error:", error);
            alert(error.message);
        }
    };

    // Delete one notification
    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `${NOTIFICATIONS_API}/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Unable to delete notification.");
            }

            await loadNotifications();

            // Notify other coordinator components that notifications changed.
            window.dispatchEvent(
                new Event("coordinatorNotificationsChange")
            );
        } catch (error) {
            console.error("Notification deletion error:", error);
            alert(error.message);
        }
    };

    // Format the timestamp returned by the backend
    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "Date unavailable";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleString();
    };

    return (
        <div className="notifications-page">
            <div className="notifications-container">
                <h1>NOTIFICATIONS</h1>

                <p>
                    Stay updated on applications, opportunities,
                    and placement activities.
                </p>

                <div className="unread-notifications-box">
                    <p>
                        <strong>Unread notifications:</strong>{" "}
                        {unreadCount}
                    </p>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            className="mark-all-read-button"
                            onClick={markAllAsRead}
                        >
                            <CheckCheck size={18} />
                            Mark All as Read
                        </button>
                    )}
                </div>

                {loading ? (
                    <p>Loading notifications...</p>
                ) : error ? (
                    <div className="notification-empty">
                        <h2>Unable to Load Notifications</h2>
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={loadNotifications}
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <h2>No Notifications</h2>
                                <p>
                                    You don't have any coordinator
                                    notifications right now.
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-card ${notification.read
                                        ? "read"
                                        : "unread"
                                        }`}
                                >
                                    <div>
                                        <h3>{notification.message}</h3>
                                        <p>
                                            {formatDate(
                                                notification.createdAt
                                            )}
                                        </p>
                                    </div>

                                    <div className="notification-actions">
                                        {!notification.read && (
                                            <button
                                                type="button"
                                                title="Mark as read"
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
                                            title="Delete notification"
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
                )}
            </div>
        </div>
    );
}

export default CoordinatorNotifications;
