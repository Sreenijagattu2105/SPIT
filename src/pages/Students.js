import React, { useEffect, useState } from "react";

function Students() {

    const [name, setName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [email, setEmail] = useState("");
    const [search, setSearch] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("");
    const [filterYear, setFilterYear] = useState("");

    const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    return savedStudents ? JSON.parse(savedStudents) : [];
});
    const [editRollNumber, setEditRollNumber] = useState(null);


useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
}, [students]);
    
    const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !rollNumber || !department || !year || !email) {
        alert("Please enter/select all student details.");
        return;
    }

    // Updating an existing student
    if (editRollNumber !== null) {

        const updatedStudents = students.map((student) => {
            if (student.rollNumber === editRollNumber) {
                return {
                    name: name,
                    rollNumber: rollNumber,
                    department: department,
                    year: year,
                    email: email
                };
            }

            return student;
        });

        setStudents(updatedStudents);

        alert("Student details updated!");

        setName("");
        setRollNumber("");
        setDepartment("");
        setYear("");
        setEmail("");
        setEditRollNumber(null);

        return;
    }

    // Registering a new student
    const duplicateStudent = students.find(
        (student) => student.rollNumber === rollNumber
    );

    if (duplicateStudent) {
        alert("Student with this roll number is already registered.");
        return;
    }

    const newStudent = {
        name: name,
        rollNumber: rollNumber,
        department: department,
        year: year,
        email: email
    };

    setStudents([...students, newStudent]);

    alert("Student details submitted!");

    setName("");
    setRollNumber("");
    setDepartment("");
    setYear("");
    setEmail("");
};

    const handleEdit = (rollNumber) => {
    const student = students.find(
        (student) => student.rollNumber === rollNumber
    );

    setName(student.name);
    setRollNumber(student.rollNumber);
    setDepartment(student.department);
    setYear(student.year);
    setEmail(student.email);

    setEditRollNumber(rollNumber);
};
const handleDelete = (rollNumber) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    const updatedStudents = students.filter(
        (student) => student.rollNumber !== rollNumber
    );

    setStudents(updatedStudents);

    alert("Student deleted successfully!");
};

    const filteredStudents = students.filter((student) => {
    return (
        (student.name.toLowerCase().includes(search.toLowerCase()) ||
         student.rollNumber.includes(search)) &&
        (filterDepartment === "" || student.department === filterDepartment) &&
        (filterYear === "" || student.year === filterYear)
    );
});

    return (
        <div className="container">

            <h1>Student Management</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter roll number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                />

                <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option value="">Select department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="AIML">AIML</option>
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                </select>

                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
<button type="submit">
    {editRollNumber !== null ? "Update" : "Submit"}
</button>

{editRollNumber !== null && (
    <button
        type="button"
        onClick={() => {
            setName("");
            setRollNumber("");
            setDepartment("");
            setYear("");
            setEmail("");
            setEditRollNumber(null);
        }}
    >
        Cancel
    </button>
)}

            </form>

            <div className="filters">

    <input
        type="text"
        placeholder="Search name or roll number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
    />

    <select
        value={filterDepartment}
        onChange={(e) => setFilterDepartment(e.target.value)}
    >
        <option value="">All Departments</option>
        <option value="CSE">CSE</option>
        <option value="AIML">AIML</option>
        <option value="IT">IT</option>
        <option value="ECE">ECE</option>
        <option value="EEE">EEE</option>
        <option value="Civil">Civil</option>
<option value="Mechanical">Mechanical</option>
    </select>

    <select
        value={filterYear}
        onChange={(e) => setFilterYear(e.target.value)}
    >
        <option value="">All Years</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
    </select>

</div>


            {/* Registered Students */}

            <h2>Registered Students</h2>

            <table border="1">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

    {filteredStudents.length > 0 ? (

        filteredStudents.map((student) => (

            <tr key={student.rollNumber}>

                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                <td>{student.department}</td>
                <td>{student.year}</td>
                <td>{student.email}</td>

                <td>
                    <button
                        onClick={() => handleEdit(student.rollNumber)}
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => handleDelete(student.rollNumber)}
                    >
                        Delete
                    </button>
                </td>

            </tr>

        ))

    ) : (

        <tr>
            <td colSpan="6">
                No students found.
            </td>
        </tr>

    )}

</tbody>

            </table>

        </div>
    );
}

export default Students;