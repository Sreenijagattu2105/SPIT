import { useState } from "react";
import { useNavigate } from "react-router-dom";

function addCoordinatorNotification(notification) {
    try {
        const stored = JSON.parse(
            localStorage.getItem("coordinatorNotifications") || "[]"
        );
        const notifications = Array.isArray(stored) ? stored : [];

        localStorage.setItem(
            "coordinatorNotifications",
            JSON.stringify([notification, ...notifications])
        );

        window.dispatchEvent(
            new Event("coordinatorNotificationsChange")
        );
    } catch (error) {
        console.error("Could not save coordinator notification:", error);
    }
}

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        const namePattern = /^[A-Za-z ]+$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10}$/;

        if (!cleanName) {
            alert("Please enter your name.");
            return;
        }

        if (!namePattern.test(cleanName)) {
            alert("Name should contain only letters.");
            return;
        }

        if (!cleanEmail || !emailPattern.test(cleanEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!phonePattern.test(cleanPhone)) {
            alert("Phone number must contain exactly 10 digits.");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        const numberCount = (password.match(/[0-9]/g) || []).length;

        if (numberCount < 2) {
            alert("Password must contain at least 2 numbers.");
            return;
        }

        if (!confirmPassword) {
            alert("Please confirm your password.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

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

        const oldRegisteredUser = (() => {
            try {
                return JSON.parse(
                    localStorage.getItem("registeredUser") || "null"
                );
            } catch {
                return null;
            }
        })();

        const emailExists =
            students.some(
                (student) =>
                    String(student.email || "").toLowerCase() === cleanEmail
            ) ||
            (
                oldRegisteredUser &&
                String(oldRegisteredUser.email || "").toLowerCase() === cleanEmail
            );

        if (emailExists) {
            alert("This email is already registered. Please login.");
            navigate("/login");
            return;
        }

        const registeredStudent = {
            id: Date.now(),
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            password: password,
            department: "",
            cgpa: ""
        };

        students.push(registeredStudent);

        localStorage.setItem("students", JSON.stringify(students));
        localStorage.setItem(
            "registeredUser",
            JSON.stringify(registeredStudent)
        );

        const date = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        addCoordinatorNotification({
            id: Date.now() + 1,
            message: `New student registered: ${cleanName} (${cleanEmail}).`,
            date,
            read: false,
            type: "student-registration",
            studentEmail: cleanEmail
        });

        window.dispatchEvent(new Event("dashboardDataUpdated"));

        alert("Registration successful! Please login.");
        navigate("/login");
    };

   
return (
    <div className="register-page">
        <div className="register-container">
            <h1>Registration</h1>

            <p>
                Create your SPIT account to explore internships
                and placement opportunities.
            </p>

            <div className="register-form-box">
                <form onSubmit={handleRegister}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Phone Number</label>
                    <input
                        type="text"
                        placeholder="Enter your 10-digit phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Register</button>
                </form>
            </div>

            <p>
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </p>
        </div>
    </div>
);

}

export default Register;
