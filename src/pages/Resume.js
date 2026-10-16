
import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
function Resume() {
    const [resumeName, setResumeName] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");

    const handleResumeUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please select a PDF file.");
            event.target.value = "";
            return;
        }

        // Release the previous preview URL, if any.
        if (resumeUrl) {
            URL.revokeObjectURL(resumeUrl);
        }

        setResumeName(file.name);
        setResumeUrl(URL.createObjectURL(file));
    };

    const removeResume = () => {
        if (resumeUrl) {
            URL.revokeObjectURL(resumeUrl);
        }

        setResumeName("");
        setResumeUrl("");
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

                    <p>Select your resume in PDF format.</p>

                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeUpload}
                    />

                    {resumeName && (
                        <div className="resume-file-details">
                            <p>
                                <strong>Selected Resume:</strong>
                                {" "}{resumeName}
                            </p>

                            <div className="resume-buttons">
                                <button
                                    type="button"
                                    onClick={() =>
                                        window.open(
                                            resumeUrl,
                                            "_blank",
                                            "noopener,noreferrer"
                                        )
                                    }
                                >
                                <Eye size={18} />     View Resume
                                </button>

                                <button
                                    type="button"
                                    onClick={removeResume}
                                >
                                 <Trash2 size={18} />  
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <p className="resume-note">
                    Note: This prototype keeps the selected file
                    temporarily in the current page. Upload it again
                    after refreshing or reopening the page.
                </p>
            </div>
        </div>
    );
}

export default Resume;
