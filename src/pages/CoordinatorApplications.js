
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const APPLICATIONS_KEY = "startedApplications";

const STATUSES = [
    "Applied",
    "Pending",
    "Under Review",
    "Shortlisted",
    "Selected",
    "Rejected"
];

function readApplications() {
    try {
        const data = JSON.parse(
            localStorage.getItem(APPLICATIONS_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function CoordinatorApplications() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState(readApplications);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        function loadApplications() {
            setApplications(readApplications());
        }

        window.addEventListener("storage", loadApplications);
        window.addEventListener("dashboardDataUpdated", loadApplications);

        return () => {
            window.removeEventListener("storage", loadApplications);
            window.removeEventListener(
                "dashboardDataUpdated",
                loadApplications
            );
        };
    }, []);

    const filteredApplications = useMemo(() => {
        const query = search.trim().toLowerCase();

        return applications.filter((application) => {
            const searchableText = [
                application.studentName,
                application.name,
                application.studentEmail,
                application.email,
                application.title,
                application.company,
                application.location
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const status = String(application.status || "Applied");

            return (
                searchableText.includes(query) &&
                (statusFilter === "All" || status === statusFilter)
            );
        });
    }, [applications, search, statusFilter]);

    function getStatus(application) {
        const status = String(application.status || "Applied");

        return STATUSES.includes(status) ? status : "Applied";
    }

    return (
        <div className="coordinator-dashboard-container">
            <section className="coordinator-welcome">
                <div>
                    <h1>Track Applications</h1>
                    <p>
                        Monitor student applications and view the latest
                        status reported by each student.
                    </p>
                </div>
            </section>

            <section className="coordinator-summary">
                <h2>Application Summary</h2>

                <div className="coordinator-stats">
                    <div className="coordinator-stat-card">
                        <h3>{applications.length}</h3>
                        <hr />
                        <p>Total Applications</p>
                    </div>

                    <div className="coordinator-stat-card">
                        <h3>
                            {applications.filter((item) =>
                                ["selected", "placed"].includes(
                                    String(item.status || "").toLowerCase()
                                )
                            ).length}
                        </h3>
                        <hr />
                        <p>Selected / Placed</p>
                    </div>

                    <div className="coordinator-stat-card">
                        <h3>
                            {applications.filter((item) =>
                                ["pending", "applied", "under review"].includes(
                                    String(item.status || "Applied").toLowerCase()
                                )
                            ).length}
                        </h3>
                        <hr />
                        <p>In Progress</p>
                    </div>
                </div>
            </section>

            <section className="coordinator-summary">
                <h2>Student Applications</h2>

                <div className="opportunity-toolbar">
                    <input
                        type="search"
                        placeholder="Search student, email, company or role..."
                        aria-label="Search applications"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <select
                        aria-label="Filter by application status"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                    >
                        <option value="All">All Statuses</option>

                        {STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {filteredApplications.length === 0 ? (
                    <p>
                        {applications.length === 0
                            ? "No applications have been recorded yet."
                            : "No applications match your search or filter."}
                    </p>
                ) : (
                    <div className="opportunity-table-wrapper">
                        <table className="opportunity-management-table">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Student</th>
                                    <th>Email</th>
                                    <th>Opportunity</th>
                                    <th>Company</th>
                                    <th>Applied Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredApplications.map(
                                    (application, index) => (
                                        <tr
                                            key={
                                                application.applicationId ||
                                                `${application.studentEmail || application.email || "student"}-${application.title || "opportunity"}-${index}`
                                            }
                                        >
                                            <td>{index + 1}</td>

                                            <td>
                                                {application.studentName ||
                                                    application.name ||
                                                    "Student name unavailable"}
                                            </td>

                                            <td>
                                                {application.studentEmail ||
                                                    application.email ||
                                                    "Not provided"}
                                            </td>

                                            <td>
                                                {application.title ||
                                                    "Opportunity unavailable"}
                                            </td>

                                            <td>
                                                {application.company ||
                                                    "Not provided"}
                                            </td>

                                            <td>
                                                {application.appliedDate ||
                                                    "Not recorded"}
                                            </td>

                                            <td>
                                                <span
                                                    className="application-status"
                                                    data-status={getStatus(application)
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "-")}
                                                >
                                                    {getStatus(application)}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="coordinator-back-section">
                <button
                    type="button"
                    onClick={() => navigate("/coordinator-dashboard")}
                >
                    Back to Dashboard
                </button>
            </section>
        </div>
    );
}

export default CoordinatorApplications;
