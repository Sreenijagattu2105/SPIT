/*
 * index.js
 * --------
 * This is the entry point of the SPIT React application.
 * It imports the required styles and components, creates
 * the React root, and renders the App component.
 */

// Import React
import React from "react";

// Import ReactDOM to render the React application
import ReactDOM from "react-dom/client";

// Import global CSS styles
import "./index.css";

// Import Bootstrap CSS for styling and responsive layouts
import "bootstrap/dist/css/bootstrap.min.css";

// Import the main App component
import App from "./App";

// Import the function used to measure application performance
import reportWebVitals from "./reportWebVitals";

/*
 * Create the React root using the HTML element
 * with the ID "root" in public/index.html.
 */
const root = ReactDOM.createRoot(
    document.getElementById("root")
);

/*
 * Render the application inside React.StrictMode.
 * StrictMode helps identify potential problems during development.
 */
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

/*
 * Measure application performance.
 * Pass a callback to reportWebVitals if you want to log
 * performance metrics or send them to an analytics service.
 */
reportWebVitals();
