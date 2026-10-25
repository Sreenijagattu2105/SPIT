import {
  Pencil,
  Save,
  X,
  Plus,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const APPLICATIONS_KEY = "startedApplications";
const PROGRESS_KEY = "interviewProgress";


function addCoordinatorNotification(notification, preferenceKey) {
  try {
    let preferences = {};

    try {
      preferences = JSON.parse(
        localStorage.getItem(
          "coordinatorNotificationPreferences"
        ) || "{}"
      ) || {};
    } catch {
      preferences = {};
    }

    // Do not create a notification when its preference is disabled.
    // If no preference has been saved, keep notifications enabled.
    if (preferences[preferenceKey] === false) {
      return;
    }

    const stored = JSON.parse(
      localStorage.getItem("coordinatorNotifications") || "[]"
    );

    const notifications = Array.isArray(stored) ? stored : [];

    localStorage.setItem(
      "coordinatorNotifications",
      JSON.stringify([notification, ...notifications])
    );

    window.dispatchEvent(
      new Event("coordinatorNotificationsChange")
    );
  } catch (error) {
    console.error(
      "Could not save coordinator notification:",
      error
    );
  }
}


function getCurrentStudentEmail() {
  try {
    const user = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    return String(user?.email || "").trim().toLowerCase();
  } catch {
    return "";
  }
}

function getCurrentStudentName() {
  try {
    const user = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    return (
      user?.name ||
      user?.fullName ||
      user?.studentName ||
      "Student"
    );
  } catch {
    return "Student";
  }
}

const ROUND_OPTIONS = [
  "Online Assessment",
  "Aptitude Test",
  "Technical Interview",
  "Coding Round",
  "HR Interview",
  "Managerial Interview",
  "Other"
];

const OVERALL_STATUSES = [
  "Applied",
  "In Progress",
  "Shortlisted",
  "Selected",
  "Rejected",
  "Withdrawn"
];

const ROUND_STATUSES = [
  "Upcoming",
  "Scheduled",
  "In Progress",
  "Shortlisted",
  "Completed",
  "Cleared",
  "Not Cleared",
  "Rescheduled",
  "Cancelled"
];

const FINAL_STATUSES = ["Selected", "Rejected", "Withdrawn"];

function getAvailableOverallStatuses(currentStatus) {
  const currentIndex = OVERALL_STATUSES.indexOf(currentStatus);

  if (FINAL_STATUSES.includes(currentStatus)) {
    return [currentStatus];
  }

  return OVERALL_STATUSES.filter((status, index) => {
    return index >= currentIndex || status === "Withdrawn";
  });
}


function readArray(key) {
  try {
    const data = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    if (!Array.isArray(data)) return [];

    const email = getCurrentStudentEmail();

    if (!email) return [];

    // Interview progress records belong to individual students.
    if (key === PROGRESS_KEY) {
      return data.filter(
        item =>
          String(item.studentEmail || "")
            .trim()
            .toLowerCase() === email
      );
    }

    // Show only the logged-in student's applications.
    return data.filter(
      application =>
        String(application.studentEmail || "")
          .trim()
          .toLowerCase() === email
    );
  } catch {
    return [];
  }
}


function getApplicationKey(application) {
  return String(
    application.applicationId ||
    `${application.studentEmail || ""}_${application.id || ""}_${application.company || ""}_${application.title || ""}`
  );
}

function InterviewProgress() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState(() =>
    readArray(APPLICATIONS_KEY)
  );

  const [progress, setProgress] = useState(() =>
    readArray(PROGRESS_KEY)
  );

  const [selectedKey, setSelectedKey] = useState("");

  const [roundName, setRoundName] = useState("Online Assessment");
  const [customRound, setCustomRound] = useState("");
  const [roundDate, setRoundDate] = useState("");

  const [roundNotes, setRoundNotes] = useState("");

  const [editingNotes, setEditingNotes] = useState({});
  const [editingStatus, setEditingStatus] = useState({});
  const [editingOverallStatus, setEditingOverallStatus] = useState(false);
  const [draftOverallStatus, setDraftOverallStatus] = useState("Applied");



  useEffect(() => {
    let active = true;

    async function reloadData() {
      try {
        const [applicationsResponse, roundsResponse] =
          await Promise.all([
            fetch(
              "http://localhost:8080/spit-backend/api/student/applications",
              { credentials: "include" }
            ),
            fetch(
              "http://localhost:8080/spit-backend/api/student/interview-progress",
              { credentials: "include" }
            )
          ]);

        const applicationsData = await applicationsResponse.json();
        const roundsData = await roundsResponse.json();

        if (!applicationsResponse.ok) {
          throw new Error(
            applicationsData.message ||
            "Unable to load applications."
          );
        }

        if (!roundsResponse.ok) {
          throw new Error(
            roundsData.message ||
            "Unable to load interview rounds."
          );
        }

        if (!active) return;

        const loadedApplications = applicationsData.map(item => ({
          ...item,
          id: item.id ?? item.opportunityId ?? item.opportunity_id,
          applicationId:
            item.applicationId ?? item.application_id,
          company: item.company ?? item.company_name ?? "",
          studentEmail: getCurrentStudentEmail(),
          type:
            String(item.type ?? "").toUpperCase() === "JOB"
              ? "Job"
              : "Internship",
          appliedDate: item.appliedAt
            ? new Date(item.appliedAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }
            )
            : "Not recorded"
        }));

        const loadedProgress = loadedApplications.map(application => {
          const applicationRounds = roundsData
            .filter(
              round =>
                String(round.applicationId) ===
                String(application.applicationId)
            )
            .map(round => ({
              id: round.roundId,
              name: round.name,
              date: round.scheduledAt
                ? String(round.scheduledAt).slice(0, 10)
                : "",
              status: String(round.status || "UPCOMING")
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, letter =>
                  letter.toUpperCase()
                ),
              notes: round.notes || ""
            }));

          const statusMap = {
            APPLIED: "Applied",
            IN_PROGRESS: "In Progress",
            SHORTLISTED: "Shortlisted",
            SELECTED: "Selected",
            REJECTED: "Rejected",
            WITHDRAWN: "Withdrawn"
          };

          const rawStatus = String(
            application.status || "APPLIED"
          ).toUpperCase();

          return {
            studentEmail: getCurrentStudentEmail(),
            applicationKey: getApplicationKey(application),
            applicationId: application.applicationId,
            company: application.company,
            title: application.title || "Untitled Opportunity",
            overallStatus: statusMap[rawStatus] || "Applied",
            rounds: applicationRounds
          };
        });

        setApplications(loadedApplications);
        setProgress(loadedProgress);
      } catch (error) {
        console.error(
          "Unable to load Interview Progress:",
          error
        );
      }
    }

    reloadData();

    window.addEventListener("dashboardDataUpdated", reloadData);

    return () => {
      active = false;
      window.removeEventListener("dashboardDataUpdated", reloadData);
    };
  }, []);



  const selectedApplication = applications.find(
    (application) => getApplicationKey(application) === selectedKey
  );

  const selectedProgress = progress.find(
    (item) => item.applicationKey === selectedKey
  );

  function showMessage(text) {
    window.alert(text);
  }

  async function addRound(event) {
    event.preventDefault();

    if (!selectedApplication) {
      showMessage("Please select an application first.");
      return;
    }

    const finalRoundName =
      roundName === "Other" ? customRound.trim() : roundName;

    if (!finalRoundName) {
      showMessage("Please enter the interview round name.");
      return;
    }

    if (!selectedApplication.applicationId) {
      showMessage("Application ID is missing. Please reload the page.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/spit-backend/api/student/interview-progress",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            applicationId: selectedApplication.applicationId,
            name: finalRoundName,
            date: roundDate || null,
            status: "UPCOMING",
            notes: roundNotes.trim()
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to add interview round."
        );
      }

      const date = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      addCoordinatorNotification({
        id: Date.now(),
        message: `${getCurrentStudentName()} (${getCurrentStudentEmail()}) added a ${finalRoundName} interview round for ${selectedApplication.title || "an opportunity"} at ${selectedApplication.company || "the company"}.`,
        date,
        read: false,
        type: "interview-round-added",
        studentEmail: getCurrentStudentEmail(),
        opportunityId: selectedApplication.id ?? null
      }, "interviewRoundAdded");

      setRoundName("Online Assessment");
      setCustomRound("");
      setRoundDate("");
      setRoundNotes("");

      window.dispatchEvent(new Event("dashboardDataUpdated"));
      showMessage("Interview round added successfully.");

    } catch (error) {
      console.error("Unable to add interview round:", error);
      showMessage(error.message || "Unable to add interview round.");
    }
  }


  function startStatusEdit(round) {
    setEditingStatus((previous) => ({
      ...previous,
      [round.id]: round.status || "Upcoming"
    }));
  }


  async function saveRoundStatus(roundId) {
    const newStatus = editingStatus[roundId];

    if (!newStatus) {
      showMessage("Please select a status.");
      return;
    }

    const application = selectedApplication;
    if (!application) return;

    const currentProgress = progress.find(
      item => item.applicationKey === selectedKey
    );

    const previousRound = currentProgress?.rounds?.find(
      round => String(round.id) === String(roundId)
    );

    if (!previousRound) {
      showMessage("Interview round not found. Please reload the page.");
      return;
    }

    const previousStatus = previousRound.status || "Upcoming";

    const previousIndex = ROUND_STATUSES.indexOf(previousStatus);
    const newIndex = ROUND_STATUSES.indexOf(newStatus);

    if (
      previousIndex !== -1 &&
      newIndex !== -1 &&
      newIndex < previousIndex
    ) {
      showMessage("You cannot move a round back to an earlier status.");
      return;
    }

    if (previousStatus === newStatus) {
      cancelStatusEdit(roundId);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/spit-backend/api/student/interview-progress/${roundId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus.toUpperCase().replace(/\s+/g, "_")
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to update interview round status."
        );
      }

      const updatedProgress = progress.map(item => {
        if (item.applicationKey !== selectedKey) return item;

        return {
          ...item,
          rounds: item.rounds.map(round =>
            String(round.id) === String(roundId)
              ? { ...round, status: newStatus }
              : round
          ),
          updatedAt: new Date().toISOString()
        };
      });

      setProgress(updatedProgress);

      const date = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      addCoordinatorNotification({
        id: Date.now(),
        message: `${getCurrentStudentName()} (${getCurrentStudentEmail()}) updated the ${previousRound.name} round status for ${application.title || "an opportunity"} at ${application.company || "the company"} from "${previousStatus}" to "${newStatus}".`,
        date,
        read: false,
        type: "interview-round-status-update",
        studentEmail: getCurrentStudentEmail(),
        opportunityId: application.id ?? null
      }, "interviewRoundStatusUpdated");

      setEditingStatus(previous => {
        const next = { ...previous };
        delete next[roundId];
        return next;
      });

      showMessage("Interview round status updated successfully.");
    } catch (error) {
      console.error("Could not update interview round status:", error);
      showMessage(
        error.message || "Unable to update interview round status."
      );
    }
  }


  function cancelStatusEdit(roundId) {
    setEditingStatus((previous) => {
      const next = { ...previous };
      delete next[roundId];
      return next;
    });
  }

  function startNotesEdit(round) {
    setEditingNotes((previous) => ({
      ...previous,
      [round.id]: round.notes || ""
    }));
  }


  async function saveRoundNotes(roundId) {
    const notes = editingNotes[roundId];

    const currentProgress = progress.find(
      item => item.applicationKey === selectedKey
    );

    const existingRound = currentProgress?.rounds?.find(
      round => String(round.id) === String(roundId)
    );

    if (!existingRound) {
      showMessage("Interview round not found. Please reload the page.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/spit-backend/api/student/interview-progress/${roundId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            notes: notes ?? existingRound.notes ?? ""
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to save interview notes."
        );
      }

      const updatedProgress = progress.map(item => {
        if (item.applicationKey !== selectedKey) return item;

        return {
          ...item,
          rounds: item.rounds.map(round =>
            String(round.id) === String(roundId)
              ? {
                ...round,
                notes: notes ?? round.notes ?? ""
              }
              : round
          ),
          updatedAt: new Date().toISOString()
        };
      });

      setProgress(updatedProgress);

      setEditingNotes(previous => {
        const next = { ...previous };
        delete next[roundId];
        return next;
      });

      showMessage("Notes saved successfully.");
    } catch (error) {
      console.error("Could not save interview notes:", error);
      showMessage(error.message || "Unable to save interview notes.");
    }
  }


  function cancelNotesEdit(roundId) {
    setEditingNotes((previous) => {
      const next = { ...previous };
      delete next[roundId];
      return next;
    });
  }


  async function removeRound(roundId) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this interview round?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8080/spit-backend/api/student/interview-progress/${roundId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to remove interview round."
        );
      }

      const updatedProgress = progress.map(item => {
        if (item.applicationKey !== selectedKey) return item;

        return {
          ...item,
          rounds: item.rounds.filter(
            round => String(round.id) !== String(roundId)
          ),
          updatedAt: new Date().toISOString()
        };
      });

      setProgress(updatedProgress);

      setEditingNotes(previous => {
        const next = { ...previous };
        delete next[roundId];
        return next;
      });

      setEditingStatus(previous => {
        const next = { ...previous };
        delete next[roundId];
        return next;
      });

      showMessage("Interview round removed successfully.");
    } catch (error) {
      console.error("Could not remove interview round:", error);
      showMessage(
        error.message || "Unable to remove interview round."
      );
    }
  }

  function startOverallStatusEdit() {
    setDraftOverallStatus(
      selectedProgress?.overallStatus || "Applied"
    );
    setEditingOverallStatus(true);
  }


  async function saveOverallStatus() {
    if (!selectedApplication) return;

    const existing = progress.find(
      item => item.applicationKey === selectedKey
    );

    const previousStatus = existing?.overallStatus || "Applied";

    if (previousStatus === draftOverallStatus) {
      setEditingOverallStatus(false);
      return;
    }

    const availableStatuses = getAvailableOverallStatuses(previousStatus);

    if (!availableStatuses.includes(draftOverallStatus)) {
      showMessage(
        "You cannot move an application back to an earlier status."
      );
      return;
    }

    // Use the database application ID, not the opportunity ID.
    const applicationId = selectedApplication.applicationId;

    if (!applicationId) {
      showMessage("Application ID is missing. Please reload the page.");
      return;
    }

    const statusMap = {
      "Applied": "APPLIED",
      "In Progress": "IN_PROGRESS",
      "Shortlisted": "SHORTLISTED",
      "Selected": "SELECTED",
      "Rejected": "REJECTED",
      "Withdrawn": "WITHDRAWN"
    };

    try {
      const response = await fetch(
        `http://localhost:8080/spit-backend/api/student/applications/${applicationId}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: statusMap[draftOverallStatus]
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update application status."
        );
      }

      const updatedItem = {
        ...existing,
        studentEmail: getCurrentStudentEmail(),
        applicationKey: selectedKey,
        applicationId,
        company: selectedApplication.company || "Company not specified",
        title: selectedApplication.title || "Untitled Opportunity",
        overallStatus: draftOverallStatus,
        rounds: existing?.rounds || [],
        updatedAt: new Date().toISOString()
      };

      const updatedProgress = existing
        ? progress.map(item =>
          item.applicationKey === selectedKey ? updatedItem : item
        )
        : [...progress, updatedItem];

      setProgress(updatedProgress);

      setEditingOverallStatus(false);

      window.dispatchEvent(new Event("dashboardDataUpdated"));

      showMessage("Overall application status updated successfully.");
    } catch (error) {
      console.error("Could not update application status:", error);
      showMessage(error.message || "Failed to update application status.");
    }
  }


  function cancelOverallStatusEdit() {
    setDraftOverallStatus(
      selectedProgress?.overallStatus || "Applied"
    );
    setEditingOverallStatus(false);
  }

  return (
    <div className="my-applications-container interview-progress-page">
      <div className="interview-page-header">
        <h1>INTERVIEW PROGRESS</h1>
        <p>
          Track interview rounds, dates and results you receive from
          companies for opportunities applied to through SPIT.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="interview-panel interview-empty">
          <h2>No Applications Found</h2>
          <p>
            Apply for an opportunity through SPIT and click
            "I've Applied" to begin tracking interview progress.
          </p>

          <button
            type="button"
            onClick={() => navigate("/opportunities")}
          >
            Explore Opportunities
          </button>
        </div>
      ) : (
        <>
          {/* Select an application */}
          <section className="interview-panel">
            <label
              className="interview-field"
              htmlFor="progress-application"
            >
              <strong>Select an Application</strong>

              <select
                id="progress-application"
                value={selectedKey}
                onChange={(event) => {
                  setSelectedKey(event.target.value);
                  setEditingNotes({});
                  setEditingStatus({});
                  setEditingOverallStatus(false);
                }}
              >
                <option value="">-- Select an application --</option>

                {applications.map((application, index) => (
                  <option
                    key={`${getApplicationKey(application)}-${index}`}
                    value={getApplicationKey(application)}
                  >
                    {application.company || "Unknown company"}
                    {" — "}
                    {application.title || "Untitled opportunity"}
                    {" ("}
                    {application.appliedDate || "Date not recorded"}
                    {")"}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {selectedApplication && (
            <>
              {/* Company and overall status */}
              <section className="interview-panel">
                <div className="interview-company-heading">
                  <div>
                    <p className="interview-eyebrow">COMPANY</p>

                    <h2>
                      {selectedApplication.company ||
                        "Company not specified"}
                    </h2>

                    <p className="interview-job-title">
                      {selectedApplication.title ||
                        "Untitled Opportunity"}
                    </p>
                  </div>

                  <span className="interview-status-chip">
                    {selectedProgress?.overallStatus ||
                      selectedApplication.status ||
                      "Applied"}
                  </span>
                </div>

                <p>
                  <strong>Applied Date:</strong>{" "}
                  {selectedApplication.appliedDate || "Not recorded"}
                </p>

                <div className="interview-field">
                  <strong>Overall Interview Status</strong>

                  {editingOverallStatus ? (
                    <>
                      <select
                        value={draftOverallStatus}
                        onChange={(event) =>
                          setDraftOverallStatus(event.target.value)
                        }
                      >
                        {OVERALL_STATUSES.map((status, index) => {
                          const currentStatus =
                            selectedProgress?.overallStatus ||
                            selectedApplication.status ||
                            "Applied";

                          const currentIndex = OVERALL_STATUSES.indexOf(currentStatus);

                          return (
                            <option
                              key={status}
                              value={status}
                              disabled={
                                index < currentIndex &&
                                status !== "Withdrawn"
                              }
                            >
                              {status}
                            </option>
                          );
                        })}
                      </select>

                      <div className="interview-note-actions">
                        <button
                          type="button"
                          onClick={saveOverallStatus}
                        >
                          <Save size={18} /> Save Status
                        </button>

                        <button
                          type="button"
                          className="interview-secondary-button"
                          onClick={cancelOverallStatusEdit}
                        >
                          <X size={18} />  Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={
                          selectedProgress?.overallStatus ||
                          selectedApplication.status ||
                          "Applied"
                        }
                        disabled
                        readOnly
                      />

                      <div className="interview-note-actions">
                        {!FINAL_STATUSES.includes(
                          selectedProgress?.overallStatus ||
                          selectedApplication.status ||
                          "Applied"
                        ) && (
                            <button
                              type="button"
                              className="interview-secondary-button"
                              onClick={startOverallStatusEdit}
                            >
                              <Pencil size={18} /> Edit Status
                            </button>
                          )}
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Add interview round */}
              <section className="interview-panel">
                <h2>Add Interview Round</h2>

                <p className="interview-muted">
                  Enter details based on updates you receive directly
                  from the company.
                </p>

                <form
                  onSubmit={addRound}
                  className="interview-round-form"
                >
                  <label className="interview-field">
                    <strong>Round Name</strong>

                    <select
                      value={roundName}
                      onChange={(event) =>
                        setRoundName(event.target.value)
                      }
                    >
                      {ROUND_OPTIONS.map((round) => (
                        <option key={round} value={round}>
                          {round}
                        </option>
                      ))}
                    </select>
                  </label>

                  {roundName === "Other" && (
                    <label className="interview-field">
                      <strong>Custom Round Name</strong>

                      <input
                        type="text"
                        value={customRound}
                        onChange={(event) =>
                          setCustomRound(event.target.value)
                        }
                        placeholder="Enter round name"
                        required
                      />
                    </label>
                  )}

                  <label className="interview-field">
                    <strong>Interview Date</strong>

                    <input
                      type="date"
                      value={roundDate}
                      onChange={(event) =>
                        setRoundDate(event.target.value)
                      }
                    />
                  </label>



                  <label className="interview-field full-width">
                    <strong>Notes / Result</strong>

                    <textarea
                      value={roundNotes}
                      onChange={(event) =>
                        setRoundNotes(event.target.value)
                      }
                      placeholder="Example: Cleared the coding round"
                      rows={3}
                    />
                  </label>

                  <div className="interview-form-actions full-width">
                    <button type="submit">
                      <Plus size={18} /> Add Interview Round
                    </button>
                  </div>
                </form>
              </section>

              {/* One outer blue box contains heading, description and rounds */}
              <section className="interview-panel interview-timeline-panel">
                <h2>Interview Timeline</h2>

                <p className="interview-muted">
                  Update each round as you receive new information from
                  the company.
                </p>

                {!selectedProgress?.rounds?.length ? (
                  <div className="interview-no-rounds">
                    <p>No interview rounds added yet.</p>
                    <span>
                      Your interview rounds will appear here after you
                      add them.
                    </span>
                  </div>
                ) : (
                  <div className="interview-timeline">
                    {selectedProgress.rounds.map((round, index) => {
                      const isEditingStatus =
                        Object.prototype.hasOwnProperty.call(
                          editingStatus,
                          round.id
                        );

                      const isEditingNotes =
                        Object.prototype.hasOwnProperty.call(
                          editingNotes,
                          round.id
                        );

                      return (
                        <article
                          className="interview-round-card"
                          key={round.id}
                        >
                          <div className="interview-round-top">
                            <div className="interview-round-number">
                              {index + 1}
                            </div>

                            <div className="interview-round-title">
                              <h3>{round.name}</h3>
                              <p>
                                {round.date
                                  ? `Date: ${round.date}`
                                  : "Date not specified"}
                              </p>
                            </div>

                            <span
                              className={`interview-round-badge ${(round.status || "Upcoming")
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {round.status || "Upcoming"}
                            </span>
                          </div>

                          <div className="interview-round-body">
                            {/* Round status */}
                            <div className="interview-field">
                              <strong>Round Status</strong>

                              <select
                                value={
                                  isEditingStatus
                                    ? editingStatus[round.id]
                                    : ROUND_STATUSES.includes(round.status)
                                      ? round.status
                                      : "Upcoming"
                                }
                                disabled={!isEditingStatus}
                                onChange={(event) =>
                                  setEditingStatus((previous) => ({
                                    ...previous,
                                    [round.id]: event.target.value
                                  }))
                                }
                              >
                                {ROUND_STATUSES.map((status, index) => {
                                  const currentStatus = round.status || "Upcoming";
                                  const currentIndex = ROUND_STATUSES.indexOf(currentStatus);

                                  return (
                                    <option
                                      key={status}
                                      value={status}
                                      disabled={index < currentIndex}
                                    >
                                      {status}
                                    </option>
                                  );
                                })}
                              </select>

                              <div className="interview-note-actions">
                                {isEditingStatus ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        saveRoundStatus(round.id)
                                      }
                                    >
                                      <Save size={18} /> Save Status
                                    </button>

                                    <button
                                      type="button"
                                      className="interview-secondary-button"
                                      onClick={() =>
                                        cancelStatusEdit(round.id)
                                      }
                                    >
                                      <X size={18} />  Cancel
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className="interview-secondary-button"
                                    onClick={() =>
                                      startStatusEdit(round)
                                    }
                                  >
                                    <Pencil size={18} />  Edit Status
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Round notes */}
                            <div className="interview-field">
                              <strong>Notes / Result</strong>

                              <textarea
                                rows={3}
                                value={
                                  isEditingNotes
                                    ? editingNotes[round.id]
                                    : round.notes || ""
                                }
                                disabled={!isEditingNotes}
                                onChange={(event) =>
                                  setEditingNotes((previous) => ({
                                    ...previous,
                                    [round.id]: event.target.value
                                  }))
                                }
                                placeholder="No notes added"
                              />

                              <div className="interview-note-actions">
                                {isEditingNotes ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        saveRoundNotes(round.id)
                                      }
                                    >
                                      <Save size={18} />
                                      Save Notes
                                    </button>

                                    <button
                                      type="button"
                                      className="interview-secondary-button"
                                      onClick={() =>
                                        cancelNotesEdit(round.id)
                                      }
                                    >
                                      <X size={18} />   Cancel
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className="interview-secondary-button"
                                    onClick={() =>
                                      startNotesEdit(round)
                                    }
                                  >
                                    <Pencil size={18} />   Edit Notes
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Remove round */}
                            <div className="interview-delete-row">
                              <button
                                type="button"
                                className="interview-danger-button"
                                onClick={() => removeRound(round.id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </>
      )}


    </div>
  );
}

export default InterviewProgress;
