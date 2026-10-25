/*
 * CoordinatorNavbar.jsx
 * ---------------------
 * Displays the navigation bar for coordinator pages.
 * Includes navigation links, the SPIT logo, unread notification
 * count, and logout functionality.
 */

// Import React hooks for managing state and side effects.
import { useEffect, useState } from "react";

// Import navigation components from React Router.
import { NavLink, useNavigate } from "react-router-dom";

// Import icons from Lucide React.
import {
    LayoutDashboard,
    Users,
    BriefcaseBusiness,
    ClipboardList,
    ChartNoAxesCombined,
    Settings,
    Bell,
    LogOut
} from "lucide-react";

// Import the SPIT logo.
import spitLogo from "../assets/spit_logo.png";

/*
 * Navigation links for the coordinator.
 * Each object defines the link name, route path, and icon.
 */
const links = [
    {
        name: "Dashboard",
        path: "/coordinator-dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Students",
        path: "/coordinator/students",
        icon: Users
    },
    {
        name: "Opportunities",
        path: "/coordinator/opportunities",
        icon: BriefcaseBusiness
    },
    {
        name: "Track Applications",
        path: "/coordinator/applications",
        icon: ClipboardList
    },
    {
        name: "Placement Reports",
        path: "/coordinator/reports",
        icon: ChartNoAxesCombined
    },
    {
        name: "Notifications",
        path: "/coordinator/notifications",
        icon: Bell
    },
    {
        name: "Settings",
        path: "/coordinator/settings",
        icon: Settings
    }
];

/**
 * CoordinatorNavbar component.
 *
 * Displays coordinator navigation links, retrieves the unread
 * notification count, and handles coordinator logout.
 */
export default function CoordinatorNavbar() {

    // Navigate programmatically to another route.
    const navigate = useNavigate();

    // Store the current number of unread coordinator notifications.
    const [unreadCount, setUnreadCount] = useState(0);

    // Backend endpoint used to retrieve coordinator notifications.
    const NOTIFICATIONS_API =
        "http://localhost:8080/spit-backend/api/coordinator/notifications";

    /*
     * Fetch the unread notification count when the component mounts.
     * Refresh the count when notification changes occur or the page
     * becomes visible again.
     */
    useEffect(() => {
        let isMounted = true;

        // Retrieve the latest unread notification count from the backend.
        const updateUnreadCount = async () => {
            try {
                const response = await fetch(NOTIFICATIONS_API, {
                    method: "GET",
                    credentials: "include"
                });

                // Handle unsuccessful HTTP responses.
                if (!response.ok) {
                    throw new Error(
                        "Unable to load unread notification count."
                    );
                }

                const data = await response.json();

                // Update state only while the component is mounted.
                if (isMounted) {
                    setUnreadCount(data.unreadCount ?? 0);
                }
            } catch (error) {
                // Log errors that occur while retrieving notifications.
                console.error(
                    "Unread notification count error:",
                    error
                );
            }
        };

        // Fetch the initial unread notification count.
        updateUnreadCount();

        // Refresh notifications when the browser tab becomes visible.
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                updateUnreadCount();
            }
        };

        // Listen for notification changes triggered by other components.
        window.addEventListener(
            "coordinatorNotificationsChange",
            updateUnreadCount
        );

        // Listen for browser tab visibility changes.
        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        // Remove event listeners when the component unmounts.
        return () => {
            isMounted = false;

            window.removeEventListener(
                "coordinatorNotificationsChange",
                updateUnreadCount
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    /*
     * Handle coordinator logout.
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
            console.error("Backend logout failed:", error);
        } finally {
            // Clear authentication-related data from localStorage.
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("registeredUser");

            // Notify other components that authentication has changed.
            window.dispatchEvent(new Event("authChange"));

            // Redirect to login and replace the current history entry.
            navigate("/login", { replace: true });
        }
    };

    /*
     * Render the coordinator navigation bar.
     */
    return (
        <nav className="coordinator-navbar">

            {/* Display the SPIT logo. */}
            <img
                src={spitLogo}
                alt="SPIT Logo"
                className="coordinator-navbar-logo"
            />

            {/* Render all coordinator navigation links. */}
            <div className="coordinator-navbar-links">
                {links.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/coordinator-dashboard"}
                        className={({ isActive }) =>
                            `coordinator-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        {/* Display the icon for the navigation link. */}
                        <div className="coordinator-nav-icon-wrapper">
                            <Icon size={20} />

                            {/* Display the unread badge for Notifications only. */}
                            {name === "Notifications" &&
                                unreadCount > 0 && (
                                    <span className="coordinator-notification-badge">
                                        {unreadCount > 9
                                            ? "9+"
                                            : unreadCount}
                                    </span>
                                )}
                        </div>

                        {/* Display the navigation link name. */}
                        <span>{name}</span>
                    </NavLink>
                ))}
            </div>

            {/* Display the coordinator logout button. */}
            <button
                type="button"
                className="coordinator-nav-link coordinator-nav-logout"
                onClick={handleLogout}
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </nav>
    );
}
