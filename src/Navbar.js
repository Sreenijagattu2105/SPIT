/*
 * Navbar.jsx
 * ----------
 * This component manages the navigation bar for SPIT.
 * It displays public navigation links for visitors and a
 * sidebar for logged-in students and coordinators.
 * It also handles authentication changes, mobile navigation,
 * and logout functionality.
 */

// Import navigation components and hooks from React Router
import {
    NavLink,
    useNavigate,
    useLocation
} from "react-router-dom";

// Import React hooks
import { useEffect, useState } from "react";

// Import icons from Lucide React
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
    FileText
} from "lucide-react";

// Import global CSS and the SPIT logo
import "./App.css";
import logo from "./assets/spit_logo.png";

/*
 * Main Navbar component.
 */
function Navbar() {
    // Initialize navigation helpers
    const navigate = useNavigate();
    const location = useLocation();

    // Store the current login status
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    // Store the current user's role
    const [userRole, setUserRole] = useState(
        localStorage.getItem("userRole")
    );

    // Control whether the mobile sidebar is open
    const [mobileOpen, setMobileOpen] = useState(false);

    /*
     * Handles logout by calling the backend,
     * clearing local authentication data,
     * and redirecting the user to the login page.
     */
    const handleLogout = async () => {
        try {
            // Send a logout request to the backend
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            // Check whether the backend logout request succeeded
            if (!response.ok) {
                console.error(
                    "Backend logout failed:",
                    response.status
                );
            } else {
                console.log("Backend logout successful.");
            }
        } catch (error) {
            // Handle backend connection errors
            console.error(
                "Backend logout request failed:",
                error
            );
        } finally {
            // Clear authentication information from localStorage
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("registeredUser");

            // Notify other components that authentication changed
            window.dispatchEvent(new Event("authChange"));

            // Update the navbar authentication state
            setIsLoggedIn(false);
            setUserRole(null);

            // Redirect to the login page
            navigate("/login", { replace: true });
        }
    };

    /*
     * Listen for authentication changes and update
     * the navbar when login status or user role changes.
     */
    useEffect(() => {
        const handleAuthChange = () => {
            // Update login status
            setIsLoggedIn(
                localStorage.getItem("isLoggedIn") === "true"
            );

            // Update the current user's role
            setUserRole(
                localStorage.getItem("userRole")
            );
        };

        // Listen for authentication changes within the application
        window.addEventListener(
            "authChange",
            handleAuthChange
        );

        // Listen for localStorage changes from other tabs
        window.addEventListener(
            "storage",
            handleAuthChange
        );

        // Remove event listeners when the component unmounts
        return () => {
            window.removeEventListener(
                "authChange",
                handleAuthChange
            );

            window.removeEventListener(
                "storage",
                handleAuthChange
            );
        };
    }, []);

    /*
     * Close the mobile sidebar whenever the user navigates
     * to a different route.
     */
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    /*
     * Generates the CSS class for navigation links.
     * The active class is applied to the current route.
     */
    const linkClass = ({ isActive }) =>
        `nav-link ${isActive ? "active" : ""}`;

    /*
     * Determine whether the current page belongs to
     * the coordinator section.
     */
    const isCoordinator =
        isLoggedIn &&
        userRole === "coordinator" &&
        window.location.pathname.startsWith("/coordinator");

    /*
     * Determine whether to display the authenticated sidebar.
     * Logged-in students and coordinators use the sidebar.
     * Other visitors use the public navbar.
     */
    const showSidebar =
        isLoggedIn &&
        (
            userRole === "student" ||
            userRole === "coordinator"
        );

    /*
     * Navigation links available to students.
     */
    const studentLinks = [
        {
            to: "/student-dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            end: true
        },
        {
            to: "/opportunities",
            label: "Opportunities",
            icon: BriefcaseBusiness
        },
        {
            to: "/my-applications",
            label: "My Applications",
            icon: ClipboardCheck
        },
        {
            to: "/interview-progress",
            label: "Interview Progress",
            icon: ChartNoAxesCombined
        },
        {
            to: "/saved-opportunities",
            label: "Saved Opportunities",
            icon: Bookmark
        },
        {
            to: "/career-resources",
            label: "Career Resources",
            icon: BookOpen
        },
        {
            to: "/profile",
            label: "My Profile",
            icon: UserRound
        },
        {
            to: "/resume",
            label: "My Resume",
            icon: FileText
        },
        {
            to: "/notifications",
            label: "Notifications",
            icon: Bell
        },
        {
            to: "/settings",
            label: "Settings",
            icon: Settings
        }
    ];

    /*
     * Navigation links available to coordinators.
     */
    const coordinatorLinks = [
        {
            to: "/coordinator-dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            end: true
        },
        {
            to: "/coordinator/students",
            label: "Students",
            icon: Users
        },
        {
            to: "/coordinator/opportunities",
            label: "Opportunities",
            icon: BriefcaseBusiness
        },
        {
            to: "/coordinator/applications",
            label: "Applications",
            icon: ClipboardCheck
        },
        {
            to: "/coordinator/reports",
            label: "Reports",
            icon: FileBarChart
        },
        {
            to: "/coordinator/notifications",
            label: "Notifications",
            icon: Bell
        },
        {
            to: "/coordinator/settings",
            label: "Settings",
            icon: Settings
        }
    ];

    /*
     * Navigation links available to visitors who are
     * not using the authenticated sidebar.
     */
    const publicLinks = [
        {
            to: "/",
            label: "Home",
            icon: Home,
            end: true
        },
        {
            to: "/about",
            label: "About Us",
            icon: Info
        },
        {
            to: "/opportunities",
            label: "Opportunities",
            icon: BriefcaseBusiness
        },
        {
            to: "/career-resources",
            label: "Career Resources",
            icon: BookOpen
        },
        {
            to: "/contact",
            label: "Contact Us",
            icon: Mail
        },
        {
            to: "/login",
            label: "Login",
            icon: LogIn
        },
        {
            to: "/register",
            label: "Register",
            icon: UserPlus
        }
    ];

    /*
     * Render the public navbar when the user is not
     * logged in as a student or coordinator.
     */
    if (!showSidebar) {
        return (
            <nav
                className={`navbar public-navbar ${location.pathname === "/reset-password"
                    ? "reset-page-navbar"
                    : ""
                    }`}
            >
                <div className="navbar-container">

                    {/* Display the SPIT logo */}
                    <NavLink
                        className="navbar-brand"
                        to="/"
                    >
                        <img
                            src={logo}
                            alt="SPIT Logo"
                        />
                    </NavLink>

                    {/* Display public navigation links */}
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

    /*
     * Select the appropriate navigation links
     * according to the logged-in user's role.
     */
    const links = isCoordinator
        ? coordinatorLinks
        : studentLinks;

    /*
     * Render the authenticated sidebar and mobile controls.
     */
    return (
        <>
            {/* Mobile menu toggle button */}
            <button
                type="button"
                className="sidebar-mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={
                    mobileOpen ? "Close menu" : "Open menu"
                }
            >
                {mobileOpen
                    ? <X size={23} />
                    : <Menu size={23} />
                }
            </button>

            {/* Display an overlay when the mobile sidebar is open */}
            {mobileOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    aria-label="Close navigation menu"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Authenticated sidebar */}
            <aside
                className={`sidebar-navbar ${mobileOpen ? "sidebar-open" : ""
                    }`}
            >
                {/* Logo links to the appropriate dashboard */}
                <NavLink
                    className="sidebar-brand"
                    to={
                        isCoordinator
                            ? "/coordinator-dashboard"
                            : "/student-dashboard"
                    }
                    onClick={() => setMobileOpen(false)}
                >
                    <img
                        src={logo}
                        alt="SPIT Logo"
                    />
                </NavLink>

                {/* Display the current role's menu heading */}
                <div className="sidebar-section-label">
                    {isCoordinator
                        ? "COORDINATOR MENU"
                        : "STUDENT MENU"
                    }
                </div>

                {/* Render navigation links for the current role */}
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
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Sidebar bottom section containing the logout button */}
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

// Export Navbar for use in the application
export default Navbar;
