
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        const cleanEmail = email.trim().toLowerCase();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!role) {
            alert("Please select your role.");
            return;
        }

        if (!emailPattern.test(cleanEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!password || password.length < 6) {
            alert("Please enter a valid password.");
            return;
        }

        if (role === "student") {
            let students = [];

            try {
                const savedStudents = JSON.parse(
                    localStorage.getItem("students") || "[]"
                );

                if (Array.isArray(savedStudents)) {
                    students = savedStudents;
                }
            } catch {
                students = [];
            }

            // Support existing accounts saved in the old format.
            let registeredUser = null;

            try {
                registeredUser = JSON.parse(
                    localStorage.getItem("registeredUser") || "null"
                );
            } catch {
                registeredUser = null;
            }

            if (students.length === 0 && registeredUser) {
                students = [registeredUser];

                localStorage.setItem(
                    "students",
                    JSON.stringify(students)
                );
            } else if (
                registeredUser &&
                !students.some(
                    (student) =>
                        String(student.email || "").toLowerCase() ===
                        String(registeredUser.email || "").toLowerCase()
                )
            ) {
                // Preserve the legacy account if it is missing from the list.
                students.push(registeredUser);

                localStorage.setItem(
                    "students",
                    JSON.stringify(students)
                );
            }

            const student = students.find(
                (item) =>
                    String(item.email || "").toLowerCase() === cleanEmail
            );

            if (!student) {
                alert(
                    "No student account found with this email. Please register first."
                );
                return;
            }

            if (student.password !== password) {
                alert("Incorrect password.");
                return;
            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", "student");

            // Save the currently logged-in student's details separately.
            localStorage.setItem(
                "currentUser",
                JSON.stringify({
                    id: student.id,
                    name: student.name || student.fullName || student.studentName,
                    email: student.email,
                    phone: student.phone || ""
                })
            );

            window.dispatchEvent(new Event("authChange"));
            navigate("/student-dashboard");
        } else if (role === "coordinator") {
            // Retains your existing coordinator-login behavior.
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", "coordinator");

            window.dispatchEvent(new Event("authChange"));
            navigate("/coordinator-dashboard");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Login</h1>

                <p>Login to access your SPIT account.</p>

                <form onSubmit={handleLogin}>
                    <label>Select Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="coordinator">
                            Placement Coordinator
                        </option>
                    </select>

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Login</button>
                </form>

                <p>
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </p>

                <p>
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
