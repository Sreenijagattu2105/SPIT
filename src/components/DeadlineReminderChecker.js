/*
 * DeadlineReminderChecker.js
 * --------------------------
 * Checks upcoming opportunity deadlines and requests deadline
 * reminders from the backend for logged-in students.
 */

// Import the useEffect hook from React.
import { useEffect } from "react";

/**
 * DeadlineReminderChecker component.
 *
 * Periodically checks for deadline reminders and rechecks them
 * when the browser tab, opportunity data, or storage changes.
 */
function DeadlineReminderChecker() {
    useEffect(() => {

        /*
         * Check whether the current user is a logged-in student.
         * If valid, retrieve the student's email and request
         * deadline reminders from the backend.
         */
        const checkDeadlines = () => {

            // Allow deadline checks only for logged-in students.
            if (
                localStorage.getItem("isLoggedIn") !== "true" ||
                localStorage.getItem("userRole") !== "student"
            ) {
                return;
            }

            // Initialize the student details.
            let currentUser = {};
            let registeredUser = {};

            // Retrieve student details from localStorage.
            try {
                currentUser = JSON.parse(
                    localStorage.getItem("currentUser") || "{}"
                );

                registeredUser = JSON.parse(
                    localStorage.getItem("registeredUser") || "{}"
                );
            } catch (error) {
                // Stop if the stored student details contain invalid JSON.
                console.error(
                    "Unable to read student details:",
                    error
                );
                return;
            }

            // Retrieve and normalize the student's email address.
            const email = String(
                currentUser.email || registeredUser.email || ""
            )
                .trim()
                .toLowerCase();

            // Stop if the student's email address is unavailable.
            if (!email) {
                return;
            }

            /*
             * Request the backend to check and create deadline reminders.
             * Include session cookies for authentication.
             */
            fetch(
                "http://localhost:8080/spit-backend/api/notifications/deadline-reminders",
                {
                    method: "POST",
                    credentials: "include"
                }
            ).catch((error) => {
                // Log errors encountered while requesting reminders.
                console.error(
                    "Could not check deadline reminders:",
                    error
                );
            });

            // Notify other components that notifications may have changed.
            window.dispatchEvent(
                new Event("notificationsChange")
            );
        };

        // Check deadlines immediately when the component mounts.
        checkDeadlines();

        // Recheck deadlines every hour.
        const intervalId = setInterval(
            checkDeadlines,
            60 * 60 * 1000
        );

        /*
         * Recheck deadlines when the user returns to the browser tab.
         */
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkDeadlines();
            }
        };

        /*
         * Recheck deadlines when opportunity-related data changes
         * within the application.
         */
        const handleOpportunityUpdate = () => {
            checkDeadlines();
        };

        /*
         * Recheck deadlines when opportunities or saved opportunities
         * change in another browser tab.
         */
        const handleStorageChange = (event) => {
            if (
                event.key === "opportunities" ||
                event.key === "savedOpportunities"
            ) {
                checkDeadlines();
            }
        };

        // Listen for browser tab visibility changes.
        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        // Listen for opportunity updates within the application.
        window.addEventListener(
            "dashboardDataUpdated",
            handleOpportunityUpdate
        );

        // Listen for localStorage changes from other browser tabs.
        window.addEventListener(
            "storage",
            handleStorageChange
        );

        /*
         * Clean up the interval and event listeners
         * when the component unmounts.
         */
        return () => {

            // Stop the hourly deadline check.
            clearInterval(intervalId);

            // Remove the visibility change listener.
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

            // Remove the opportunity update listener.
            window.removeEventListener(
                "dashboardDataUpdated",
                handleOpportunityUpdate
            );

            // Remove the storage change listener.
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    // This component performs background checks and renders no UI.
    return null;
}

export default DeadlineReminderChecker;