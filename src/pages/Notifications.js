import { useState, useEffect } from "react";

function Notifications() {

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

                <h1>Notifications</h1>

                <p>
                    View updates about opportunities and your applications.
                </p>

                {notifications.some(
                    (notification) => !notification.read
                ) && (

                    <button
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
            Mark as Read
        </button>

    )}

    <button
        onClick={() =>
            handleDelete(notification.id)
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

export default Notifications;