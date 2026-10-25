import { ChevronLeft, Eye, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCoordinatorStudentResume,
    downloadCoordinatorStudentResume
} from "../utils/resumeStorage";


function CoordinatorStudents() {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(true);
    const [studentsError, setStudentsError] = useState("");
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [coordinatorResume, setCoordinatorResume] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(false);
    useEffect(() => {
        let cancelled = false;

        async function loadStudents() {
            setStudentsLoading(true);
            setStudentsError("");

            try {
                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/coordinator/students",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        response.status === 401 || response.status === 403
                            ? "Your coordinator session may have expired. Please log in again."
                            : `Unable to load students. Status: ${response.status}`
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid student data received from the server.");
                }

                if (!cancelled) {
                    setStudents(data);
                }
            } catch (error) {
                console.error("Error loading students:", error);

                if (!cancelled) {
                    setStudentsError(
                        error.message || "Unable to load students."
                    );
                }
            } finally {
                if (!cancelled) {
                    setStudentsLoading(false);
                }
            }
        }

        loadStudents();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadResume() {
            if (!selectedStudent?.id) {
                setCoordinatorResume(null);
                return;
            }

            setResumeLoading(true);

            try {
                const resume = await getCoordinatorStudentResume(
                    selectedStudent.id
                );

                if (!cancelled) {
                    setCoordinatorResume(resume);
                }
            } catch (error) {
                if (!cancelled) {
                    setCoordinatorResume(null);
                    console.error("Unable to load student resume:", error);
                }
            } finally {
                if (!cancelled) {
                    setResumeLoading(false);
                }
            }
        }

        loadResume();

        return () => {
            cancelled = true;
        };
    }, [selectedStudent?.id]);


    const filteredStudents = useMemo(() => {
        const query = search.trim().toLowerCase();

        return students.filter((student) => {
            const name = String(
                student.name ||
                student.fullName ||
                student.studentName ||
                ""
            ).toLowerCase();

            const email = String(student.email || "").toLowerCase();
            const phone = String(
                student.phone || student.phoneNumber || ""
            ).toLowerCase();

            const qualification = String(
                student.qualification ||
                student.education ||
                student.highestQualification ||
                ""
            ).toLowerCase();

            return `${name} ${email} ${phone} ${qualification}`
                .includes(query);
        });
    }, [students, search]);



    async function handleDelete(student) {
        const studentId = student.id ?? student.userId ?? student.user_id;
        const studentName = student.fullName || student.name || "this student";

        if (!studentId) {
            setMessage("Cannot deactivate this student: database ID is missing.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to deactivate ${studentName}'s account? Their applications and other records will be retained.`
        );

        if (!confirmed) return;

        try {
            setMessage("");

            const response = await fetch(
                `http://localhost:8080/spit-backend/api/coordinator/students/${studentId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: { Accept: "application/json" }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to deactivate student.");
            }

            setStudents((previousStudents) =>
                previousStudents.map((item) => {
                    const itemId = item.id ?? item.userId ?? item.user_id;

                    return String(itemId) === String(studentId)
                        ? { ...item, active: false }
                        : item;
                })
            );

            setSelectedStudent((current) => {
                if (!current) return current;

                const currentId = current.id ?? current.userId ?? current.user_id;
                return String(currentId) === String(studentId)
                    ? { ...current, active: false }
                    : current;
            });

            setMessage(data.message || "Student account deactivated successfully.");
        } catch (error) {
            setMessage(error.message || "Something went wrong. Please try again.");
        }
    }



    function getValue(student, keys) {
        for (const key of keys) {
            const value = student[key];

            if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
            ) {
                return value;
            }
        }

        return "Not provided";
    }

    function renderProfileField(label, value) {
        const displayValue =
            value === undefined ||
                value === null ||
                String(value).trim() === ""
                ? "Not provided"
                : value;

        const isLink =
            typeof displayValue === "string" &&
            /^https?:\/\//i.test(displayValue);

        return (
            <div
                key={label}
                style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #dceff2",
                    overflowWrap: "anywhere"
                }}
            >
                <strong style={{ color: "#087f91" }}>
                    {label}
                </strong>
                <div style={{ marginTop: "5px", color: "#344054" }}>
                    {isLink ? (
                        <a
                            href={displayValue}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {displayValue}
                        </a>
                    ) : (
                        String(displayValue)
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="coordinator-dashboard-container">


            <div className="coordinator-page-heading">
                <h1>MANAGE STUDENTS</h1>
            </div>
            <section className="coordinator-welcome">
                <p>
                    View, search and manage registered students
                    and job seekers in the SPIT tracker.
                </p>

            </section>

            <section className="coordinator-summary">
                <h2>Student Summary</h2>

                <div className="coordinator-stats">
                    <div className="coordinator-stat-card">
                        <h3>{students.length}</h3>
                        <hr />
                        <p>Registered Students</p>
                        <small>Registered accounts</small>
                    </div>

                    <div className="coordinator-stat-card">
                        <h3>
                            {students.filter(student => student.active === true).length}
                        </h3>
                        <hr />
                        <p>Active Students</p>
                        <small>Accounts currently active</small>
                    </div>
                </div>
            </section>

            <section className="coordinator-summary">
                <h2>Registered Students</h2>

                <div className="opportunity-toolbar">
                    <input
                        type="search"
                        placeholder="Search name, email, phone or qualification..."
                        aria-label="Search students"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>

                {message && (
                    <p role="status" aria-live="polite">
                        {message}
                    </p>
                )}

                {studentsLoading && (
                    <p role="status">Loading students from the server...</p>
                )}

                {studentsError && (
                    <p role="alert" style={{ color: "#b42318" }}>
                        {studentsError}
                    </p>
                )}

                {!studentsLoading && !studentsError && (
                    filteredStudents.length === 0 ? (
                        <p>
                            {students.length === 0
                                ? "No registered student accounts found."
                                : "No students match your search."}
                        </p>
                    ) : (
                        <div className="students-table-wrapper">
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>S. No</th>
                                        <th>Database ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th>Qualification</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student, index) => {
                                        const name =
                                            student.name ||
                                            student.fullName ||
                                            student.studentName ||
                                            "Not provided";

                                        const phone =
                                            student.phone ||
                                            student.phoneNumber ||
                                            "Not provided";

                                        const qualification =
                                            student.qualification ||
                                            student.education ||
                                            student.highestQualification ||
                                            "Not provided";

                                        return (
                                            <tr key={student.id || student.email || index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {student.id ?? student.userId ?? student.user_id ?? "Missing ID"}
                                                </td>
                                                <td>{name}</td>

                                                <td>{student.email || "Not provided"}</td>
                                                <td>{phone}</td>
                                                <td>{qualification}</td>
                                                <td>
                                                    <span
                                                        className={`student-status ${student.active ? "active" : "inactive"
                                                            }`}
                                                    >
                                                        {student.active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="opportunity-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedStudent(student)}
                                                    >
                                                        <Eye size={18} /> View Profile
                                                    </button>

                                                    <button className="student-delete-button"
                                                        type="button"
                                                        onClick={() => handleDelete(student)}
                                                        disabled={student.active === false}
                                                        aria-label={`Delete ${name}`}
                                                        title={
                                                            student.active === false
                                                                ? "This student is already inactive"
                                                                : "Deactivate student"
                                                        }
                                                    >

                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

            </section>

            {selectedStudent && (
                <div
                    onClick={() => setSelectedStudent(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        zIndex: 9999
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="student-profile-title"
                        onClick={(event) => event.stopPropagation()}
                        style={{
                            background: "#ffffff",
                            width: "100%",
                            maxWidth: "600px",
                            maxHeight: "85vh",
                            overflowY: "auto",
                            borderRadius: "14px",
                            padding: "25px",
                            boxShadow: "0 10px 35px rgba(0,0,0,0.2)"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px"
                            }}
                        >
                            <h2
                                id="student-profile-title"
                                style={{ color: "#087f91", margin: 0 }}
                            >
                                Student Profile
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedStudent(null)}
                                aria-label="Close student profile"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p style={{ color: "#667085" }}>
                            Registered student details (read-only)
                        </p>

                        {renderProfileField(
                            "Full Name",
                            getValue(selectedStudent, [
                                "name",
                                "fullName",
                                "studentName"
                            ])
                        )}

                        {renderProfileField(
                            "Email",
                            getValue(selectedStudent, ["email"])
                        )}

                        {renderProfileField(
                            "Phone Number",
                            getValue(selectedStudent, [
                                "phone",
                                "phoneNumber"
                            ])
                        )}
                        {renderProfileField(
                            "Address",
                            getValue(selectedStudent, [
                                "address",
                                "location"
                            ])
                        )}
                        {renderProfileField(
                            "Qualification",
                            getValue(selectedStudent, [
                                "qualification",
                                "education",
                                "highestQualification"
                            ])
                        )}

                        {renderProfileField(
                            "Institution / University",
                            getValue(selectedStudent, [
                                "institution",
                                "university",
                                "college",
                                "institutionName"
                            ])
                        )}
                        {renderProfileField(
                            "Department",
                            getValue(selectedStudent, [
                                "department",
                                "branch"
                            ])
                        )}

                        {renderProfileField(
                            "Graduation Year",
                            getValue(selectedStudent, [
                                "graduationYear",
                                "passingYear",
                                "year"
                            ])
                        )}

                        {renderProfileField(
                            "Skills",
                            Array.isArray(selectedStudent.skills)
                                ? selectedStudent.skills.join(", ")
                                : getValue(selectedStudent, ["skills"])
                        )}

                        {renderProfileField(
                            "LinkedIn",
                            getValue(selectedStudent, [
                                "linkedin",
                                "linkedinUrl",
                                "linkedIn"
                            ])
                        )}

                        {renderProfileField(
                            "GitHub",
                            getValue(selectedStudent, [
                                "github",
                                "githubUrl",
                                "gitHub"
                            ])
                        )}




                        {renderProfileField(
                            "Resume",
                            resumeLoading
                                ? "Loading resume..."
                                : coordinatorResume?.name || "Resume not uploaded"
                        )}


                        {coordinatorResume?.name && (
                            <div className="student-resume-actions">
                                <button
                                    type="button"
                                    disabled={resumeLoading}
                                    onClick={async () => {
                                        try {
                                            const blob = await downloadCoordinatorStudentResume(
                                                selectedStudent.id
                                            );

                                            const url = URL.createObjectURL(blob);
                                            window.open(url, "_blank", "noopener,noreferrer");

                                            setTimeout(() => URL.revokeObjectURL(url), 60000);
                                        } catch (error) {
                                            alert(error.message || "Unable to view resume.");
                                        }
                                    }}
                                >
                                    View Resume
                                </button>

                                <button
                                    type="button"
                                    disabled={resumeLoading}
                                    onClick={async () => {
                                        try {
                                            const blob = await downloadCoordinatorStudentResume(
                                                selectedStudent.id
                                            );

                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement("a");

                                            link.href = url;
                                            link.download = coordinatorResume.name || "student-resume";
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();

                                            setTimeout(() => URL.revokeObjectURL(url), 60000);
                                        } catch (error) {
                                            alert(error.message || "Unable to download resume.");
                                        }
                                    }}
                                >
                                    Download Resume
                                </button>
                            </div>
                        )}








                    </div>
                </div>
            )}

            <section className="coordinator-back-section">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/coordinator-dashboard")
                    }
                >
                    <button
                        type="button"
                        onClick={() => navigate("/coordinator-dashboard")}
                    >
                        <ChevronLeft size={18} />
                        Back to Dashboard
                    </button></button>
            </section>
        </div>
    );
}

export default CoordinatorStudents;
