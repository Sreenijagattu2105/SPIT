import { Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";


function Profile() {
    const [profileUser, setProfileUser] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [qualification, setQualification] = useState("");
    const [department, setDepartment] = useState("");
    const [institution, setInstitution] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [skills, setSkills] = useState("");
    const [projects, setProjects] = useState("");
    const [certifications, setCertifications] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/student/profile",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load profile."
                    );
                }

                const user = {
                    name: data.full_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    qualification: data.highest_qualification || "",
                    department: data.department || "",
                    institution: data.institution_university || "",
                    graduationYear: data.graduation_year == null
                        ? ""
                        : String(data.graduation_year),
                    skills: data.skills || "",
                    projects: data.projects || "",
                    certifications: data.certifications || "",
                    resume: "",
                    linkedin: data.linkedin_url || "",
                    github: data.github_url || ""
                };

                setProfileUser(user);
                setName(user.name);
                setEmail(user.email);
                setPhone(user.phone);
                setAddress(user.address);
                setQualification(user.qualification);
                setDepartment(user.department);
                setInstitution(user.institution);
                setGraduationYear(user.graduationYear);
                setSkills(user.skills);
                setProjects(user.projects);
                setCertifications(user.certifications);
                setLinkedin(user.linkedin);
                setGithub(user.github);
            } catch (error) {
                console.error("Error loading student profile:", error);
                alert(
                    error.message +
                    " Please make sure you are logged in as a student."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);


    const handleSave = async (e) => {
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
            ...profileUser,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            address: address.trim(),
            qualification: qualification.trim(),
            department: department.trim(),
            institution: institution.trim(),
            graduationYear: graduationYear.trim(),
            skills: skills.trim(),
            projects: projects.trim(),
            certifications: certifications.trim(),
            linkedin: linkedin.trim(),
            github: github.trim()
        };

        const fieldsToCheck = [
            "name",
            "phone",
            "address",
            "qualification",
            "department",
            "institution",
            "graduationYear",
            "skills",
            "projects",
            "certifications",
            "linkedin",
            "github"
        ];

        const profileChanged = fieldsToCheck.some(field => {
            const oldValue = profileUser[field] ?? "";
            const newValue = updatedUser[field] ?? "";

            return String(oldValue).trim() !== String(newValue).trim();
        });

        const fieldLabels = {
            name: "Full Name",
            phone: "Phone Number",
            address: "Address",
            qualification: "Highest Qualification",
            department: "Department",
            institution: "Institution / University",
            graduationYear: "Graduation Year",
            skills: "Skills",
            projects: "Projects",
            certifications: "Certifications",
            linkedin: "LinkedIn Profile",
            github: "GitHub Profile"
        };

        const formatProfileValue = (value) => {
            const text = String(value ?? "").trim();
            return text || "Not specified";
        };

        const changedDetails = fieldsToCheck
            .filter(field => {
                const oldValue = profileUser[field] ?? "";
                const newValue = updatedUser[field] ?? "";

                

                return String(oldValue).trim() !== String(newValue).trim();
            })
            .map(field => {
                

                const oldValue = formatProfileValue(profileUser[field]);
                const newValue = formatProfileValue(updatedUser[field]);

                return `${fieldLabels[field]}: "${oldValue}" → "${newValue}"`;
            });

        if (!profileChanged) {
            alert("No changes detected in your profile.");
            setIsEditing(false);
            return;
        }


        // Save the profile to the Spring MVC backend.
        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/student/profile",
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName: name.trim(),
                        phone: phone.trim(),
                        address: address.trim(),
                        highestQualification: qualification.trim(),
                        department: department.trim(),
                        institutionUniversity: institution.trim(),
                        graduationYear: graduationYear.trim() || null,
                        skills: skills.trim(),
                        projects: projects.trim(),
                        certifications: certifications.trim(),
                        linkedinUrl: linkedin.trim(),
                        githubUrl: github.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Could not update the profile."
                );
            }

            // Update local state only after the backend confirms success.
            setProfileUser(updatedUser);

            localStorage.setItem(
                "currentUser",
                JSON.stringify({
                    ...JSON.parse(localStorage.getItem("currentUser") || "{}"),
                    ...updatedUser
                })
            );

            localStorage.setItem(
                "registeredUser",
                JSON.stringify({
                    ...JSON.parse(localStorage.getItem("registeredUser") || "{}"),
                    ...updatedUser
                })
            );

            const allStudents = JSON.parse(
                localStorage.getItem("students") || "[]"
            );

            if (Array.isArray(allStudents)) {
                const updatedStudents = allStudents.map(student =>
                    String(student.email || "").toLowerCase() ===
                        updatedUser.email.toLowerCase()
                        ? { ...student, ...updatedUser }
                        : student
                );

                localStorage.setItem(
                    "students",
                    JSON.stringify(updatedStudents)
                );
            }
        } catch (error) {
            console.error("Error saving student profile:", error);
            alert(error.message || "Could not save the profile.");
            return;
        }

        // Notify the coordinator only if the profile changed
        // and the coordinator enabled this notification.
        if (profileChanged) {
            let coordinatorPreferences = {};

            try {
                coordinatorPreferences = JSON.parse(
                    localStorage.getItem("coordinatorNotificationPreferences") || "{}"
                ) || {};
            } catch {
                coordinatorPreferences = {};
            }

            if (coordinatorPreferences.profileUpdated !== false) {
                try {
                    const existingNotifications = JSON.parse(
                        localStorage.getItem("coordinatorNotifications") || "[]"
                    );

                    const notifications = Array.isArray(existingNotifications)
                        ? existingNotifications
                        : [];

                    const notification = {
                        id: Date.now(),
                        message: `Student ${updatedUser.name} (${updatedUser.email}) updated their profile. Changes: ${changedDetails.join("; ")}.`,
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
            }
        }

        // Notify other components that student data changed
        window.dispatchEvent(new Event("dashboardDataUpdated"));

        alert("Profile updated successfully!");
        setIsEditing(false);
    };

    if (isLoading) {
        return <div className="profile-page">Loading your profile...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1>MY PROFILE</h1>

                <p>View and update your personal information.</p>

                <form onSubmit={handleSave}>
                    <h2>Personal Information</h2>



                    <div className="profile-fields-white">
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
                    </div>


                    <h2>Address</h2>
                    <div className="profile-fields-white">
                        <label htmlFor="profile-address">Full Address</label>
                        <textarea
                            id="profile-address"
                            className="profile-address-input"
                            name="address"
                            placeholder="Enter your full address..."
                            rows={4}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>



                    <h2>Education</h2>
                    <div className="profile-fields-white">
                        <label>Highest Qualification</label>
                        <input
                            type="text"
                            placeholder="e.g. B.Tech, BCA, MCA, B.Sc"
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            disabled={!isEditing}
                        />
                        <label>Department</label>
                        <input
                            type="text"
                            placeholder="e.g. CSE, IT, ECE, AIML"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
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
                    </div>
                    <h2>Skills</h2>
                    <div className="profile-fields-white">
                        <label>Skills</label>
                        <input
                            type="text"
                            placeholder="e.g. Java, React, SQL, Python"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>
                    <h2>Projects</h2>
                    <div className="profile-fields-white">
                        <label>Projects</label>
                        <input
                            type="text"
                            placeholder="e.g. Hospital Management System, Accident Detection System"
                            value={projects}
                            onChange={(e) => setProjects(e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>
                    <h2>Certifications</h2>
                    <div className="profile-fields-white">
                        <label>Certifications</label>
                        <input
                            type="text"
                            placeholder="e.g. Java, SQL, AWS, React"
                            value={certifications}
                            onChange={(e) => setCertifications(e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <h2>Professional Links</h2>
                    <div className="profile-fields-white">
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
                    </div>
                    <div className="profile-buttons">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil size={18} />  Edit Profile
                        </button>

                        <button
                            type="submit"
                            disabled={!isEditing}
                        >
                            <Save size={18} />   Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
