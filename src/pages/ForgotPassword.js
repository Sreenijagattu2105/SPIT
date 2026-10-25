
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Mail } from "lucide-react";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSending) return;

        const cleanEmail = email.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!cleanEmail || !emailPattern.test(cleanEmail)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        try {
            setIsSending(true);
            setMessage("");

            const response = await fetch(
                "http://localhost:8080/spit-backend/api/auth/password/forgot",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: cleanEmail })
                }
            );

            const responseText = await response.text();
            let result = {};

            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch {
                result = {};
            }

            if (!response.ok) {
                setMessage(
                    result.message ||
                    "Unable to process your request. Please try again."
                );
                return;
            }

            setMessage(
                result.message ||
                "If an active account exists for that email, reset instructions will be sent."
            );
        } catch (error) {
            console.error("Forgot password error:", error);
            setMessage(
                "Could not connect to the server. Please try again later."
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <h1>FORGOT PASSWORD ?</h1>

                <p>
                    Enter your registered email address to reset your password.
                </p>

                <div className="forgot-password-form-box">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="forgot-email">Email</label>

                        <input
                            id="forgot-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setMessage("");
                            }}
                            autoComplete="email"
                            maxLength={254}
                            required
                        />

                        <button type="submit" disabled={isSending}>
                            <Mail size={18} />
                            {isSending
                                ? "Sending..."
                                : "Send Reset Instructions"}
                        </button>

                        {message && (
                            <p
                                role="status"
                                aria-live="polite"
                                style={{
                                    marginTop: "15px",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    backgroundColor: "#E0F7FA",
                                    color: "#455A64",
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                <button
                    type="button"

                    onClick={() => navigate("/login")}
                >
                    <ChevronLeft size={18} />
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
