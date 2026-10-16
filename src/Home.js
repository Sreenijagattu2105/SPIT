import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, BriefcaseBusiness, Search, ArrowRight } from "lucide-react";
function Home() {

    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");


    // Search Opportunities
    const handleSearch = () => {

        if (!keyword.trim() && !type && !location.trim()) {
            alert("Please enter at least one search criterion.");
            return;
        }

        navigate("/opportunities", {
            state: {
                keyword,
                type,
                location
            }
        });
    };


    return (
        <div className="home-container">


            {/* Welcome Banner */}

            <section className="welcome-banner">

                <h1>Find Your Next Full Stack Career Opportunity</h1>

<p>
    Discover Full Stack Development jobs, internships and software development
    opportunities from leading technology companies.
</p>

                <button
                    onClick={() => navigate("/opportunities")}
                >
                   <BriefcaseBusiness size={18} /> Explore Opportunities
                </button>

                <button
                    onClick={() => navigate("/register")}
                >
                   <Rocket size={18} /> Get Started
                </button>

            </section>


            {/* Search Opportunities */}

            <section className="search-section">

                <h2>Search Opportunities</h2>

               <p>
    Find the right Full Stack Development job or internship based on your
    skills, interests and location.
</p>

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Search by job title, skill or keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />


                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
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


                    <input
    type="text"
    placeholder="Enter location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
/>


                    <button onClick={handleSearch}>
                        <Search size={18} />Search
                    </button>

                </div>

            </section>


            {/* Latest Opportunities */}

            <section className="latest-section">

                <h2>Latest Opportunities</h2>

                <p>
    Explore the latest Full Stack Development jobs and internships available
    on our platform.
</p>


                <div className="opportunity-cards">


                    {/* Software Developer */}

                    <div className="opportunity-card">

                        <h3>Software Developer</h3>

                        <p>
                            <b>Company:</b> Tech Solutions
                        </p>

                        <p>
                            <b>ocation:</b>L Hyderabad
                        </p>

                        <p>
                           <b> Type:</b> Full Time
                        </p>

                        <button
                            onClick={() =>
                                navigate("/opportunity-details", {
                                    state: {
                                         from: "home",
                                        opportunity: {
                                            title: "Software Developer",
                                            company: "Tech Solutions",
                                            location: "Hyderabad",
                                            type: "Job",
                                            deadline: "10 Oct 2026",
                                            skills:
                                                "Java, SQL, Data Structures, Problem Solving",
                                            eligibility:
                                                "Graduates with programming knowledge",
                                            stipend:
                                                "As per company norms",
                                            description:
                                                "Join Tech Solutions as a Software Developer and work on software development projects using modern technologies.",
                                            companyWebsite:
                                                "https://www.tcs.com/careers"
                                        }
                                    }
                                })
                            }
                        >
                           <ArrowRight size={18} /> View Details
                        </button>

                    </div>


                    {/* Frontend Developer Intern */}

                    <div className="opportunity-card">

                        <h3>Frontend Developer Intern</h3>

                        <p>
                           <b>Company:</b> Innovate Labs
                        </p>

                        <p>
                            <b>Location:</b> Remote
                        </p>

                        <p>
                            <b>Type:</b>
                             Internship
                        </p>

                        <button
                            onClick={() =>
                                navigate("/opportunity-details", {
                                    state: {
                                         from: "home",
                                        opportunity: {
                                            title: "Frontend Developer Intern",
                                            company: "Innovate Labs",
                                            location: "Remote",
                                            type: "Internship",
                                            deadline: "15 Oct 2026",
                                            skills:
                                                "HTML, CSS, JavaScript, React",
                                            eligibility:
                                                "Students with frontend development knowledge",
                                            stipend:
                                                "As per company norms",
                                            description:
                                                "Work with frontend technologies and gain practical experience in building modern web applications.",
                                            companyWebsite:
                                                "https://www.microsoft.com/en-us/careers"
                                        }
                                    }
                                })
                            }
                        >
                           <ArrowRight size={18} /> View Details
                        </button>

                    </div>


                    {/* Java Full Stack Developer */}

<div className="opportunity-card">

    <h3>Java Full Stack Developer</h3>

    <p>
       <b> Company:</b> TechNova Solutions
    </p>

    <p>
        <b>Location:</b> Bangalore
    </p>

    <p>
        <b>Type: </b>Full Time
    </p>

    <button
        onClick={() =>
            navigate("/opportunity-details", {
                state: {
                    from: "home",
                    opportunity: {
                        title: "Java Full Stack Developer",
                        company: "TechNova Solutions",
                        location: "Bangalore",
                        type: "Job",
                        deadline: "25 Oct 2026",
                        skills:
                            "Java, Spring Boot, React, JavaScript, MySQL, REST APIs",
                        eligibility:
                            "Graduates with knowledge of full stack web development",
                        stipend:
                            "As per company norms",
                        description:
                            "Work on full stack web applications using Java, Spring Boot, React, JavaScript and MySQL.",
                        companyWebsite:
                            "https://www.tcs.com/careers"
                    }
                }
            })
        }
    >
       <ArrowRight size={18} /> View Details
    </button>

</div>

                </div>

            </section>

            {/* Featured Companies */}
<section className="companies-section">

    <h2>Featured Companies</h2>

    <p>
        Explore companies offering jobs, internships and career opportunities.
    </p>

    <div className="company-cards">

        {/* TCS */}
        <div className="company-card">
            <h3>TCS</h3>
            <p>Technology & Consulting</p>

            <button
                onClick={() =>
                    navigate("/opportunities", {
                        state: {
                            selectedCompany: "TCS"
                        }
                    })
                }
            >
                <ArrowRight size={18} />View Opportunity
            </button>
        </div>


        {/* Wipro */}
        <div className="company-card">
            <h3>Wipro</h3>
            <p>IT Services & Consulting</p>

            <button
                onClick={() =>
                    navigate("/opportunities", {
                        state: {
                            selectedCompany: "Wipro"
                        }
                    })
                }
            >
               <ArrowRight size={18} /> View Opportunity
            </button>
        </div>


        {/* Deloitte */}
        <div className="company-card">
            <h3>Deloitte</h3>
            <p>Consulting & Professional Services</p>

            <button
                onClick={() =>
                    navigate("/opportunities", {
                        state: {
                            selectedCompany: "Deloitte"
                        }
                    })
                }
            >
              <ArrowRight size={18} />  View Opportunity
            </button>
        </div>


        {/* IBM */}
        <div className="company-card">
            <h3>IBM</h3>
            <p>Technology & Artificial Intelligence</p>

            <button
                onClick={() =>
                    navigate("/opportunities", {
                        state: {
                            selectedCompany: "IBM"
                        }
                    })
                }
            >
                <ArrowRight size={18} />View Opportunity
            </button>
        </div>

    </div>

</section>


            {/* Platform Statistics */}

            <section className="stats-section">

                <h2>Platform Statistics</h2>

                <p>
                    A growing platform connecting students with
                    career opportunities.
                </p>


                <div className="stats-container">

                    <div className="stat-card">

                        <h3>1,200+</h3>

                        <p>Registered Users</p>

                    </div>


                    <div className="stat-card">

                        <h3>350+</h3>

                        <p>Opportunities</p>

                    </div>


                    <div className="stat-card">

                        <h3>100+</h3>

                        <p>Companies</p>

                    </div>

                </div>

            </section>


            {/* Why Choose SPIT */}

            <section className="why-section">

                <h2>Why Choose SPIT?</h2>

                <p>
                    Everything you need to discover opportunities
                    and build your career.
                </p>


                <div className="why-cards">


                    <div className="why-card">

                        <h3>Wide Range of Opportunities</h3>

                       <p>
    Explore Full Stack Development jobs, internships and software development
    opportunities.
</p>

                    </div>


                    <div className="why-card">

                        <h3>Career Resources</h3>

                        <p>
                            Access useful resources to improve your
                            skills and prepare for your career.
                        </p>

                    </div>


                    <div className="why-card">

                        <h3>Easy to Explore</h3>

                        <p>
                            Search and discover opportunities based
                            on your skills, interests and location.
                        </p>

                    </div>


                    <div className="why-card">

                        <h3>Trusted Companies</h3>

                      <p>
    Discover Full Stack Development opportunities from companies hiring
    software and web development talent.
</p>

                    </div>

                </div>

            </section>


            {/* Platform Features */}

            <section className="features-section">

                <h2>Our Features</h2>

                <p>
                    Explore the features available on our platform.
                </p>


                <div className="feature-cards">


                    <div className="feature-card">

                        <h3>Job Opportunities</h3>

                        <p>
    Discover software development and Full Stack Development job openings
    from companies.
</p>

                    </div>


                    <div className="feature-card">

                        <h3>Internship Opportunities</h3>

                        <p>
                            Find internships that help you gain
                            practical experience and develop
                            your skills.
                        </p>

                    </div>


                    <div className="feature-card">

                        <h3>Opportunity Search</h3>

                        <p>
                            Search for opportunities using keywords,
                            type and location.
                        </p>

                    </div>


                    <div className="feature-card">

                        <h3>Career Resources</h3>

                        <p>
                            Access resources for resume building,
                            interview preparation and skill
                            development.
                        </p>

                    </div>


                    <div className="feature-card">

                        <h3>Application Tracking</h3>

                        <p>
                            Keep track of the opportunities you
                            have applied for.
                        </p>

                    </div>


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

export default Home;