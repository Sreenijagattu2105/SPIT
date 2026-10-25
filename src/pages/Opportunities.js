import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";


import { ArrowRight, FilterX, Bookmark, House } from "lucide-react";


async function getCoordinatorOpportunities() {
    const response = await fetch(
        "http://localhost:8080/spit-backend/api/student/opportunities",
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load published opportunities."
        );
    }

    return data.map((item) => ({
        ...item,
        id: item.id ?? item.opportunity_id,
        company: item.company ?? item.company_name ?? "",
        companyDescription:
            item.companyDescription ?? item.company_description ?? "",
        description: item.description ?? item.job_description ?? "",
        type:
            (item.type ?? item.opportunity_type ?? "").toUpperCase() === "JOB"
                ? "Job"
                : "Internship",
        salaryStipend:
            item.salaryStipend ?? item.salary_stipend ?? "",
        companyWebsite:
            item.companyWebsite ?? item.company_website ?? "",
        status:
            (item.status || "").toUpperCase() === "PUBLISHED"
                ? "Published"
                : item.status,
    }));
}




function Opportunities() {

    const location = useLocation();

    const navigate = useNavigate();



    const selectedCompany = location.state?.selectedCompany || "";



    const [search, setSearch] = useState(location.state?.keyword || "");

    const [type, setType] = useState(location.state?.type || "");

    const [locationFilter, setLocationFilter] = useState(

        location.state?.location || ""

    );

    const [sortBy, setSortBy] = useState("");

    const [allOpportunities, setAllOpportunities] = useState([]);

    const [savedOpportunities, setSavedOpportunities] = useState(() => {

        try {

            const data = JSON.parse(

                localStorage.getItem("savedOpportunities") || "[]"

            );

            return Array.isArray(data) ? data : [];

        } catch {

            return [];

        }

    });




    useEffect(() => {
        let isActive = true;

        const loadOpportunities = async () => {
            try {
                const published = await getCoordinatorOpportunities();

                if (isActive) {
                    setAllOpportunities(
                        published.filter(
                            (item) =>
                                String(item.status).toUpperCase() === "PUBLISHED"
                        )
                    );
                }
            } catch (error) {
                console.error("Error loading student opportunities:", error);

                if (isActive) {
                    setAllOpportunities([]);
                }
            }
        };

        loadOpportunities();

        return () => {
            isActive = false;
        };
    }, []);


    const handleSave = async (opportunity) => {
        if (
            localStorage.getItem("isLoggedIn") !== "true" ||
            localStorage.getItem("userRole") !== "student"
        ) {
            alert("Please login as a student to save an opportunity.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/spit-backend/api/student/saved-opportunities`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        opportunityId: opportunity.id,
                    }),
                }
            );

            const data = await response.json();

            if (response.status === 409) {
                alert("Opportunity already saved.");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to save the opportunity."
                );
            }

            const savedOpportunity = {
                ...opportunity,
                saved: true,
            };

            setSavedOpportunities((previous) => [
                ...previous.filter(
                    (item) => String(item.id) !== String(opportunity.id)
                ),
                savedOpportunity,
            ]);

            window.dispatchEvent(new Event("savedOpportunitiesChange"));

            alert("Opportunity saved successfully!");
        } catch (error) {
            console.error("Error saving opportunity:", error);
            alert(error.message || "Unable to save the opportunity.");
        }
    };




    const filteredOpportunities = allOpportunities.filter(opportunity => {

        const company = String(opportunity.company || "");

        const title = String(opportunity.title || "");

        const skills = Array.isArray(opportunity.skills)

            ? opportunity.skills.join(" ")

            : String(opportunity.skills || "");

        const opportunityLocation = String(opportunity.location || "");



        const matchesCompany =

            !selectedCompany ||

            company.toLowerCase() === selectedCompany.toLowerCase();



        const searchText = search.toLowerCase().trim();

        const matchesSearch =

            title.toLowerCase().includes(searchText) ||

            company.toLowerCase().includes(searchText) ||

            skills.toLowerCase().includes(searchText);



        const matchesType = !type || opportunity.type === type;



        const matchesLocation =

            !locationFilter ||

            opportunityLocation.toLowerCase().includes(

                locationFilter.toLowerCase()

            );



        return matchesCompany && matchesSearch && matchesType && matchesLocation;

    });



    const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {

        if (sortBy === "company") {

            return String(a.company || "").localeCompare(String(b.company || ""));

        }

        if (sortBy === "title") {

            return String(a.title || "").localeCompare(String(b.title || ""));

        }

        return 0;

    });



    const clearFilters = () => {

        setSearch("");

        setType("");

        setLocationFilter("");

        setSortBy("");

        navigate("/opportunities", { replace: true, state: {} });

    };



    return (

        <div className="opportunities-container">

            {!selectedCompany && (

                <>

                    <h1>OPPORTUNITIES</h1>



                    <div className="filters">

                        <input

                            type="text"

                            placeholder="Search by title, company or skill"

                            value={search}

                            onChange={event => setSearch(event.target.value)}

                        />



                        <select value={type}

                            onChange={event => setType(event.target.value)}>

                            <option value="">All Types</option>

                            <option value="Job">Job</option>

                            <option value="Internship">Internship</option>

                        </select>



                        <input

                            type="text"

                            placeholder="Enter location"

                            value={locationFilter}

                            onChange={event => setLocationFilter(event.target.value)}

                        />



                        <select value={sortBy}

                            onChange={event => setSortBy(event.target.value)}>

                            <option value="">Sort By</option>

                            <option value="company">Company</option>

                            <option value="title">Title</option>

                        </select>



                        <button onClick={clearFilters}><FilterX size={18} />Clear Filters</button>

                    </div>

                </>

            )}



            <div className="opportunity-cards">

                {sortedOpportunities.length > 0 ? (

                    sortedOpportunities.map(opportunity => (

                        <div className="opportunity-card" key={opportunity.id}>

                            <h2>{opportunity.company}</h2>

                            <h2>{opportunity.title}</h2>
                            <p><strong>Location:</strong> {opportunity.location || "Not specified"}</p>
                            <p><strong>Type:</strong> {opportunity.type || "Not specified"}</p>
                            <p>
                                <strong>Salary / Stipend:</strong>{" "}
                                {opportunity.salaryStipend || "Not specified"}
                            </p>

                            <p>

                                <strong>Skills:</strong>{" "}

                                {Array.isArray(opportunity.skills)

                                    ? opportunity.skills.join(", ")

                                    : opportunity.skills || "Not specified"}

                            </p>

                            <p><strong>Deadline:</strong> {opportunity.deadline || "Not specified"}</p>


                            <div className="opportunity-actions">
                                <button
                                    className="view-details-button"
                                    onClick={() =>
                                        navigate("/opportunity-details", {
                                            state: {
                                                from: "opportunities",
                                                opportunity
                                            }
                                        })
                                    }
                                >
                                    <ArrowRight size={18} />
                                    View Details
                                </button>




                                {localStorage.getItem("isLoggedIn") === "true" &&

                                    localStorage.getItem("userRole") === "student" && (

                                        <button
                                            className="save-opportunity-button"
                                            onClick={() => handleSave(opportunity)}
                                        >
                                            <Bookmark size={18} /> Save Opportunity
                                        </button>

                                    )}



                                {selectedCompany && (

                                    <button onClick={() => navigate("/")}>

                                        <House size={18} />Back to Home

                                    </button>

                                )}
                            </div>
                        </div>

                    ))

                ) : (

                    <p className="no-opportunities-message">

                        {allOpportunities.length === 0

                            ? "No published opportunities available yet. Please check again later."

                            : "No opportunities match your search or filters."}

                    </p>

                )}

            </div>

        </div>

    );

}


export default Opportunities;