
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Save, ChevronLeft } from "lucide-react";

const PROFILE_KEY = "coordinatorSettings";

const PREFERENCES_API =
    "http://localhost:8080/spit-backend/api/coordinator/notifications/preferences";
const DEFAULT_PREFERENCES = {
    registeredAccount: true,
    deletedAccount: true,
    profileUpdated: true,
    resumeUploaded: true,
    resumeDeleted: true,
    newApplications: true,
    overallInterviewStatusUpdated: true,
    interviewRoundAdded: true,
    interviewRoundStatusUpdated: true
};

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

    const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [savedPreferences, setSavedPreferences] = useState(
        DEFAULT_PREFERENCES
    );
    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/coordinator/profile",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load coordinator profile.");
                }

                const data = await response.json();

                setProfile({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || ""
                });
            } catch (error) {
                console.error("Profile loading error:", error);
                alert(error.message);
            }
        }

        loadProfile();
    }, []);


    useEffect(() => {
        async function loadPreferences() {
            try {
                const response = await fetch(PREFERENCES_API, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Unable to load notification preferences.");
                }

                const data = await response.json();

                const loadedPreferences = {
                    ...DEFAULT_PREFERENCES,
                    ...data,
                };

                setPreferences(loadedPreferences);
                setSavedPreferences(loadedPreferences);
            } catch (error) {
                console.error("Preference loading error:", error);
                alert(error.message);
            }
        }

        loadPreferences();
    }, []);

    function handleProfileChange(event) {
        const { name, value } = event.target;

        setProfile(previous => ({
            ...previous,
            [name]: value
        }));
    }


    async function saveProfile(event) {
        event.preventDefault();

        if (!profile.name.trim() || !profile.email.trim()) {
            alert("Please enter the coordinator name and email.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/coordinator/profile",
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: profile.name.trim(),
                        email: profile.email.trim(),
                        phone: profile.phone.trim()
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to save coordinator profile."
                );
            }

            alert("Coordinator profile saved successfully!");
        } catch (error) {
            console.error("Profile saving error:", error);
            alert(error.message);
        }
    }

    function handlePreferenceChange(event) {
        const { name, checked } = event.target;

        setPreferences(previous => ({
            ...previous,
            [name]: checked
        }));
    }


    const savePreferences = async (event) => {
        event.preventDefault();
        const hasChanges = Object.keys(DEFAULT_PREFERENCES).some(
            (key) => preferences[key] !== savedPreferences[key]
        );

        if (!hasChanges) {
            alert("No changes to save.");
            return;
        }
        try {
            const response = await fetch(PREFERENCES_API, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(preferences),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save notification preferences."
                );
            }
            setSavedPreferences({ ...preferences });
            alert("Notification preferences saved successfully.");
        } catch (error) {
            console.error("Error saving notification preferences:", error);
            alert(
                "Could not save preferences. Please check the backend and try again."
            );
        }
    };


    function handlePasswordChange(event) {
        const { name, value } = event.target;

        setPasswordForm(previous => ({
            ...previous,
            [name]: value
        }));
    }


    async function changePassword(event) {
        event.preventDefault();

        if (
            !passwordForm.currentPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword
        ) {
            alert("Please fill in all password fields.");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            alert("New password must contain at least 8 characters.");
            return;
        }

        if (
            passwordForm.newPassword !== passwordForm.confirmPassword
        ) {
            alert("New password and confirm password do not match.");
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
                        currentPassword: passwordForm.currentPassword,
                        newPassword: passwordForm.newPassword
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to change password."
                );
            }

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            alert("Password changed successfully!");
        } catch (error) {
            console.error("Password change error:", error);
            alert(error.message);
        }
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
                        Your current password is verified securely.
                        Your new password is saved to your account after validation.
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
                                    name="registeredAccount"
                                    checked={preferences.registeredAccount !== false}
                                    onChange={handlePreferenceChange}
                                />
                                New account registered
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="deletedAccount"
                                    checked={preferences.deletedAccount !== false}
                                    onChange={handlePreferenceChange}
                                />
                                Student account deleted
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="profileUpdated"
                                    checked={preferences.profileUpdated !== false}
                                    onChange={handlePreferenceChange}
                                />
                                Student profile updated
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="resumeUploaded"
                                    checked={preferences.resumeUploaded !== false}
                                    onChange={handlePreferenceChange}
                                />
                                Resume uploaded
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="resumeDeleted"
                                    checked={preferences.resumeDeleted !== false}
                                    onChange={handlePreferenceChange}
                                />
                                Resume deleted
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="newApplications"
                                    checked={preferences.newApplications !== false}
                                    onChange={handlePreferenceChange}
                                />
                                New application recorded
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="overallInterviewStatusUpdated"
                                    checked={preferences.overallInterviewStatusUpdated !== false}
                                    onChange={handlePreferenceChange}
                                />
                                Overall interview status updated
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="interviewRoundAdded"
                                    checked={preferences.interviewRoundAdded !== false}
                                    onChange={handlePreferenceChange}
                                />
                                Interview round added
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="interviewRoundStatusUpdated"
                                    checked={preferences.interviewRoundStatusUpdated !== false}
                                    onChange={handlePreferenceChange}
                                />
                                Interview round status updated
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
