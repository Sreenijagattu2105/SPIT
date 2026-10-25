import { Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import GoToTop from "../components/GoToTop";
function ResumeTips() {

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

                <h1>RESUME TIPS</h1>

                <p className="resource-detail-intro">
                    Learn how to create a clear, professional and
                    ATS-friendly resume for Full Stack Development
                    and software development internships and job applications.
                </p>


                {/* 1. Resume Structure */}
                <div className="resource-tips-content">
                    <div className="resource-section">

                        <h2>1. Resume Structure</h2>

                        <p>
                            A fresher resume should be simple, organized and easy
                            for recruiters to read. A recommended structure is:
                        </p>

                        <ul>
                            <li>Full Name and Contact Information</li>
                            <li>Career Objective or Professional Summary</li>
                            <li>Education</li>
                            <li>Technical Skills</li>
                            <li>Projects</li>
                            <li>Internships or Experience</li>
                            <li>Certifications</li>
                            <li>Achievements</li>
                            <li>LinkedIn and GitHub Profile</li>
                        </ul>

                    </div>


                    {/* 2. Contact Information */}

                    <div className="resource-section">

                        <h2>2. Contact Information</h2>

                        <p>
                            Include the information recruiters need to contact you.
                        </p>

                        <ul>
                            <li>Full Name</li>
                            <li>Phone Number</li>
                            <li>Professional Email Address</li>
                            <li>LinkedIn Profile</li>
                            <li>GitHub Profile</li>
                        </ul>
                        <div className="resource-example">
                            <strong>Example:</strong>

                            <p>
                                <strong>Priya Sharma</strong>
                                <br />
                                Hyderabad, Telangana, India
                                <br />
                                Phone: +91 98765 43210
                                <br />
                                Email: priya.sharma@example.com
                                <br />
                                LinkedIn: linkedin.com/in/priyasharma
                                <br />
                                GitHub: github.com/priyasharma
                            </p>
                        </div>
                    </div>


                    {/* 3. Career Objective */}

                    <div className="resource-section">

                        <h2>3. Career Objective / Summary</h2>

                        <p>
                            Keep your objective or professional summary short
                            and focused on your career direction and relevant skills.
                        </p>

                        <div className="resource-example">

                            <strong>Example 1 – Fresher:</strong>

                            <p>
                                Motivated Computer Science graduate with knowledge of Java,
                                React, SQL and web development, seeking an entry-level
                                software development opportunity to apply technical skills
                                and contribute to real-world projects.
                            </p>

                            <strong>Example 2 – Full Stack Development:</strong>

                            <p>
                                Aspiring Full Stack Developer with knowledge of Java,
                                Spring Boot, React, JavaScript, HTML, CSS and MySQL,
                                seeking an opportunity to build scalable web applications
                                and develop practical software development skills.
                            </p>

                            <strong>Example 3 – Java Developer:</strong>

                            <p>
                                Computer Science graduate with a strong foundation in Java,
                                Object-Oriented Programming, SQL and web technologies,
                                seeking an entry-level Java Developer role to apply
                                programming skills and contribute to software projects.
                            </p>

                            <strong>Example 4 – Software Developer:</strong>

                            <p>
                                Enthusiastic software development fresher with knowledge of
                                programming, databases and web development, looking for an
                                opportunity to learn, solve real-world problems and contribute
                                to software development projects.
                            </p>

                            <strong>Example 5 – Internship:</strong>

                            <p>
                                Computer Science student with knowledge of Java, React,
                                JavaScript and SQL, seeking a software development internship
                                to gain practical industry experience and strengthen
                                full stack development skills.
                            </p>

                            <strong>Example 6 – Short Objective:</strong>

                            <p>
                                To begin a career in software development where I can apply
                                my technical knowledge, continuously learn new technologies
                                and contribute effectively to development projects.
                            </p>

                        </div>

                    </div>


                    {/* 4. Education */}

                    <div className="resource-section">

                        <h2>4. Education</h2>

                        <p>
                            Mention your educational qualifications clearly, starting
                            with your most recent qualification and then moving backward.
                        </p>

                        <p>
                            For a fresher, you can include your education from your
                            degree up to your school education.
                        </p>

                        <ul>
                            <li>Degree / Graduation</li>
                            <li>Intermediate / 12th Standard</li>
                            <li>10th Standard / School Education</li>
                        </ul>

                        <p>
                            For each qualification, mention the institution, year and
                            percentage or CGPA when relevant.
                        </p>

                        <p>
                            <strong>Avoid using a table format.</strong> Use separate
                            lines or simple entries for each qualification. A single-column
                            format is easier to read and is more ATS-friendly.
                        </p>

                        <div className="resource-example">

                            <strong>Example 1:</strong>

                            <p>
                                <strong>B.Tech in Computer Science, Aurora's Technological and Research Institute, Hyderabad (2022 – 2026) </strong>
                                <br />
                                CGPA: 7.8
                            </p>

                            <p>
                                <strong>Intermediate (MPC), Keshav Smarak Junior College, Hyderabad (2020 – 2022)</strong>
                                <br />
                                Percentage: 89%
                            </p>

                            <p>
                                <strong>10th Standard – CBSE, Vasavi Public School, Hyderabad (2019 – 2020)</strong>
                                <br />
                                Percentage: 89%
                            </p>

                            <strong>Example 2:</strong>

                            <p>
                                B.Tech in Computer Science
                                <br /> Aurora's Technological and Research Institute, Hyderabad
                                <br /> (2022 – 2026)
                                <br /> CGPA: 7.8
                            </p>

                        </div>

                    </div>


                    {/* 5. Technical Skills */}

                    <div className="resource-section">

                        <h2>5. Technical Skills</h2>

                        <p>
                            List technical skills that are relevant to the Full Stack
                            Development or software development position you are applying for.
                        </p>

                        <h3>Recommended Format 1 – Category Based</h3>

                        <div className="resource-example">

                            <p>
                                <strong>Programming:</strong> Java, Python, C
                            </p>

                            <p>
                                <strong>Frontend:</strong> HTML, CSS, JavaScript, React
                            </p>

                            <p>
                                <strong>Backend:</strong>Spring Boot, REST APIs
                            </p>

                            <p>
                                <strong>Database:</strong> MySQL, SQL
                            </p>

                            <p>
                                <strong>Tools:</strong> Git, GitHub, VS Code
                            </p>

                        </div>


                        <h3>Recommended Format 2 – Simple List</h3>

                        <div className="resource-example">

                            <p>
                                <strong>Technical Skills:</strong>
                                Java, Spring Boot, HTML, CSS, JavaScript, React,
                                SQL, MySQL, REST APIs, Git and GitHub
                            </p>

                        </div>


                        <h3>Rules for Listing Technical Skills</h3>

                        <ul>
                            <li>
                                Include skills that are relevant to the job you are applying for.
                            </li>

                            <li>
                                Group related skills into categories such as Programming,
                                Frontend, Backend, Database and Tools.
                            </li>

                            <li>
                                Mention technologies that you actually know and can explain
                                during an interview.
                            </li>

                            <li>
                                Use the exact technology names where appropriate, such as
                                JavaScript, React, Spring Boot, MySQL and Git.
                            </li>

                            <li>
                                Match relevant keywords from the job description when you
                                genuinely have those skills.
                            </li>

                            <li>
                                Do not add a long list of technologies just to make the
                                skills section look bigger.
                            </li>

                            <li>
                                Do not use star ratings, progress bars or percentage bars
                                to show skill level.
                            </li>

                            <li>
                                Do not use a table format for technical skills.
                            </li>

                            <li>
                                Avoid unnecessary graphics, icons and decorative elements.
                            </li>

                            <li>
                                Keep the formatting simple, consistent and easy to scan.
                            </li>
                        </ul>
                    </div>

                    {/* 6. Projects */}

                    <div className="resource-section">

                        <h2>6. Projects</h2>

                        <p>
                            Projects are especially important for freshers because
                            they demonstrate practical technical knowledge.
                        </p>

                        <p>
                            For each project, mention:
                        </p>

                        <ul>
                            <li>Project name : GitHub Link</li>
                            <li>Technologies used</li>
                            <li>description</li>
                            <li>Your contribution</li>
                            <li>Important features or results</li>

                        </ul>

                        <div className="resource-example">

                            <strong>Example:</strong>

                            <p>
                                <strong>Medicine Door Delivery System : GitHub Link</strong>
                            </p>

                            <p>
                                <strong>Technologies: </strong> Java, HTML, CSS, MySQL
                            </p>

                            <p>
                                <strong>Description:</strong> Developed a web-based application that allows users to order medicines from nearby medical stores.
                            </p>
                            <p><strong>Highlights:</strong></p>
                            <ul>
                                <li>Proposed medicine ordering functionality.</li>
                                <li>Planned quantity selection and order placement.</li>
                                <li>Identified prescription verification as a potential feature.</li>
                            </ul>

                        </div>

                    </div>


                    {/* 7. Internships / Experience */}

                    <div className="resource-section">

                        <h2>7. Internships / Experience</h2>

                        <p>
                            If you have internship or work experience, mention
                            the organization, role, duration and the work you
                            performed.
                        </p>

                        <ul>
                            <li>Organization / Company - Location</li>
                            <li>Role or Position</li>
                            <li>Duration</li>
                            <li>Responsibilities</li>
                            <li>Technologies or tools used</li>
                            <li>Important contributions or achievements</li>
                        </ul>
                        <div className="resource-example">

                            <strong>Example:</strong>

                            <p>
                                Software Engineering Intern – ABC Tech, Bangalore
                                <br />
                                Duration: May 2024 – July 2024
                                <br />
                                Worked on: Backend development for a fintech platform
                            </p>

                            <p><strong>Key Contributions:</strong></p>

                            <ul>
                                <li>Developed REST APIs using Django and PostgreSQL.</li>
                                <li>Improved query performance by 40% through indexing and query optimization.</li>
                                <li>Collaborated with a team of five using Agile methodology.</li>
                            </ul>
                        </div>
                    </div>


                    {/* 8. Certifications */}

                    <div className="resource-section">

                        <h2>8. Certifications</h2>

                        <p>
                            Add relevant certifications that demonstrate your
                            technical knowledge or professional skills.
                        </p>

                        <ul>
                            <li>Certification Name</li>
                            <li>Organization or Platform</li>
                            <li>Year of Completion</li>
                        </ul>

                    </div>


                    {/* 9. Achievements */}

                    <div className="resource-section">

                        <h2>9. Achievements</h2>

                        <p>
                            Include relevant academic, technical or
                            extracurricular achievements that demonstrate
                            your skills and accomplishments.
                        </p>

                        <ul>
                            <li>Academic achievements</li>
                            <li>Technical competitions</li>
                            <li>Workshops or events</li>
                            <li>Leadership or extracurricular achievements</li>
                        </ul>

                    </div>


                    {/* 10. LinkedIn and GitHub */}

                    <div className="resource-section">

                        <h2>10. LinkedIn and GitHub</h2>

                        <p>
                            Include your professional online profiles when
                            they contain relevant and up-to-date information.
                        </p>

                        <ul>
                            <li>Keep your LinkedIn profile updated.</li>
                            <li>Use a professional LinkedIn headline.</li>
                            <li>Add relevant education and experience.</li>
                            <li>Keep your GitHub repositories organized.</li>
                            <li>Add your important software projects to GitHub.</li>
                        </ul>

                        <p><strong>Format:</strong></p>

                        <ul>
                            <li>LinkedIn: linkedin.com/in/yourname</li>
                            <li>GitHub: github.com/yourusername</li>
                        </ul>

                    </div>


                    {/* 11. ATS Friendly Resume */}

                    <div className="resource-section">

                        <h2>11. ATS-Friendly Resume Tips</h2>

                        <p>
                            An Applicant Tracking System (ATS) helps organizations
                            process and organize resumes. A simple, text-based,
                            single-column layout can improve readability and reduce
                            parsing issues.
                        </p>

                        <ul>
                            <li>Use a simple, professional format.</li>
                            <li>Prefer a single-column layout.</li>
                            <li>Use clear and standard section headings.</li>
                            <li>Include relevant keywords from the job description.</li>
                            <li>Avoid tables and multiple-column layouts.</li>
                            <li>Avoid unnecessary images, icons and graphics.</li>
                            <li>Use readable fonts and consistent formatting.</li>
                            <li>Mention relevant tools, platforms and certifications.</li>
                            <li>Keep the resume concise and relevant.</li>
                            <li>Save the final resume as PDF or DOC when appropriate.</li>
                            <li>Keep the resume within two pages where possible.</li>
                        </ul>

                    </div>


                    {/* 12. Common Resume Mistakes */}

                    <div className="resource-section">

                        <h2>12. Common Resume Mistakes</h2>

                        <ul>
                            <li>Spelling and grammatical errors</li>
                            <li>Using an unprofessional email address</li>
                            <li>Adding irrelevant information</li>
                            <li>Listing skills without practical knowledge</li>
                            <li>Using complicated layouts</li>
                            <li>Using excessive graphics or decorative elements</li>
                            <li>Making the resume unnecessarily long</li>
                            <li>Not highlighting relevant projects</li>
                            <li>Not keeping LinkedIn and GitHub information updated</li>
                        </ul>

                    </div>

                </div>
                {/* Back Button */}

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

export default ResumeTips;