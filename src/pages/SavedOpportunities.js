
import { useEffect, useState } from "react";

function SavedOpportunities() {
  const [savedOpportunities, setSavedOpportunities] = useState([]);

  // Safely read saved opportunities
  const loadSavedOpportunities = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("savedOpportunities") || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.error("Error loading saved opportunities:", error);
      return [];
    }
  };

  // Check upcoming deadlines and create daily student reminders
  const checkDeadlineReminders = (opportunities) => {
    try {
      const today = new Date();

      const todayUTC = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const todayKey = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("-");

      let sentReminders = [];

      try {
        const existingSent = JSON.parse(
          localStorage.getItem("deadlineReminderSent") || "[]"
        );
        sentReminders = Array.isArray(existingSent) ? existingSent : [];
      } catch {
        sentReminders = [];
      }

      let notifications = [];

      try {
        const storedNotifications = JSON.parse(
          localStorage.getItem("notifications") || "[]"
        );
        notifications = Array.isArray(storedNotifications)
          ? storedNotifications
          : [];
      } catch {
        notifications = [];
      }

      const newNotifications = [];
      const newlySent = [];

      opportunities.forEach((opportunity) => {
        if (!opportunity.deadline) return;

        const parts = String(opportunity.deadline)
          .split("-")
          .map(Number);

        if (
          parts.length !== 3 ||
          parts.some((part) => !Number.isInteger(part)) ||
          parts[0] < 1000 ||
          parts[1] < 1 ||
          parts[1] > 12 ||
          parts[2] < 1 ||
          parts[2] > 31
        ) {
          return;
        }

        const [year, month, day] = parts;
        const deadlineUTC = Date.UTC(year, month - 1, day);
        const deadlineDate = new Date(year, month - 1, day);

        if (
          deadlineDate.getFullYear() !== year ||
          deadlineDate.getMonth() !== month - 1 ||
          deadlineDate.getDate() !== day
        ) {
          return;
        }

        const daysRemaining = Math.round(
          (deadlineUTC - todayUTC) / 86400000
        );

        if (daysRemaining < 0 || daysRemaining > 3) return;

        const opportunityKey =
          opportunity.id != null
            ? String(opportunity.id)
            : `${opportunity.company || ""}-${opportunity.title || ""}`;

        const reminderKey = `${opportunityKey}-${opportunity.deadline}`;
        const dailyReminderKey = `${reminderKey}-${todayKey}`;

        if (sentReminders.includes(dailyReminderKey)) return;

        const title = opportunity.title || "Saved opportunity";
        const company = opportunity.company || "the company";

        let deadlineMessage;

        if (daysRemaining === 0) {
          deadlineMessage = "The application deadline is today!";
        } else if (daysRemaining === 1) {
          deadlineMessage = "The application deadline is tomorrow.";
        } else {
          deadlineMessage = `The application deadline is in ${daysRemaining} days.`;
        }

        newNotifications.push({
          id: Date.now() + newNotifications.length,
          message: `Deadline reminder: ${title} at ${company}. ${deadlineMessage}`,
          date: today.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          read: false,
          type: "deadline-reminder",
          opportunityId: opportunity.id,
          opportunityTitle: title,
          company,
          deadline: opportunity.deadline,
        });

        newlySent.push(dailyReminderKey);
      });

      if (newNotifications.length > 0) {
        localStorage.setItem(
          "notifications",
          JSON.stringify([...newNotifications, ...notifications])
        );

        localStorage.setItem(
          "deadlineReminderSent",
          JSON.stringify([...sentReminders, ...newlySent])
        );

        window.dispatchEvent(new Event("notificationsChange"));
      }
    } catch (error) {
      console.error("Error checking deadline reminders:", error);
    }
  };

  // Load opportunities and check reminders
  useEffect(() => {
    const loadAndCheck = () => {
      const opportunities = loadSavedOpportunities();
      setSavedOpportunities(opportunities);
      checkDeadlineReminders(opportunities);
    };

    loadAndCheck();

    window.addEventListener("savedOpportunitiesChange", loadAndCheck);
    window.addEventListener("storage", loadAndCheck);

    return () => {
      window.removeEventListener("savedOpportunitiesChange", loadAndCheck);
      window.removeEventListener("storage", loadAndCheck);
    };
  }, []);

  // Remove a saved opportunity
  const handleRemove = (opportunityToRemove) => {
    const updatedOpportunities = savedOpportunities.filter(
      (opportunity) =>
        !(
          opportunity.company === opportunityToRemove.company &&
          opportunity.title === opportunityToRemove.title
        )
    );

    localStorage.setItem(
      "savedOpportunities",
      JSON.stringify(updatedOpportunities)
    );

    setSavedOpportunities(updatedOpportunities);

    window.dispatchEvent(new Event("savedOpportunitiesChange"));

    alert("Opportunity removed from saved list.");
  };

  return (
    <div className="container mt-4 saved-opportunities-page">
      <h2 className="mb-4">Saved Opportunities</h2>


<p className="saved-opportunities-subtitle">
    Keep your favorite career opportunities saved in one place
    and access them whenever you're ready to apply.
</p>
      {savedOpportunities.length === 0 ? (
        <div className="alert alert-info">
          You have not saved any opportunities yet.
        </div>
      ) : (
        <div className="row">
          {savedOpportunities.map((opportunity, index) => (
            <div
              className="col-md-6 col-lg-4 mb-4"
              key={opportunity.id ?? index}
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{opportunity.title}</h5>

                  <p className="card-text">
                    <strong>Company:</strong> {opportunity.company}
                  </p>

                  <p className="card-text">
                    <strong>Location:</strong>{" "}
                    {opportunity.location || "Not specified"}
                  </p>

                  <p className="card-text">
                    <strong>Type:</strong>{" "}
                    {opportunity.type || "Not specified"}
                  </p>

                  <p className="card-text">
                    <strong>Deadline:</strong>{" "}
                    {opportunity.deadline || "Not specified"}
                  </p>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemove(opportunity)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedOpportunities;
