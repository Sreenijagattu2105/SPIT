import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    "http://localhost:8080/spit-backend/api/coordinator/applications";

const STATUSES = [
    "Applied",
    "In Progress",
    "Shortlisted",
    "Selected",
    "Rejected",
    "Withdrawn"
];

// Convert database application statuses into readable labels.
function formatStatus(databaseStatus) {
    const status = String(databaseStatus || "APPLIED")
        .toUpperCase()
        .replace(/\s+/g, "_");

    const statusMap = {
        APPLIED: "Applied",
        IN_PROGRESS: "In Progress",
        SHORTLISTED: "Shortlisted",
        SELECTED: "Selected",
        REJECTED: "Rejected",
        WITHDRAWN: "Withdrawn"
    };

    return statusMap[status] || "Applied";
}

function formatAppliedDate(value) {
    if (value === null || value === undefined || value === "") {
        return "Not recorded";
    }

    let date;

    if (typeof value === "number") {
        // Spring/Jackson may serialize a SQL timestamp as milliseconds.
        date = new Date(value);
    } else {
        date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
        return "Not recorded";
    }

    return date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
}

function CoordinatorApplications() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadApplications() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(API_URL, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(
                        `Unable to load applications (${response.status}).`
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error(
                        "The server returned an unexpected applications response."
                    );
                }

                const normalizedApplications = data.map((item) => ({
                    ...item,
                    applicationId: item.applicationId,
                    studentName: item.studentName,
                    studentEmail: item.studentEmail,
                    title: item.title,
                    company: item.company,
                    appliedDate: formatAppliedDate(item.appliedDate),
                    status: formatStatus(item.status)
                }));

                if (!cancelled) {
                    setApplications(normalizedApplications);
                }
            } catch (err) {
                console.error("Applications loading error:", err);

                if (!cancelled) {
                    setError(
                        err.message ||
                        "Unable to load student applications."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadApplications();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredApplications = useMemo(() => {
        const query = search.trim().toLowerCase();

        return applications.filter((application) => {
            const searchableText = [
                application.studentName,
                application.studentEmail,
                application.title,
                application.company
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                searchableText.includes(query) &&
                (statusFilter === "All" ||
                    application.status === statusFilter)
            );
        });
    }, [applications, search, statusFilter]);

    // Count applications marked as selected.
    const selectedApplications = applications.filter((item) =>
        ["Selected"].includes(item.status)
    ).length;

    // Count applications that are still progressing.
    const inProgressApplications = applications.filter((item) =>
        ["Applied", "In Progress", "Shortlisted"].includes(
            item.status
        )
    ).length;

    return (
        <div className="coordinator-dashboard-container">
            <div className="coordinator-page-heading">
                <h1>TRACK APPLICATIONS</h1>
            </div>

            <section className="coordinator-welcome">
                <p>
                    Monitor student applications and view the latest
                    status reported by each student.
                </p>
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
                        <h3>{selectedApplications}</h3>
                        <hr />
                        <p>Selected / Placed</p>
                    </div>

                    <div className="coordinator-stat-card">
                        <h3>{inProgressApplications}</h3>
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

                {loading ? (
                    <p>Loading student applications...</p>
                ) : error ? (
                    <p role="alert">{error}</p>
                ) : filteredApplications.length === 0 ? (
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
                                        <tr key={application.applicationId}>
                                            <td>{index + 1}</td>

                                            <td>
                                                {application.studentName ||
                                                    "Student name unavailable"}
                                            </td>

                                            <td>
                                                {application.studentEmail ||
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

                                            <td>{application.appliedDate}</td>

                                            <td>
                                                <span
                                                    className="application-status"
                                                    data-status={application.status
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "-")}
                                                >
                                                    {application.status}
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
                    <ChevronLeft size={18} /> Back to Dashboard
                </button>
            </section>
        </div>
    );
}

export default CoordinatorApplications;