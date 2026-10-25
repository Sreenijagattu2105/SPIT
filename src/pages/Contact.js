/*
 * Contact.jsx
 * -----------
 * Displays the SPIT contact page and allows visitors to submit
 * questions or messages to the backend.
 */

// Import React state management.
import { useState } from "react";

// Import icons for the contact form and contact information.
import { Send, Mail, Phone } from "lucide-react";

function Contact() {
    // Store the contact form field values.
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    // Track whether the form submission is in progress.
    const [isSending, setIsSending] = useState(false);

    /*
     * Validate the form and submit the message to the backend.
     */
    const handleSubmit = async (e) => {
        // Prevent the browser's default form submission.
        e.preventDefault();

        // Prevent duplicate submissions while a request is running.
        if (isSending) return;

        // Remove leading and trailing whitespace from form values.
        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanSubject = subject.trim();
        const cleanMessage = message.trim();

        // Allow letters, spaces, apostrophes, periods, and hyphens in names.
        const namePattern = /^[\p{L}][\p{L}\p{M} .'-]*$/u;

        // Basic email address format validation.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate the name.
        if (!cleanName) {
            alert("Please enter your name.");
            return;
        }

        if (!namePattern.test(cleanName)) {
            alert("Please enter a valid name.");
            return;
        }

        if (cleanName.length > 100) {
            alert("Name cannot exceed 100 characters.");
            return;
        }

        // Validate the email address.
        if (!cleanEmail || !emailPattern.test(cleanEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (cleanEmail.length > 254) {
            alert("Email address is too long.");
            return;
        }

        // Validate the subject.
        if (!cleanSubject) {
            alert("Please enter a subject.");
            return;
        }

        if (cleanSubject.length > 150) {
            alert("Subject cannot exceed 150 characters.");
            return;
        }

        // Validate the message.
        if (!cleanMessage) {
            alert("Please enter your message.");
            return;
        }

        if (cleanMessage.length > 5000) {
            alert("Message cannot exceed 5000 characters.");
            return;
        }

        try {
            // Disable the submit button while sending the request.
            setIsSending(true);

            // Send the contact form data to the Spring MVC backend.
            const response = await fetch(
                "http://localhost:8080/spit-backend/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: cleanName,
                        email: cleanEmail,
                        subject: cleanSubject,
                        message: cleanMessage
                    })
                }
            );

            // Read the response as text to handle non-JSON responses safely.
            const responseText = await response.text();

            let result = {};

            try {
                // Parse the response when the backend returns JSON.
                result = responseText
                    ? JSON.parse(responseText)
                    : {};
            } catch {
                // Continue with an empty result for invalid JSON.
                result = {};
            }

            // Display an error if the backend request failed.
            if (!response.ok) {
                alert(
                    result.message ||
                    "Unable to send your message. Please try again."
                );
                return;
            }

            // Notify the visitor that the message was submitted successfully.
            alert(
                result.message ||
                "Your message has been sent successfully!"
            );

            // Clear the form after a successful submission.
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch (error) {
            // Handle network errors and unexpected request failures.
            console.error("Contact form error:", error);

            alert(
                "Could not connect to the server. Please try again later."
            );
        } finally {
            // Re-enable the submit button after the request completes.
            setIsSending(false);
        }
    };

    // Render the contact information and message form.
    return (
        <div className="contact-container">
            <h1>CONTACT US</h1>

            <p className="contact-intro">
                Have a question or need help? Get in touch with us.
            </p>

            <div className="contact-content">

                {/* Display contact information. */}
                <div className="contact-info">
                    <h2>Get In Touch</h2>

                    <p>
                        We are here to help you with your questions
                        and career-related queries.
                    </p>

                    <p>
                        <strong>
                            <Mail size={18} />:
                        </strong>{" "}
                        <a href="mailto:spitofficial241026@gmail.com">
                            spitofficial241026@gmail.com
                        </a>
                    </p>

                    <p>
                        <strong>
                            <Phone size={18} />:
                        </strong>{" "}
                        <a href="tel:+919876543210">
                            +91 98765 43210
                        </a>
                    </p>

                    {/* Display the motivational message. */}
                    <br />

                    <div className="contact-quote">
                        <p>
                            "Your journey starts with one small step. 🚀✨"
                        </p>
                    </div>
                </div>

                {/* Display the contact form. */}
                <div className="contact-form">
                    <h2>Send Us a Message</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Visitor's name. */}
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={100}
                            autoComplete="name"
                            required
                        />

                        {/* Visitor's email address. */}
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={254}
                            autoComplete="email"
                            required
                        />

                        {/* Message subject. */}
                        <input
                            type="text"
                            placeholder="Enter subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            maxLength={150}
                            required
                        />

                        {/* Main message content. */}
                        <textarea
                            placeholder="Enter your message"
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={5000}
                            required
                        />

                        {/* Submit the form and show the loading state. */}
                        <button
                            type="submit"
                            disabled={isSending}
                        >
                            <Send size={18} />
                            {isSending ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Export Contact for use in the application routes.
export default Contact;
