
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    ClipboardCheck,
    ChartNoAxesCombined,
    Bookmark,
    BookOpen,
    UserRound,
    Bell,
    Settings,
    LogOut,
    Users,
    FileBarChart,
    Home,
    Info,
    Mail,
    LogIn,
    UserPlus,
    Menu,
    X,
    FileText,
} from "lucide-react";

import "./App.css";
import logo from "./assets/spit_logo.png";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );
    const [userRole, setUserRole] = useState(
        localStorage.getItem("userRole")
    );
    const [mobileOpen, setMobileOpen] = useState(false);

    const getUnreadCount = () => {
        try {
            const notifications = JSON.parse(
                localStorage.getItem("notifications") || "[]"
            );
            return notifications.filter(
                (notification) => notification.read !== true
            ).length;
        } catch {
            return 0;
        }
    };

    const getCoordinatorUnreadCount = () => {
        try {
            const notifications = JSON.parse(
                localStorage.getItem("coordinatorNotifications") || "[]"
            );
            return notifications.filter(
                (notification) => notification.read !== true
            ).length;
        } catch {
            return 0;
        }
    };

    const [unreadCount, setUnreadCount] = useState(getUnreadCount());
    const [coordinatorUnreadCount, setCoordinatorUnreadCount] =
        useState(getCoordinatorUnreadCount());

    useEffect(() => {
        const handleAuthChange = () => {
            setIsLoggedIn(
                localStorage.getItem("isLoggedIn") === "true"
            );
            setUserRole(localStorage.getItem("userRole"));
            setUnreadCount(getUnreadCount());
            setCoordinatorUnreadCount(getCoordinatorUnreadCount());
        };

        const handleNotificationsChange = () => {
            setUnreadCount(getUnreadCount());
        };

        const handleCoordinatorNotificationsChange = () => {
            setCoordinatorUnreadCount(getCoordinatorUnreadCount());
        };

        window.addEventListener("authChange", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);
        window.addEventListener(
            "notificationsChange",
            handleNotificationsChange
        );
        window.addEventListener(
            "coordinatorNotificationsChange",
            handleCoordinatorNotificationsChange
        );

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
            window.removeEventListener(
                "notificationsChange",
                handleNotificationsChange
            );
            window.removeEventListener(
                "coordinatorNotificationsChange",
                handleCoordinatorNotificationsChange
            );
        };
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        localStorage.removeItem("currentUser");

        window.dispatchEvent(new Event("authChange"));
        setMobileOpen(false);
        navigate("/");
    };

    const linkClass = ({ isActive }) =>
        `nav-link ${isActive ? "active" : ""}`;

    const isCoordinator =
        isLoggedIn &&
        userRole === "coordinator" &&
        window.location.pathname.startsWith("/coordinator");

    const showSidebar =
        isLoggedIn &&
        (userRole === "student" || userRole === "coordinator");

    const studentLinks = [
        {
            to: "/student-dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            end: true,
        },
        {
            to: "/opportunities",
            label: "Opportunities",
            icon: BriefcaseBusiness,
        },
        {
            to: "/my-applications",
            label: "My Applications",
            icon: ClipboardCheck,
        },
        {
            to: "/interview-progress",
            label: "Interview Progress",
            icon: ChartNoAxesCombined,
        },
        {
            to: "/saved-opportunities",
            label: "Saved Opportunities",
            icon: Bookmark,
        },
        {
            to: "/career-resources",
            label: "Career Resources",
            icon: BookOpen,
        },
        {
            to: "/profile",
            label: "My Profile",
            icon: UserRound,
        },
        {
            to: "/resume",
            label: "My Resume",
            icon: FileText,
        },
        {
            to: "/notifications",
            label: "Notifications",
            icon: Bell,
            badge: unreadCount,
        },
        {
            to: "/settings",
            label: "Settings",
            icon: Settings,
        },
    ];

    const coordinatorLinks = [
        {
            to: "/coordinator-dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            end: true,
        },
        {
            to: "/coordinator/students",
            label: "Students",
            icon: Users,
        },
        {
            to: "/coordinator/opportunities",
            label: "Opportunities",
            icon: BriefcaseBusiness,
        },
        {
            to: "/coordinator/applications",
            label: "Applications",
            icon: ClipboardCheck,
        },
        {
            to: "/coordinator/reports",
            label: "Reports",
            icon: FileBarChart,
        },
        {
            to: "/coordinator/notifications",
            label: "Notifications",
            icon: Bell,
            badge: coordinatorUnreadCount,
        },
        {
            to: "/coordinator/settings",
            label: "Settings",
            icon: Settings,
        },
    ];

    const publicLinks = [
        { to: "/", label: "Home", icon: Home, end: true },
        { to: "/about", label: "About Us", icon: Info },
        {
            to: "/opportunities",
            label: "Opportunities",
            icon: BriefcaseBusiness,
        },
        {
            to: "/career-resources",
            label: "Career Resources",
            icon: BookOpen,
        },
        { to: "/contact", label: "Contact Us", icon: Mail },
        { to: "/login", label: "Login", icon: LogIn },
        { to: "/register", label: "Register", icon: UserPlus },
    ];

    if (!showSidebar) {
        return (
            <nav className="navbar public-navbar">
                <div className="navbar-container">
                    <NavLink className="navbar-brand" to="/">
                        <img src={logo} alt="SPIT Logo" />
                    </NavLink>

                    <div className="navbar-links">
                        {publicLinks.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={linkClass}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </nav>
        );
    }

    const links = isCoordinator ? coordinatorLinks : studentLinks;

    return (
        <>
            <button
                type="button"
                className="sidebar-mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
                {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>

            {mobileOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    aria-label="Close navigation menu"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`sidebar-navbar ${
                    mobileOpen ? "sidebar-open" : ""
                }`}
            >
                <NavLink
                    className="sidebar-brand"
                    to={
                        isCoordinator
                            ? "/coordinator-dashboard"
                            : "/student-dashboard"
                    }
                    onClick={() => setMobileOpen(false)}
                >
                    <img src={logo} alt="SPIT Logo" />
                </NavLink>

                <div className="sidebar-section-label">
                    {isCoordinator ? "COORDINATOR MENU" : "STUDENT MENU"}
                </div>

                <nav className="sidebar-links">
                    {links.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={linkClass}
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>

                                {item.badge > 0 && (
                                    <span className="notification-badge">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-bottom">
                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={19} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Navbar;
