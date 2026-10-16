import {
    Users,
    BriefcaseBusiness,
    ClipboardCheck,
    ChartNoAxesCombined
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function readLocalData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function CoordinatorDashboard() {
    const navigate = useNavigate();
    const [search] = useState("");
    
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const [students, setStudents] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);

    const loadDashboardData = useCallback(() => {
        setStudents(readLocalData("students"));
        setOpportunities(readLocalData("opportunities"));
        setApplications(readLocalData("applications"));
        setLastUpdated(new Date());
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    useEffect(() => {
        const handleStorageChange = () => loadDashboardData();
        const handleDataChange = () => loadDashboardData();

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("dashboardDataUpdated", handleDataChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("dashboardDataUpdated", handleDataChange);
        };
    }, [loadDashboardData]);

    const internships = opportunities.filter((item) =>
        String(item.type || item.opportunityType || "").toLowerCase()
            .includes("internship")
    );

    const selectedApplications = applications.filter((item) =>
        ["selected", "placed"].includes(
            String(item.status || "").toLowerCase()
        )
    );

    const stats = [
        {
            title: "Total Students",
            count: students.length,
            description: "Registered students",
            path: "/coordinator/students"
        },
        {
            title: "Total Opportunities",
            count: opportunities.length,
            description: "Available opportunities",
            path: "/coordinator/opportunities"
        },
        {
            title: "Total Applications",
            count: applications.length,
            description: "Student applications",
            path: "/coordinator/applications"
        },
        {
            title: "Internships",
            count: internships.length,
            description: "Internship opportunities",
            path: "/coordinator/opportunities"
        }
    ];

    const actions = [
    {
        title: "Manage Students",
        description:
            "View student information and monitor placement readiness.",
        button: "View Students",
        path: "/coordinator/students",
        icon: Users
    },
    {
        title: "Manage Opportunities",
        description:
            "Add, update and remove job and internship opportunities.",
        button: "Manage Opportunities",
        path: "/coordinator/opportunities",
        icon: BriefcaseBusiness
    },
    {
        title: "Track Applications",
        description:
            "Review student applications and update their status.",
        button: "View Applications",
        path: "/coordinator/applications",
        icon: ClipboardCheck
    },
    {
        title: "Placement Reports",
        description:
            "Review placement statistics and application progress.",
        button: "View Reports",
        path: "/coordinator/reports",
        icon: ChartNoAxesCombined
    }
];
   
const filteredActions = actions.filter((action) =>
    `${action.title} ${action.description} ${action.button}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
);

   
       
return (


    <div className="coordinator-dashboard-container">

        <section className="coordinator-welcome">
            <h1>Welcome, Coordinator! 👋</h1>
            <p>
                Manage students, opportunities and placement
                activities from one place.
            </p>
        </section>

        <section className="coordinator-summary">
            <div className="coordinator-section-heading">
                <h2>Dashboard Summary</h2>
                <span className="coordinator-updated">
                    Updated: {lastUpdated.toLocaleTimeString()}
                </span>
            </div>

            <div className="coordinator-stats">
                {stats.map((stat) => (
                    <button
                        type="button"
                        className="coordinator-stat-card"
                        key={stat.title}
                        onClick={() => navigate(stat.path)}
                        title={`Open ${stat.title}`}
                    >
                        <h3>{stat.count}</h3>
                        <hr />
                        <p>{stat.title}</p>
                        <small>{stat.description}</small>
                    </button>
                ))}
            </div>
        </section>

        <section className="coordinator-summary">
            <h2 className="coordinator-centered-heading">
                Placement Snapshot
            </h2>

            <div className="coordinator-placement-snapshot">
                <div>
                    <span>Applications selected / placed</span>
                    <strong>{selectedApplications.length}</strong>
                </div>

                <div>
                    <span>Applications awaiting review</span>
                    <strong>
                        {
                            applications.filter((item) =>
                                ["pending", "applied", ""].includes(
                                    String(item.status || "").toLowerCase()
                                )
                            ).length
                        }
                    </strong>
                </div>
            </div>
        </section>

        <section className="coordinator-actions">
            <h2 className="coordinator-centered-heading">
                Explore Your Dashboard
            </h2>

            <div className="coordinator-actions-grid">
                {filteredActions.map((action) => (
                    <div
                        className="coordinator-action-card"
                        key={action.title}
                    >
                        <h3>{action.title}</h3>
                        <p>{action.description}</p>

                        <button
                            type="button"
                            onClick={() => navigate(action.path)}
                        >
                          <action.icon size={18} />   {action.button}
                        </button>
                    </div>
                ))}
            </div>
        </section>

    </div>

);

}

export default CoordinatorDashboard;
