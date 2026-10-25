
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    LockKeyhole,
    Eye,
    EyeOff,
    ChevronLeft
} from "lucide-react";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!token) {
            setMessage(
                "This reset link is invalid. Please request a new one."
            );
            return;
        }

        if (password.length < 8) {
            setMessage("Password must contain at least 8 characters.");
            return;
        }

        if (password.length > 72) {
            setMessage("Password cannot exceed 72 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            setIsSubmitting(true);
            setMessage("");

            const response = await fetch(
                "http://localhost:8080/spit-backend/api/auth/password/reset",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token,
                        newPassword: password
                    })
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
                    "Unable to reset your password. Please request a new link."
                );
                return;
            }

            setIsSuccess(true);
            setMessage(
                result.message ||
                "Your password has been reset successfully."
            );
        } catch (error) {
            console.error("Reset password error:", error);
            setMessage(
                "Could not connect to the server. Please try again later."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="forgot-password-page reset-password-page">
            <div className="forgot-password-container reset-password-container">
                <div className="forgot-password-form-box reset-password-form-box">

                    <div className="reset-password-heading">


                        <h1><LockKeyhole size={32} />Reset Password</h1>

                        <p>
                            Create a new password for your SPIT account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* New Password */}
                        <div className="reset-password-field">
                            <label htmlFor="new-password">
                                New Password
                            </label>

                            <div className="password-input-wrapper">
                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setMessage("");
                                    }}
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={72}
                                    required
                                    disabled={isSuccess}
                                />

                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide new password"
                                            : "Show new password"
                                    }
                                    disabled={isSuccess}
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={22}
                                            color="#ffffff"
                                            strokeWidth={2}
                                        />
                                    ) : (
                                        <Eye
                                            size={22}
                                            color="#ffffff"
                                            strokeWidth={2}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="reset-password-field">
                            <label htmlFor="confirm-password">
                                Confirm Password
                            </label>

                            <div className="password-input-wrapper">
                                <input
                                    id="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setMessage("");
                                    }}
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={72}
                                    required
                                    disabled={isSuccess}
                                />

                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    disabled={isSuccess}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff
                                            size={22}
                                            color="#ffffff"
                                            strokeWidth={2}
                                        />
                                    ) : (
                                        <Eye
                                            size={22}
                                            color="#ffffff"
                                            strokeWidth={2}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Status message */}
                        {message && (
                            <p
                                className={
                                    isSuccess
                                        ? "success-message"
                                        : "error-message"
                                }
                                role="status"
                                aria-live="polite"
                            >
                                {message}
                            </p>
                        )}

                        {/* Reset button */}
                        {!isSuccess && (
                            <button
                                type="submit"
                                className="reset-password-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Resetting Password..."
                                    : "Reset Password"}
                            </button>
                        )}
                    </form>

                    {/* Success action */}
                    {isSuccess && (
                        <button
                            type="button"
                            className="reset-password-submit"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    )}

                    {/* Back to Login at the bottom */}
                    <button
                        type="button"
                        className="reset-back-to-login"
                        onClick={() => navigate("/login")}
                    >
                        <ChevronLeft size={18} />
                        Back to Login
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
