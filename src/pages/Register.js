import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn } from "lucide-react";


function addCoordinatorNotification(notification, preferenceKey) {
    try {
        let preferences = {};

        try {
            preferences = JSON.parse(
                localStorage.getItem("coordinatorNotificationPreferences") || "{}"
            ) || {};
        } catch {
            preferences = {};
        }

        // Do not create the notification if its preference is disabled.
        if (preferences[preferenceKey] === false) {
            return;
        }

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

    const handleRegister = async (e) => {
        e.preventDefault();

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10}$/;

        if (!cleanName) {
            alert("Please enter your name.");
            return;
        }

        if (cleanName.length < 2 || cleanName.length > 50) {
            alert("Name must be between 2 and 50 characters.");
            return;
        }

        if (!namePattern.test(cleanName)) {
            alert("Name should contain only letters and single spaces between words.");
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

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
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


        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName: cleanName,
                        email: cleanEmail,
                        phone: cleanPhone,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed.");
                return;
            }

            const date = new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            addCoordinatorNotification({
                id: Date.now(),
                message: `New student registered: ${cleanName} (${cleanEmail}).`,
                date,
                read: false,
                type: "student-registration",
                studentEmail: cleanEmail
            }, "registeredAccount");

            window.dispatchEvent(new Event("dashboardDataUpdated"));

            alert("Registration successful! Please login.");
            navigate("/login");

            alert("Registration successful! Please login.");
            navigate("/login");

        } catch (error) {
            console.error("Registration failed:", error);
            alert(
                "Unable to connect to the server. Please ensure the backend is running."
            );
        }

        return;


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
        }, "registeredAccount");


        window.dispatchEvent(new Event("dashboardDataUpdated"));

        alert("Registration successful! Please login.");
        navigate("/login");
    };


    return (
        <div className="register-page">
            <div className="register-container">
                <h1>REGISTRATION</h1>

                <p>
                    Create your SPIT account to explore internships
                    and placement opportunities.
                </p>

                <div className="register-form-box">
                    <form onSubmit={handleRegister}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={50}
                            minLength={2}
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

                        <button type="submit"> <UserPlus size={18} /> Register</button>
                    </form>
                </div>

                <p>
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        <LogIn size={18} />    Login
                    </button>
                </p>
            </div>
        </div>
    );

}

export default Register;
