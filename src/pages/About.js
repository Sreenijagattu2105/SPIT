/*
 * About.jsx
 * ---------
 * Displays information about SPIT (Smart Internship & Placement
 * Tracker), including its mission, vision, objectives, workflow,
 * and career support features.
 */

// Import navigation hook from React Router.
import { useNavigate } from "react-router-dom";

// Import icons used throughout the About page.
import {
    UserPlus,
    ClipboardList,
    BriefcaseBusiness,
    BookOpen
} from "lucide-react";

function About() {
    // Initialize navigation for page transitions.
    const navigate = useNavigate();

    return (
        <div className="about-container">

            {/* About SPIT introduction */}
            <h1>ABOUT US</h1>

            <section className="about-section">
                <h2>Smart Internship & Placement Tracker</h2>

                <p>
                    Smart Internship & Placement Tracker (SPIT) is a
                    platform designed to help students discover
                    Full Stack Development and software development
                    internship and placement opportunities and
                    manage their career activities in one place.
                </p>

                <p>
                    The platform provides students with access to
                    relevant development opportunities, career
                    resources and application tracking, while
                    placement coordinators can manage opportunities
                    and student information.
                </p>
            </section>

            {/* Describe the mission of SPIT */}
            <section className="mission-section">
                <h2>Our Mission</h2>

                <p>
                    To provide students with a simple and organized
                    platform to discover Full Stack Development and
                    software development internship and placement
                    opportunities and prepare for their careers.
                </p>
            </section>

            {/* Describe the vision of SPIT */}
            <section className="vision-section">
                <h2>Our Vision</h2>

                <p>
                    To connect students with relevant software
                    development opportunities and help them build
                    the technical and professional skills needed for
                    successful careers in Full Stack Development.
                </p>
            </section>

            {/* List the main objectives of SPIT */}
            <section className="objectives-section">
                <h2>Our Objectives</h2>

                <ul>
                    <li>
                        Help students discover Full Stack Development
                        and software development internship and
                        placement opportunities.
                    </li>

                    <li>
                        Provide useful career preparation resources
                        for software development roles.
                    </li>

                    <li>
                        Help students manage and track their
                        applications.
                    </li>

                    <li>
                        Provide placement coordinators with tools
                        to manage development opportunities and
                        students.
                    </li>
                </ul>
            </section>

            {/* Explain the main steps in using SPIT */}
            <section className="how-it-works-section">
                <h2>How SPIT Works</h2>

                <div className="steps">

                    {/* Step 1: Student registration */}
                    <div className="step">
                        <h3>1. Register</h3>

                        <p>
                            Create your SPIT account and provide your
                            basic academic information.
                        </p>

                        <button
                            onClick={() => navigate("/register")}
                        >
                            <UserPlus size={18} />
                            Register Now
                        </button>
                    </div>

                    {/* Step 2: Explore available opportunities */}
                    <div className="step">
                        <h3>2. Explore</h3>

                        <p>
                            Browse and search for Full Stack
                            Development and software development
                            internships and placement opportunities
                            based on your skills and interests.
                        </p>

                        <button
                            onClick={() => navigate("/opportunities")}
                        >
                            <BriefcaseBusiness size={18} />
                            Explore Opportunities
                        </button>
                    </div>

                    {/* Step 3: Find opportunities and apply */}
                    <div className="step">
                        <h3>3. Apply</h3>

                        <p>
                            View opportunity details and use the
                            official company application link to
                            apply for the opportunity.
                        </p>

                        <button
                            onClick={() => navigate("/opportunities")}
                        >
                            <BriefcaseBusiness size={18} />
                            Find Opportunities
                        </button>
                    </div>

                    {/* Step 4: Track application progress */}
                    <div className="step">
                        <h3>4. Track</h3>

                        <p>
                            Students can log in to their account to
                            track the software development
                            opportunities they have applied for and
                            monitor their application progress.
                        </p>

                        <button
                            onClick={() => {
                                // Ask the user to log in before tracking.
                                alert(
                                    "Please login as a student to track your applications."
                                );

                                navigate("/login");
                            }}
                        >
                            <ClipboardList size={18} />
                            Track Applications
                        </button>
                    </div>

                </div>
            </section>

            {/* Highlight career preparation resources */}
            <section className="career-support-section">
                <h2>Career Support</h2>

                <p>
                    SPIT provides career resources to help students
                    prepare resumes, improve their LinkedIn profiles,
                    practice aptitude tests, and prepare for
                    technical and HR interviews for software
                    development roles.
                </p>

                <button
                    onClick={() => navigate("/career-resources")}
                >
                    <BookOpen size={18} />
                    Explore Career Resources
                </button>
            </section>

            {/* Encourage visitors to explore SPIT */}
            <section className="about-cta">
                <h2>Ready to Explore Your Career Opportunities?</h2>

                <p>
                    Discover Full Stack Development and software
                    development internships and placement
                    opportunities and start preparing for your career.
                </p>

                <button
                    onClick={() => navigate("/opportunities")}
                >
                    <BriefcaseBusiness size={18} />
                    Explore Opportunities
                </button>

                <button
                    onClick={() => navigate("/register")}
                >
                    <UserPlus size={18} />
                    Create an Account
                </button>
            </section>

        </div>
    );
}

// Export About so it can be used in the application routes.
export default About;
