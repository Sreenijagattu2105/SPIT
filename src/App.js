/*
 * App.js
 * ------
 * Main entry component for the SPIT application.
 *
 * Responsibilities:
 * 1. Configure React Router.
 * 2. Track authentication status and user roles.
 * 3. Display the appropriate navigation bar.
 * 4. Define public, student, and coordinator routes.
 * 5. Protect authenticated pages.
 * 6. Run deadline and interview reminder checkers.
 */

// Import routing components from React Router
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// Import React hooks
import { useState, useEffect } from "react";

// Import common application components
import ScrollToTop from "./ScrollToTop";
import Navbar from "./Navbar";

// Import public pages
import Home from "./Home";
import About from "./pages/About";
import Opportunities from "./pages/Opportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import CareerResources from "./pages/CareerResources";
import Contact from "./pages/Contact";
import StudentInstructions from "./pages/StudentInstructions";

// Import authentication pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";

// Import student pages
import StudentDashboard from "./pages/StudentDashboard";
import MyApplications from "./pages/MyApplications";
import SavedOpportunities from "./pages/SavedOpportunities";
import Students from "./pages/Students";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Resume from "./pages/Resume";
import InterviewProgress from "./pages/InterviewProgress";
import Settings from "./pages/Settings";

// Import career resource pages
import ResumeTips from "./pages/ResumeTips";
import ResumeTemplates from "./pages/ResumeTemplates";
import InterviewPreparation from "./pages/InterviewPreparation";
import AptitudeResources from "./pages/AptitudeResources";
import HRInterviewQuestions from "./pages/HRInterviewQuestions";
import TechnicalInterviewQuestions from "./pages/TechnicalInterviewQuestions";

// Import coordinator pages
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import CoordinatorOpportunities from "./pages/CoordinatorOpportunities";
import CoordinatorStudents from "./pages/CoordinatorStudents";
import CoordinatorApplications from "./pages/CoordinatorApplications";
import CoordinatorReports from "./pages/CoordinatorReports";
import CoordinatorSettings from "./pages/CoordinatorSettings";
import CoordinatorNotifications from "./pages/CoordinatorNotifications";

// Import role-specific navigation bars
import StudentIconNavbar from "./components/StudentIconNavbar";
import CoordinatorNavbar from "./components/CoordinatorNavbar";

// Import reminder checker components
import DeadlineReminderChecker from "./components/DeadlineReminderChecker";
import InterviewRoundReminderChecker from "./components/InterviewRoundReminderChecker";

/*
 * Main App component.
 */
function App() {
    /*
     * Initialize the authentication state using localStorage.
     */
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    // Store the current user's role
    const [userRole, setUserRole] = useState(
        localStorage.getItem("userRole")
    );

    /*
     * Listen for authentication changes.
     * Update the login status and user role when a user
     * logs in or logs out.
     */
    useEffect(() => {
        const handleAuthChange = () => {
            // Update the login status
            setIsLoggedIn(
                localStorage.getItem("isLoggedIn") === "true"
            );

            // Update the current user's role
            setUserRole(
                localStorage.getItem("userRole")
            );
        };

        // Listen for authentication changes within the application
        window.addEventListener(
            "authChange",
            handleAuthChange
        );

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener(
                "authChange",
                handleAuthChange
            );
        };
    }, []);

    /*
     * Determine whether the authenticated user is a student
     * or coordinator who should see a sidebar.
     */
    const showSidebar =
        isLoggedIn &&
        (
            userRole === "student" ||
            userRole === "coordinator"
        );

    /*
     * Render the application and configure its routes.
     */
    return (
        <BrowserRouter>
            {/* Scroll to the top when the route changes */}
            <ScrollToTop />

            {/* Check for upcoming opportunity deadlines */}
            <DeadlineReminderChecker />

            {/* Check for upcoming interview rounds */}
            <InterviewRoundReminderChecker />

            {/* Apply the appropriate layout class */}
            <div
                className={
                    showSidebar
                        ? "app-with-sidebar"
                        : "app-with-top-navbar"
                }
            >
                {/* Display the navbar according to the user's role */}
                {showSidebar && userRole === "student" ? (
                    <StudentIconNavbar />
                ) : showSidebar && userRole === "coordinator" ? (
                    <CoordinatorNavbar />
                ) : (
                    <Navbar />
                )}

                {/* Main content area for the current route */}
                <main
                    className={
                        showSidebar
                            ? "app-main-content"
                            : "app-public-content"
                    }
                >
                    <Routes>

                        {/* PUBLIC HOME PAGE */}
                        <Route
                            path="/"
                            element={<Home />}
                        />

                        {/* PUBLIC PAGES */}
                        <Route
                            path="/about"
                            element={<About />}
                        />

                        <Route
                            path="/opportunities"
                            element={<Opportunities />}
                        />

                        <Route
                            path="/opportunity-details"
                            element={<OpportunityDetails />}
                        />

                        <Route
                            path="/career-resources"
                            element={<CareerResources />}
                        />

                        <Route
                            path="/contact"
                            element={<Contact />}
                        />

                        {/* AUTHENTICATION PAGES */}
                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />
                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        {/* STUDENT DASHBOARD */}
                        <Route
                            path="/student-dashboard"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <StudentDashboard />
                                    : <Navigate to="/" replace />
                            }
                        />

                        {/* STUDENT PROFILE */}
                        <Route
                            path="/profile"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <Profile />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* STUDENT APPLICATIONS */}
                        <Route
                            path="/my-applications"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <MyApplications />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* STUDENT SAVED OPPORTUNITIES */}
                        <Route
                            path="/saved-opportunities"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <SavedOpportunities />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* COORDINATOR STUDENT MANAGEMENT */}
                        <Route
                            path="/students"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <Students />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* STUDENT NOTIFICATIONS */}
                        <Route
                            path="/notifications"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <Notifications />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* CAREER RESOURCE PAGES */}
                        <Route
                            path="/career-resources/resume-tips"
                            element={<ResumeTips />}
                        />

                        <Route
                            path="/career-resources/resume-templates"
                            element={<ResumeTemplates />}
                        />

                        <Route
                            path="/career-resources/interview-preparation"
                            element={<InterviewPreparation />}
                        />

                        <Route
                            path="/career-resources/aptitude-resources"
                            element={<AptitudeResources />}
                        />

                        <Route
                            path="/career-resources/hr-interview-questions"
                            element={<HRInterviewQuestions />}
                        />

                        <Route
                            path="/career-resources/technical-interview-questions"
                            element={<TechnicalInterviewQuestions />}
                        />

                        {/* STUDENT RESUME */}
                        <Route
                            path="/resume"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <Resume />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* STUDENT SETTINGS */}
                        <Route
                            path="/settings"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <Settings />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* STUDENT INSTRUCTIONS */}
                        <Route
                            path="/student-instructions"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <StudentInstructions />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* COORDINATOR DASHBOARD */}
                        <Route
                            path="/coordinator-dashboard"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorDashboard />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* COORDINATOR OPPORTUNITY MANAGEMENT */}
                        <Route
                            path="/coordinator/opportunities"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorOpportunities />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* COORDINATOR STUDENT MANAGEMENT */}
                        <Route
                            path="/coordinator/students"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorStudents />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* COORDINATOR APPLICATION TRACKING */}
                        <Route
                            path="/coordinator/applications"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorApplications />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* COORDINATOR PLACEMENT REPORTS */}
                        <Route
                            path="/coordinator/reports"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorReports />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* COORDINATOR SETTINGS */}
                        <Route
                            path="/coordinator/settings"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorSettings />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* COORDINATOR NOTIFICATIONS */}
                        <Route
                            path="/coordinator/notifications"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorNotifications />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* STUDENT INTERVIEW PROGRESS */}
                        <Route
                            path="/interview-progress"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <InterviewProgress />
                                    : <Navigate to="/login" replace />
                            }
                        />

                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

// Export App for rendering in index.js
export default App;
