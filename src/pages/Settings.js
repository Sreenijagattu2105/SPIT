
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const [emailAlerts, setEmailAlerts] = useState(true);
    const [applicationUpdates, setApplicationUpdates] = useState(true);
    const [opportunityAlerts, setOpportunityAlerts] = useState(true);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Load saved notification preferences
    useEffect(() => {
        try {
            const savedSettings = JSON.parse(
                localStorage.getItem("studentSettings") || "null"
            );

            if (savedSettings) {
                setEmailAlerts(savedSettings.emailAlerts ?? true);
                setApplicationUpdates(
                    savedSettings.applicationUpdates ?? true
                );
                setOpportunityAlerts(
                    savedSettings.opportunityAlerts ?? true
                );
            }
        } catch {
            console.error("Unable to load saved settings.");
        }
    }, []);

    // Save notification preferences
    const saveSettings = () => {
        const settings = {
            emailAlerts,
            applicationUpdates,
            opportunityAlerts
        };

        localStorage.setItem(
            "studentSettings",
            JSON.stringify(settings)
        );

        alert("Settings saved successfully!");
    };

    // Change password (frontend prototype only)
    const changePassword = () => {
        let user;

        try {
            user = JSON.parse(
                localStorage.getItem("registeredUser") || "null"
            );
        } catch {
            alert("Unable to read the saved account details.");
            return;
        }

        if (!user) {
            alert("Student account details were not found.");
            return;
        }

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        if (!user.password || user.password !== currentPassword) {
            alert(
                "Current password is incorrect, or password verification is not configured."
            );
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

        const updatedUser = {
            ...user,
            password: newPassword
        };

        localStorage.setItem(
            "registeredUser",
            JSON.stringify(updatedUser)
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        alert("Password updated successfully!");
    };

    // Delete account (frontend prototype only)
    const deleteAccount = () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );

        if (!confirmed) return;

        let user;

        try {
            user = JSON.parse(
                localStorage.getItem("registeredUser") || "null"
            );
        } catch {
            alert("Unable to read the saved account details.");
            return;
        }

        // Remove the current user's saved profile record, if present
        if (user?.email) {
            try {
                const students = JSON.parse(
                    localStorage.getItem("students") || "[]"
                );

                const remainingStudents = students.filter(
                    student => student.email !== user.email
                );

                localStorage.setItem(
                    "students",
                    JSON.stringify(remainingStudents)
                );
            } catch {
                alert("Unable to process the saved student records.");
                return;
            }
        }

        // Clear locally stored session and personal data
        [
            "registeredUser",
            "isLoggedIn",
            "userRole",
            "studentSettings",
            "startedApplications",
            "savedOpportunities"
        ].forEach(key => localStorage.removeItem(key));

        alert("Local account data has been removed.");

        navigate("/", { replace: true });
        window.location.reload();
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>

            <p className="settings-intro">
                Manage your account and notification preferences.
            </p>

            <section className="settings-section">
                <h2>Account Settings</h2>
                <p>Update your personal information.</p>

                <button
                    type="button"
                    onClick={() => navigate("/profile")}
                >
                    Manage Profile
                </button>
            </section>

            <section className="settings-section">
                <h2>Change Password</h2>

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
                    Update Password
                </button>
            </section>

            <section className="settings-section">
                <h2>Notification Preferences</h2>

                <label className="settings-option">
                    <span>Email Alerts</span>
                    <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={e => setEmailAlerts(e.target.checked)}
                    />
                </label>

                <label className="settings-option">
                    <span>Application Updates</span>
                    <input
                        type="checkbox"
                        checked={applicationUpdates}
                        onChange={e =>
                            setApplicationUpdates(e.target.checked)
                        }
                    />
                </label>

                <label className="settings-option">
                    <span>New Opportunity Alerts</span>
                    <input
                        type="checkbox"
                        checked={opportunityAlerts}
                        onChange={e =>
                            setOpportunityAlerts(e.target.checked)
                        }
                    />
                </label>
            </section>

            <button
                className="save-settings-button"
                type="button"
                onClick={saveSettings}
            >
                Save Settings
            </button>

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
                    Delete Account
                </button>
            </section>
        </div>
    );
}

export default Settings;
