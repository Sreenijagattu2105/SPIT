
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import GoToTop from "../components/GoToTop";
function ResumeTemplates() {
    const navigate = useNavigate();

    const isStudent =
        localStorage.getItem("isLoggedIn") === "true" &&
        localStorage.getItem("userRole") === "student";

    if (!isStudent) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="resource-detail-page">
            <div className="resource-detail-container">

                <h1>RESUME TEMPLATES</h1>

                <p className="resource-detail-intro">
                    Choose a resume format based on your experience
                    and the software development role you are applying for.
                    Both templates follow a simple, professional structure.
                </p>

                {/* TEMPLATE 1 */}

                <div className="resume-template">

                    <h2>Template 1 – General Fresher Resume</h2>

                    <p>
                        Best suited for students and freshers applying
                        for their first internship or entry-level job.
                    </p>

                    <div className="resume-template-box">
                        <div className="resume-contact-info">
                            <h3>YOUR NAME</h3>

                            <p>
                                Phone: +91 XXXXX XXXXX
                                <br />
                                Email: yourname@example.com
                                <br />
                                Location: City, State
                                <br />
                                LinkedIn:{" "}
                                <a
                                    href="https://www.linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    LinkedIn Profile
                                </a>
                                <br />
                                GitHub:{" "}
                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitHub Profile
                                </a>
                            </p>
                        </div>
                        <hr />

                        <h4>CAREER OBJECTIVE</h4>

                        <p>
                            Motivated Computer Science student with
                            knowledge of programming, databases and
                            web development, seeking an entry-level
                            software development opportunity to apply
                            technical knowledge and contribute to
                            real-world projects.
                        </p>

                        <h4>EDUCATION</h4>

                        <p>
                            <strong>Degree – Course Name</strong>
                            <br />
                            College Name, University
                            <br />
                            Year | CGPA or Percentage
                        </p>

                        <p>
                            <strong>Intermediate / Class XII</strong>
                            <br />
                            College Name | Year | Percentage
                        </p>

                        <p>
                            <strong>Class X</strong>
                            <br />
                            School Name | Year | Percentage
                        </p>

                        <h4>TECHNICAL SKILLS</h4>

                        <p>
                            <strong>Programming Languages:</strong>
                            Java, Python, C
                        </p>

                        <p>
                            <strong>Frontend Technologies:</strong>
                            HTML, CSS, JavaScript, React
                        </p>

                        <p>
                            <strong>Backend Technologies:</strong>
                            Mention the backend technologies used
                        </p>

                        <p>
                            <strong>Databases:</strong>
                            SQL, MySQL
                        </p>

                        <p>
                            <strong>Developer Tools:</strong>
                            Git, GitHub, VS Code, Eclipse
                        </p>

                        <p>
                            <strong>Core Computer Science:</strong>
                            OOP, DBMS, Data Structures, Operating Systems
                        </p>

                        <h4>PROJECTS</h4>

                        <p>
                            <strong>Project Name</strong>
                        </p>

                        <p>
                            <strong>Technologies:</strong>
                            Mention the technologies actually used
                        </p>

                        <p>
                            <strong>Description:</strong>
                            Describe the purpose and functionality of the project.
                        </p>

                        <ul>
                            <li>Explain the features you implemented.</li>
                            <li>Mention your individual contribution.</li>
                            <li>Include meaningful results, if available.</li>
                        </ul>

                        <p>
                            <strong>GitHub Repository:</strong> GitHub Link

                        </p>


                        <p>
                            <strong>Project Highlights:</strong>
                        </p>

                        <ul>
                            <li>Important feature implemented in the project.</li>
                            <li>Technical problem solved or functionality developed.</li>
                            <li>Individual contribution to the project.</li>
                        </ul>

                        <h4>INTERNSHIPS / EXPERIENCE</h4>

                        <p>
                            Organization Name – Location
                            <br />
                            Role / Position
                            <br />
                            Duration: Month Year – Month Year
                        </p>

                        <ul>
                            <li>Describe your responsibilities.</li>
                            <li>Mention the technologies you used.</li>
                            <li>Mention Key Contributions of the project.</li>
                        </ul>

                        <h4>CERTIFICATIONS</h4>

                        <ul>
                            <li>Certification Name </li>
                            <li>Organization Name </li>
                            <li>Year of Completion</li>
                        </ul>

                        <h4>ACHIEVEMENTS</h4>

                        <ul>
                            <li>Academic or technical achievements.</li>
                            <li>Relevant competitions or extracurricular activities.</li>
                        </ul>

                    </div>
                </div>

                {/* TEMPLATE 2 */}

                <div className="resume-template">

                    <h2>Template 2 – Technical Resume</h2>

                    <p>
                        Best suited for candidates applying for Java Developer,
                        Full Stack Developer, Frontend Developer and
                        Software Developer roles.
                    </p>

                    <div className="resume-template-box">
                        <div className="resume-contact-info">
                            <h3>YOUR NAME</h3>

                            <p>
                                Phone: +91 XXXXX XXXXX
                                <br />
                                Email: yourname@example.com
                                <br />
                                Location: City, State
                                <br />
                                LinkedIn:{" "}
                                <a
                                    href="https://www.linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    LinkedIn Profile
                                </a>
                                <br />
                                GitHub:{" "}
                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitHub Profile
                                </a>
                            </p>
                        </div>
                        <hr />

                        <h4>PROFESSIONAL SUMMARY</h4>

                        <p>
                            Computer Science student or graduate with
                            knowledge of programming, frontend development,
                            databases and software development tools.
                            Interested in developing web applications
                            and contributing to software development projects.
                        </p>

                        <h4>EDUCATION</h4>

                        <p>
                            <strong>
                                Degree – Computer Science and Engineering
                            </strong>
                            <br />
                            College Name | University
                            <br />
                            Year | CGPA or Percentage
                        </p>

                        <p>
                            <strong>Intermediate / Class XII</strong>
                            <br />
                            College Name | Year | Percentage
                        </p>

                        <p>
                            <strong>Class X</strong>
                            <br />
                            School Name | Year | Percentage
                        </p>

                        <h4>TECHNICAL SKILLS</h4>

                        <p>
                            <strong>Programming Languages:</strong>
                            Java, Python, C
                        </p>

                        <p>
                            <strong>Frontend Technologies:</strong>
                            HTML, CSS, JavaScript, React
                        </p>

                        <p>
                            <strong>Backend Technologies:</strong>
                            Mention the backend frameworks and technologies used
                        </p>

                        <p>
                            <strong>Databases:</strong>
                            SQL, MySQL
                        </p>

                        <p>
                            <strong>Developer Tools:</strong>
                            Git, GitHub, VS Code, Eclipse
                        </p>

                        <p>
                            <strong>Core Computer Science:</strong>
                            OOP, DBMS, Data Structures, Operating Systems
                        </p>

                        <h4>PROJECTS</h4>

                        <p>
                            <strong>Project Name</strong>
                        </p>

                        <p>
                            <strong>Technologies:</strong>
                            Mention the technologies actually used
                        </p>

                        <p>
                            <strong>Description:</strong>
                            Briefly explain the problem your application solves.
                        </p>

                        <p>
                            <strong>Key Contributions:</strong>
                        </p>

                        <ul>
                            <li>Describe the technical features you implemented.</li>
                            <li>Explain your role in development.</li>
                            <li>Mention meaningful results or improvements, if measured.</li>
                        </ul>

                        <p>
                            <strong>GitHub Repository: </strong> GitHub Link

                        </p>

                        <p>
                            <strong>Project Highlights:</strong>
                        </p>

                        <ul>
                            <li>Important feature implemented in the project.</li>
                            <li>Technical problem solved or functionality developed.</li>
                            <li>Individual contribution to the project.</li>
                        </ul>

                        <h4>INTERNSHIPS / EXPERIENCE</h4>

                        <p>
                            Organization Name – Location
                            <br />
                            Role / Position
                            <br />
                            Duration: Month Year – Month Year
                        </p>

                        <ul>
                            <li>Describe the technical work you performed.</li>
                            <li>Mention programming languages, frameworks or tools used.</li>
                            <li>Highlight contributions supported by actual results.</li>
                        </ul>

                        <h4>CERTIFICATIONS</h4>

                        <ul>
                            <li>Certification Name </li>
                            <li>Organization Name </li>
                            <li>Year of Completion</li>
                        </ul>

                        <h4>ACHIEVEMENTS</h4>

                        <ul>
                            <li>Relevant programming or technical achievements.</li>
                            <li>Academic or extracurricular achievements.</li>
                        </ul>

                    </div>
                </div>

                {/* TEMPLATE TIPS */}

                <div className="resource-section">

                    <h2>How to Choose a Template</h2>
                    <br></br>
                    <ul>
                        <li>
                            Choose Template 1 for a general fresher resume
                            when you want a straightforward introduction.
                        </li>

                        <li>
                            Choose Template 2 for technical software
                            development roles that emphasize projects
                            and technical skills.
                        </li>

                        <li>
                            Organize technical skills into relevant categories.
                        </li>

                        <li>
                            Use a simple, single-column layout with clear headings.
                        </li>

                        <li>
                            Include LinkedIn and GitHub links when available
                            and relevant to the job.
                        </li>

                        <li>
                            Link to project repositories that you can share.
                        </li>

                        <li>
                            Include only technologies and experience you can explain.
                        </li>

                        <li>
                            Do not invent experience, achievements or performance figures.
                        </li>

                        <li>
                            Check spelling, contact details and links before submitting.
                        </li>
                    </ul>

                </div>

                <button
                    className="back-resource-button"
                    onClick={() => navigate("/career-resources")}
                >
                    <ChevronLeft size={18} />   Back to Career Resources
                </button>

            </div>
            <GoToTop />
        </div>
    );

}

export default ResumeTemplates;
