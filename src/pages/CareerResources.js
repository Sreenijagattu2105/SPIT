import { useNavigate } from "react-router-dom";

function CareerResources() {

    const navigate = useNavigate();

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


    const handleView = (resource) => {

        const isStudent =
            localStorage.getItem("isLoggedIn") === "true" &&
            localStorage.getItem("userRole") === "student";

        if (!isStudent) {
            alert(
                "Please login as a student to access the resource content."
            );

            navigate("/login");

            return;
        }


        if (resource.path) {
            navigate(resource.path);
        }

    };


    return (

        <div className="career-resources-container">

            <h1>Career Resources</h1>

            <p className="career-resources-intro">
                Explore career preparation resources focused on
                Full Stack Development and software development roles.
            </p>


            <div className="resources-grid">

                {resources.map((resource, index) => (

                    <div
                        className="resource-card"
                        key={index}
                    >

                        <h2>
                            {resource.title}
                        </h2>

                        <p>
                            {resource.description}
                        </p>


                        <button
                            onClick={() => handleView(resource)}
                        >
                            View
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default CareerResources;