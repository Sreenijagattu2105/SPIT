
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    BriefcaseBusiness,
    ClipboardCheck,
    ChartNoAxesCombined,
    Bookmark,
    BookOpen,
    UserRound,
    FileText,
    Bell,
    Settings as SettingsIcon,
    LayoutDashboard,
} from "lucide-react";

function StudentDashboard() {
    const navigate = useNavigate();

    const user =
        JSON.parse(localStorage.getItem("registeredUser")) || {};

    const [applicationCount, setApplicationCount] = useState(
        JSON.parse(localStorage.getItem("startedApplications"))?.length || 0
    );

    const [savedCount, setSavedCount] = useState(
        JSON.parse(localStorage.getItem("savedOpportunities"))?.length || 0
    );

    const [profileCompletion, setProfileCompletion] = useState(0);

    // Calculate Profile Completion
    useEffect(() => {
        const currentUser =
            JSON.parse(localStorage.getItem("registeredUser")) || {};

        let score = 0;

        if (currentUser.name && currentUser.email && currentUser.phone) score += 20;
        if (currentUser.resume) score += 20;
        if (currentUser.skills) score += 20;
        if (currentUser.projects) score += 20;
        if (currentUser.certifications) score += 20;

        setProfileCompletion(score);
    }, []);

    // Refresh dashboard counts when saved data changes
    useEffect(() => {
        const updateCounts = () => {
            const applications = JSON.parse(
                localStorage.getItem("startedApplications") || "[]"
            );
            const saved = JSON.parse(
                localStorage.getItem("savedOpportunities") || "[]"
            );

            setApplicationCount(
                Array.isArray(applications) ? applications.length : 0
            );
            setSavedCount(Array.isArray(saved) ? saved.length : 0);
        };

        window.addEventListener("dashboardDataUpdated", updateCounts);
        window.addEventListener("savedOpportunitiesChange", updateCounts);
        window.addEventListener("storage", updateCounts);

        return () => {
            window.removeEventListener("dashboardDataUpdated", updateCounts);
            window.removeEventListener("savedOpportunitiesChange", updateCounts);
            window.removeEventListener("storage", updateCounts);
        };
    }, []);

    // Reusable dashboard icon
    const DashboardIcon = ({ icon: Icon }) => (
        <div className="dashboard-card-icon">
            <Icon size={34} strokeWidth={1.8} />
        </div>
    );

    return (
        <div className="student-dashboard-container">

            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1>Welcome, {user.name || "Student"}! 👋</h1>
                <p>
                    Manage your opportunities, applications and career
                    activities from one place.
                </p>
            </div>

            {/* SECTION 1: Dashboard Summary */}
            <section className="dashboard-summary-section">
                <h2 className="dashboard-section-title">
                    <LayoutDashboard size={25} className="dashboard-heading-icon" />
                    Dashboard Summary
                </h2>

                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <ClipboardCheck size={30} className="dashboard-stat-icon" />
                        <h2>{applicationCount}</h2>
                        <p>Applications</p>
                    </div>

                    <div className="dashboard-stat-card">
                        <Bookmark size={30} className="dashboard-stat-icon" />
                        <h2>{savedCount}</h2>
                        <p>Saved Opportunities</p>
                    </div>

                    <div className="dashboard-stat-card">
                        <UserRound size={30} className="dashboard-stat-icon" />
                        <h2>{profileCompletion}%</h2>
                        <p>Profile Completion</p>

                        <div className="profile-progress">
                            <div
                                className="profile-progress-bar"
                                style={{ width: `${profileCompletion}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: Dashboard Cards */}
            <section className="dashboard-main-section">
                <h2 className="dashboard-section-title">
                    <LayoutDashboard size={25} className="dashboard-heading-icon" />
                    Explore Your Dashboard
                </h2>

                <div className="dashboard-cards">

                    <div className="dashboard-card">
                        <DashboardIcon icon={BriefcaseBusiness} />
                        <h2>Find Opportunities</h2>
                        <p>
                            Explore Full Stack Development jobs,
                            internships and software development opportunities.
                        </p>
                        <Link to="/opportunities">
                            <button>Explore Opportunities</button>
                        </Link>
                    </div>

                    <div className="dashboard-card">
                        <DashboardIcon icon={ClipboardCheck} />
                        <h2>My Applications</h2>
                        <p>
                            View and track the opportunities you have
                            applied for.
                        </p>
                        <Link to="/my-applications">
                            <button>View Applications</button>
                        </Link>
                    </div>

                    <div className="dashboard-card">
                        <DashboardIcon icon={ChartNoAxesCombined} />
                        <h2>Interview Progress</h2>
                        <p>
                            Track your interview rounds and update your status
                            as you receive updates from companies.
                        </p>
                        <button onClick={() => navigate("/interview-progress")}>
                            View Interview Progress
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <DashboardIcon icon={Bookmark} />
                        <h2>Saved Opportunities</h2>
                        <p>
                            View opportunities that you have saved for later.
                        </p>
                        <Link to="/saved-opportunities">
                            <button>View Saved</button>
                        </Link>
                    </div>

                    <div className="dashboard-card">
                        <DashboardIcon icon={BookOpen} />
                        <h2>Career Resources</h2>
                        <p>
                            Access resume tips, resume templates,
                            interview preparation, HR questions,
                            technical questions and aptitude resources.
                        </p>
                        <button onClick={() => navigate("/career-resources")}>
                            View Resources
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <DashboardIcon icon={UserRound} />
                        <h2>My Profile</h2>
                        <p>
                            View and update your personal information,
                            skills and career details.
                        </p>
                        <button onClick={() => navigate("/profile")}>
                            View Profile
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <DashboardIcon icon={FileText} />
                        <h2>My Resume</h2>
                        <p>
                            Upload and manage your resume for Full Stack Development
                            internships and placement opportunities.
                        </p>
                        <button onClick={() => navigate("/resume")}>
                            View My Resume
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <DashboardIcon icon={Bell} />
                        <h2>Notifications</h2>
                        <p>
                            View important updates about opportunities
                            and your applications.
                        </p>
                        <button onClick={() => navigate("/notifications")}>
                            View Notifications
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <DashboardIcon icon={SettingsIcon} />
                        <h2>Settings</h2>
                        <p>
                            Manage your account preferences and
                            notification alerts.
                        </p>
                        <button onClick={() => navigate("/settings")}>
                            Open Settings
                        </button>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default StudentDashboard;