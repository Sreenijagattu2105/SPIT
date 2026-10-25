// Import icons used by the opportunity management page.
import {
  ChevronLeft, X,
  Pencil,
  Globe,
  GlobeLock,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react";

// Import React hooks.
import { useEffect, useMemo, useState } from "react";

// Import navigation.
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "opportunities";

function readOpportunities() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function CoordinatorOpportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const emptyForm = {
    title: "",
    company: "",
    type: "Job",
    location: "",
    companyDescription: "",
    description: "",
    skills: "",
    eligibility: "",
    deadline: "",
    companyWebsite: "",
    salaryStipend: "",
    status: "Draft"
  };

  const [form, setForm] = useState(emptyForm);


  useEffect(() => {
    async function loadOpportunities() {
      try {
        const response = await fetch(
          "http://localhost:8080/spit-backend/api/coordinator/opportunities",
          {
            method: "GET",
            credentials: "include"
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load opportunities.");
        }
        setOpportunities(
          data.map((item) => ({
            ...item,
            company: item.company ?? item.company_name ?? "",
            companyDescription:
              item.companyDescription ?? item.company_description ?? "",
            description:
              item.description ?? item.job_description ?? "",
            type: item.type ?? item.opportunity_type ?? "",
            salaryStipend:
              item.salaryStipend ?? item.salary_stipend ?? "",
            companyWebsite:
              item.companyWebsite ?? item.company_website ?? "",
            createdAt: item.createdAt ?? item.created_at ?? "",
            status: item.status ?? "Draft",
          }))
        );


      } catch (error) {
        console.error("Error loading opportunities:", error);
        setMessage(error.message);
      }
    }

    loadOpportunities();
  }, []);


  function saveOpportunities(updated) {
    setOpportunities(updated);
  }

  // Create a notification for the coordinator.
  function addCoordinatorNotification(type, title, company) {
    let existingNotifications = [];

    try {
      const stored = JSON.parse(
        localStorage.getItem("coordinatorNotifications") || "[]"
      );
      existingNotifications = Array.isArray(stored) ? stored : [];
    } catch {
      existingNotifications = [];
    }

    const messages = {
      "opportunity-published":
        `Opportunity published: "${title}" at ${company} is now available to students.`,
      "opportunity-updated":
        `Opportunity updated: "${title}" at ${company} has been updated.`,
      "opportunity-unpublished":
        `Opportunity unpublished: "${title}" at ${company} is no longer published.`
    };

    const notification = {
      id: Date.now(),
      message: messages[type],
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      read: false,
      type,
      opportunityTitle: title,
      company
    };

    localStorage.setItem(
      "coordinatorNotifications",
      JSON.stringify([notification, ...existingNotifications])
    );

    window.dispatchEvent(new Event("coordinatorNotificationsChange"));
  }

  // Create a notification for students.



  function addStudentNotification(type, title, company, opportunityId, changes = []) {
    let existingNotifications = [];
    let students = [];

    try {
      const storedNotifications = JSON.parse(
        localStorage.getItem("notifications") || "[]"
      );
      existingNotifications = Array.isArray(storedNotifications)
        ? storedNotifications
        : [];

      const storedStudents = JSON.parse(
        localStorage.getItem("students") || "[]"
      );
      students = Array.isArray(storedStudents) ? storedStudents : [];
    } catch {
      console.error("Unable to read students or notifications.");
      return;
    }

    const preferenceKey =
      type === "opportunity-published"
        ? "opportunityPublished"
        : type === "opportunity-updated"
          ? "opportunityUpdated"
          : null;

    if (!preferenceKey) return;

    const date = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const newNotifications = [];

    students.forEach(student => {
      const studentEmail = String(student.email || "")
        .trim()
        .toLowerCase();

      if (!studentEmail) return;

      let preferences = {};

      try {
        preferences = JSON.parse(
          localStorage.getItem(`studentSettings:${studentEmail}`) || "{}"
        );
      } catch {
        preferences = {};
      }

      // Missing preferences default to enabled.
      if (preferences[preferenceKey] === false) return;

      newNotifications.push({
        id: `${Date.now()}-${studentEmail}-${type}-${opportunityId}`,
        studentEmail,

        message:
          type === "opportunity-published"
            ? `New opportunity: "${title}" at ${company} is available on SPIT.`
            : changes.length > 0
              ? `Opportunity updated: "${title}" at ${company}. Changes: ${changes.join("; ")}.`
              : `Opportunity updated: "${title}" at ${company} has new details.`,

        date,
        read: false,
        type,
        opportunityId,
        opportunityTitle: title,
        company
      });
    });

    if (newNotifications.length > 0) {
      localStorage.setItem(
        "notifications",
        JSON.stringify([...newNotifications, ...existingNotifications])
      );

      window.dispatchEvent(new Event("notificationsChange"));
    }
  }






  function handleChange(event) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }

  async function createOpportunityInBackend(opportunity) {
    const response = await fetch(
      "http://localhost:8080/spit-backend/api/coordinator/opportunities",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(opportunity),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save opportunity.");
    }

    return data;
  }

  async function updateOpportunityInBackend(id, opportunity) {
    const response = await fetch(
      `http://localhost:8080/spit-backend/api/coordinator/opportunities/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...opportunity,
          type: opportunity.type.toUpperCase(),
          status: opportunity.status.toUpperCase(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update opportunity.");
    }

    return data;
  }



  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (
      !form.title.trim() ||
      !form.company.trim() ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (
      form.deadline &&
      form.deadline < new Date().toISOString().slice(0, 10)
    ) {
      setMessage("Please choose today or a future deadline.");
      return;
    }

    const companyWebsite = form.companyWebsite.trim();

    if (companyWebsite) {
      try {
        const url = new URL(companyWebsite);

        if (!["https:", "http:"].includes(url.protocol)) {
          setMessage("Please enter a valid application URL.");
          return;
        }
      } catch {
        setMessage("Enter a valid URL, including https://.");
        return;
      }
    }


    const cleanedForm = {
      ...form,
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      companyDescription: form.companyDescription.trim(),
      description: form.description.trim(),
      skills: form.skills.trim(),
      eligibility: form.eligibility.trim(),
      companyWebsite,
      status: form.status || "Draft"
    };

    let updated;
    let successMessage;
    let notificationType = null;
    let changedDetails = [];


    if (editingId !== null) {
      const previousOpportunity = opportunities.find(
        (item) => String(item.id) === String(editingId)
      );

      const previousStatus = previousOpportunity?.status || "Draft";

      try {
        await updateOpportunityInBackend(editingId, cleanedForm);

        const response = await fetch(
          "http://localhost:8080/spit-backend/api/coordinator/opportunities",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to reload opportunities.");
        }

        updated = data.map((item) => ({
          ...item,
          company: item.company ?? item.company_name ?? "",
          companyDescription:
            item.companyDescription ?? item.company_description ?? "",
          description: item.description ?? item.job_description ?? "",
          type: item.type ?? item.opportunity_type ?? "",
          salaryStipend: item.salaryStipend ?? item.salary_stipend ?? "",
          companyWebsite: item.companyWebsite ?? item.company_website ?? "",
          status: item.status ?? "Draft",
        }));
      } catch (error) {
        setMessage(error.message || "Unable to update opportunity.");
        return;
      }

      if (cleanedForm.status === "Published") {
        notificationType =
          previousStatus === "Published"
            ? "opportunity-updated"
            : "opportunity-published";
      } else if (previousStatus === "Published") {
        notificationType = "opportunity-unpublished";
      }

      if (notificationType === "opportunity-updated") {
        const fieldsToCompare = [
          ["title", "Opportunity title"],
          ["company", "Company"],
          ["type", "Opportunity type"],
          ["location", "Location"],
          ["companyDescription", "Company description"],
          ["description", "Job description"],
          ["skills", "Required skills"],
          ["eligibility", "Eligibility criteria"],
          ["deadline", "Application deadline"],
          ["companyWebsite", "Official application URL"],
          ["salaryStipend", "Salary / stipend"],
        ];

        changedDetails = fieldsToCompare
          .filter(([key]) => {
            const oldValue = String(
              key === "description"
                ? previousOpportunity?.description ?? ""
                : previousOpportunity?.[key] ?? ""
            ).trim();

            const newValue = String(cleanedForm[key] ?? "").trim();

            return oldValue !== newValue;
          })
          .map(([key, label]) => `${label} changed`);
      }

      successMessage =
        cleanedForm.status === "Published"
          ? "Opportunity updated and published successfully!"
          : cleanedForm.status === "Unpublished"
            ? "Opportunity updated and unpublished successfully!"
            : "Opportunity updated successfully!";
    } else {

      if (cleanedForm.status === "Published") {
        notificationType = "opportunity-published";
      }


      let newOpportunity;

      try {
        const result = await createOpportunityInBackend({
          ...cleanedForm,
          type: cleanedForm.type.toUpperCase(),
          status: cleanedForm.status.toUpperCase()
        });

        newOpportunity = {
          ...cleanedForm,
          id: result.id,
          createdAt: new Date().toISOString()
        };
      } catch (error) {
        setMessage(error.message || "Unable to save opportunity.");
        return;
      }

      updated = [...opportunities, newOpportunity];




      successMessage =
        cleanedForm.status === "Published"
          ? "Opportunity published successfully!"
          : cleanedForm.status === "Unpublished"
            ? "Opportunity saved as unpublished successfully!"
            : "Opportunity saved as draft successfully!";
    }

    saveOpportunities(updated);

    if (notificationType) {
      addCoordinatorNotification(
        notificationType,
        cleanedForm.title,
        cleanedForm.company
      );

      // Notify students when an opportunity is published or updated.
      if (
        notificationType === "opportunity-published" ||
        notificationType === "opportunity-updated"
      ) {
        const savedOpportunity =
          editingId !== null
            ? updated.find(
              item => String(item.id) === String(editingId)
            )
            : updated[updated.length - 1];

        addStudentNotification(
          notificationType,
          cleanedForm.title,
          cleanedForm.company,
          savedOpportunity?.id,
          notificationType === "opportunity-updated"
            ? changedDetails
            : []
        );
      }
    }

    setForm(emptyForm);
    setEditingId(null);
    alert(successMessage);
  }

  function handleEdit(opportunity) {
    setForm({
      title: opportunity.title || "",
      company: opportunity.company || "",
      type: opportunity.type || "Job",
      location: opportunity.location || "",
      companyDescription: opportunity.companyDescription || "",
      description: opportunity.jobDescription || opportunity.description || "",
      skills: Array.isArray(opportunity.skills)
        ? opportunity.skills.join(", ")
        : opportunity.skills || "",
      eligibility: opportunity.eligibility || "",
      deadline: opportunity.deadline || "",
      companyWebsite: opportunity.companyWebsite || "",
      salaryStipend: opportunity.salaryStipend || "",
      status: opportunity.status || "Draft"
    });

    setEditingId(opportunity.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  async function handlePublishToggle(opportunity) {
    const currentStatus = String(opportunity.status || "Draft").toUpperCase();

    const nextStatus =
      currentStatus === "PUBLISHED" ? "UNPUBLISHED" : "PUBLISHED";

    try {
      await updateOpportunityInBackend(opportunity.id, {
        ...opportunity,
        status: nextStatus
      });

      const response = await fetch(
        "http://localhost:8080/spit-backend/api/coordinator/opportunities",
        {
          method: "GET",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to reload opportunities.");
      }

      const updated = data.map((item) => ({
        ...item,
        company: item.company ?? item.company_name ?? "",
        companyDescription:
          item.companyDescription ?? item.company_description ?? "",
        description: item.description ?? item.job_description ?? "",
        type:
          String(item.type ?? item.opportunity_type ?? "").toUpperCase() === "JOB"
            ? "Job"
            : "Internship",
        salaryStipend: item.salaryStipend ?? item.salary_stipend ?? "",
        companyWebsite: item.companyWebsite ?? item.company_website ?? "",
        status:
          String(item.status || "DRAFT").toUpperCase() === "PUBLISHED"
            ? "Published"
            : String(item.status || "DRAFT").toUpperCase() === "UNPUBLISHED"
              ? "Unpublished"
              : "Draft"
      }));

      saveOpportunities(updated);

      addCoordinatorNotification(
        nextStatus === "PUBLISHED"
          ? "opportunity-published"
          : "opportunity-unpublished",
        opportunity.title || "Untitled opportunity",
        opportunity.company || "Unknown company"
      );

      if (nextStatus === "PUBLISHED") {
        addStudentNotification(
          "opportunity-published",
          opportunity.title || "Untitled opportunity",
          opportunity.company || "Unknown company",
          opportunity.id
        );
      }

      alert(
        nextStatus === "PUBLISHED"
          ? `"${opportunity.title}" published successfully!`
          : `"${opportunity.title}" unpublished successfully!`
      );
    } catch (error) {
      console.error("Publish/Unpublish error:", error);
      alert(error.message || "Unable to update opportunity status.");
    }
  }



  async function handleDelete(id) {
    const opportunity = opportunities.find(
      (item) => String(item.id) === String(id)
    );

    if (!opportunity) {
      alert("Opportunity not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${opportunity.title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8080/spit-backend/api/coordinator/opportunities/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete opportunity.");
      }

      // Reload the list from the backend.
      const reloadResponse = await fetch(
        "http://localhost:8080/spit-backend/api/coordinator/opportunities",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const updated = await reloadResponse.json();

      if (!reloadResponse.ok) {
        throw new Error("Deleted, but unable to reload opportunities.");
      }

      saveOpportunities(
        updated.map((item) => ({
          ...item,
          company: item.company ?? item.company_name ?? "",
          companyDescription:
            item.companyDescription ?? item.company_description ?? "",
          description: item.description ?? item.job_description ?? "",
          type:
            (item.type ?? item.opportunity_type ?? "").toUpperCase() === "JOB"
              ? "Job"
              : "Internship",
          salaryStipend: item.salaryStipend ?? item.salary_stipend ?? "",
          companyWebsite: item.companyWebsite ?? item.company_website ?? "",
          status: (item.status || "DRAFT").toUpperCase() === "PUBLISHED"
            ? "Published"
            : (item.status || "DRAFT").toUpperCase() === "UNPUBLISHED"
              ? "Unpublished"
              : "Draft",
        }))
      );

      alert("Opportunity deleted successfully!");
    } catch (error) {
      console.error("Delete opportunity error:", error);
      alert(error.message || "Unable to delete opportunity.");
    }
  }


  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const company = String(item.company || "").toLowerCase();
      const location = String(item.location || "").toLowerCase();

      return (
        title.includes(query) ||
        company.includes(query) ||
        location.includes(query)
      );
    });
  }, [opportunities, search]);
  return (
    <div className="coordinator-dashboard-container">
      <div className="coordinator-page-heading">
        <h1>MANAGE &amp; PUBLISH OPPORTUNITIES</h1>
      </div>
      <section className="coordinator-welcome">
        <p>
          Create opportunities, save drafts, and publish listings for students.
        </p>
      </section>

      <section className="coordinator-summary">
        <h2>{editingId !== null ? "Edit Opportunity" : "Add Opportunity"}</h2>

        {message && <p role="alert">{message}</p>}

        <form onSubmit={handleSubmit} className="opportunity-form">
          <div className="opportunity-form-grid">
            <label>
              Opportunity Title *
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Company Name *
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                required
              />
            </label>
            <label className="opportunity-full-width">
              Company Description
              <textarea
                name="companyDescription"
                rows="4"
                placeholder="Enter information about the company..."
                value={form.companyDescription}
                onChange={handleChange}
              />
            </label>
            <label>
              Type *
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="Job">Job</option>
                <option value="Internship">Internship</option>
              </select>
            </label>

            <label>
              Location *
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Salary / Stipend
              <input
                type="text"
                name="salaryStipend"
                placeholder="e.g. ₹6 LPA or ₹15,000/month"
                value={form.salaryStipend}
                onChange={handleChange}
              />
            </label>

            <label>
              Deadline
              <input
                type="date"
                name="deadline"
                min={new Date().toISOString().slice(0, 10)}
                value={form.deadline}
                onChange={handleChange}
              />
            </label>

            <label>
              Eligibility
              <input
                name="eligibility"
                value={form.eligibility}
                onChange={handleChange}
              />
            </label>

            <label className="opportunity-full-width">
              Official Application URL
              <input
                type="url"
                name="companyWebsite"
                placeholder="https://company.com/careers"
                value={form.companyWebsite}
                onChange={handleChange}
              />
            </label>

            <label className="opportunity-full-width">
              Job Description *
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the role and responsibilities..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>

            <label className="opportunity-full-width">
              Skills Required
              <input
                type="text"
                name="skills"
                placeholder="e.g. Java, SQL, React"
                value={form.skills}
                onChange={handleChange}
              />
            </label>

            <label>
              Publishing Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
              </select>
            </label>
          </div>

          <button type="submit">
            {editingId !== null ? (
              <>
                <RefreshCw size={18} />
                Update Opportunity
              </>
            ) : form.status === "Published" ? (
              <>
                <Globe size={18} />
                Publish Opportunity
              </>
            ) : form.status === "Unpublished" ? (
              <>
                <GlobeLock size={18} />
                Save as Unpublished
              </>
            ) : (
              <>
                <Save size={18} />
                Save as Draft
              </>
            )}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setMessage("");
              }}
            >
              <X size={18} />  Cancel Edit
            </button>
          )}
        </form>
      </section>

      <section className="coordinator-summary">
        <h2>All Opportunities ({opportunities.length})</h2>

        <div className="opportunity-toolbar">
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search title, company or location..."
          />


        </div>

        {filteredOpportunities.length === 0 ? (
          <p>No opportunities found.</p>
        ) : (
          <div className="opportunity-table-wrapper">
            <table className="opportunity-management-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Official URL</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredOpportunities.map((item, index) => {
                  const rawStatus = String(item.status || "DRAFT").toUpperCase();

                  const status =
                    rawStatus === "PUBLISHED"
                      ? "Published"
                      : rawStatus === "UNPUBLISHED"
                        ? "Unpublished"
                        : "Draft";


                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>{item.company}</td>
                      <td>{item.type}</td>
                      <td>{item.deadline || "Not specified"}</td>

                      <td>
                        <span
                          className={`opportunity-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {item.companyWebsite ? (
                          <a
                            href={item.companyWebsite}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open URL
                          </a>
                        ) : (
                          "Not added"
                        )}
                      </td>

                      <td className="opportunity-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil size={18} />
                        </button>


                        <button
                          type="button"
                          onClick={() => handlePublishToggle(item)}
                        >
                          {status === "Published" ? (
                            <>
                              <GlobeLock size={18} />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Globe size={18} />
                              Publish
                            </>
                          )}
                        </button>


                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="coordinator-back-section">
        <button
          type="button"
          onClick={() => navigate("/coordinator-dashboard")}
        >
          <ChevronLeft size={18} /> Back to Dashboard
        </button>
      </section>
    </div>
  );
}

export default CoordinatorOpportunities;
