import {ChevronLeft, Eye, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "students";

function readStudents() {
    try {
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function CoordinatorStudents() {
    const navigate = useNavigate();

    const [students, setStudents] = useState(readStudents);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        function loadStudents() {
            setStudents(readStudents());
        }

        window.addEventListener("storage", loadStudents);
        window.addEventListener("dashboardDataUpdated", loadStudents);

        return () => {
            window.removeEventListener("storage", loadStudents);
            window.removeEventListener(
                "dashboardDataUpdated",
                loadStudents
            );
        };
    }, []);

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

    function handleDelete(student) {
        const studentName =
            student.name ||
            student.fullName ||
            student.studentName ||
            student.email ||
            "this student";

        const confirmed = window.confirm(
            `Are you sure you want to delete ${studentName}?`
        );

        if (!confirmed) return;

        const updatedStudents = students.filter(
            (item) => item !== student
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedStudents)
        );

        setStudents(updatedStudents);
        setMessage("Student deleted successfully.");

        if (selectedStudent === student) {
            setSelectedStudent(null);
        }

        window.dispatchEvent(new Event("dashboardDataUpdated"));
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
                        <p>Total Students</p>
                        <small>Registered accounts</small>
                    </div>

                    <div className="coordinator-stat-card">
                        <h3>{filteredStudents.length}</h3>
                        <hr />
                        <p>Matching Students</p>
                        <small>Based on your search</small>
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

                {filteredStudents.length === 0 ? (
                    <p>
                        {students.length === 0
                            ? "No registered student accounts found."
                            : "No students match your search."}
                    </p>
                ) : (
                    <div className="opportunity-table-wrapper">
                        <table className="opportunity-management-table">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Qualification</th>
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
                                        <tr
                                            key={`${student.email || name}-${index}`}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{name}</td>
                                            <td>
                                                {student.email || "Not provided"}
                                            </td>
                                            <td>{phone}</td>
                                            <td>{qualification}</td>
                                            <td className="opportunity-actions">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedStudent(student)
                                                    }
                                                >
                                                  <Eye size={18} />   View Profile
                                                </button>

                                                {" "}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(student)
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
                            "Qualification",
                            getValue(selectedStudent, [
                                "qualification",
                                "education",
                                "highestQualification"
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
                            "Address",
                            getValue(selectedStudent, [
                                "address",
                                "location"
                            ])
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
