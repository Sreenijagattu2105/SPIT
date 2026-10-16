import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import staticOpportunities from "../opportunitiesData";
import {  Share2, ArrowRight, FilterX, Bookmark, House } from "lucide-react";


function getCoordinatorOpportunities() {

          try {

                    const data = JSON.parse(

                              localStorage.getItem("opportunities") || "[]"

                    );

                    return Array.isArray(data) ? data : [];

          } catch {

                    return [];

          }

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

                    const loadOpportunities = () => {

                              const coordinatorOpportunities = getCoordinatorOpportunities();



                              // Only published coordinator opportunities are public.

                              const published = coordinatorOpportunities.filter(

                                        item => item.status === "Published"

                              );



                              const combined = [...staticOpportunities, ...published];



                              // Coordinator records take priority if IDs match.

                              const unique = combined.reduce((result, item) => {

                                        const index = result.findIndex(

                                                  existing => String(existing.id) === String(item.id)

                                        );



                                        if (index === -1) {

                                                  result.push(item);

                                        } else {

                                                  result[index] = item;

                                        }



                                        return result;

                              }, []);



                              setAllOpportunities(unique);

                    };



                    loadOpportunities();



                    window.addEventListener("storage", loadOpportunities);

                    window.addEventListener("dashboardDataUpdated", loadOpportunities);



                    return () => {

                              window.removeEventListener("storage", loadOpportunities);

                              window.removeEventListener("dashboardDataUpdated", loadOpportunities);

                    };

          }, []);



          
const handleShare = (opportunity) => {
    const shareUrl =
        `${window.location.origin}/opportunity-details?id=${encodeURIComponent(opportunity.id)}`;

    const message =
        `Check out this opportunity at ${opportunity.company}: ${opportunity.title}\n\n${shareUrl}`;

    const whatsappUrl =
        `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};




          const handleSave = opportunity => {

                    if (

                              localStorage.getItem("isLoggedIn") !== "true" ||

                              localStorage.getItem("userRole") !== "student"

                    ) {

                              alert("Please login as a student to save an opportunity.");

                              navigate("/login");

                              return;

                    }



                    const alreadySaved = savedOpportunities.some(

                              item => String(item.id) === String(opportunity.id)

                    );



                    if (alreadySaved) {

                              alert("Opportunity already saved.");

                              return;

                    }



                    const updatedSaved = [...savedOpportunities, opportunity];

                    setSavedOpportunities(updatedSaved);

                    localStorage.setItem("savedOpportunities", JSON.stringify(updatedSaved));



                    let existingNotifications = [];



                    try {

                              existingNotifications = JSON.parse(

                                        localStorage.getItem("notifications") || "[]"

                              );

                              if (!Array.isArray(existingNotifications)) {

                                        existingNotifications = [];

                              }

                    } catch {

                              existingNotifications = [];

                    }



                    const newNotification = {

                              id: Date.now(),

                              message: `Opportunity Saved: You saved the ${opportunity.title} opportunity at ${opportunity.company}.`,

                              date: new Date().toLocaleDateString("en-GB", {

                                        day: "2-digit",

                                        month: "short",

                                        year: "numeric"

                              }),

                              read: false

                    };



                    localStorage.setItem(

                              "notifications",

                              JSON.stringify([newNotification, ...existingNotifications])

                    );



                    window.dispatchEvent(new Event("notificationsChange"));

                    alert("Opportunity saved successfully!");

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
                                                                      <button onClick={() =>

                                                                                navigate("/opportunity-details", {

                                                                                          state: {

                                                                                                    from: "opportunities",

                                                                                                    opportunity

                                                                                          }

                                                                                })

                                                                      }>

                                                                                <ArrowRight size={18} />View Details

                                                                      </button>
                                                                     <button
    className="share-opportunity-button"
    onClick={() => handleShare(opportunity)}
>
    <Share2 size={18} /> Share
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

                                                  <p>

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