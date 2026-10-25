/*
 * CareerResources.jsx
 * -------------------
 * Displays career preparation resources available in SPIT.
 * Students must log in to access individual resource pages.
 */

// Import the navigation hook from React Router.
import { useNavigate } from "react-router-dom";

// Import the arrow icon used on resource buttons.
import { ArrowRight } from "lucide-react";

function CareerResources() {
    // Initialize navigation for opening resource pages.
    const navigate = useNavigate();

    // Define the career resources displayed on this page.
    const resources = [
        {
            title: "Resume Tips",
            description:
                "Learn how to create an effective resume and highlight your software development skills, projects and experience.",
            path: "/career-resources/resume-tips"
        },
        {
            title: "Resume Templates",
            description:
                "Access useful resume formats and templates for Full Stack Development internships and placement applications.",
            path: "/career-resources/resume-templates"
        },
        {
            title: "Interview Preparation",
            description:
                "Prepare for Full Stack and software development interviews with commonly asked questions and useful preparation tips.",
            path: "/career-resources/interview-preparation"
        },
        {
            title: "Aptitude Resources",
            description:
                "Practice quantitative aptitude, logical reasoning and verbal ability questions for placement preparation.",
            path: "/career-resources/aptitude-resources"
        },
        {
            title: "HR Interview Questions",
            description:
                "Prepare for common HR interview questions and improve your communication skills for software development roles.",
            path: "/career-resources/hr-interview-questions"
        },
        {
            title: "Technical Interview Questions",
            description:
                "Practice technical questions related to Java, Spring Boot, React, JavaScript, HTML, CSS, SQL, REST APIs and Git.",
            path: "/career-resources/technical-interview-questions"
        }
    ];

    /*
     * Checks whether the current user is a logged-in student.
     * Redirects unauthorized users to the login page.
     */
    const handleView = (resource) => {
        const isStudent =
            localStorage.getItem("isLoggedIn") === "true" &&
            localStorage.getItem("userRole") === "student";

        // Require student login before opening resource content.
        if (!isStudent) {
            alert(
                "Please login as a student to access the resource content."
            );

            navigate("/login");
            return;
        }

        // Navigate to the selected resource page.
        if (resource.path) {
            navigate(resource.path);
        }
    };

    // Render the career resource cards.
    return (
        <div className="career-resources-container">
            <h1>CAREER RESOURCES</h1>

            <p className="career-resources-intro">
                Explore career preparation resources focused on
                Full Stack Development and software development roles.
            </p>

            {/* Display all available resources in a grid. */}
            <div className="resources-grid">
                {resources.map((resource) => (
                    <div
                        className="resource-card"
                        key={resource.path}
                    >
                        {/* Resource title and description */}
                        <h2>{resource.title}</h2>

                        <p>{resource.description}</p>

                        {/* Open the selected resource. */}
                        <button
                            onClick={() => handleView(resource)}
                        >
                            <ArrowRight size={18} />
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Export the component for use in application routes.
export default CareerResources;
