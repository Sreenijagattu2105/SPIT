// Import icons used by the reports page.
import { RefreshCw, Download, ChevronLeft } from "lucide-react";

// Import React hooks.
import { useEffect, useMemo, useState } from "react";

// Import navigation.
import { useNavigate } from "react-router-dom";

function readLocalData(key) {

    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function CoordinatorReports() {

    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [reportStats, setReportStats] = useState({
        totalStudents: 0,
        totalOpportunities: 0,
        totalJobs: 0,
        totalInternships: 0,
        totalApplications: 0,
        selectedStudents: 0
    });

    useEffect(() => {
        async function loadReportData() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/coordinator/applications",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Unable to load applications (${response.status}).`
                    );
                }

                const data = await response.json();

                // Fetch placement report statistics from the backend
                const statsResponse = await fetch(
                    "http://localhost:8080/spit-backend/api/coordinator/placement-report-stats",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!statsResponse.ok) {
                    throw new Error(
                        `Unable to load placement statistics (${statsResponse.status}).`
                    );
                }

                const stats = await statsResponse.json();
                setReportStats(stats);

                const reportApplications = data.map((item) => ({
                    ...item,
                    status: String(item.status || "APPLIED"),
                    type: item.opportunityType || item.type || "Job"
                }));

                setApplications(reportApplications);


                // Derive unique students and opportunities from the
                // applications returned by the backend.
                setStudents(
                    [...new Set(
                        reportApplications
                            .map((item) => item.studentEmail || item.studentId)
                            .filter(Boolean)
                    )]
                );

                setOpportunities(
                    [...new Set(
                        reportApplications
                            .map((item) => item.opportunityId)
                            .filter(Boolean)
                    )]
                );
            } catch (err) {
                console.error("Placement report error:", err);
                setError(err.message || "Unable to load placement report.");
            } finally {
                setLoading(false);
            }
        }

        loadReportData();
    }, []);

    const getStatus = (application) =>

        String(application.status || "Applied");

    const getType = (opportunity) =>

        String(

            opportunity.type ||

            opportunity.opportunityType ||

            "Job"

        );

    const totalJobs = reportStats.totalJobs;
    const totalInternships = reportStats.totalInternships;

    const selectedStudents = reportStats.selectedStudents;

    const rejectedApplications = applications.filter(

        (item) => getStatus(item).toLowerCase() === "rejected"

    ).length;


    const inProgressApplications = applications.filter(
        (item) => getStatus(item).toLowerCase() === "in_progress"
    ).length;


    const shortlistedApplications = applications.filter(

        (item) => getStatus(item).toLowerCase() === "shortlisted"

    ).length;

    const selectionRate =
        students.length > 0
            ? ((selectedStudents / students.length) * 100).toFixed(1)
            : "0.0";
    const selectedApplications = applications.filter(
        (item) => getStatus(item).toUpperCase() === "SELECTED"
    ).length;

    const statusSummary = [
        {
            label: "Applied",
            value: applications.filter(
                (item) => getStatus(item).toLowerCase() === "applied"
            ).length
        },
        {
            label: "In Progress",
            value: inProgressApplications
        },
        {
            label: "Shortlisted",
            value: shortlistedApplications
        },
        {
            label: "Selected",
            value: selectedApplications
        },
        {
            label: "Rejected",
            value: rejectedApplications
        },
        {
            label: "Withdrawn",
            value: applications.filter(
                (item) => getStatus(item).toLowerCase() === "withdrawn"
            ).length
        }
    ];

    const filteredApplications = useMemo(() => {
        const query = search.trim().toLowerCase();

        return applications.filter((application) => {
            const searchableText = [
                application.studentName,
                application.name,
                application.studentEmail,
                application.email,
                application.title,
                application.company
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [applications, search]);

    function refreshReport() {
        window.location.reload();
    }

    function exportCSV() {

        const headers = [

            "Student Name",

            "Student Email",

            "Opportunity",

            "Company",

            "Type",

            "Applied Date",

            "Status"

        ];

        const rows = filteredApplications.map((item) => [

            item.studentName || item.name || "",

            item.studentEmail || item.email || "",

            item.title || "",

            item.company || "",

            getType(item),

            item.appliedDate || "",

            getStatus(item)

        ]);

        const escapeCSV = (value) =>

            `"${String(value).replace(/"/g, '""')}"`;

        const csvContent = [

            headers.map(escapeCSV).join(","),

            ...rows.map((row) => row.map(escapeCSV).join(","))

        ].join("\r\n");

        const blob = new Blob(["\uFEFF" + csvContent], {

            type: "text/csv;charset=utf-8;"

        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "SPIT_Placement_Report.csv";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    }

    return (

        <div className="coordinator-dashboard-container">

            {loading && <p>Loading placement report...</p>}

            {error && (
                <p role="alert" style={{ color: "red" }}>
                    {error}
                </p>
            )}
            <div className="coordinator-page-heading">

                <h1>PLACEMENT REPORTS</h1>
            </div>
            <section className="coordinator-welcome">

                <p>

                    View placement statistics, application progress

                    and opportunity summaries.

                </p>
            </section>
            {/* Overall summary */}

            <section className="coordinator-summary">

                <h2>Overall Summary</h2>

                <div className="coordinator-stats">

                    <div className="coordinator-stat-card">

                        <h3>{reportStats.totalStudents}</h3>

                        <hr />

                        <p>Total Students</p>

                        <small>Students who applied</small>

                    </div>

                    <div className="coordinator-stat-card">

                        <h3>{reportStats.totalOpportunities}</h3>

                        <hr />

                        <p>Total Opportunities</p>

                        <small>Available listings</small>

                    </div>

                    <div className="coordinator-stat-card">

                        <h3>{totalJobs}</h3>

                        <hr />

                        <p>Jobs</p>

                        <small>Job opportunities</small>

                    </div>

                    <div className="coordinator-stat-card">

                        <h3>{totalInternships}</h3>

                        <hr />

                        <p>Internships</p>

                        <small>Internship opportunities</small>

                    </div>



                    <div className="coordinator-stat-card">

                        <h3>{reportStats.totalApplications}</h3>

                        <hr />

                        <p>Total Applications</p>

                        <small>Recorded applications</small>

                    </div>



                    <div className="coordinator-stat-card">

                        <h3>{selectedStudents}</h3>

                        <hr />

                        <p>Selected / Placed</p>

                        <small>Unique students marked selected / placed</small>

                    </div>

                </div>

            </section>



            {/* Application status summary */}

            <section className="coordinator-summary">

                <h2>Application Status Report</h2>



                <div className="coordinator-placement-snapshot">

                    <div>

                        <span>Selection Rate</span>

                        <strong>{selectionRate}%</strong>

                        <small>

                            Selected / placed applications divided by

                            all recorded applications

                        </small>

                    </div>



                    <div>

                        <span>Applications In Progress</span>

                        <strong>{inProgressApplications}</strong>

                    </div>



                    <div>

                        <span>Shortlisted</span>

                        <strong>{shortlistedApplications}</strong>

                    </div>



                    <div>

                        <span>Rejected</span>

                        <strong>{rejectedApplications}</strong>

                    </div>

                </div>



                <div className="opportunity-table-wrapper">

                    <table className="opportunity-management-table">

                        <thead>

                            <tr>

                                <th>Application Status</th>

                                <th>Number of Applications</th>

                            </tr>

                        </thead>



                        <tbody>

                            {statusSummary.map((item) => (

                                <tr key={item.label}>

                                    <td>{item.label}</td>

                                    <td>{item.value}</td>

                                </tr>

                            ))}



                            <tr>

                                <th>Total</th>

                                <th>{applications.length}</th>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </section>



            {/* Detailed report */}

            <section className="coordinator-summary">

                <h2>Detailed Application Report</h2>



                <div className="opportunity-toolbar">

                    <input

                        type="search"

                        placeholder="Search student, email, company or role..."

                        aria-label="Search placement report"

                        value={search}

                        onChange={(event) => setSearch(event.target.value)}

                    />









                </div>



                <p>

                    Showing {filteredApplications.length} of{" "}

                    {applications.length} applications.

                </p>



                <div className="report-actions">
                    <button type="button" onClick={refreshReport}>
                        <RefreshCw size={18} />  Refresh Report
                    </button>
                    <button type="button" onClick={exportCSV}>
                        <Download size={18} /> Export Report to CSV
                    </button>
                </div>



                {filteredApplications.length === 0 ? (

                    <p>No applications match the selected filters.</p>

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

                                    <th>Type</th>

                                    <th>Applied Date</th>

                                    <th>Status</th>

                                </tr>

                            </thead>



                            <tbody>

                                {filteredApplications.map((item, index) => (

                                    <tr

                                        key={

                                            item.applicationId ||

                                            `${item.studentEmail || item.email || "student"}-${item.title || "opportunity"}-${index}`

                                        }

                                    >

                                        <td>{index + 1}</td>

                                        <td>

                                            {item.studentName ||

                                                item.name ||

                                                "Not provided"}

                                        </td>

                                        <td>

                                            {item.studentEmail ||

                                                item.email ||

                                                "Not provided"}

                                        </td>

                                        <td>{item.title || "Not provided"}</td>

                                        <td>{item.company || "Not provided"}</td>

                                        <td>{getType(item)}</td>

                                        <td>

                                            {item.appliedDate || "Not recorded"}

                                        </td>

                                        <td>{getStatus(item)}</td>

                                    </tr>

                                ))}

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

export default CoordinatorReports;
