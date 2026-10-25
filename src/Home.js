/*
 * Home.js
 * -------
 * This component displays the public homepage of SPIT
 * (Student Placement & Interview Tracker).
 *
 * Main features:
 * 1. Welcome banner
 * 2. Opportunity search
 * 3. Latest opportunities
 * 4. Platform statistics
 * 5. Why Choose SPIT section
 * 6. Platform features
 */

// Import React hooks
import { useEffect, useState } from "react";

// Import navigation hook
import { useNavigate } from "react-router-dom";

// Import icons from Lucide React
import {
    Rocket,
    BriefcaseBusiness,
    Search,
    ArrowRight
} from "lucide-react";

const API_URL =
    "http://localhost:8080/spit-backend/api/student/opportunities";

/*
 * Fetches opportunities from the backend and returns
 * only opportunities with PUBLISHED status.
 */
async function getPublishedOpportunities() {
    const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to load opportunities.");
    }

    const data = await response.json();

    return data.filter(
        (item) =>
            String(item.status || "").toUpperCase() === "PUBLISHED"
    );
}

/*
 * Main Home component.
 */
function Home() {
    // Initialize navigation
    const navigate = useNavigate();

    /*
     * Initializes platform statistics using locally stored
     * student data. Opportunity and company counts are
     * populated separately from the backend.
    */
    const getPlatformStats = () => {
        const readArray = (key) => {
            try {
                const data = JSON.parse(
                    localStorage.getItem(key) || "[]"
                );
                return Array.isArray(data) ? data : [];
            } catch {
                return [];
            }
        };

        const students = readArray("students");

        return {
            users: students.filter((student) => student.email).length,
            opportunities: 0,
            companies: 0,
        };
    };

    const [stats, setStats] = useState(getPlatformStats);

    /*
     * Update statistics when relevant data changes,
     * when the browser tab receives focus, or when
     * localStorage changes in another tab.
     */
    useEffect(() => {
        let isActive = true;

        const updateStats = async () => {
            try {
                const publishedOpportunities =
                    await getPublishedOpportunities();

                const uniqueCompanies = new Set(
                    publishedOpportunities
                        .map((item) =>
                            String(
                                item.company ??
                                item.company_name ??
                                ""
                            ).trim().toLowerCase()
                        )
                        .filter(Boolean)
                );

                if (isActive) {
                    setStats((previous) => ({
                        ...previous,
                        opportunities: publishedOpportunities.length,
                        companies: uniqueCompanies.size,
                    }));
                }
            } catch (error) {
                console.error(
                    "Error loading platform statistics:",
                    error
                );
            }
        };
        
         /*
         * Refreshes the platform statistics by retrieving
         * published opportunities and counting unique companies.
         */
        const handleRefresh = () => {
            updateStats();
        };

        updateStats();

        window.addEventListener("focus", handleRefresh);
        window.addEventListener("dashboardDataUpdated", handleRefresh);

        return () => {
            isActive = false;
            window.removeEventListener("focus", handleRefresh);
            window.removeEventListener(
                "dashboardDataUpdated",
                handleRefresh
            );
        };
    }, []);

    /*
     * State variables for opportunity search.
     */
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");

    /*
     * Search opportunities using the entered keyword,
     * selected opportunity type, and location.
     */
    const handleSearch = () => {
        // Require at least one search criterion
        if (
            !keyword.trim() &&
            !type &&
            !location.trim()
        ) {
            alert(
                "Please enter at least one search criterion."
            );
            return;
        }

        // Navigate to the opportunities page with search criteria
        navigate("/opportunities", {
            state: {
                keyword,
                type,
                location
            }
        });
    };

    /*
     * Render the SPIT homepage.
     */
    return (
        <div className="home-container">

            {/* Welcome banner */}
            <section className="welcome-banner">
                <h1>
                    Find Your Next Full Stack Career Opportunity
                </h1>

                <p>
                    Discover Full Stack Development jobs,
                    internships and software development
                    opportunities from leading technology companies.
                </p>

                {/* Navigate to the opportunities page */}
                <button
                    onClick={() => navigate("/opportunities")}
                >
                    <BriefcaseBusiness size={18} />
                    Explore Opportunities
                </button>

                {/* Navigate to student registration */}
                <button
                    onClick={() => navigate("/register")}
                >
                    <Rocket size={18} />
                    Get Started
                </button>
            </section>

            {/* Opportunity search section */}
            <section className="search-section">
                <h2>Search Opportunities</h2>

                <p>
                    Find the right Full Stack Development job
                    or internship based on your skills,
                    interests and location.
                </p>

                <div className="search-box">

                    {/* Search by job title, skill, or keyword */}
                    <input
                        type="text"
                        placeholder="Search by job title, skill or keyword"
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                    />

                    {/* Select the opportunity type */}
                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
                    >
                        <option value="">
                            Select Type
                        </option>

                        <option value="Job">
                            Jobs
                        </option>

                        <option value="Internship">
                            Internships
                        </option>
                    </select>

                    {/* Search by location */}
                    <input
                        type="text"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) =>
                            setLocation(e.target.value)
                        }
                    />

                    {/* Submit the search */}
                    <button onClick={handleSearch}>
                        <Search size={18} />
                        Search
                    </button>
                </div>
            </section>

            {/* Latest opportunities section */}
            <section className="latest-section">
                <h2>Latest Opportunities</h2>

                <p>
                    Explore the latest Full Stack Development
                    jobs and internships available on our platform.
                </p>

                <div className="opportunity-cards">

                    {/* Opportunity 1: PHP Internship */}
                    <div className="opportunity-card">
                        <h3>Engineer Trainee</h3>

                        <p>
                            <b>Company:</b> L & T
                        </p>

                        <p>
                            <b>Location:</b> Chennai & PAN India
                        </p>

                        <p>
                            <b>Type:</b> Job
                        </p>

                        {/* Open the PHP internship details */}
                        <button
                            onClick={() =>
                                navigate("/opportunity-details", {
                                    state: {
                                        from: "home",
                                        opportunity: {
                                            title: "Engineer Trainee",
                                            company: "L & T",
                                            location:
                                                "Chennai",
                                            type: "Job",
                                            deadline: "11-04-2027 ",
                                            skills:
                                                "JavaScript, TypeScript, React.js, Angular, Node.js, Express.js, REST APIs, GraphQL, MySQL, MongoDB, Git, Web Development, Frontend Development, Backend Development, Debugging, Problem-Solving, Agile Methodology",
                                            eligibility:
                                                "0-2 years",
                                            stipend: "₹4–6 LPA",
                                            companyDescription:
                                                "Larsen & Toubro (L&T) is a major Indian multinational company operating across engineering, technology, construction, and infrastructure. L&T EduTech, its education and skilling business, develops learning solutions and digital platforms designed to help students and professionals build industry-relevant skills.",
                                            description:
                                                "L&T EduTech is looking for an Engineer Trainee to join its Platform Development Team. The role involves developing, enhancing, testing, and maintaining web applications and digital platforms. Responsibilities include building frontend components, supporting backend development, integrating REST and GraphQL APIs, working with databases, debugging issues, documenting code, and collaborating with the team using Agile development practices.",
                                            companyWebsite:
                                                "https://larsentoubrocareers.peoplestrong.com/job/detail/LNT_ET_1891936?reference=LINKEDIN"
                                        }
                                    }
                                })
                            }
                        >
                            <ArrowRight size={18} />
                            View Details
                        </button>
                    </div>

                    {/* Opportunity 2: HPE Software Engineering Intern */}
                    <div className="opportunity-card">
                        <h3>Software Engineering Intern</h3>

                        <p>
                            <b>Company:</b> Hewlett Packard Enterprise (HPE)
                        </p>

                        <p>
                            <b>Location:</b> Bengaluru, Karnataka
                        </p>

                        <p>
                            <b>Type:</b> Internship
                        </p>

                        {/* Open the HPE internship details */}
                        <button
                            onClick={() =>
                                navigate("/opportunity-details", {
                                    state: {
                                        from: "home",
                                        opportunity: {
                                            title:
                                                "Software Engineering Intern",
                                            company:
                                                "Hewlett Packard Enterprise (HPE)",
                                            location:
                                                "Bengaluru, Karnataka",
                                            type: "Internship",
                                            deadline: " ",
                                            skills:
                                                "Basic programming or scripting knowledge (e.g., Python, Java, C++), strong problem-solving and analytical skills",
                                            eligibility: "2027 / 2028",
                                            stipend: "35k per month",
                                            companyDescription:
                                                "Hewlett Packard Enterprise is a global technology company providing IT infrastructure, cloud, networking, and related technology solutions.",
                                            description:
                                                "Join Hewlett Packard Enterprise (HPE) as a Software Engineering Intern to gain hands-on experience, contribute to real-world technology projects, strengthen your software development skills, and learn from experienced engineering teams.",
                                            companyWebsite:
                                                "https://careers.hpe.com/us/en/job/1211844/Intern"
                                        }
                                    }
                                })
                            }
                        >
                            <ArrowRight size={18} />
                            View Details
                        </button>
                    </div>

                    {/* Opportunity 3: HackerRank SDE Intern */}
                    <div className="opportunity-card">
                        <h3>SDE Intern</h3>

                        <p>
                            <b>Company:</b> HackerRank
                        </p>

                        <p>
                            <b>Location:</b> Bangalore
                        </p>

                        <p>
                            <b>Type:</b> Internship
                        </p>

                        {/* Open the HackerRank internship details */}
                        <button
                            onClick={() =>
                                navigate("/opportunity-details", {
                                    state: {
                                        from: "home",
                                        opportunity: {
                                            title: "SDE Intern",
                                            company: "HackerRank",
                                            location: "Bangalore",
                                            type: "Internship",
                                            deadline: " ",
                                            skills: " ",
                                            eligibility:
                                                "2027, 2028 Graduates",
                                            stipend: " ",
                                            companyDescription:
                                                "HackerRank is a technology platform that helps companies assess technical skills and helps developers practice and demonstrate coding abilities.",
                                            description:
                                                "This is a 6-month full-time onsite internship (Jan - June 2027).",
                                            companyWebsite:
                                                "https://www.hackerrank.com/careers/job?id=8229735"
                                        }
                                    }
                                })
                            }
                        >
                            <ArrowRight size={18} />
                            View Details
                        </button>
                    </div>
                </div>
            </section>

            {/* Platform statistics section */}
            <section className="stats-section">
                <h2>Platform Statistics</h2>

                <p>
                    A growing platform connecting students
                    with career opportunities.
                </p>

                <div className="stats-container">

                    {/* Display registered student count */}
                    <div className="stat-card">
                        <h3>
                            {stats.users.toLocaleString("en-IN")}
                        </h3>
                        <p>Registered Users</p>
                    </div>

                    {/* Display published opportunity count */}
                    <div className="stat-card">
                        <h3>
                            {stats.opportunities.toLocaleString("en-IN")}
                        </h3>
                        <p>Opportunities</p>
                    </div>

                    {/* Display unique company count */}
                    <div className="stat-card">
                        <h3>
                            {stats.companies.toLocaleString("en-IN")}
                        </h3>
                        <p>Companies</p>
                    </div>
                </div>
            </section>

            {/* Why Choose SPIT section */}
            <section className="why-section">
                <h2>Why Choose SPIT?</h2>

                <p>
                    Everything you need to discover opportunities
                    and build your career.
                </p>

                <div className="why-cards">

                    {/* Benefit 1: Opportunity variety */}
                    <div className="why-card">
                        <h3>Wide Range of Opportunities</h3>

                        <p>
                            Explore Full Stack Development jobs,
                            internships and software development
                            opportunities.
                        </p>
                    </div>

                    {/* Benefit 2: Career resources */}
                    <div className="why-card">
                        <h3>Career Resources</h3>

                        <p>
                            Access useful resources to improve
                            your skills and prepare for your career.
                        </p>
                    </div>

                    {/* Benefit 3: Opportunity discovery */}
                    <div className="why-card">
                        <h3>Easy to Explore</h3>

                        <p>
                            Search and discover opportunities
                            based on your skills, interests
                            and location.
                        </p>
                    </div>

                    {/* Benefit 4: Company opportunities */}
                    <div className="why-card">
                        <h3>Trusted Companies</h3>

                        <p>
                            Discover Full Stack Development
                            opportunities from companies hiring
                            software and web development talent.
                        </p>
                    </div>
                </div>
            </section>

            {/* Platform features section */}
            <section className="features-section">
                <h2>Our Features</h2>

                <p>
                    Explore the features available on our platform.
                </p>

                <div className="feature-cards">

                    {/* Feature 1: Job listings */}
                    <div className="feature-card">
                        <h3>Job Opportunities</h3>

                        <p>
                            Discover software development and
                            Full Stack Development job openings
                            from companies.
                        </p>
                    </div>

                    {/* Feature 2: Internships */}
                    <div className="feature-card">
                        <h3>Internship Opportunities</h3>

                        <p>
                            Find internships that help you gain
                            practical experience and develop
                            your skills.
                        </p>
                    </div>

                    {/* Feature 3: Search functionality */}
                    <div className="feature-card">
                        <h3>Opportunity Search</h3>

                        <p>
                            Search for opportunities using
                            keywords, type and location.
                        </p>
                    </div>

                    {/* Feature 4: Career development */}
                    <div className="feature-card">
                        <h3>Career Resources</h3>

                        <p>
                            Access resources for resume building,
                            interview preparation and skill development.
                        </p>
                    </div>

                    {/* Feature 5: Application tracking */}
                    <div className="feature-card">
                        <h3>Application Tracking</h3>

                        <p>
                            Keep track of the opportunities
                            you have applied for.
                        </p>
                    </div>

                    {/* Feature 6: Company information */}
                    <div className="feature-card">
                        <h3>Company Information</h3>

                        <p>
                            Explore companies and the opportunities
                            they currently offer.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Export Home for use in the application routes
export default Home
