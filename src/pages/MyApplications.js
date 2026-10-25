import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Trash2 } from "lucide-react";

function getCurrentStudentEmail() {
    try {
        const user = JSON.parse(
            localStorage.getItem("currentUser") || "null"
        );

        return String(user?.email || "").trim().toLowerCase();
    } catch {
        return "";
    }
}

function MyApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");


    useEffect(() => {
        let active = true;

        async function loadApplications() {
            try {
                setLoadError("");

                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/student/applications",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load applications."
                    );
                }

                if (active) {
                    const loadedApplications = data.map((item) => ({
                        ...item,
                        id: item.id ?? item.opportunity_id,
                        applicationId: item.applicationId ?? item.application_id,
                        company: item.company ?? item.company_name ?? "",
                        type:
                            String(item.type ?? "").toUpperCase() === "JOB"
                                ? "Job"
                                : "Internship",

                        appliedDate: item.appliedAt
                            ? new Date(item.appliedAt).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            )
                            : "Not recorded",
                    }));

                    setApplications(loadedApplications);
                }
            } catch (error) {
                if (active) {
                    setLoadError(error.message || "Unable to load applications.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadApplications();

        return () => {
            active = false;
        };
    }, []);


    async function handleRemove(index) {
        const confirmed = window.confirm(
            "Are you sure you want to remove this application?"
        );

        if (!confirmed) return;

        const application = applications[index];
        if (!application) return;

        if (!application.applicationId) {
            alert("Application ID is missing. Please refresh the page.");
            return;
        }

        const email = getCurrentStudentEmail();

        try {
            const response = await fetch(
                `http://localhost:8080/spit-backend/api/student/applications/${application.applicationId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to remove application."
                );
            }

            // Remove the application from the visible list.
            setApplications(previous =>
                previous.filter(
                    item =>
                        String(item.applicationId) !==
                        String(application.applicationId)
                )
            );



            // Remove its related interview-progress record for this student.
            try {
                const storedProgress = JSON.parse(
                    localStorage.getItem("interviewProgress") || "[]"
                );

                const allProgress = Array.isArray(storedProgress)
                    ? storedProgress
                    : [];

                const updatedProgress = allProgress.filter(item => {
                    const sameStudent =
                        String(item.studentEmail || "")
                            .trim()
                            .toLowerCase() === email;

                    const sameApplication =
                        (
                            item.applicationId != null &&
                            String(item.applicationId) === String(application.id)
                        ) ||
                        (
                            item.applicationKey ===
                            [
                                email,
                                String(application.id || ""),
                                String(application.company || ""),
                                String(application.title || "")
                            ].join("|")
                        );

                    return !(sameStudent && sameApplication);
                });

                localStorage.setItem(
                    "interviewProgress",
                    JSON.stringify(updatedProgress)
                );
            } catch (error) {
                console.error(
                    "Could not remove related interview progress:",
                    error
                );
            }

            // Notify the student unless deletion notifications are disabled.
            try {
                let preferences = {};

                try {
                    preferences = JSON.parse(
                        localStorage.getItem(`studentSettings:${email}`) || "{}"
                    ) || {};
                } catch {
                    preferences = {};
                }

                if (preferences.applicationDeleted !== false) {
                    const storedNotifications = JSON.parse(
                        localStorage.getItem("notifications") || "[]"
                    );

                    const notifications = Array.isArray(storedNotifications)
                        ? storedNotifications
                        : [];

                    const notification = {
                        id: `application-deleted-${Date.now()}-${email}`,
                        studentEmail: email,
                        message: `Application removed: Your application for ${application.title || "an opportunity"} at ${application.company || "the company"} was removed from My Applications.`,
                        date: new Date().toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }),
                        read: false,
                        type: "application-deleted",
                        opportunityId: application.id ?? null
                    };

                    localStorage.setItem(
                        "notifications",
                        JSON.stringify([notification, ...notifications])
                    );

                    window.dispatchEvent(new Event("notificationsChange"));
                }
            } catch (error) {
                console.error(
                    "Could not create application deletion notification:",
                    error
                );
            }

            window.dispatchEvent(new Event("dashboardDataUpdated"));

            alert("Application removed successfully!");
        } catch (error) {
            alert(error.message || "Could not remove application.");
        }
    }





    return (
        <div className="my-applications-container">
            <h1>MY APPLICATIONS</h1>

            <p>
                Track your applications and update their current status.
            </p>

            {loading ? (
                <p>Loading your applications...</p>
            ) : loadError ? (
                <div className="alert alert-danger">{loadError}</div>
            ) : applications.length === 0 ? (
                <div className="application-empty">
                    <p>
                        You have not applied for any opportunities yet.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/opportunities")}
                    >
                        Explore Opportunities
                    </button>
                </div>
            ) : (
                <div className="application-list">
                    {applications.map((application, index) => (
                        <div
                            className="application-card"
                            key={
                                application.applicationId ||
                                `${application.id || application.title}-${index}`
                            }
                        >
                            <h2>
                                {application.title || "Untitled Opportunity"}
                            </h2>

                            <p>
                                <strong>Company:</strong>{" "}
                                {application.company || "Not provided"}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {application.location || "Not provided"}
                            </p>

                            <p>
                                <strong>Type:</strong>{" "}
                                {application.type || "Not provided"}
                            </p>

                            <p>
                                <strong>Deadline:</strong>{" "}
                                {application.deadline || "Not specified"}
                            </p>

                            <p>
                                <strong>Applied Date:</strong>{" "}
                                {application.appliedDate || "Not recorded"}
                            </p>



                            <div className="application-card-actions">
                                {application.companyWebsite && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                application.companyWebsite,
                                                "_blank",
                                                "noopener,noreferrer"
                                            )
                                        }
                                    >
                                        <ExternalLink size={18} />
                                        Visit Website
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    title="Remove application"
                                    aria-label="Remove application"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}

export default MyApplications;
