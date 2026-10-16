
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Save, ChevronLeft } from "lucide-react";

const PROFILE_KEY = "coordinatorSettings";
const PREFERENCES_KEY = "coordinatorNotificationPreferences";

function readData(key, fallback) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return data ?? fallback;
    } catch {
        return fallback;
    }
}

function CoordinatorSettings() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(() => ({
        name: "",
        email: "",
        phone: "",
        ...readData(PROFILE_KEY, {})
    }));

    const [preferences, setPreferences] = useState(() => ({
        newApplications: true,
        newRegistrations: true,
        placementUpdates: true,
        deadlines: true,
        ...readData(PREFERENCES_KEY, {})
    }));

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const user = readData("currentUser", {});

        setProfile(previous => ({
            ...previous,
            name: previous.name || user.name || user.fullName || "",
            email: previous.email || user.email || "",
            phone: previous.phone || user.phone || ""
        }));
    }, []);

    function handleProfileChange(event) {
        const { name, value } = event.target;

        setProfile(previous => ({
            ...previous,
            [name]: value
        }));
    }

    function saveProfile(event) {
        event.preventDefault();

        if (!profile.name.trim() || !profile.email.trim()) {
            alert("Please enter the coordinator name and email.");
            return;
        }

        const updatedProfile = {
            ...profile,
            name: profile.name.trim(),
            email: profile.email.trim(),
            phone: profile.phone.trim()
        };

        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(updatedProfile)
        );

        alert("Coordinator profile saved successfully!");
    }

    function handlePreferenceChange(event) {
        const { name, checked } = event.target;

        setPreferences(previous => ({
            ...previous,
            [name]: checked
        }));
    }

    function savePreferences(event) {
        event.preventDefault();

        localStorage.setItem(
            PREFERENCES_KEY,
            JSON.stringify(preferences)
        );

        alert("Notification preferences saved successfully!");
    }

    function handlePasswordChange(event) {
        const { name, value } = event.target;

        setPasswordForm(previous => ({
            ...previous,
            [name]: value
        }));
    }

    function changePassword(event) {
        event.preventDefault();

        const savedPassword = localStorage.getItem("coordinatorPassword");

        if (!savedPassword) {
            alert(
                "Password changing is not connected to coordinator authentication yet. Connect it to your backend to change passwords securely."
            );
            return;
        }

        if (passwordForm.currentPassword !== savedPassword) {
            alert("Current password is incorrect.");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            alert("New password must contain at least 8 characters.");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }

        localStorage.setItem(
            "coordinatorPassword",
            passwordForm.newPassword
        );

        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        alert("Password changed successfully!");
    }

    return (
        <div className="coordinator-dashboard-container">
            <div className="coordinator-page-heading">
                <h1>SETTINGS</h1>
                </div>
                <section className="coordinator-welcome">
                <p>
                    Manage your profile, password and notification
                    preferences.
                </p>
            </section>

            <section className="coordinator-summary">
                <h2>Profile Settings</h2>
            <div className="coordinator-settings-section">

                <form
                    className="opportunity-form"
                    onSubmit={saveProfile}
                >
                    <div className="opportunity-form-grid">
                        <label>
                            Coordinator Name *
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>

                        <label>
                            Email Address *
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                required
                            />
                        </label>

                        <label>
                            Phone Number
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleProfileChange}
                            />
                        </label>
                    </div>

                    <button type="submit"> <Save size={18} />Save Profile</button>
                </form>
            </div>


            
                <h2>Password Settings</h2>
<div className="coordinator-settings-section">

                <form
                    className="opportunity-form"
                    onSubmit={changePassword}
                >
                    <div className="opportunity-form-grid">
                        <label>
                            Current Password
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                autoComplete="current-password"
                                required
                            />
                        </label>

                        <label>
                            New Password
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                minLength={8}
                                autoComplete="new-password"
                                required
                            />
                        </label>

                        <label>
                            Confirm New Password
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                minLength={8}
                                autoComplete="new-password"
                                required
                            />
                        </label>
                    </div>

                    <button type="submit">  <KeyRound size={18} />Change Password</button>
                </form>

                <p>
                    Password changes require backend authentication.
                    This form will not change your login password until
                    it is connected to the authentication system.
                </p>
            </div>

            
                <h2>Notification Preferences</h2>
<div className="coordinator-settings-section">

                <form
                    className="opportunity-form"
                    onSubmit={savePreferences}
                >
                    <div className="coordinator-settings-options">
                        <label>
                            <input
                                type="checkbox"
                                name="newApplications"
                                checked={preferences.newApplications}
                                onChange={handlePreferenceChange}
                            />
                            New student applications
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="newRegistrations"
                                checked={preferences.newRegistrations}
                                onChange={handlePreferenceChange}
                            />
                            New student registrations
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="placementUpdates"
                                checked={preferences.placementUpdates}
                                onChange={handlePreferenceChange}
                            />
                            Placement and selection updates
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="deadlines"
                                checked={preferences.deadlines}
                                onChange={handlePreferenceChange}
                            />
                            Opportunity deadline reminders
                        </label>
                    </div>

                    <button type="submit">
                     <Save size={18} />     Save Notification Preferences
                    </button>
                </form>
                </div >

            </section>

            <section className="coordinator-back-section">
                <button
                    type="button"
                    onClick={() => navigate("/coordinator-dashboard")}
                >
                  <ChevronLeft size={18} />    Back to Dashboard
                </button>
            </section>
        </div>
    );
}

export default CoordinatorSettings;
