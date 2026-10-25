
import { useEffect, useState } from "react";
import { Eye, Trash2, Download } from "lucide-react";
import {
    saveResumeFile,
    getResumeFile,
    deleteResumeFile,
    downloadResumeFile
} from "../utils/resumeStorage";

function getStudentEmail() {
    try {
        const user = JSON.parse(
            localStorage.getItem("currentUser") || "null"
        );

        return String(user?.email || "").trim().toLowerCase();
    } catch {
        return "";
    }
}

function Resume() {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadResume() {
            const email = getStudentEmail();

            if (!email) {
                setLoading(false);
                return;
            }

            try {
                const savedResume = await getResumeFile(email);

                if (!cancelled) {
                    setResume(savedResume);
                }
            } catch (error) {
                console.error("Error loading resume:", error);
                if (!cancelled) {
                    alert("Unable to load your resume.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadResume();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleResumeUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedExtensions = /\.(pdf|doc|docx)$/i;

        if (!allowedExtensions.test(file.name)) {
            alert("Please upload only PDF, DOC or DOCX files.");
            event.target.value = "";
            return;
        }

        const email = getStudentEmail();

        if (!email) {
            alert("Please log in again to upload your resume.");
            event.target.value = "";
            return;
        }

        setIsSaving(true);

        try {
            const isResumeReplacement = Boolean(resume);

            await saveResumeFile(email, file);

            const savedResume = await getResumeFile(email);
            setResume(savedResume);


            // Notify the coordinator only if resume notifications are enabled.
            let coordinatorPreferences = {};

            try {
                coordinatorPreferences = JSON.parse(
                    localStorage.getItem("coordinatorNotificationPreferences") || "{}"
                ) || {};
            } catch {
                coordinatorPreferences = {};
            }

            if (coordinatorPreferences.resumeUploaded !== false) {
                try {
                    const existingNotifications = JSON.parse(
                        localStorage.getItem("coordinatorNotifications") || "[]"
                    );

                    const notifications = Array.isArray(existingNotifications)
                        ? existingNotifications
                        : [];

                    const currentUser = JSON.parse(
                        localStorage.getItem("currentUser") || "null"
                    );

                    const notification = {
                        id: Date.now(),
                        message: `Student ${currentUser?.name || email} (${email}) ${isResumeReplacement
                                ? "updated their resume."
                                : "uploaded a resume."
                            }`,
                        date: new Date().toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }),
                        read: false,
                        type: isResumeReplacement
                            ? "resume-updated"
                            : "resume-uploaded",
                        studentName: currentUser?.name || email,
                        studentEmail: email
                    };

                    localStorage.setItem(
                        "coordinatorNotifications",
                        JSON.stringify([notification, ...notifications])
                    );

                    window.dispatchEvent(
                        new Event("coordinatorNotificationsChange")
                    );
                } catch (error) {
                    console.error("Error creating resume notification:", error);
                }
            }

            alert(
                isResumeReplacement
                    ? "Resume updated successfully!"
                    : "Resume uploaded successfully!"
            );
        } catch (error) {
            console.error("Error saving resume:", error);
            alert(
                "Unable to save the resume. Browser storage may be unavailable or full."
            );
        } finally {
            setIsSaving(false);
            event.target.value = "";
        }
    };


    const openResume = async () => {
        if (!resume) {
            alert("Please upload your resume first.");
            return;
        }

        try {
            const blob = await downloadResumeFile();
            const url = URL.createObjectURL(blob);
            const newWindow = window.open(url, "_blank");

            if (!newWindow) {
                URL.revokeObjectURL(url);
                alert("Please allow pop-ups to view your resume.");
                return;
            }

            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) {
            console.error("Error opening resume:", error);
            alert(error.message || "Unable to open your resume.");
        }
    };


    const downloadResume = async () => {
        if (!resume) {
            alert("Please upload your resume first.");
            return;
        }

        try {
            const blob = await downloadResumeFile();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = resume.name || "resume";
            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) {
            console.error("Error downloading resume:", error);
            alert(error.message || "Unable to download your resume.");
        }
    };


    const removeResume = async () => {
        if (!resume) return;

        if (!window.confirm("Are you sure you want to delete your resume?")) {
            return;
        }

        const email = getStudentEmail();

        if (!email) {
            alert("Please log in again.");
            return;
        }

        try {
            await deleteResumeFile(email);
            setResume(null);


            // Notify the coordinator only if resume deletion notifications are enabled.
            let coordinatorPreferences = {};

            try {
                coordinatorPreferences = JSON.parse(
                    localStorage.getItem("coordinatorNotificationPreferences") || "{}"
                ) || {};
            } catch {
                coordinatorPreferences = {};
            }

            if (coordinatorPreferences.resumeDeleted !== false) {
                try {
                    const existingNotifications = JSON.parse(
                        localStorage.getItem("coordinatorNotifications") || "[]"
                    );

                    const notifications = Array.isArray(existingNotifications)
                        ? existingNotifications
                        : [];

                    const currentUser = JSON.parse(
                        localStorage.getItem("currentUser") || "null"
                    );

                    const notification = {
                        id: Date.now(),
                        message: `Student ${currentUser?.name || email} (${email}) deleted their resume.`,
                        date: new Date().toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }),
                        read: false,
                        type: "resume-deleted",
                        studentName: currentUser?.name || email,
                        studentEmail: email
                    };

                    localStorage.setItem(
                        "coordinatorNotifications",
                        JSON.stringify([notification, ...notifications])
                    );

                    window.dispatchEvent(
                        new Event("coordinatorNotificationsChange")
                    );
                } catch (error) {
                    console.error("Error creating resume deletion notification:", error);
                }
            }


            alert("Resume deleted successfully!");
        } catch (error) {
            console.error("Error deleting resume:", error);
            alert("Unable to delete the resume. Please try again.");
        }
    };

    return (
        <div className="resume-container">
            <div className="resume-card">
                <h1>MY RESUME</h1>

                <p className="resume-intro">
                    Upload and manage your resume for internship
                    and placement opportunities.
                </p>

                <div className="resume-upload-section">
                    <h2>Upload Resume</h2>

                    <p>
                        Select your resume in PDF, DOC or DOCX format.
                    </p>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleResumeUpload}
                        disabled={loading || isSaving}
                    />

                    {loading && <p>Loading resume...</p>}
                    {isSaving && <p>Saving resume...</p>}

                    {resume && (
                        <div className="resume-file-details">
                            <p>
                                <strong>Saved Resume:</strong>{" "}
                                {resume.name}
                            </p>

                            <div className="resume-buttons">
                                <button
                                    type="button"
                                    onClick={openResume}
                                >
                                    <Eye size={18} />
                                    View Resume
                                </button>

                                <button
                                    type="button"
                                    onClick={downloadResume}
                                >
                                    <Download size={18} />
                                    Download Resume
                                </button>

                                <button
                                    type="button"
                                    onClick={removeResume}
                                >
                                    <Trash2 size={18} />
                                    Delete Resume
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <p className="resume-note">
                    Your resume is stored in this browser for your
                    logged-in student account. Browser storage can be
                    cleared, and the resume is not automatically
                    available on other devices.
                </p>
            </div>
        </div>
    );
}

export default Resume;
