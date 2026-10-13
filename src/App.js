
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ScrollToTop from "./ScrollToTop";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./pages/About";
import Opportunities from "./pages/Opportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import CareerResources from "./pages/CareerResources";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MyApplications from "./pages/MyApplications";
import SavedOpportunities from "./pages/SavedOpportunities";
import Students from "./pages/Students";
import Placements from "./pages/Placements";
import Internships from "./pages/Internships";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import ResumeTips from "./pages/ResumeTips";
import ResumeTemplates from "./pages/ResumeTemplates";
import InterviewPreparation from "./pages/InterviewPreparation";
import AptitudeResources from "./pages/AptitudeResources";
import HRInterviewQuestions from "./pages/HRInterviewQuestions";
import TechnicalInterviewQuestions from "./pages/TechnicalInterviewQuestions";
import Settings from "./pages/Settings";
import Resume from "./pages/Resume";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import CoordinatorOpportunities from "./pages/CoordinatorOpportunities";
import CoordinatorStudents from "./pages/CoordinatorStudents";
import CoordinatorApplications from "./pages/CoordinatorApplications";
import CoordinatorReports from "./pages/CoordinatorReports";
import CoordinatorSettings from "./pages/CoordinatorSettings";
import CoordinatorNotifications from "./pages/CoordinatorNotifications";
import InterviewProgress from "./pages/InterviewProgress";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    const [userRole, setUserRole] = useState(
        localStorage.getItem("userRole")
    );

    useEffect(() => {
        const handleAuthChange = () => {
            setIsLoggedIn(
                localStorage.getItem("isLoggedIn") === "true"
            );
            setUserRole(localStorage.getItem("userRole"));
        };

        window.addEventListener("authChange", handleAuthChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

    const showSidebar =
        isLoggedIn &&
        (userRole === "student" || userRole === "coordinator");

    return (
        <BrowserRouter>
            <ScrollToTop />

            <div className={showSidebar ? "app-with-sidebar" : "app-with-top-navbar"}>
                <Navbar />

                <main className={showSidebar ? "app-main-content" : "app-public-content"}>
                    <Routes>
                        {/* PUBLIC HOME */}
                        <Route
                            path="/"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <Navigate to="/student-dashboard" replace />
                                    : <Home />
                            }
                        />

                        {/* PUBLIC PAGES */}
                        <Route path="/about" element={<About />} />
                        <Route path="/opportunities" element={<Opportunities />} />
                        <Route
                            path="/opportunity-details"
                            element={<OpportunityDetails />}
                        />
                        <Route
                            path="/career-resources"
                            element={<CareerResources />}
                        />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route path="/register" element={<Register />} />

                        {/* STUDENT DASHBOARD */}
                        <Route
                            path="/student-dashboard"
                            element={
                                isLoggedIn && userRole === "student"
                                    ? <StudentDashboard />
                                    : <Navigate to="/" replace />
                            }
                        />

                        {/* STUDENT PAGES */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/my-applications" element={<MyApplications />} />
                        <Route
                            path="/saved-opportunities"
                            element={<SavedOpportunities />}
                        />
                        <Route path="/students" element={<Students />} />
                        <Route path="/placements" element={<Placements />} />
                        <Route path="/internships" element={<Internships />} />
                        <Route path="/notifications" element={<Notifications />} />

                        {/* CAREER RESOURCES */}
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

                        {/* RESUME */}
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

                        {/* COORDINATOR PAGES */}
                        <Route
                            path="/coordinator-dashboard"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorDashboard />
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/coordinator/opportunities"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorOpportunities />
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/coordinator/students"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorStudents />
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/coordinator/applications"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorApplications />
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/coordinator/reports"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorReports />
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/coordinator/settings"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorSettings />
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/coordinator/notifications"
                            element={
                                isLoggedIn && userRole === "coordinator"
                                    ? <CoordinatorNotifications />
                                    : <Navigate to="/login" replace />
                            }
                        />

                        {/* INTERVIEW PROGRESS */}
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

export default App;
