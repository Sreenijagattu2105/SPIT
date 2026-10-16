import {ChevronLeft,  X,
    Pencil,
    Globe,
    GlobeLock,
    Trash2,
    Save,
    RefreshCw} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  const [opportunities, setOpportunities] = useState(readOpportunities);
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
    description: "",
    eligibility: "",
    deadline: "",
    companyWebsite: "",
    salaryStipend: "",
    status: "Draft"
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const load = () => setOpportunities(readOpportunities());

    window.addEventListener("storage", load);
    window.addEventListener("dashboardDataUpdated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("dashboardDataUpdated", load);
    };
  }, []);

  function saveOpportunities(updated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setOpportunities(updated);
    window.dispatchEvent(new Event("dashboardDataUpdated"));
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
  function addStudentNotification(type, title, company, opportunityId) {
    let existingNotifications = [];

    try {
      const stored = JSON.parse(
        localStorage.getItem("notifications") || "[]"
      );
      existingNotifications = Array.isArray(stored) ? stored : [];
    } catch {
      existingNotifications = [];
    }

    const messages = {
      "opportunity-published":
        `New opportunity: "${title}" at ${company} is available on SPIT.`,
      "opportunity-updated":
        `Opportunity updated: "${title}" at ${company} has new details.`
    };

    const notification = {
      id: Date.now() + 1,
      message: messages[type],
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      read: false,
      type,
      opportunityId,
      opportunityTitle: title,
      company
    };

    localStorage.setItem(
      "notifications",
      JSON.stringify([notification, ...existingNotifications])
    );

    window.dispatchEvent(new Event("notificationsChange"));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
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
      description: form.description.trim(),
      eligibility: form.eligibility.trim(),
      companyWebsite,
      status: form.status || "Draft"
    };

    let updated;
    let successMessage;
    let notificationType = null;

    if (editingId !== null) {
      const previousOpportunity = opportunities.find(
        item => String(item.id) === String(editingId)
      );

      const previousStatus = previousOpportunity?.status || "Draft";

      if (cleanedForm.status === "Published") {
        notificationType =
          previousStatus === "Published"
            ? "opportunity-updated"
            : "opportunity-published";
      } else if (previousStatus === "Published") {
        notificationType = "opportunity-unpublished";
      }

      updated = opportunities.map(item =>
        String(item.id) === String(editingId)
          ? { ...item, ...cleanedForm, id: item.id }
          : item
      );

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

      const newOpportunity = {
        ...cleanedForm,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };

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
          savedOpportunity?.id
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
      description: opportunity.description || "",
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

  function handlePublishToggle(opportunity) {
    const currentStatus = opportunity.status || "Draft";
    const nextStatus =
      currentStatus === "Published" ? "Unpublished" : "Published";

    const updated = opportunities.map(item =>
      String(item.id) === String(opportunity.id)
        ? { ...item, status: nextStatus }
        : item
    );

    saveOpportunities(updated);

    addCoordinatorNotification(
      nextStatus === "Published"
        ? "opportunity-published"
        : "opportunity-unpublished",
      opportunity.title || "Untitled opportunity",
      opportunity.company || "Unknown company"
    );

    // Notify students when the opportunity becomes published.
    if (nextStatus === "Published") {
      addStudentNotification(
        "opportunity-published",
        opportunity.title || "Untitled opportunity",
        opportunity.company || "Unknown company",
        opportunity.id
      );
    }

    alert(
      nextStatus === "Published"
        ? `"${opportunity.title}" published successfully!`
        : `"${opportunity.title}" unpublished successfully!`
    );
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) {
      return;
    }

    const updated = opportunities.filter(
      item => String(item.id) !== String(id)
    );

    saveOpportunities(updated);

    if (String(editingId) === String(id)) {
      setEditingId(null);
      setForm(emptyForm);
    }

    alert("Opportunity deleted successfully!");
  }

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter(item => {
      const matchesSearch =
        `${item.title || ""} ${item.company || ""} ${item.location || ""}`
          .toLowerCase()
          .includes(query);

      const matchesType =
        filterType === "All" || item.type === filterType;

      const status = item.status || "Draft";
      const matchesStatus =
        filterStatus === "All" || status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [opportunities, search, filterType, filterStatus]);

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
              Description *
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
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

          <select
            value={filterType}
            onChange={event => setFilterType(event.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Job">Jobs</option>
            <option value="Internship">Internships</option>
          </select>

          <select
            value={filterStatus}
            onChange={event => setFilterStatus(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Unpublished">Unpublished</option>
          </select>
        </div>

        {filteredOpportunities.length === 0 ? (
          <p>No opportunities found.</p>
        ) : (
          <div className="opportunity-table-wrapper">
            <table className="opportunity-management-table">
              <thead>
                <tr>
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
                {filteredOpportunities.map(item => {
                  const status = item.status || "Draft";

                  return (
                    <tr key={item.id}>
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
