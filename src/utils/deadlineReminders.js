// ==========================================
// SPIT - DEADLINE REMINDER SERVICE
// Creates notifications for upcoming opportunity deadlines
// ==========================================


// ==========================================
// 1. CREATE DEADLINE REMINDERS
// Generates reminders for 7, 3, 1, and 0 days
// before an opportunity deadline.
// ==========================================

export function createDeadlineReminders(studentEmail) {
    try {

        // Normalize the student's email address
        const email = String(studentEmail || "").trim().toLowerCase();

        // Create a separate storage key for this student's deleted reminders
        const deletedRemindersKey = `deletedDeadlineReminders:${email}`;

        // Store reminder IDs that the student has deleted
        let deletedReminders = [];

        try {
            const storedDeletedReminders = JSON.parse(
                localStorage.getItem(deletedRemindersKey) || "[]"
            );

            // Accept the stored value only if it is an array
            deletedReminders = Array.isArray(storedDeletedReminders)
                ? storedDeletedReminders
                : [];
        } catch {
            // Use an empty array if the stored data is invalid
            deletedReminders = [];
        }

        // Stop if the student's email is empty
        if (!email) return;

        // Load all opportunities from localStorage
        const opportunities = JSON.parse(
            localStorage.getItem("opportunities") || "[]"
        );

        // Load saved opportunities
        const savedOpportunities = JSON.parse(
            localStorage.getItem("savedOpportunities") || "[]"
        );

        // Load existing notifications
        const allNotifications = JSON.parse(
            localStorage.getItem("notifications") || "[]"
        );


        // ==========================================
        // 2. LOAD STUDENT NOTIFICATION PREFERENCES
        // Read the student's deadline reminder settings.
        // ==========================================

        let preferences = {};

        try {
            preferences = JSON.parse(
                localStorage.getItem(`studentSettings:${email}`) || "{}"
            ) || {};
        } catch {
            // Use default preferences if stored settings are invalid
            preferences = {};
        }

        // Map each reminder interval to its preference key
        const reminderPreferenceKeys = {
            7: "deadline7Days",
            3: "deadline3Days",
            1: "deadline1Day",
            0: "deadlineDay"
        };


        // ==========================================
        // 3. FILTER PUBLISHED AND SAVED OPPORTUNITIES
        // Include published opportunities and opportunities
        // saved by the current student.
        // ==========================================

        const published = (
            Array.isArray(opportunities) ? opportunities : []
        ).filter(item => item.status === "Published");

        // Keep only saved opportunities belonging to this student
        const saved = (
            Array.isArray(savedOpportunities) ? savedOpportunities : []
        ).filter(item =>
            String(item.studentEmail || "").trim().toLowerCase() === email
        );

        // Combine published and saved opportunities.
        // Use a Map to avoid duplicate entries with the same key.
        const relevant = [
            ...new Map(
                [...published, ...saved].map(item => [
                    String(item.id ?? `${item.company}-${item.title}`),
                    item
                ])
            ).values()
        ];


        // ==========================================
        // 4. CALCULATE THE NUMBER OF DAYS REMAINING
        // Compare calendar dates without considering
        // the current time of day.
        // ==========================================

        const today = new Date();

        // Convert today's local calendar date to a UTC timestamp
        const todayUTC = Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        // Reminder intervals: 7 days, 3 days, 1 day, and deadline day
        const reminderDays = [7, 3, 1, 0];

        // Collect newly generated reminders here
        const newReminders = [];


        // ==========================================
        // 5. CHECK EACH OPPORTUNITY DEADLINE
        // Skip opportunities without valid deadlines
        // or outside the configured reminder intervals.
        // ==========================================

        relevant.forEach(opportunity => {

            // Skip opportunities that do not have a deadline
            if (!opportunity.deadline) return;

            // Extract the date in YYYY-MM-DD format
            const match = String(opportunity.deadline).match(
                /^(\d{4})-(\d{2})-(\d{2})/
            );

            // Skip deadlines that do not match the expected format
            if (!match) return;

            // Extract the year, month, and day
            const year = Number(match[1]);
            const month = Number(match[2]);
            const day = Number(match[3]);

            // Convert the deadline date to a UTC timestamp
            const deadlineUTC = Date.UTC(year, month - 1, day);

            // Calculate the whole number of calendar days remaining
            const daysLeft = Math.round(
                (deadlineUTC - todayUTC) / (24 * 60 * 60 * 1000)
            );

            // Create reminders only at the configured intervals
            if (!reminderDays.includes(daysLeft)) return;


            // ==========================================
            // 6. CHECK WHETHER THE REMINDER WAS DELETED
            // Do not recreate a reminder that the student
            // previously deleted.
            // ==========================================

            const reminderKey =
                `${opportunity.id}-${daysLeft}-${opportunity.deadline}`;

            // Skip reminders listed in the deleted-reminders storage
            if (deletedReminders.includes(reminderKey)) return;


            // ==========================================
            // 7. CHECK REMINDER PREFERENCES
            // Respect the student's disabled reminder settings.
            // ==========================================

            const preferenceKey = reminderPreferenceKeys[daysLeft];

            // Missing preferences default to enabled
            if (preferences[preferenceKey] === false) return;


            // ==========================================
            // 8. PREVENT DUPLICATE NOTIFICATIONS
            // Check whether a reminder already exists for
            // this student, opportunity, deadline, and interval.
            // ==========================================

            const alreadyExists = (
                Array.isArray(allNotifications) ? allNotifications : []
            ).some(notification =>
                notification.type === "deadline-reminder" &&
                String(notification.studentEmail || "").trim().toLowerCase() === email &&
                String(notification.opportunityId) === String(opportunity.id) &&
                notification.reminderDaysLeft === daysLeft &&
                notification.deadline === opportunity.deadline
            );

            // Skip if an equivalent reminder already exists
            if (alreadyExists) return;


            // ==========================================
            // 9. GENERATE THE REMINDER MESSAGE
            // Use different messages depending on the
            // number of days remaining.
            // ==========================================

            const message = daysLeft === 0
                ? `Deadline today! Apply for "${opportunity.title}" at ${opportunity.company}.`
                : daysLeft === 1
                    ? `Last day tomorrow! Apply for "${opportunity.title}" at ${opportunity.company}.`
                    : `Reminder: "${opportunity.title}" at ${opportunity.company} has ${daysLeft} days left to apply.`;


            // ==========================================
            // 10. CREATE THE NOTIFICATION OBJECT
            // Store the reminder message and related
            // opportunity details.
            // ==========================================

            newReminders.push({
                // Unique reminder identifier
                id: `deadline-${opportunity.id}-${daysLeft}-${email}`,

                // Student who should receive the reminder
                studentEmail: email,

                // Reminder message displayed to the student
                message,

                // Date when the reminder was generated
                date: today.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }),

                // New notifications are initially unread
                read: false,

                // Identify this notification as a deadline reminder
                type: "deadline-reminder",

                // Store the related opportunity details
                opportunityId: opportunity.id,
                opportunityTitle: opportunity.title,
                company: opportunity.company,
                deadline: opportunity.deadline,

                // Number of days remaining until the deadline
                reminderDaysLeft: daysLeft
            });
        });


        // ==========================================
        // 11. SAVE NEW REMINDERS
        // Add new reminders to the existing notification list
        // only when at least one new reminder is generated.
        // ==========================================

        if (newReminders.length > 0) {
            localStorage.setItem(
                "notifications",
                JSON.stringify([
                    ...newReminders,
                    ...(
                        Array.isArray(allNotifications)
                            ? allNotifications
                            : []
                    )
                ])
            );

            // Notify other components that notifications changed
            window.dispatchEvent(new Event("notificationsChange"));
        }

    } catch (error) {

        // Log errors without crashing the application
        console.error("Unable to create deadline reminders:", error);
    }
}
