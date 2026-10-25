
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn, KeyRound } from "lucide-react";
function Login() {
    const navigate = useNavigate();

    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (e) => {
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

        try {
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/auth/login",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: cleanEmail,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Invalid email or password.");
                return;
            }

            // The backend determines the account's actual role.
            const actualRole = data.role?.toLowerCase();

            if (actualRole !== role) {
                alert(
                    `This account is registered as ${actualRole || "an unknown role"
                    }. Please select the correct login role.`
                );
                return;
            }

            const loggedInUser = {
                id: Number(data.userId),
                userId: Number(data.userId),
                name: data.fullName,
                fullName: data.fullName,
                email: data.email,
                role: actualRole
            };

            // Clear any previous user's data before saving the new login.
            localStorage.removeItem("currentUser");
            localStorage.removeItem("registeredUser");

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", actualRole);
            localStorage.setItem(
                "currentUser",
                JSON.stringify(loggedInUser)
            );

            if (actualRole === "student") {
                localStorage.setItem(
                    "registeredUser",
                    JSON.stringify(loggedInUser)
                );

                window.dispatchEvent(new Event("authChange"));
                navigate("/student-dashboard");
            } else if (actualRole === "coordinator") {
                window.dispatchEvent(new Event("authChange"));
                navigate("/coordinator-dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert(
                "Unable to connect to the server. Please ensure the backend is running."
            );
        }
    };



    return (
        <div className="login-page">
            <div className="login-container">
                <h1>LOGIN</h1>

                <p>Login to access your SPIT account.</p>

                <div className="login-form-box">
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

                        <button type="submit"> <LogIn size={18} />Login</button>
                    </form>
                </div>

                <p className="forgot-password-link">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                    >
                        <KeyRound size={18} /> Forgot Password ?
                    </button>
                </p>

                <p>
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        <UserPlus size={18} /> Register
                    </button>
                </p>
            </div>
        </div>
    );

}

export default Login;
