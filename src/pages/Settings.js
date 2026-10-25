
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, Trash2, Save, RefreshCw } from "lucide-react";
function Settings() {
    const navigate = useNavigate();
    
    const [opportunityPublished, setOpportunityPublished] = useState(true);
    const [opportunityUpdated, setOpportunityUpdated] = useState(true);

    const [deadline7Days, setDeadline7Days] = useState(true);
    const [deadline3Days, setDeadline3Days] = useState(true);
    const [deadline1Day, setDeadline1Day] = useState(true);
    const [deadlineDay, setDeadlineDay] = useState(true);

    const [applicationAdded, setApplicationAdded] = useState(true);
    const [applicationDeleted, setApplicationDeleted] = useState(true);
    const [savedPreferences, setSavedPreferences] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordUpdated, setPasswordUpdated] = useState(true);

    // Load notification preferences for the logged-in student

    // Load notification preferences from the backend
    useEffect(() => {
        const loadNotificationPreferences = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/student/notification-preferences",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load notification preferences.");
                }

                const settings = await response.json();

                setOpportunityPublished(settings.opportunityPublished);
                setOpportunityUpdated(settings.opportunityUpdated);

                setDeadline7Days(settings.deadline7Days);
                setDeadline3Days(settings.deadline3Days);
                setDeadline1Day(settings.deadline1Day);
                setDeadlineDay(settings.deadlineDay);

                setApplicationAdded(settings.applicationAdded);
                setApplicationDeleted(settings.applicationDeleted);
                setPasswordUpdated(settings.passwordUpdated ?? true);
                setSavedPreferences({
                    opportunityPublished: settings.opportunityPublished,
                    opportunityUpdated: settings.opportunityUpdated,
                    deadline7Days: settings.deadline7Days,
                    deadline3Days: settings.deadline3Days,
                    deadline1Day: settings.deadline1Day,
                    deadlineDay: settings.deadlineDay,

                    applicationAdded: settings.applicationAdded,
                    applicationDeleted: settings.applicationDeleted,
                    passwordUpdated: settings.passwordUpdated ?? true,
                });
            } catch (error) {
                console.error("Error loading notification preferences:", error);
                alert("Unable to load notification preferences. Please try again.");
            }
        };

        loadNotificationPreferences();
    }, []);



    const saveSettings = async () => {

        if (savedPreferences === null) {
            alert("Please wait until notification preferences finish loading.");
            return;
        }

        const currentPreferences = {
            opportunityPublished,
            opportunityUpdated,
            deadline7Days,
            deadline3Days,
            deadline1Day,
            deadlineDay,
            applicationAdded,
            applicationDeleted,
            passwordUpdated
        };

        const hasChanges = Object.keys(currentPreferences).some(
            key => currentPreferences[key] !== savedPreferences[key]
        );

        if (!hasChanges) {
            alert("No changes were made to your notification preferences.");
            return;
        }

        const settings = {
            opportunityPublished,
            opportunityUpdated,
            deadline7Days,
            deadline3Days,
            deadline1Day,
            deadlineDay,
            applicationAdded,
            applicationDeleted,
            passwordUpdated
        };

        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/student/notification-preferences",
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(settings)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to save notification preferences."
                );
            }
            setSavedPreferences({ ...settings });
            alert("Notification preferences saved successfully!");

        } catch (error) {
            console.error("Error saving notification preferences:", error);
            alert(error.message || "Unable to save notification preferences.");
        }
    };




    const changePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        if (newPassword.length < 8) {
            alert("New password must contain at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            alert("New password must differ from the current password.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/auth/change-password",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to change password.");
                return;
            }

            alert(data.message || "Password changed successfully!");

            // Refresh the student's notification list.
            window.dispatchEvent(new Event("notificationsChange"));

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Change password error:", error);
            alert("Could not connect to the server. Please check that the backend is running.");
        }
    };



    const deleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate your SPIT account? You will no longer be able to log in."
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/auth/account",
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Unable to deactivate your account.");
                return;
            }

            // The backend has successfully deactivated the account.
            // Clear only the current browser session.
            ["currentUser", "registeredUser"].forEach(key => {
                try {
                    const user = JSON.parse(
                        localStorage.getItem(key) || "null"
                    );

                    if (user) {
                        localStorage.removeItem(key);
                    }
                } catch {
                    localStorage.removeItem(key);
                }
            });

            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");

            alert(result.message || "Your account has been deactivated.");

            navigate("/", { replace: true });
            window.location.reload();

        } catch (error) {
            console.error("Account deactivation error:", error);
            alert(
                "Could not connect to the backend. Your account was not deactivated by this request."
            );
        }
    };



    return (
        <div className="settings-container">
            <h1>SETTINGS</h1>

            <p className="settings-intro">
                Manage your account and notification preferences.
            </p>

            {/* Main blue box */}
            <div className="settings-content-box">

                <section className="settings-section account-settings">

                    <h2>Account Settings</h2>
                    <div className="settings-inner-white-box">
                        <p>Update your personal information.</p>

                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                        >
                            <UserRound size={18} /> Manage Profile
                        </button>
                    </div>
                </section>

                <section className="settings-section password-settings">
                    <h2>Change Password</h2>

                    <div className="settings-inner-white-box">
                        <label htmlFor="currentPassword">
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                        />

                        <label htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                        />

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                        />

                        <button type="button" onClick={changePassword}>
                            <RefreshCw size={18} />  Update Password
                        </button>
                    </div>
                </section>
                <section className="settings-section notification-settings">
                    <h2>Notification Preferences</h2>


                    <div className="settings-inner-white-box">
                        <h3>Opportunity Notifications</h3>

                        <label className="settings-option">
                            <span>New opportunities published</span>
                            <input
                                type="checkbox"
                                checked={opportunityPublished}
                                onChange={e => setOpportunityPublished(e.target.checked)}
                            />
                        </label>

                        <label className="settings-option">
                            <span>Opportunity details updated</span>
                            <input
                                type="checkbox"
                                checked={opportunityUpdated}
                                onChange={e => setOpportunityUpdated(e.target.checked)}
                            />
                        </label>

                        <h3>Deadline Reminders</h3>

                        <label className="settings-option">
                            <span>7 days before the deadline</span>
                            <input
                                type="checkbox"
                                checked={deadline7Days}
                                onChange={e => setDeadline7Days(e.target.checked)}
                            />
                        </label>

                        <label className="settings-option">
                            <span>3 days before the deadline</span>
                            <input
                                type="checkbox"
                                checked={deadline3Days}
                                onChange={e => setDeadline3Days(e.target.checked)}
                            />
                        </label>

                        <label className="settings-option">
                            <span>1 day before the deadline</span>
                            <input
                                type="checkbox"
                                checked={deadline1Day}
                                onChange={e => setDeadline1Day(e.target.checked)}
                            />
                        </label>

                        <label className="settings-option">
                            <span>On the deadline day</span>
                            <input
                                type="checkbox"
                                checked={deadlineDay}
                                onChange={e => setDeadlineDay(e.target.checked)}
                            />
                        </label>

                        <h3>Application Notifications</h3>

                        <label className="settings-option">
                            <span>Application added confirmation</span>
                            <input
                                type="checkbox"
                                checked={applicationAdded}
                                onChange={e => setApplicationAdded(e.target.checked)}
                            />
                        </label>
                        <label className="settings-option">
                            <span>Application deleted notification</span>
                            <input
                                type="checkbox"
                                checked={applicationDeleted}
                                onChange={e => setApplicationDeleted(e.target.checked)}
                            />
                        </label>

                        <h3>Account Security Notifications</h3>

                        <label className="settings-option">
                            <span>Password updated successfully</span>
                            <input
                                type="checkbox"
                                checked={passwordUpdated}
                                onChange={(e) =>
                                    setPasswordUpdated(e.target.checked)
                                }
                            />
                        </label>

                    </div>

                    <button
                        className="save-settings-button"
                        type="button"
                        onClick={saveSettings}
                    >
                        <Save size={18} />   Save Settings
                    </button>

                </section>
            </div>

            {/* Separate blue box for Delete Account */}
            <section className="settings-section danger-section">
                <h2>Delete Account</h2>

                <p>
                    Remove your locally stored account information and
                    student session from this browser.
                </p>

                <p className="settings-note">
                    This frontend prototype cannot delete an account
                    from the server or database.
                </p>

                <button
                    className="delete-account-button"
                    type="button"
                    onClick={deleteAccount}
                >
                    <Trash2 size={18} />
                </button>
            </section>
        </div>
    );

}

export default Settings;
