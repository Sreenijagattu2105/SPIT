
import { useState } from "react";

function Profile() {
    const registeredUser =
        JSON.parse(localStorage.getItem("registeredUser")) || {};

    const [name, setName] = useState(registeredUser.name || "");
    const [email, setEmail] = useState(registeredUser.email || "");
    const [phone, setPhone] = useState(registeredUser.phone || "");
    const [qualification, setQualification] = useState(
        registeredUser.qualification || ""
    );
    const [institution, setInstitution] = useState(
        registeredUser.institution || ""
    );
    const [graduationYear, setGraduationYear] = useState(
        registeredUser.graduationYear || ""
    );
    const [skills, setSkills] = useState(registeredUser.skills || "");
    const [projects, setProjects] = useState(registeredUser.projects || "");
    const [certifications, setCertifications] = useState(
        registeredUser.certifications || ""
    );
    const [resume, setResume] = useState(registeredUser.resume || "");
    const [linkedin, setLinkedin] = useState(registeredUser.linkedin || "");
    const [github, setGithub] = useState(registeredUser.github || "");
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();

        const namePattern = /^[A-Za-z ]+$/;
        const phonePattern = /^[0-9]{10}$/;
        const yearPattern = /^[0-9]{4}$/;
        const linkedinPattern =
            /^https?:\/\/(www\.)?linkedin\.com\/.+$/i;
        const githubPattern =
            /^https?:\/\/(www\.)?github\.com\/.+$/i;

        // Full Name validation
        if (name.trim() === "") {
            alert("Please enter your name.");
            return;
        }

        if (!namePattern.test(name.trim())) {
            alert("Name should contain only letters and spaces.");
            return;
        }

        // Phone validation
        if (phone.trim() === "") {
            alert("Please enter your phone number.");
            return;
        }

        if (!phonePattern.test(phone.trim())) {
            alert("Phone number must contain exactly 10 digits.");
            return;
        }

        // Graduation Year validation
        if (graduationYear.trim() !== "") {
            if (!yearPattern.test(graduationYear.trim())) {
                alert("Graduation year must contain exactly 4 digits.");
                return;
            }
        }

        // LinkedIn validation
        if (linkedin.trim() !== "") {
            if (!linkedinPattern.test(linkedin.trim())) {
                alert("Please enter a valid LinkedIn profile URL.");
                return;
            }
        }

        // GitHub validation
        if (github.trim() !== "") {
            if (!githubPattern.test(github.trim())) {
                alert("Please enter a valid GitHub profile URL.");
                return;
            }
        }

        const updatedUser = {
            ...registeredUser,
            name: name.trim(),
            email: email,
            phone: phone.trim(),
            qualification: qualification.trim(),
            institution: institution.trim(),
            graduationYear: graduationYear.trim(),
            skills: skills.trim(),
            projects: projects.trim(),
            certifications: certifications.trim(),
            resume: resume,
            linkedin: linkedin.trim(),
            github: github.trim()
        };

        // Save the updated profile
        localStorage.setItem(
            "registeredUser",
            JSON.stringify(updatedUser)
        );

        // Update the registered student record, if present
        try {
            const students = JSON.parse(
                localStorage.getItem("students") || "[]"
            );

            if (Array.isArray(students)) {
                const updatedStudents = students.map((student) =>
                    student.email === registeredUser.email
                        ? { ...student, ...updatedUser }
                        : student
                );

                localStorage.setItem(
                    "students",
                    JSON.stringify(updatedStudents)
                );
            }
        } catch (error) {
            console.error("Error updating student records:", error);
        }

        // Create a coordinator notification
        try {
            const existingNotifications = JSON.parse(
                localStorage.getItem("coordinatorNotifications") || "[]"
            );

            const notifications = Array.isArray(existingNotifications)
                ? existingNotifications
                : [];

            const notification = {
                id: Date.now(),
                message: `Student ${updatedUser.name} (${updatedUser.email}) updated their profile.`,
                date: new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }),
                read: false,
                type: "profile-updated",
                studentName: updatedUser.name,
                studentEmail: updatedUser.email
            };

            localStorage.setItem(
                "coordinatorNotifications",
                JSON.stringify([notification, ...notifications])
            );

            window.dispatchEvent(
                new Event("coordinatorNotificationsChange")
            );
        } catch (error) {
            console.error(
                "Error creating coordinator notification:",
                error
            );
        }

        // Notify other components that student data changed
        window.dispatchEvent(new Event("dashboardDataUpdated"));

        alert("Profile updated successfully!");
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1>My Profile</h1>

                <p>View and update your personal information.</p>

                <form onSubmit={handleSave}>
                    <h2>Personal Information</h2>

                    <label>Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                    />

                    <label>Email</label>
                    <input type="email" value={email} disabled />

                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                    />

                    <h2>Education</h2>

                    <label>Highest Qualification</label>
                    <input
                        type="text"
                        placeholder="e.g. B.Tech, BCA, MCA, B.Sc"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        disabled={!isEditing}
                    />

                    <label>Institution / University</label>
                    <input
                        type="text"
                        placeholder="Enter your institution or university"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        disabled={!isEditing}
                    />

                    <label>Graduation Year</label>
                    <input
                        type="text"
                        placeholder="e.g. 2026"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        disabled={!isEditing}
                    />

                    <h2>Skills</h2>

                    <label>Skills</label>
                    <input
                        type="text"
                        placeholder="e.g. Java, React, SQL, Python"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        disabled={!isEditing}
                    />

                    <h2>Projects</h2>

                    <label>Projects</label>
                    <input
                        type="text"
                        placeholder="e.g. Hospital Management System, Accident Detection System"
                        value={projects}
                        onChange={(e) => setProjects(e.target.value)}
                        disabled={!isEditing}
                    />

                    <h2>Certifications</h2>

                    <label>Certifications</label>
                    <input
                        type="text"
                        placeholder="e.g. Java, SQL, AWS, React"
                        value={certifications}
                        onChange={(e) => setCertifications(e.target.value)}
                        disabled={!isEditing}
                    />

                    <h2>Resume</h2>

                    <label>Upload Resume</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        disabled={!isEditing}
                        onChange={(e) => {
                            if (e.target.files.length === 0) return;

                            const file = e.target.files[0];

                            const allowedTypes = [
                                "application/pdf",
                                "application/msword",
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            ];

                            if (!allowedTypes.includes(file.type)) {
                                alert(
                                    "Please upload only PDF, DOC or DOCX files."
                                );
                                e.target.value = "";
                                setResume("");
                                return;
                            }

                            setResume(file.name);
                        }}
                    />

                    {resume && (
                        <p className="resume-name">
                            Selected Resume: {resume}
                        </p>
                    )}

                    <h2>Professional Links</h2>

                    <label>LinkedIn Profile</label>
                    <input
                        type="url"
                        placeholder="https://www.linkedin.com/in/yourname"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        disabled={!isEditing}
                    />

                    <label>GitHub Profile</label>
                    <input
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        disabled={!isEditing}
                    />

                    <div className="profile-buttons">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>

                        <button
                            type="submit"
                            disabled={!isEditing}
                        >
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
