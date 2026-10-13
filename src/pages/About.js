import { useNavigate } from "react-router-dom";

function About() {

    const navigate = useNavigate();

    return (
        <div className="about-container">

            {/* About SPIT */}

            <section className="about-section">

                <h1>About SPIT</h1>

                <h2>
                    Smart Internship & Placement Tracker
                </h2>

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


            {/* Mission */}

            <section className="mission-section">

                <h2>Our Mission</h2>

                <p>
                    To provide students with a simple and organized
                    platform to discover Full Stack Development and
                    software development internship and placement
                    opportunities and prepare for their careers.
                </p>

            </section>


            {/* Vision */}

            <section className="vision-section">

                <h2>Our Vision</h2>

                <p>
                    To connect students with relevant software
                    development opportunities and help them build
                    the technical and professional skills needed for
                    successful careers in Full Stack Development.
                </p>

            </section>


            {/* Objectives */}

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


            {/* How SPIT Works */}

            <section className="how-it-works-section">

                <h2>How SPIT Works</h2>

                <div className="steps">


                    {/* Step 1 */}

                    <div className="step">

                        <h3>1. Register</h3>

                        <p>
                            Create your SPIT account and provide your
                            basic academic information.
                        </p>

                        <button
                            onClick={() => navigate("/register")}
                        >
                            Register Now
                        </button>

                    </div>


                    {/* Step 2 */}

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
                            Explore Opportunities
                        </button>

                    </div>


                    {/* Step 3 */}

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
                            Find Opportunities
                        </button>

                    </div>


                    {/* Step 4 */}

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
                                alert("Please login as a student to track your applications.");
                                navigate("/login");
                            }}
                        >
                            Track Applications
                        </button>

                    </div>

                </div>

            </section>


            {/* Career Support */}

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
                    Explore Career Resources
                </button>

            </section>


            {/* Call To Action */}

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
                    Explore Opportunities
                </button>

                <button
                    onClick={() => navigate("/register")}
                >
                    Create an Account
                </button>

            </section>

        </div>
    );
}

export default About;