import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        alert(
            "If an account exists with this email, password reset instructions will be sent."
        );

        setEmail("");
    };

    return (
        <div className="forgot-password-page">
        <div className="forgot-password-container">

            <h1>Forgot Password?</h1>

            <p>
                Enter your registered email address to reset your password.
            </p>

            <form onSubmit={handleSubmit}>

                <label>Email</label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit">
                    Send Reset Instructions
                </button>

            </form>

            <button
                type="button"
                onClick={() => navigate("/login")}
            >
                Back to Login
            </button>
          </div>
        </div>
    );
}

export default ForgotPassword;