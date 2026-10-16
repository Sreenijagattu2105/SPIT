import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BriefcaseBusiness, ClipboardCheck, ChartNoAxesCombined, Bookmark, BookOpen, UserRound, FileText, Bell, Settings, LogOut } from "lucide-react";
import spitLogo from "../assets/spit_logo.png";

const links = [
    { name: "Dashboard", path: "/student-dashboard", icon: LayoutDashboard },
    { name: "Find Opportunities", path: "/opportunities", icon: BriefcaseBusiness },
    { name: "My Applications", path: "/my-applications", icon: ClipboardCheck },
    { name: "Interview Progress", path: "/interview-progress", icon: ChartNoAxesCombined },
    { name: "Saved Opportunities", path: "/saved-opportunities", icon: Bookmark },
    { name: "Career Resources", path: "/career-resources", icon: BookOpen },
    { name: "My Resume", path: "/resume", icon: FileText },
    { name: "My Profile", path: "/profile", icon: UserRound },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Settings", path: "/settings", icon: Settings }
];

export default function StudentIconNavbar() {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const updateUnreadCount = () => {
            try {
                const notifications = JSON.parse(
                    localStorage.getItem("notifications") || "[]"
                );

                setUnreadCount( notifications.filter( notification => !notification.read ).length );
            } 
            catch {
                setUnreadCount(0);
            }
        };

        updateUnreadCount();

        window.addEventListener( "notificationsChange", updateUnreadCount );
        window.addEventListener("storage", updateUnreadCount);

        return () => {
            window.removeEventListener( "notificationsChange", updateUnreadCount );
            window.removeEventListener( "storage", updateUnreadCount );
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
    };

    return (
        <nav className="student-icon-navbar">
            <img
                src={spitLogo}
                alt="SPIT Logo"
                className="student-icon-navbar-logo"
            />

            <div className="student-icon-navbar-links">
                {links.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/student-dashboard"}
                        className={({ isActive }) =>
                            `student-icon-link ${isActive ? "active" : ""}`
                        }
                        title={name}
                        aria-label={name}
                    >
                        {name === "Notifications" ? (
                            <span className="notification-icon-wrapper">
                                <Icon size={22} />
                                {unreadCount > 0 && (
                                    <span className="notification-count">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </span>
                        ) : (
                            <Icon size={22} />
                        )}

                        <span className="student-icon-tooltip">{name}</span>
                    </NavLink>
                ))}
            </div>

            <button
                type="button"
                className="student-icon-link student-icon-logout"
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
            >
                <LogOut size={22} />
                <span className="student-icon-tooltip">Logout</span>
            </button>
        </nav>
    );
}
