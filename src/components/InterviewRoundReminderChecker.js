/*
 * InterviewRoundReminderChecker.js
 * --------------------------------
 * Checks students' interview rounds and creates reminders
 * one day before scheduled interview rounds.
 */

// Import the useEffect hook from React.
import { useEffect } from "react";

/**
 * Creates reminders for interview rounds scheduled for tomorrow.
 *
 * Retrieves the student's interview progress and existing notifications
 * from localStorage, then creates reminders for eligible interview rounds.
 */
function createInterviewRoundReminders() {
    try {
        // Retrieve the currently logged-in user's details.
        const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "null"
        );

        const registeredUser = JSON.parse(
            localStorage.getItem("registeredUser") || "null"
        );

        // Retrieve and normalize the student's email address.
        const email = String(
            currentUser?.email ||
            registeredUser?.email ||
            ""
        )
            .trim()
            .toLowerCase();

        // Stop if the student's email address is unavailable.
        if (!email) {
            return;
        }

        // Retrieve interview progress from localStorage.
        const storedProgress = JSON.parse(
            localStorage.getItem("interviewProgress") || "[]"
        );

        // Ensure interview progress is an array.
        const progress = Array.isArray(storedProgress)
            ? storedProgress
            : [];

        // Retrieve existing student notifications from localStorage.
        const storedNotifications = JSON.parse(
            localStorage.getItem("notifications") || "[]"
        );

        // Ensure notifications are stored as an array.
        const notifications = Array.isArray(storedNotifications)
            ? storedNotifications
            : [];

        /*
         * Calculate tomorrow's date and reset the time to midnight.
         * This allows interview dates to be compared consistently.
         */
        const tomorrow = new Date();

        tomorrow.setHours(0, 0, 0, 0);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Format tomorrow's date as YYYY-MM-DD.
        const tomorrowKey = [
            tomorrow.getFullYear(),
            String(tomorrow.getMonth() + 1).padStart(2, "0"),
            String(tomorrow.getDate()).padStart(2, "0")
        ].join("-");

        // Store newly generated reminders before saving them.
        const newReminders = [];

        /*
         * Check each application belonging to the currently logged-in
         * student and ignore applications belonging to other students.
         */
        progress.forEach((application) => {
            // Compare the application's student email with the logged-in email.
            if (
                String(application.studentEmail || "")
                    .trim()
                    .toLowerCase() !== email
            ) {
                return;
            }

            /*
             * Check each interview round associated with the application.
             */
            (application.rounds || []).forEach((round) => {
                // Process only tomorrow's Upcoming or Rescheduled rounds.
                if (
                    round.date !== tomorrowKey ||
                    !["Upcoming", "Rescheduled"].includes(round.status)
                ) {
                    return;
                }

                // Generate a unique ID for the interview reminder.
                const reminderId =
                    `interview-round-reminder-${email}-${round.id}`;

                // Skip the round if its reminder already exists.
                if (
                    notifications.some(
                        (notification) => notification.id === reminderId
                    )
                ) {
                    return;
                }

                // Create a notification for the upcoming interview round.
                newReminders.push({
                    id: reminderId,
                    studentEmail: email,
                    message:
                        `Reminder: Your ${round.name} for ` +
                        `${application.title || "your opportunity"} at ` +
                        `${application.company || "the company"} is scheduled for tomorrow.`,
                    date: new Date().toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }),
                    read: false,
                    type: "interview-round-reminder",
                    opportunityId: application.applicationId ?? null
                });
            });
        });

        /*
         * Save new reminders only when at least one reminder was created.
         * Dispatch an event so other components can refresh notifications.
         */
        if (newReminders.length > 0) {
            localStorage.setItem(
                "notifications",
                JSON.stringify([
                    ...newReminders,
                    ...notifications
                ])
            );

            // Notify other components that student notifications have changed.
            window.dispatchEvent(
                new Event("notificationsChange")
            );
        }
    } catch (error) {
        // Log errors encountered while retrieving data or creating reminders.
        console.error(
            "Could not create interview round reminders:",
            error
        );
    }
}

/**
 * InterviewRoundReminderChecker component.
 *
 * Periodically checks for interview reminders while a student is logged in.
 * Also checks when dashboard data, authentication, or browser focus changes.
 */
function InterviewRoundReminderChecker() {
    useEffect(() => {
        /*
         * Run the reminder checker only when a student is logged in.
         */
        const checkReminders = () => {
            if (
                localStorage.getItem("isLoggedIn") === "true" &&
                localStorage.getItem("userRole") === "student"
            ) {
                createInterviewRoundReminders();
            }
        };

        // Check for reminders when the component mounts.
        checkReminders();

        // Recheck reminders every minute.
        const intervalId = window.setInterval(
            checkReminders,
            60 * 1000
        );

        // Recheck when dashboard data changes.
        window.addEventListener(
            "dashboardDataUpdated",
            checkReminders
        );

        // Recheck when authentication changes.
        window.addEventListener(
            "authChange",
            checkReminders
        );

        // Recheck when the browser window receives focus.
        window.addEventListener(
            "focus",
            checkReminders
        );

        /*
         * Clear the interval and remove event listeners
         * when the component unmounts.
         */
        return () => {
            window.clearInterval(intervalId);

            window.removeEventListener(
                "dashboardDataUpdated",
                checkReminders
            );

            window.removeEventListener(
                "authChange",
                checkReminders
            );

            window.removeEventListener(
                "focus",
                checkReminders
            );
        };
    }, []);

    // This background component does not render any visible UI.
    return null;
}

export default InterviewRoundReminderChecker;

