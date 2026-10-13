
import { useEffect, useState } from "react";

const STORAGE_KEY = "coordinatorNotifications";

function readNotifications() {
    try {
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function CoordinatorNotifications() {
    const [notifications, setNotifications] = useState(
        readNotifications
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setNotifications(readNotifications());
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener(
            "coordinatorNotificationsChange",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
            window.removeEventListener(
                "coordinatorNotificationsChange",
                handleStorageChange
            );
        };
    }, []);

    const saveNotifications = (updatedNotifications) => {
        setNotifications(updatedNotifications);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedNotifications)
        );

        window.dispatchEvent(
            new Event("coordinatorNotificationsChange")
        );
    };

    const markAsRead = (id) => {
        saveNotifications(
            notifications.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        saveNotifications(
            notifications.map((notification) => ({
                ...notification,
                read: true
            }))
        );
    };

    const handleDelete = (id) => {
        saveNotifications(
            notifications.filter(
                (notification) => notification.id !== id
            )
        );
    };

    const unreadCount = notifications.filter(
        (notification) => notification.read !== true
    ).length;

    return (
        <div className="notifications-page">
            <div className="notifications-container">
                <h1>Coordinator Notifications</h1>

                <p>
                    Stay updated on applications, opportunities,
                    and placement activities.
                </p>

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
                        Mark All as Read
                    </button>
                )}

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
                                className={`notification-card ${
                                    notification.read
                                        ? "read"
                                        : "unread"
                                }`}
                            >
                                <div>
                                    <h3>{notification.message}</h3>
                                    <p>
                                        {notification.date ||
                                            "Date unavailable"}
                                    </p>
                                </div>

                                <div className="notification-actions">
                                    {!notification.read && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                markAsRead(
                                                    notification.id
                                                )
                                            }
                                        >
                                            Mark as Read
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                notification.id
                                            )
                                        }
                                    >
                                        Delete
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

export default CoordinatorNotifications;
