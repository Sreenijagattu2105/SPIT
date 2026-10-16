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

const ROUND_OPTIONS = [
  "Online Assessment",
  "Aptitude Test",
  "Technical Interview",
  "Coding Round",
  "HR Interview",
  "Managerial Interview",
  "Other"
];

const ROUND_STATUSES = [
  "Upcoming",
  "Completed",
  "Cleared",
  "Not Cleared",
  "Rescheduled",
  "Cancelled"
];

const OVERALL_STATUSES = [
  "Applied",
  "In Progress",
  "Selected",
  "Rejected",
  "Withdrawn"
];

function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
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
  const [roundStatus, setRoundStatus] = useState("Upcoming");
  const [roundNotes, setRoundNotes] = useState("");

  const [editingNotes, setEditingNotes] = useState({});
  const [editingStatus, setEditingStatus] = useState({});
  const [editingOverallStatus, setEditingOverallStatus] = useState(false);
  const [draftOverallStatus, setDraftOverallStatus] = useState("Applied");

  useEffect(() => {
    function reloadData() {
      setApplications(readArray(APPLICATIONS_KEY));
      setProgress(readArray(PROGRESS_KEY));
    }

    window.addEventListener("storage", reloadData);
    window.addEventListener("dashboardDataUpdated", reloadData);

    return () => {
      window.removeEventListener("storage", reloadData);
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

  function saveProgress(updatedProgress) {
    try {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify(updatedProgress)
      );

      setProgress(updatedProgress);

      window.dispatchEvent(new Event("dashboardDataUpdated"));

      return true;
    } catch (error) {
      console.error("Could not save interview progress:", error);

      showMessage(
        "Unable to save interview progress. Please check your browser storage."
      );

      return false;
    }
  }

  function addRound(event) {
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

    const existing = progress.find(
      (item) => item.applicationKey === selectedKey
    );

    const newRound = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: finalRoundName,
      date: roundDate,
      status: roundStatus,
      notes: roundNotes.trim()
    };

    const updatedItem = {
      applicationKey: selectedKey,
      applicationId: selectedApplication.id ?? null,
      company: selectedApplication.company || "Company not specified",
      title: selectedApplication.title || "Untitled Opportunity",
      overallStatus: existing?.overallStatus || "In Progress",
      rounds: [...(existing?.rounds || []), newRound],
      updatedAt: new Date().toISOString()
    };

    const updatedProgress = existing
      ? progress.map((item) =>
          item.applicationKey === selectedKey ? updatedItem : item
        )
      : [...progress, updatedItem];

    if (!saveProgress(updatedProgress)) return;

    setRoundName("Online Assessment");
    setCustomRound("");
    setRoundDate("");
    setRoundStatus("Upcoming");
    setRoundNotes("");

    showMessage("Interview round added successfully.");
  }

  function startStatusEdit(round) {
    setEditingStatus((previous) => ({
      ...previous,
      [round.id]: round.status || "Upcoming"
    }));
  }

  function saveRoundStatus(roundId) {
    const newStatus = editingStatus[roundId];

    if (!newStatus) {
      showMessage("Please select a status.");
      return;
    }

    const updatedProgress = progress.map((item) => {
      if (item.applicationKey !== selectedKey) return item;

      return {
        ...item,
        rounds: item.rounds.map((round) =>
          round.id === roundId
            ? { ...round, status: newStatus }
            : round
        ),
        updatedAt: new Date().toISOString()
      };
    });

    if (!saveProgress(updatedProgress)) return;

    setEditingStatus((previous) => {
      const next = { ...previous };
      delete next[roundId];
      return next;
    });

    showMessage("Interview round status updated successfully.");
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

  function saveRoundNotes(roundId) {
    const notes = editingNotes[roundId];

    const updatedProgress = progress.map((item) => {
      if (item.applicationKey !== selectedKey) return item;

      return {
        ...item,
        rounds: item.rounds.map((round) =>
          round.id === roundId
            ? { ...round, notes: notes ?? round.notes ?? "" }
            : round
        ),
        updatedAt: new Date().toISOString()
      };
    });

    if (!saveProgress(updatedProgress)) return;

    setEditingNotes((previous) => {
      const next = { ...previous };
      delete next[roundId];
      return next;
    });

    showMessage("Notes saved successfully.");
  }

  function cancelNotesEdit(roundId) {
    setEditingNotes((previous) => {
      const next = { ...previous };
      delete next[roundId];
      return next;
    });
  }

  function removeRound(roundId) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this interview round?"
    );

    if (!confirmed) return;

    const updatedProgress = progress.map((item) => {
      if (item.applicationKey !== selectedKey) return item;

      return {
        ...item,
        rounds: item.rounds.filter((round) => round.id !== roundId),
        updatedAt: new Date().toISOString()
      };
    });

    if (!saveProgress(updatedProgress)) return;

    setEditingNotes((previous) => {
      const next = { ...previous };
      delete next[roundId];
      return next;
    });

    setEditingStatus((previous) => {
      const next = { ...previous };
      delete next[roundId];
      return next;
    });

    showMessage("Interview round removed successfully.");
  }

  function startOverallStatusEdit() {
    setDraftOverallStatus(
      selectedProgress?.overallStatus || "Applied"
    );
    setEditingOverallStatus(true);
  }

  function saveOverallStatus() {
    if (!selectedApplication) return;

    const existing = progress.find(
      (item) => item.applicationKey === selectedKey
    );

    const updatedItem = {
      applicationKey: selectedKey,
      applicationId: selectedApplication.id ?? null,
      company: selectedApplication.company || "Company not specified",
      title: selectedApplication.title || "Untitled Opportunity",
      overallStatus: draftOverallStatus,
      rounds: existing?.rounds || [],
      updatedAt: new Date().toISOString()
    };

    const updatedProgress = existing
      ? progress.map((item) =>
          item.applicationKey === selectedKey ? updatedItem : item
        )
      : [...progress, updatedItem];

    if (!saveProgress(updatedProgress)) return;

    setEditingOverallStatus(false);
    showMessage("Overall interview status updated successfully.");
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
                    {selectedProgress?.overallStatus || "Applied"}
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
                        {OVERALL_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
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
                          selectedProgress?.overallStatus || "Applied"
                        }
                        disabled
                        readOnly
                      />

                      <div className="interview-note-actions">
                        <button
                          type="button"
                          className="interview-secondary-button"
                          onClick={startOverallStatusEdit}
                        >
                         <Pencil size={18} />  Edit Status
                        </button>
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

                  <label className="interview-field">
                    <strong>Round Status</strong>

                    <select
                      value={roundStatus}
                      onChange={(event) =>
                        setRoundStatus(event.target.value)
                      }
                    >
                      {ROUND_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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
                                {ROUND_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
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
