import {

    useLocation,

    useNavigate,

    useSearchParams

} from "react-router-dom";
import {
    GraduationCap,  ExternalLink,
    CheckCircle,
    Check
} from "lucide-react";
import { useState, useEffect, useRef } from "react";




function getStoredArray(key) {

    try {

        const data = JSON.parse(localStorage.getItem(key) || "[]");

        return Array.isArray(data) ? data : [];

    } catch {

        return [];

    }

}

function isOpportunityExpired(deadline) {
    if (!deadline) return false;

    // Expected format: YYYY-MM-DD
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
        String(deadline).trim()
    );

    // Do not silently treat an invalid date as an expired opportunity.
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const deadlineEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

    // Reject impossible dates such as 2026-02-31.
    if (
        deadlineEnd.getFullYear() !== year ||
        deadlineEnd.getMonth() !== month - 1 ||
        deadlineEnd.getDate() !== day
    ) {
        return false;
    }

    return Date.now() > deadlineEnd.getTime();
}
// ==========================================
// FETCH PUBLISHED OPPORTUNITIES FROM BACKEND
// Loads opportunities from the Spring MVC API
// and normalizes field names for the frontend.
// ==========================================

async function getPublishedOpportunities() {
    const response = await fetch(
        "http://localhost:8080/spit-backend/api/student/opportunities",
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load opportunity details."
        );
    }

    if (!Array.isArray(data)) {
        throw new Error("Invalid opportunities response from backend.");
    }

    return data.map((item) => ({
        ...item,
        id: item.id ?? item.opportunity_id,
        company: item.company ?? item.company_name ?? "",
        companyDescription:
            item.companyDescription ?? item.company_description ?? "",
        description:
            item.description ?? item.job_description ?? "",
        jobDescription:
            item.jobDescription ?? item.job_description ?? item.description ?? "",
        type:
            (item.type ?? item.opportunity_type ?? "").toUpperCase() === "JOB"
                ? "Job"
                : "Internship",
        salaryStipend:
            item.salaryStipend ?? item.salary_stipend ?? "",
        companyWebsite:
            item.companyWebsite ?? item.company_website ?? "",
    }));
}
function OpportunityDetails() {

    const location = useLocation();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();




    // ==========================================
    // OPPORTUNITY STATE
    // Stores the opportunity displayed on this page.
    // ==========================================

    const sharedId = searchParams.get("id");

    const stateOpportunity = location.state?.opportunity;

    const [opportunity, setOpportunity] = useState(
        sharedId ? null : stateOpportunity || null
    );

    const [isOpportunityLoading, setIsOpportunityLoading] = useState(
        Boolean(sharedId)
    );

    const [opportunityLoadError, setOpportunityLoadError] = useState("");


    // ==========================================
    // LOAD THE OPPORTUNITY
    // If a shared ID exists, fetch the opportunity
    // from the backend instead of relying on localStorage.
    // ==========================================

    useEffect(() => {
        let isActive = true;

        const loadOpportunity = async () => {
            if (!sharedId) {
                setOpportunity(stateOpportunity || null);
                setIsOpportunityLoading(false);
                setOpportunityLoadError("");
                return;
            }

            setIsOpportunityLoading(true);
            setOpportunityLoadError("");

            try {
                const publishedOpportunities =
                    await getPublishedOpportunities();

                const matchedOpportunity = publishedOpportunities.find(
                    (item) => String(item.id) === String(sharedId)
                );

                if (!matchedOpportunity) {
                    throw new Error(
                        "This opportunity was not found or is no longer published."
                    );
                }

                if (isActive) {
                    setOpportunity(matchedOpportunity);
                }
            } catch (error) {
                if (isActive) {
                    setOpportunity(null);
                    setOpportunityLoadError(error.message);
                }
            } finally {
                if (isActive) {
                    setIsOpportunityLoading(false);
                }
            }
        };

        loadOpportunity();

        return () => {
            isActive = false;
        };
    }, [sharedId, stateOpportunity]);


    const isStudent =

        localStorage.getItem("isLoggedIn") === "true" &&

        localStorage.getItem("userRole") === "student";

    const opportunityId = opportunity?.id;
    const isExpired = isOpportunityExpired(opportunity?.deadline);


    const [isApplied, setIsApplied] = useState(false);


    useEffect(() => {
        if (!opportunity?.id) {
            setIsApplied(false);
            return;
        }

        let cancelled = false;

        const checkApplicationStatus = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/student/applications",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to check application status.");
                }

                const applications = await response.json();

                const alreadyApplied = Array.isArray(applications) &&
                    applications.some((application) =>
                        String(application.id) === String(opportunity.id)
                    );

                if (!cancelled) {
                    setIsApplied(alreadyApplied);
                }
            } catch (error) {
                console.error("Error checking application status:", error);

                // Keep the existing localStorage check as a fallback.
                let currentUser = {};

                try {
                    currentUser = JSON.parse(
                        localStorage.getItem("currentUser") || "{}"
                    );
                } catch {
                    currentUser = {};
                }

                const email = String(currentUser.email || "")
                    .trim()
                    .toLowerCase();

                const alreadyApplied = getStoredArray("startedApplications").some(
                    (application) =>
                        String(application.studentEmail || "")
                            .trim()
                            .toLowerCase() === email &&
                        String(application.id) === String(opportunity.id)
                );

                if (!cancelled) {
                    setIsApplied(alreadyApplied);
                }
            }
        };

        checkApplicationStatus();

        return () => {
            cancelled = true;
        };
    }, [opportunity?.id]);




    // Never enable the button just because an old session value exists.

    const [hasVisitedOfficialPage, setHasVisitedOfficialPage] =

        useState(false);

    // Tracks whether the SPIT tab was actually hidden after opening

    // the external website.

    const wasHiddenRef = useRef(false);

    // Detect when the student returns to the SPIT tab.

    useEffect(() => {

        if (!opportunityId) return;

        const key = `visitedOpportunity_${opportunityId}`;

        wasHiddenRef.current = false;

        const handleVisibilityChange = () => {

            if (document.visibilityState === "hidden") {

                wasHiddenRef.current = true;

                return;

            }

            if (

                document.visibilityState === "visible" &&

                wasHiddenRef.current &&

                sessionStorage.getItem(key) === "pending"

            ) {

                sessionStorage.setItem(key, "returned");

                setHasVisitedOfficialPage(true);

                wasHiddenRef.current = false;

            }

        };

        const handleWindowFocus = () => {

            if (

                wasHiddenRef.current &&

                document.visibilityState === "visible" &&

                sessionStorage.getItem(key) === "pending"

            ) {

                sessionStorage.setItem(key, "returned");

                setHasVisitedOfficialPage(true);

                wasHiddenRef.current = false;

            }

        };

        document.addEventListener(

            "visibilitychange",

            handleVisibilityChange

        );

        window.addEventListener("focus", handleWindowFocus);

        return () => {

            document.removeEventListener(

                "visibilitychange",

                handleVisibilityChange

            );

            window.removeEventListener("focus", handleWindowFocus);

        };

    }, [opportunityId]);
    // Show loading while fetching the opportunity from the backend
    if (isOpportunityLoading) {
        return (
            <div className="container mt-5 text-center">
                <h4>Loading Opportunity...</h4>
            </div>
        );
    }

    // Show an error if the opportunity could not be loaded
    if (!opportunity) {
        return (
            <div className="container mt-5 text-center">
                <h4>Opportunity Not Found</h4>

                <p>
                    {opportunityLoadError ||
                        "This opportunity could not be found."}
                </p>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const skillsText = Array.isArray(opportunity.skills)

        ? opportunity.skills.join(", ")

        : opportunity.skills || "Not specified";

    const officialWebsite = String(

        opportunity.companyWebsite || ""

    ).trim();

    const handleOpenOfficialPage = () => {

        if (!officialWebsite) {
            if (isOpportunityExpired(opportunity?.deadline)) {
                alert("This opportunity has expired. You can no longer start a new application.");
                return;
            }

            alert(

                "The coordinator has not added an official application URL."

            );

            return;

        }

        let url;

        try {

            url = new URL(officialWebsite);

            if (!["https:", "http:"].includes(url.protocol)) {

                throw new Error("Invalid URL");

            }

        } catch {

            alert("Please enter a valid official application URL.");

            return;

        }

        // Clear any old visit state before attempting to open the link.

        const key = `visitedOpportunity_${opportunityId}`;

        sessionStorage.removeItem(key);

        setHasVisitedOfficialPage(false);

        wasHiddenRef.current = false;

        // Open the company website in a new tab.

        const newTab = window.open(url.href, "_blank");

        if (!newTab) {

            alert(

                "The application page was blocked. Allow pop-ups for SPIT and try again."

            );

            return;

        }

        // Prevent the external page from accessing the SPIT window.

        try {

            newTab.opener = null;

        } catch {

            // The browser may already have restricted access.

        }

        // Wait until the SPIT tab is hidden and becomes visible again.

        sessionStorage.setItem(key, "pending");

    };

    const handleApplied = async () => {
        if (isOpportunityExpired(opportunity?.deadline)) {
            alert("This opportunity has expired. You cannot record a new application.");
            return;
        }
        if (isApplied) return;

        if (!hasVisitedOfficialPage) {

            alert(

                "Please open the official application page in a new tab and return to SPIT first."

            );

            return;

        }


        const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}"
        );

        const studentEmail = String(currentUser.email || "")
            .trim()
            .toLowerCase();

        if (!studentEmail) {
            alert("Please log in again to record your application.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/student/applications",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        opportunityId: opportunityId,
                    }),
                }
            );

            const data = await response.json();

            if (response.status === 409) {
                setIsApplied(true);
                alert("This application is already recorded.");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Could not record the application."
                );
            }
        } catch (error) {
            console.error("Error recording application:", error);
            alert(error.message || "Unable to record the application.");
            return;
        }


        const newApplication = {
            ...opportunity,
            studentName:
                currentUser.name ||
                currentUser.fullName ||
                "Student name unavailable",
            studentEmail: studentEmail,
            status: "Applied",
            appliedDate: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        };


        // Notify the coordinator only if the preference is enabled.
        let coordinatorPreferences = {};

        try {
            coordinatorPreferences = JSON.parse(
                localStorage.getItem(
                    "coordinatorNotificationPreferences"
                ) || "{}"
            ) || {};
        } catch {
            coordinatorPreferences = {};
        }

        // Default to enabled if no preference has been saved.
        if (coordinatorPreferences.newApplications !== false) {
            const coordinatorNotifications = getStoredArray(
                "coordinatorNotifications"
            );

            const coordinatorNotification = {
                id: Date.now(),
                message: `${newApplication.studentName} (${newApplication.studentEmail || "Email unavailable"}) recorded an application for ${opportunity.title || "an opportunity"} at ${opportunity.company || "a company"}.`,
                date: new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }),
                read: false,
                type: "new-application",
                opportunityId: opportunity.id
            };

            localStorage.setItem(
                "coordinatorNotifications",
                JSON.stringify([
                    coordinatorNotification,
                    ...coordinatorNotifications
                ])
            );

            window.dispatchEvent(
                new Event("coordinatorNotificationsChange")
            );
        }






        // Create a student notification only if the preference is enabled.
        let studentPreferences = {};

        try {
            studentPreferences = JSON.parse(
                localStorage.getItem(`studentSettings:${studentEmail}`) || "{}"
            ) || {};
        } catch {
            studentPreferences = {};
        }

        // Default to enabled when no preference has been saved.
        if (studentPreferences.applicationAdded !== false) {
            const existingNotifications =
                getStoredArray("notifications");

            const newNotification = {
                id: Date.now(),
                studentEmail: studentEmail,
                message: `Application Added: You marked the ${opportunity.title} opportunity at ${opportunity.company} as applied.`,
                date: new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }),
                read: false,
                type: "application-added",
                opportunityId: opportunity.id
            };

            localStorage.setItem(
                "notifications",
                JSON.stringify([
                    newNotification,
                    ...existingNotifications
                ])
            );

            window.dispatchEvent(
                new Event("notificationsChange")
            );
        }



        window.dispatchEvent(new Event("dashboardDataUpdated"));

        setIsApplied(true);

        sessionStorage.removeItem(

            `visitedOpportunity_${opportunityId}`

        );

        alert("Application added successfully!");

        setTimeout(() => {

            navigate("/my-applications");

        }, 1000);

    };

    return (

        <div className="opportunity-details-container">

            {!isStudent && (
                <div className="login-application-message">
                    <h1>Want to apply for this opportunity?</h1>
                    <p>
                        Please log in as a student to apply for this opportunity and track your application.
                    </p>
                    <button onClick={() => navigate("/login")}>
                        <GraduationCap size={18} />Login as Student
                    </button>
                </div>
            )}
            <div className="opportunity-details-background">
                <div className="opportunity-details-header">
                    <h2>{opportunity.title || "Untitled Opportunity"}</h2>
                    <p>
                        <strong>Company:</strong>{" "}

                        {opportunity.company || "Not specified"}

                    </p>

                    <p>

                        <strong>Location:</strong>{" "}

                        {opportunity.location || "Not specified"}

                    </p>

                    <p>

                        <strong>Type:</strong>{" "}

                        {opportunity.type || "Not specified"}

                    </p>

                    <p>

                        <strong>Deadline:</strong>{" "}

                        {opportunity.deadline || "Not specified"}

                    </p>

                </div>

                <div className="opportunity-details-content">

                    <h2>Company Description</h2>

                    <p>

                        {opportunity.companyDescription ||

                            "Company information has not been provided."}

                    </p>

                    <h2>Job Description</h2>

                    <p>

                        {opportunity.jobDescription ||

                            opportunity.description ||

                            "Job description has not been provided."}

                    </p>



                    <h2>Skills Required</h2>

                    <p>{skillsText}</p>

                    <h2>Eligibility</h2>

                    <p>{opportunity.eligibility || "Not specified"}</p>

                    <h2>Stipend / Salary</h2>

                    <p>

                        {opportunity.salaryStipend ||

                            opportunity.salary ||

                            opportunity.stipend ||

                            "As per company norms"}

                    </p>

                </div>
            </div>

            {isStudent && (

                <div className="opportunity-details-actions">


                    {isApplied ? (
                        <button disabled>
                            <Check size={18} /> Applied
                        </button>
                    ) : isExpired ? (
                        <div className="application-instruction">
                            <h2>Application Closed</h2>
                            <p>
                                The deadline for this opportunity has passed.
                                You can still view the opportunity details, but
                                new applications can no longer be started.
                            </p>
                        </div>
                    ) : (
                        <div className="application-instruction">





                            <h2>Application Instructions</h2>

                            <p>

                                Open the company's official application

                                website in a new tab. Return to SPIT

                                to record your application.

                            </p>

                            <button

                                type="button"

                                onClick={handleOpenOfficialPage}

                            >

                                <ExternalLink size={18} /> Open Official Application Page

                            </button>

                            <p>

                                After returning to SPIT, click{" "}

                                <strong>"I've Applied"</strong> to record

                                your application.

                            </p>

                            <button

                                type="button"

                                onClick={handleApplied}

                                disabled={!hasVisitedOfficialPage}

                            >

                                <CheckCircle size={18} />  I've Applied

                            </button>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}

export default OpportunityDetails;
