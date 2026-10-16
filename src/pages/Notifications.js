import { useState, useEffect } from "react";
import { Trash2, CheckCheck, Check } from "lucide-react";
function Notifications() {
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
    const updateUnreadCount = () => {
        try {
            const notifications = JSON.parse(
                localStorage.getItem("notifications") || "[]"
            );

            setUnreadCount(
                notifications.filter(notification => !notification.read).length
            );
        } catch {
            setUnreadCount(0);
        }
    };

    updateUnreadCount();

    window.addEventListener("notificationsChange", updateUnreadCount);
    window.addEventListener("storage", updateUnreadCount);

    return () => {
        window.removeEventListener("notificationsChange", updateUnreadCount);
        window.removeEventListener("storage", updateUnreadCount);
    };
}, []);
    const [notifications, setNotifications] = useState(
        JSON.parse(localStorage.getItem("notifications")) || [
            {
                id: 1,
                message: "New Internship Opportunity Available: A Java Full Stack Intern opportunity has been added by Infosys.",
                date: "28 Sep 2026",
                read: false
            },
            {
                id: 2,
                message: "Application status updated.",
                date: "27 Sep 2026",
                read: false
            },
            {
                id: 3,
                message: "Application deadline is approaching.",
                date: "26 Sep 2026",
                read: true
            }
        ]
    );

    useEffect(() => {
        localStorage.setItem(
            "notifications",
            JSON.stringify(notifications)
        );

        window.dispatchEvent(new Event("notificationsChange"));
    }, [notifications]);


    const markAsRead = (id) => {

        const updatedNotifications = notifications.map((notification) =>
            notification.id === id
                ? { ...notification, read: true }
                : notification
        );

        setNotifications(updatedNotifications);
    };
const handleDelete = (id) => {

    const updatedNotifications = notifications.filter(
        (notification) => notification.id !== id
    );

    setNotifications(updatedNotifications);

    localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
    );

    window.dispatchEvent(
        new Event("notificationsChange")
    );
};

    const markAllAsRead = () => {

        const updatedNotifications = notifications.map((notification) => ({
            ...notification,
            read: true
        }));

        setNotifications(updatedNotifications);
    };


    return (
        <div className="notifications-page">

            <div className="notifications-container">

                <h1>NOTIFICATIONS</h1>


{/* Description box */}
<div className="notifications-description-box">
    <p>
        View updates about opportunities and your applications.
    </p>
</div>

{/* Unread notifications box */}
<div className="student-unread-notifications">
    <strong>Unread notifications: {unreadCount}</strong>

    {unreadCount > 0 && (
        <button
            type="button"
            className="mark-all-read-button"
            onClick={markAllAsRead}
        >
          <CheckCheck size={18} />    Mark All as Read
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

                                    <h3>
                                        {notification.message}
                                    </h3>

                                    <p>
                                        {notification.date}
                                    </p>

                                </div>


                                <div className="notification-actions">

    {!notification.read && (

        <button
            onClick={() =>
                markAsRead(notification.id)
            }
        >
            <Check size={18} /> 
        </button>

    )}

    <button
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