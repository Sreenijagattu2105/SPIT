import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, BriefcaseBusiness, ClipboardList, ChartNoAxesCombined, Settings, Bell, LogOut } from "lucide-react";
import spitLogo from "../assets/spit_logo.png";

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

function getUnreadNotificationCount() {
    try {
        const notifications = JSON.parse(
            localStorage.getItem("coordinatorNotifications") || "[]"
        );

        if (!Array.isArray(notifications)) return 0;

        return notifications.filter(
            (notification) => notification.read !== true
        ).length;
    } catch {
        return 0;
    }
}

export default function CoordinatorNavbar() {
    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(
        getUnreadNotificationCount
    );

    useEffect(() => {
        const updateUnreadCount = () => {
            setUnreadCount(getUnreadNotificationCount());
        };

        updateUnreadCount();

        window.addEventListener(
            "coordinatorNotificationsChange",
            updateUnreadCount
        );

        window.addEventListener("storage", updateUnreadCount);

        return () => {
            window.removeEventListener(
                "coordinatorNotificationsChange",
                updateUnreadCount
            );

            window.removeEventListener("storage", updateUnreadCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    };
    
return (
    <nav className="coordinator-navbar">
        <img 
            src={spitLogo} 
            alt="SPIT Logo" 
            className="coordinator-navbar-logo" 
        />

        <div className="coordinator-navbar-links">
            {links.map(({ name, path, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    end={path === "/coordinator-dashboard"}
                    className={({ isActive }) =>
                        `coordinator-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    <div className="coordinator-nav-icon-wrapper">
    <Icon size={20} />

    {name === "Notifications" && unreadCount > 0 && (
        <span className="coordinator-notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
        </span>
    )}
</div>

<span>{name}</span>
                </NavLink>
            ))}
        </div>

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
