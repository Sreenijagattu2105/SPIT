import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {ChevronLeft,  Mail } from "lucide-react";
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
            <h1>FORGOT PASSWORD ?</h1>

            <p>
                Enter your registered email address to reset your password.
            </p>

            <div className="forgot-password-form-box">
                <form onSubmit={handleSubmit}>
                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button type="submit">
                        <Mail size={18} /> Send Reset Instructions
                    </button>
                </form>
            </div>

            <button                                  
                type="button"
                onClick={() => navigate("/login")}
            >
              <ChevronLeft size={18} />   Back to Login
            </button>
        </div>
    </div>
);

}

export default ForgotPassword;