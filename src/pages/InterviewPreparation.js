import { Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft} from "lucide-react";
function InterviewPreparation() {

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

                <h1>INTERVIEW PREPARATION</h1>

                <p className="resource-detail-intro">
                    Prepare for Full Stack Development and software
                    development interviews with self-introduction,
                    technical preparation, HR questions, STAR method
                    and behavioral interview guidance.
                </p>

<div className="resource-tips-content">
                {/* 1. Before the Interview */}

                <div className="resource-section">

                    <h2>1. Before the Interview</h2>

                    <ul>
                        <li>Research the company and its products or services.</li>

                        <li>
                            Read the job description carefully.
                        </li>

                        <li>
                            Revise the technical skills mentioned
                            in the job description.
                        </li>

                        <li>
                            Review your resume and be prepared to explain
                            everything mentioned in it.
                        </li>

                        <li>
                            Review your academic and personal projects.
                        </li>

                        <li>
                            Prepare a short self-introduction.
                        </li>

                        <li>
                            Prepare examples for common behavioral questions.
                        </li>

                        <li>
                            Keep your resume and other required documents ready.
                        </li>
                    </ul>

                </div>


                {/* 2. Self Introduction */}

                <div className="resource-section">

                    <h2>2. Self Introduction</h2>

                    <p>
                        Your self-introduction should be clear, concise
                        and related to your education, technical skills,
                        projects and career interest.
                    </p>

                    <h3>Self-Introduction Structure</h3>

                    <ul>
                        <li>Greeting</li>

                        <li>Your name</li>

                        <li>Educational background</li>

                        <li>Technical skills</li>

                        <li>Hands-on experience or projects</li>

                        <li>What you learned from your projects</li>

                        <li>Your career interest</li>
                    </ul>

                    <div className="resource-example">

                        <strong>Example:</strong>

                        <p>
                            Good morning, my name is [Name]. I recently
                            completed my engineering in [Branch].
                            I have a strong interest in software development
                            and have hands-on experience with Java, React,
                            SQL and web development.
                        </p>

                        <p>
                            I have worked on academic projects where I
                            developed practical programming and
                            problem-solving skills. Through these projects,
                            I learned how to work with different technologies
                            and solve real-world problems.
                        </p>

                        <p>
                            I am eager to apply my technical skills,
                            continuously learn new technologies and
                            contribute as a software developer.
                        </p>

                    </div>

                </div>


                {/* 3. Technical Preparation */}

                <div className="resource-section">

                    <h2>3. Technical Interview Preparation</h2>

                    <p>
                        Revise the technical areas that are relevant
                        to the software development position.
                    </p>

                    <ul>
                        <li>Programming fundamentals</li>

                        <li>Object-Oriented Programming</li>

                        <li>Data Structures and Algorithms</li>

                        <li>Database and SQL</li>

                        <li>Web Development</li>

                        <li>Java and Spring Boot</li>

                        <li>React and JavaScript</li>

                        <li>REST APIs</li>

                        <li>Git and GitHub</li>

                        <li>Projects mentioned in your resume</li>
                    </ul>

                </div>


                {/* 4. Project Questions */}

                <div className="resource-section">

                    <h2>4. Be Ready to Explain Your Projects</h2>

                    <p>
                        Interviewers may ask detailed questions about
                        projects mentioned on your resume.
                    </p>

                    <p>Be prepared to explain:</p>

                    <ul>
                        <li>What problem does your project solve?</li>

                        <li>Why did you choose the project?</li>

                        <li>Which technologies did you use?</li>

                        <li>What was your individual role?</li>

                        <li>What features did you develop?</li>

                        <li>What challenges did you face?</li>

                        <li>How did you solve those challenges?</li>

                        <li>What did you learn from the project?</li>

                        <li>What improvements can be made?</li>
                    </ul>

                </div>


                {/* 5. STAR Method */}

                <div className="resource-section">

                    <h2>5. STAR Method</h2>

                    <p>
                        The STAR method can be used to structure answers
                        to behavioral and situation-based interview questions.
                    </p>

                    <ul>
                        <li>
                            <strong>S – Situation:</strong>
                            Describe the situation or context.
                        </li>

                        <li>
                            <strong>T – Task:</strong>
                            Explain your responsibility or challenge.
                        </li>

                        <li>
                            <strong>A – Action:</strong>
                            Explain what you personally did.
                        </li>

                        <li>
                            <strong>R – Result:</strong>
                            Explain the result and what you learned.
                        </li>
                    </ul>

                    <div className="resource-example">

                        <strong>Example – Handling a Mistake:</strong>

                        <p>
                            <strong>Situation:</strong>
                            During a project, I took responsibility for
                            several tasks without properly estimating
                            the time required.
                        </p>

                        <p>
                            <strong>Task:</strong>
                            I needed to complete my assigned work within
                            the project deadline.
                        </p>

                        <p>
                            <strong>Action:</strong>
                            After realizing the problem, I created a priority
                            list and estimated the time required for each task.
                        </p>

                        <p>
                            <strong>Result:</strong>
                            This helped me manage my responsibilities more
                            systematically and complete future tasks on time.
                        </p>

                    </div>

                </div>


                {/* 6. Behavioral Interview */}

                <div className="resource-section">

                    <h2>6. Behavioral Interview Preparation</h2>

                    <p>
                        Prepare a few real examples from your academic
                        projects, internships, college activities or
                        other experiences.
                    </p>

                    <p>
                        The source material recommends preparing stories
                        around:
                    </p>

                    <ul>
                        <li>Leadership</li>

                        <li>Teamwork</li>

                        <li>Decision making</li>

                        <li>Handling pressure</li>

                        <li>Overcoming challenges</li>

                        <li>Learning from failures</li>
                    </ul>

                </div>


                {/* 7. Common Questions */}

                <div className="resource-section">

                    <h2>7. Common Interview Questions</h2>

                    <ul>
                        <li>Tell me about yourself.</li>

                        <li>How would you describe yourself as a learner?</li>

                        <li>What motivates you?</li>

                        <li>Why did you choose software development?</li>

                        <li>Why should we hire you?</li>

                        <li>Why do you want to work here?</li>

                        <li>Where do you see yourself in five years?</li>
                        <li>Prove that you are the best fit for this job.</li>

                        <li>Tell me about a time you worked in a team.</li>

                        <li>Tell me about a challenge you faced.</li>

                        <li>Tell me about a mistake you made and what you learned.</li>

                        <li>How do you manage multiple tasks or deadlines?</li>
                        <li>Tell us a little about your hobbies and interests</li>
                        <li>How do you stay updated with technology?</li>
                    </ul>

                </div>


                {/* 8. Teamwork */}

                <div className="resource-section">

                    <h2>8. Teamwork Questions</h2>

                    <p>
                        For freshers, academic projects, college events
                        and group activities can be used as examples.
                    </p>

                    <p>
                        A useful structure is:
                    </p>

                    <p>
                        <strong>
                            Situation → Your Role / Task → Action → Result
                        </strong>
                    </p>

                    <div className="resource-example">

                        <strong>Example Question:</strong>

                        <p>
                            Tell me about a time when you worked in a team.
                        </p>

                        <p>
                            Explain the project or situation, your
                            responsibility, how you communicated with
                            teammates, what actions you took and what
                            the final result was.
                        </p>

                    </div>

                </div>


                {/* 9. Motivation and Career */}

                <div className="resource-section">

                    <h2>9. Career and Motivation</h2>

                    <p>
                        Be prepared to explain why you chose software
                        development and what motivates you to learn
                        and improve.
                    </p>

                    <div className="resource-example">

                        <strong>Example:</strong>

                        <p>
                            I am motivated by setting clear goals and
                            consistently working towards achieving them.
                            I enjoy learning new technologies, solving
                            programming problems and seeing the results
                            of my work in practical projects.
                        </p>

                    </div>

                </div>


                {/* 10. Industry Trends */}

                <div className="resource-section">

                    <h2>10. Staying Updated with Technology</h2>

                    <p>
                        The interview material recommends regularly
                        following technology-related learning sources
                        and applying what you learn through practical work.
                    </p>

                    <ul>
                        <li>Technology blogs</li>

                        <li>Professional forums</li>

                        <li>Educational platforms</li>

                        <li>Webinars</li>

                        <li>Online tutorials</li>

                        <li>Small projects and assignments</li>
                    </ul>

                </div>


                {/* 11. Mock Interview */}

                <div className="resource-section">

                    <h2>11. Mock Interview Questions</h2>

                    <h3>Introduction</h3>

                    <ul>
                        <li>Tell me about yourself.</li>

                        <li>How would you describe yourself as a learner?</li>

                        <li>What kind of work environment helps you perform better?</li>
                    </ul>


                    <h3>Projects</h3>

                    <ul>
                        <li>Tell me about one project you worked on.</li>

                        <li>What was the problem statement?</li>

                        <li>What was your individual role?</li>

                        <li>What did you learn from the project?</li>
                    </ul>


                    <h3>Communication and Workplace Behavior</h3>

                    <ul>
                        <li>
                            How do you explain technical information
                            to someone non-technical?
                        </li>

                        <li>
                            Tell me about a disagreement during a group task.
                        </li>

                        <li>
                            How do you respond to feedback from mentors?
                        </li>
                    </ul>


                    <h3>Work Ethic and Problem Solving</h3>

                    <ul>
                        <li>
                            What do you do when you are stuck while
                            solving a problem?
                        </li>

                        <li>
                            How do you manage multiple tasks or deadlines?
                        </li>

                        <li>
                            How do you practice or revise what you learn?
                        </li>
                    </ul>

                </div>


                {/* 12. Interview Day */}

                <div className="resource-section">

                    <h2>12. Interview Day Tips</h2>

                    <ul>
                        <li>Reach the interview location early.</li>

                        <li>
                            For online interviews, check your internet,
                            camera and microphone beforehand.
                        </li>

                        <li>Dress professionally.</li>

                        <li>Listen carefully to every question.</li>

                        <li>Answer clearly and honestly.</li>

                        <li>
                            If you do not know an answer, avoid guessing
                            unnecessarily.
                        </li>

                        <li>Maintain professional communication.</li>

                        <li>Stay calm and take a moment to think before answering.</li>
                    </ul>

                </div>

</div>
                {/* Back Button */}

                <button
                    className="back-resource-button"
                    onClick={() => navigate("/career-resources")}
                >
                 <ChevronLeft size={18} />    Back to Career Resources
                </button>

            </div>

        </div>
    );
}

export default InterviewPreparation;