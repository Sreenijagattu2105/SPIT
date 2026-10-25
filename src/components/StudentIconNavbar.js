/*
 * StudentIconNavbar.jsx
 * ---------------------
 * Displays the student's icon-based navigation bar.
 * Includes navigation links, unread notification badges,
 * tooltips, and logout functionality.
 */

// Import React hooks for managing state and side effects.
import { useEffect, useState } from "react";

// Import navigation components from React Router.
import { NavLink } from "react-router-dom";

// Import icons from Lucide React.
import {
    LayoutDashboard,
    BriefcaseBusiness,
    ClipboardCheck,
    ChartNoAxesCombined,
    Bookmark,
    BookOpen,
    UserRound,
    FileText,
    Bell,
    Settings,
    CircleHelp,
    LogOut
} from "lucide-react";

// Import the SPIT logo.
import spitLogo from "../assets/spit_logo.png";

/*
 * Navigation links for the student dashboard.
 * Each object contains the link name, route path, and icon.
 */
const links = [
    {
        name: "Dashboard",
        path: "/student-dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Find Opportunities",
        path: "/opportunities",
        icon: BriefcaseBusiness
    },
    {
        name: "My Applications",
        path: "/my-applications",
        icon: ClipboardCheck
    },
    {
        name: "Interview Progress",
        path: "/interview-progress",
        icon: ChartNoAxesCombined
    },
    {
        name: "Saved Opportunities",
        path: "/saved-opportunities",
        icon: Bookmark
    },
    {
        name: "Career Resources",
        path: "/career-resources",
        icon: BookOpen
    },
    {
        name: "My Resume",
        path: "/resume",
        icon: FileText
    },
    {
        name: "My Profile",
        path: "/profile",
        icon: UserRound
    },
    {
        name: "Notifications",
        path: "/notifications",
        icon: Bell
    },
    {
        name: "Settings",
        path: "/settings",
        icon: Settings
    },
    {
        name: "Instructions",
        path: "/student-instructions",
        icon: CircleHelp
    }
];

/**
 * StudentIconNavbar component.
 *
 * Displays student navigation links, tracks unread notifications,
 * and provides logout functionality.
 */
export default function StudentIconNavbar() {

    // Store the current number of unread student notifications.
    const [unreadCount, setUnreadCount] = useState(0);

    /*
     * Fetch the unread notification count when the component mounts.
     * Refresh the count whenever notifications or authentication change.
     */
    useEffect(() => {
        let isMounted = true;

        // Retrieve notifications from the backend and count unread items.
        const updateUnreadCount = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/notifications",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                // Stop processing if the request was unsuccessful.
                if (!response.ok) {
                    console.error(
                        "Failed to load notifications:",
                        response.status
                    );
                    return;
                }

                const data = await response.json();

                // Count notifications that have not been marked as read.
                const unread = data.filter((notification) => {
                    const value = notification.isRead;

                    return (
                        value === false ||
                        value === 0 ||
                        value === "0"
                    );
                }).length;

                // Update the count only while the component is mounted.
                if (isMounted) {
                    setUnreadCount(unread);
                }
            } catch (error) {
                // Log errors encountered while retrieving notifications.
                console.error(
                    "Unable to load unread notifications:",
                    error
                );
            }
        };

        // Fetch the initial unread notification count.
        updateUnreadCount();

        // Refresh the count when another component changes notifications.
        window.addEventListener(
            "notificationsChange",
            updateUnreadCount
        );

        // Refresh the count when authentication changes.
        window.addEventListener(
            "authChange",
            updateUnreadCount
        );

        // Remove event listeners when the component unmounts.
        return () => {
            isMounted = false;

            window.removeEventListener(
                "notificationsChange",
                updateUnreadCount
            );

            window.removeEventListener(
                "authChange",
                updateUnreadCount
            );
        };
    }, []);

    /*
     * Handle student logout.
     * Send a logout request to the backend, clear local authentication
     * data, notify other components, and redirect to the login page.
     */
    const handleLogout = async () => {
        try {
            // Send the logout request using the existing session cookie.
            await fetch(
                "http://localhost:8080/spit-backend/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );
        } catch (error) {
            // Log an error if the backend logout request fails.
            console.error("Student logout failed:", error);
        } finally {
            // Remove authentication-related data from localStorage.
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("registeredUser");

            // Notify other components that authentication has changed.
            window.dispatchEvent(new Event("authChange"));

            // Redirect to the login page and replace the current page.
            window.location.replace("/login");
        }
    };

    /*
     * Render the student's icon-based navigation bar.
     */
    return (
        <nav className="student-icon-navbar">

            {/* Display the SPIT logo. */}
            <img
                src={spitLogo}
                alt="SPIT Logo"
                className="student-icon-navbar-logo"
            />

            {/* Render all student navigation links. */}
            <div className="student-icon-navbar-links">
                {links.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/student-dashboard"}
                        className={({ isActive }) =>
                            `student-icon-link ${
                                isActive ? "active" : ""
                            }`
                        }
                        title={name}
                        aria-label={name}
                    >
                        {/* Display the navigation icon and notification badge. */}
                        <span className="student-icon-wrapper">
                            <Icon size={22} />

                            {/* Show the unread count for Notifications only. */}
                            {name === "Notifications" &&
                                unreadCount > 0 && (
                                    <span className="student-notification-badge">
                                        {unreadCount > 99
                                            ? "99+"
                                            : unreadCount}
                                    </span>
                                )}
                        </span>

                        {/* Display the tooltip when hovering over the icon. */}
                        <span className="student-icon-tooltip">
                            {name}
                        </span>
                    </NavLink>
                ))}
            </div>

            {/* Display the student logout button. */}
            <button
                type="button"
                className="student-icon-link student-icon-logout"
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
            >
                <LogOut size={22} />

                {/* Display the logout tooltip. */}
                <span className="student-icon-tooltip">
                    Logout
                </span>
            </button>
        </nav>
    );
}
