import {

    useLocation,

    useNavigate,

    useSearchParams

} from "react-router-dom";
import {GraduationCap, ChevronLeft, ExternalLink,
    CheckCircle,
    Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import opportunities from "../opportunitiesData";

function getAllOpportunities() {

    let coordinatorOpportunities = [];

    try {

        const data = JSON.parse(

            localStorage.getItem("opportunities") || "[]"

        );

        coordinatorOpportunities = Array.isArray(data) ? data : [];

    } catch {

        coordinatorOpportunities = [];

    }

    const combined = [

        ...(Array.isArray(opportunities) ? opportunities : []),

        ...coordinatorOpportunities

    ];

    return combined.reduce((result, item) => {

        const index = result.findIndex(

            (existing) => String(existing.id) === String(item.id)

        );

        if (index === -1) {

            result.push(item);

        } else {

            result[index] = item;

        }

        return result;

    }, []);

}

function getStoredArray(key) {

    try {

        const data = JSON.parse(localStorage.getItem(key) || "[]");

        return Array.isArray(data) ? data : [];

    } catch {

        return [];

    }

}

function OpportunityDetails() {

    const location = useLocation();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const sharedId = searchParams.get("id");

    const stateOpportunity = location.state?.opportunity;

    const allOpportunities = getAllOpportunities();

    let opportunity =

        stateOpportunity ||

        allOpportunities.find(

            (item) => String(item.id) === String(sharedId)

        );

    if (!opportunity) {

        const sharedData = searchParams.get("data");

        if (sharedData) {

            try {

                opportunity = JSON.parse(sharedData);

            } catch {

                try {

                    opportunity = JSON.parse(

                        decodeURIComponent(sharedData)

                    );

                } catch {

                    console.error("Unable to read shared opportunity.");

                }

            }

        }

    }

    const isStudent =

        localStorage.getItem("isLoggedIn") === "true" &&

        localStorage.getItem("userRole") === "student";

    const opportunityId = opportunity?.id;

    const [isApplied, setIsApplied] = useState(() => {

        if (!opportunity) return false;

        return getStoredArray("startedApplications").some(

            (application) =>

                (

                    application.id != null &&

                    String(application.id) === String(opportunity.id)

                ) ||

                (

                    application.company === opportunity.company &&

                    application.title === opportunity.title

                )

        );

    });

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

    if (!opportunity) {

        return (

            <div className="opportunity-details-container">

                <h1>Opportunity Not Found</h1>

                <p>

                    This opportunity may have been removed or the link

                    may be incorrect.

                </p>

                <button onClick={() => navigate("/opportunities")}>

                    <ChevronLeft size={18} /> Back to Opportunities

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

    const handleApplied = () => {

        if (isApplied) return;

        if (!hasVisitedOfficialPage) {

            alert(

                "Please open the official application page in a new tab and return to SPIT first."

            );

            return;

        }

        const existingApplications =

            getStoredArray("startedApplications");

        const alreadyRecorded = existingApplications.some(

            (application) =>

                (

                    application.id != null &&

                    String(application.id) === String(opportunityId)

                ) ||

                (

                    application.company === opportunity.company &&

                    application.title === opportunity.title

                )

        );

        if (alreadyRecorded) {

            setIsApplied(true);

            alert("This application is already recorded.");

            return;

        }

        const currentUser = JSON.parse(

    localStorage.getItem("currentUser") || "{}"

);

const newApplication = {

    ...opportunity,

    studentName:

        currentUser.name ||

        currentUser.fullName ||

        "Student name unavailable",

    studentEmail: currentUser.email || "",

    status: "Applied",

    appliedDate: new Date().toLocaleDateString("en-GB", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    })

};

        localStorage.setItem(

            "startedApplications",

            JSON.stringify([

                ...existingApplications,

                newApplication

            ])

        );

        // Notify the coordinator when a student records an application.
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


        const existingNotifications =

            getStoredArray("notifications");

        const newNotification = {

            id: Date.now(),

            message: `Application Added: You marked the ${opportunity.title} opportunity at ${opportunity.company} as applied.`,

            date: new Date().toLocaleDateString("en-GB", {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }),

            read: false

        };

        localStorage.setItem(

            "notifications",

            JSON.stringify([

                newNotification,

                ...existingNotifications

            ])

        );

        window.dispatchEvent(new Event("notificationsChange"));

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

                <h2>About the Opportunity</h2>

                <p>

                    {opportunity.description ||

                        "No additional information provided."}

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

                        <button disabled><Check size={18} />Applied</button>

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
