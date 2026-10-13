

import { useEffect, useMemo, useState } from "react";

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



          const [students, setStudents] = useState(() =>

                    readLocalData("students")

          );



          const [opportunities, setOpportunities] = useState(() =>

                    readLocalData("opportunities")

          );



          const [applications, setApplications] = useState(() =>

                    readLocalData("startedApplications")

          );



          const [search, setSearch] = useState("");

          const [typeFilter, setTypeFilter] = useState("All");

          const [statusFilter, setStatusFilter] = useState("All");



          useEffect(() => {

                    function loadReportData() {

                              setStudents(readLocalData("students"));

                              setOpportunities(readLocalData("opportunities"));

                              setApplications(readLocalData("startedApplications"));

                    }



                    window.addEventListener("storage", loadReportData);

                    window.addEventListener("dashboardDataUpdated", loadReportData);



                    return () => {

                              window.removeEventListener("storage", loadReportData);

                              window.removeEventListener(

                                        "dashboardDataUpdated",

                                        loadReportData

                              );

                    };

          }, []);



          const getStatus = (application) =>

                    String(application.status || "Applied");



          const getType = (opportunity) =>

                    String(

                              opportunity.type ||

                              opportunity.opportunityType ||

                              "Job"

                    );



          const totalJobs = opportunities.filter(

                    (item) => getType(item).toLowerCase() === "job"

          ).length;



          const totalInternships = opportunities.filter(

                    (item) => getType(item).toLowerCase().includes("internship")

          ).length;



          const selectedApplications = applications.filter((item) =>
                    ["selected", "placed"].includes(
                              getStatus(item).toLowerCase()
                    )
          ).length;

          // Count each selected student only once.
          const selectedStudentKeys = new Set(
                    applications
                              .filter((item) =>
                                        ["selected", "placed"].includes(
                                                  getStatus(item).toLowerCase()
                                        )
                              )
                              .map((item) =>
                                        String(
                                                  item.studentEmail ||
                                                  item.email ||
                                                  item.studentId ||
                                                  item.studentName ||
                                                  item.name ||
                                                  ""
                                        ).trim().toLowerCase()
                              )
                              .filter(Boolean)
          );

          const selectedStudents = selectedStudentKeys.size;

          const rejectedApplications = applications.filter(

                    (item) => getStatus(item).toLowerCase() === "rejected"

          ).length;



          const pendingApplications = applications.filter((item) =>

                    ["pending", "applied", "under review"].includes(

                              getStatus(item).toLowerCase()

                    )

          ).length;



          const shortlistedApplications = applications.filter(

                    (item) => getStatus(item).toLowerCase() === "shortlisted"

          ).length;



          const selectionRate =
                    students.length > 0
                              ? ((selectedStudents / students.length) * 100).toFixed(1)
                              : "0.0";



          const statusSummary = [

                    { label: "Applied", value: applications.filter((item) => getStatus(item).toLowerCase() === "applied").length },

                    { label: "Pending", value: applications.filter((item) => getStatus(item).toLowerCase() === "pending").length },

                    { label: "Under Review", value: applications.filter((item) => getStatus(item).toLowerCase() === "under review").length },

                    { label: "Shortlisted", value: shortlistedApplications },

                    { label: "Selected", value: selectedApplications },

                    { label: "Rejected", value: rejectedApplications }

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



                              const matchesSearch = searchableText.includes(query);



                              const matchesType =

                                        typeFilter === "All" ||

                                        getType(application).toLowerCase() ===

                                                  typeFilter.toLowerCase();



                              const matchesStatus =

                                        statusFilter === "All" ||

                                        getStatus(application).toLowerCase() ===

                                                  statusFilter.toLowerCase();



                              return matchesSearch && matchesType && matchesStatus;

                    });

          }, [applications, search, typeFilter, statusFilter]);



          function refreshReport() {
                    setStudents(readLocalData("students"));
                    setOpportunities(readLocalData("opportunities"));
                    setApplications(readLocalData("startedApplications"));
                    alert("Placement report refreshed successfully.");
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



                              <section className="coordinator-welcome">

                                        <div>

                                                  <h1>Placement Reports</h1>

                                                  <p>

                                                            View placement statistics, application progress

                                                            and opportunity summaries.

                                                  </p>

                                        </div>

                              </section>



                              {/* Overall summary */}

                              <section className="coordinator-summary">

                                        <h2>Overall Summary</h2>



                                        <div className="coordinator-stats">

                                                  <div className="coordinator-stat-card">

                                                            <h3>{students.length}</h3>

                                                            <hr />

                                                            <p>Total Students</p>

                                                            <small>Registered accounts</small>

                                                  </div>



                                                  <div className="coordinator-stat-card">

                                                            <h3>{opportunities.length}</h3>

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

                                                            <h3>{applications.length}</h3>

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

                                                            <strong>{pendingApplications}</strong>

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



                                                  <select

                                                            aria-label="Filter by opportunity type"

                                                            value={typeFilter}

                                                            onChange={(event) => setTypeFilter(event.target.value)}

                                                  >

                                                            <option value="All">All Types</option>

                                                            <option value="Job">Jobs</option>

                                                            <option value="Internship">Internships</option>

                                                  </select>



                                                  <select

                                                            aria-label="Filter by application status"

                                                            value={statusFilter}

                                                            onChange={(event) => setStatusFilter(event.target.value)}

                                                  >

                                                            <option value="All">All Statuses</option>



                                                            {statusSummary.map((item) => (

                                                                      <option key={item.label} value={item.label}>

                                                                                {item.label}

                                                                      </option>

                                                            ))}

                                                  </select>

                                        </div>



                                        <p>

                                                  Showing {filteredApplications.length} of{" "}

                                                  {applications.length} applications.

                                        </p>



                                        <div className="report-actions">
                    <button type="button" onClick={refreshReport}>
                      Refresh Report
                    </button>
                    <button type="button" onClick={exportCSV}>
                      Export Report to CSV
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

                                                  Back to Dashboard

                                        </button>

                              </section>



                    </div>

          );

}



export default CoordinatorReports;
