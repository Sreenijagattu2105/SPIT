import { useState } from "react";

function Contact() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");


    const handleSubmit = (e) => {

    e.preventDefault();

    const namePattern = /^[A-Za-z ]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Name validation
    if (name.trim() === "") {
        alert("Please enter your name.");
        return;
    }

    if (!namePattern.test(name.trim())) {
        alert("Name should contain only letters.");
        return;
    }


    // Email validation
    if (email.trim() === "") {
        alert("Please enter your email address.");
        return;
    }

    if (!emailPattern.test(email.trim())) {
        alert("Please enter a valid email address.");
        return;
    }


    // Subject validation
    if (subject.trim() === "") {
        alert("Please enter a subject.");
        return;
    }


    // Message validation
    if (message.trim() === "") {
        alert("Please enter your message.");
        return;
    }


    // Success
    alert("Your message has been submitted successfully!");

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
};

    return (

        <div className="contact-container">

            <h1>Contact Us</h1>

            <p className="contact-intro">
                Have a question or need help? Get in touch with us.
            </p>


            <div className="contact-content">


                {/* Contact Information */}

                <div className="contact-info">

                    <h2>Get In Touch</h2>

                    <p>
                        We are here to help you with your questions
                        and career-related queries.
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        support@example.com
                    </p>

                    <p>
                        <strong>Phone:</strong>{" "}
                        +91 98765 43210
                    </p>
                     <br></br>
                    <div className="contact-quote">
    <p>"Your journey starts with one small step. 🚀✨"</p>
</div>

                </div>
                

                {/* Contact Form */}

                <div className="contact-form">

                    <h2>Send Us a Message</h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />


                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />


                        <input
                            type="text"
                            placeholder="Enter subject"
                            value={subject}
                            onChange={(e) =>
                                setSubject(e.target.value)
                            }
                        />


                        <textarea
                            placeholder="Enter your message"
                            rows="5"
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                        >
                        </textarea>


                        <button type="submit">
                            Send Message
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Contact;