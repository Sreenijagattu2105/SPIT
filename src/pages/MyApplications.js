import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Trash2 } from "lucide-react";
const STORAGE_KEY = "startedApplications";

const STATUSES = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Selected",
    "Rejected"
];

function readApplications() {
    try {
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function addCoordinatorNotification(notification) {
    try {
        const stored = JSON.parse(
            localStorage.getItem("coordinatorNotifications") || "[]"
        );
        const notifications = Array.isArray(stored) ? stored : [];

        localStorage.setItem(
            "coordinatorNotifications",
            JSON.stringify([notification, ...notifications])
        );

        window.dispatchEvent(
            new Event("coordinatorNotificationsChange")
        );
    } catch (error) {
        console.error("Could not save coordinator notification:", error);
    }
}

function MyApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState(readApplications);

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

    function handleStatusChange(index, newStatus) {
        const application = applications[index];
        if (!application) return;

        const previousStatus = application.status || "Applied";
        if (previousStatus === newStatus) return;

        const updatedApplications = applications.map(
            (item, applicationIndex) =>
                applicationIndex === index
                    ? { ...item, status: newStatus }
                    : item
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedApplications)
        );
        localStorage.setItem(
            "applications",
            JSON.stringify(updatedApplications)
        );

        setApplications(updatedApplications);

        const date = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        addCoordinatorNotification({
            id: Date.now(),
            message: `${application.studentName || "A student"} updated the application status for ${application.title || "an opportunity"} at ${application.company || "the company"} from "${previousStatus}" to "${newStatus}".`,
            date,
            read: false,
            type: "application-status-update",
            opportunityId: application.id,
            studentEmail: application.studentEmail || ""
        });

        window.dispatchEvent(new Event("dashboardDataUpdated"));
        alert(`Application status updated to "${newStatus}" successfully!`);
    }

    function handleRemove(index) {
        const confirmed = window.confirm(
            "Are you sure you want to remove this application from your list?"
        );

        if (!confirmed) return;

        const updatedApplications = applications.filter(
            (_, applicationIndex) => applicationIndex !== index
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedApplications)
        );
        localStorage.setItem(
            "applications",
            JSON.stringify(updatedApplications)
        );

        setApplications(updatedApplications);
        window.dispatchEvent(new Event("dashboardDataUpdated"));
    }

    return (
        <div className="my-applications-container">
            <h1>MY APPLICATIONS</h1>

            <p>
                Track your applications and update their current status.
            </p>

            {applications.length === 0 ? (
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
                            <h2>{application.title || "Untitled Opportunity"}</h2>

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

                            <label>
                                <strong>Application Status:</strong>

                                <select
                                    value={
                                        STATUSES.includes(application.status)
                                            ? application.status
                                            : "Applied"
                                    }
                                    onChange={(event) =>
                                        handleStatusChange(
                                            index,
                                            event.target.value
                                        )
                                    }
                                >
                                    {STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </label>

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
            Visit Company Website
        </button>
    )}

    <button
        type="button"
        onClick={() => handleRemove(index)}
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
