import { useState, useEffect } from "react";
import {
    ClipboardCheck,
    Bookmark,
    UserRound,
    CalendarDays,
    Clock,
    CheckCircle2,
} from "lucide-react";

function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <h2 className="dashboard-live-clock">
            {time.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
            })}
        </h2>
    );
}

function StudentDashboard() {
    const user = (() => {
        try {
            return JSON.parse(
                localStorage.getItem("currentUser") || "{}"
            );
        } catch {
            return {};
        }
    })();

    const [applicationCount, setApplicationCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0);
    const [profileCompletion, setProfileCompletion] = useState(0);

    const [checklist, setChecklist] = useState({
        coding: false,
        interview: false,
        updates: false,
    });

    const [studyPlan, setStudyPlan] = useState([]);
    const [studySubject, setStudySubject] = useState("");
    const [studyTime, setStudyTime] = useState("");
    const [studyDescription, setStudyDescription] = useState("");

    const studyPlanDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
    });

    const studyPlanKey = `studentStudyPlan:${studyPlanDate}`;

    useEffect(() => {
        try {
            const savedPlan = JSON.parse(
                localStorage.getItem(studyPlanKey) || "[]"
            );

            setStudyPlan(Array.isArray(savedPlan) ? savedPlan : []);
        } catch {
            setStudyPlan([]);
        }
    }, [studyPlanKey]);

    const saveStudyPlan = (updatedPlan) => {
        setStudyPlan(updatedPlan);
        localStorage.setItem(studyPlanKey, JSON.stringify(updatedPlan));
    };

    const addStudyTask = (event) => {
        event.preventDefault();

        if (!studySubject.trim() || !studyTime) {
            return;
        }

        const newTask = {
            id: `${Date.now()}-${Math.random()}`,
            subject: studySubject.trim(),
            time: studyTime,
            description: studyDescription.trim(),
            completed: false,
        };

        saveStudyPlan([...studyPlan, newTask]);

        setStudySubject("");
        setStudyTime("");
        setStudyDescription("");
    };

    const toggleStudyTask = (id) => {
        saveStudyPlan(
            studyPlan.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const deleteStudyTask = (id) => {
        saveStudyPlan(studyPlan.filter((task) => task.id !== id));
    };

    // Load the student's profile and calculate completion.
    useEffect(() => {
        const loadProfileCompletion = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/student/profile",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Could not load profile."
                    );
                }

                const fields = [
                    data.full_name,
                    data.email,
                    data.phone,
                    data.address,
                    data.department,
                    data.graduation_year,
                    data.highest_qualification,
                    data.institution_university,
                    data.skills,
                    data.projects,
                    data.certifications,
                    data.linkedin_url,
                    data.github_url,
                ];

                const completedFields = fields.filter(
                    (value) =>
                        value !== null &&
                        value !== undefined &&
                        String(value).trim() !== ""
                ).length;

                const score = Math.round(
                    (completedFields / fields.length) * 100
                );

                setProfileCompletion(score);
            } catch (error) {
                console.error(
                    "Error loading profile completion:",
                    error
                );
            }
        };

        loadProfileCompletion();
    }, []);

    // Load application and saved-opportunity counts from the backend.
    useEffect(() => {
        const updateCounts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/spit-backend/api/student/dashboard-stats",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Could not load dashboard statistics."
                    );
                }

                setApplicationCount(data.applicationCount ?? 0);
                setSavedCount(data.savedCount ?? 0);
            } catch (error) {
                console.error(
                    "Error loading dashboard statistics:",
                    error
                );
            }
        };

        updateCounts();
    }, []);

    // Load today's checklist and keep it for the current date.
    useEffect(() => {
        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
        });

        const storageKey = `studentCareerChecklist:${today}`;

        try {
            const savedChecklist = JSON.parse(
                localStorage.getItem(storageKey) || "null"
            );

            if (savedChecklist) {
                setChecklist({
                    coding: Boolean(savedChecklist.coding),
                    interview: Boolean(savedChecklist.interview),
                    updates: Boolean(savedChecklist.updates),
                });
            }
        } catch (error) {
            console.error("Unable to load checklist:", error);
        }
    }, []);

    const handleChecklistChange = (name, checked) => {
        const updatedChecklist = {
            ...checklist,
            [name]: checked,
        };

        setChecklist(updatedChecklist);

        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
        });

        localStorage.setItem(
            `studentCareerChecklist:${today}`,
            JSON.stringify(updatedChecklist)
        );
    };

    const DashboardIcon = ({ icon: Icon }) => (
        <div className="dashboard-card-icon">
            <Icon size={34} strokeWidth={1.8} />
        </div>
    );

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });

    const completedTasks = Object.values(checklist).filter(Boolean).length;

    return (
        <div className="student-dashboard-container">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1
                    className="dashboard-welcome-title"
                    title={`Welcome, ${user.name || "Student"}!`}
                >
                    Welcome, {user.name || "Student"}! 👋
                </h1>

                <p>
                    Manage your opportunities, applications and career
                    activities from one place.
                </p>
            </div>

            {/* SECTION 1: Dashboard Summary */}
            <section className="dashboard-summary-section">
                <h2 className="dashboard-section-title">
                    Dashboard Summary
                </h2>

                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <ClipboardCheck
                            size={30}
                            className="dashboard-stat-icon"
                        />
                        <h2>{applicationCount}</h2>
                        <p>Applications</p>
                    </div>

                    <div className="dashboard-stat-card">
                        <Bookmark
                            size={30}
                            className="dashboard-stat-icon"
                        />
                        <h2>{savedCount}</h2>
                        <p>Saved Opportunities</p>
                    </div>

                    <div className="dashboard-stat-card">
                        <UserRound
                            size={30}
                            className="dashboard-stat-icon"
                        />
                        <h2>{profileCompletion}%</h2>
                        <p>Profile Completion</p>

                        <div className="profile-progress">
                            <div
                                className="profile-progress-bar"
                                style={{
                                    width: `${profileCompletion}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: Student Planner */}
            <section className="dashboard-main-section">
                <h2 className="dashboard-section-title">
                    Your Student Planner
                </h2>

                <div className="dashboard-cards">
                    {/* Live Clock */}
                    <div className="dashboard-card">
                        <DashboardIcon icon={Clock} />
                        <h2>Current Time</h2>
                        <LiveClock />
                        <p>
                            Keep track of your day and manage your study
                            time.
                        </p>
                    </div>

                    {/* Calendar */}
                    <div className="dashboard-card">
                        <DashboardIcon icon={CalendarDays} />
                        <h2>Today's Date</h2>
                        <p className="dashboard-current-date">
                            {formattedDate}
                        </p>
                        <p>
                            Plan your preparation and placement activities.
                        </p>
                    </div>

                    {/* Daily Checklist */}
                    <div className="dashboard-card">
                        <DashboardIcon icon={CheckCircle2} />
                        <h2>Daily Career Checklist</h2>

                        <p>
                            Completed: {completedTasks} of 3 tasks
                        </p>

                        <label className="dashboard-checklist-item">
                            <input
                                type="checkbox"
                                checked={checklist.coding}
                                onChange={(event) =>
                                    handleChecklistChange(
                                        "coding",
                                        event.target.checked
                                    )
                                }
                            />
                            Practise coding
                        </label>

                        <label className="dashboard-checklist-item">
                            <input
                                type="checkbox"
                                checked={checklist.interview}
                                onChange={(event) =>
                                    handleChecklistChange(
                                        "interview",
                                        event.target.checked
                                    )
                                }
                            />
                            Revise interview questions
                        </label>

                        <label className="dashboard-checklist-item">
                            <input
                                type="checkbox"
                                checked={checklist.updates}
                                onChange={(event) =>
                                    handleChecklistChange(
                                        "updates",
                                        event.target.checked
                                    )
                                }
                            />
                            Check placement updates
                        </label>
                    </div>




                    {/* Today's Study Plan */}
                    <div className="dashboard-card student-study-plan-card">
                        <DashboardIcon icon={CalendarDays} />

                        <h2>Today's Study Plan</h2>
                        <p>Plan your study sessions and track your progress.</p>

                        <form className="study-plan-form" onSubmit={addStudyTask}>
                            <div className="study-plan-input-group">
                                <label htmlFor="studySubject">Subject / Topic</label>
                                <input
                                    id="studySubject"
                                    type="text"
                                    placeholder="e.g. Java, React, DSA"
                                    value={studySubject}
                                    onChange={(event) =>
                                        setStudySubject(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="study-plan-input-group">
                                <label htmlFor="studyTime">Study Time</label>
                                <input
                                    id="studyTime"
                                    type="time"
                                    value={studyTime}
                                    onChange={(event) =>
                                        setStudyTime(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="study-plan-input-group study-plan-description">
                                <label htmlFor="studyDescription">
                                    What will you study? (Optional)
                                </label>
                                <textarea
                                    id="studyDescription"
                                    placeholder="e.g. Revise inheritance and practise 5 questions"
                                    value={studyDescription}
                                    onChange={(event) =>
                                        setStudyDescription(event.target.value)
                                    }
                                    rows="2"
                                />
                            </div>

                            <button type="submit" className="study-plan-add-button">
                                + Add Study Task
                            </button>
                        </form>

                        <div className="study-plan-progress">
                            <span>
                                Progress: {studyPlan.filter((task) => task.completed).length}
                                {" / "}
                                {studyPlan.length} completed
                            </span>

                            <div className="study-plan-progress-track">
                                <div
                                    className="study-plan-progress-fill"
                                    style={{
                                        width: `${studyPlan.length
                                                ? (studyPlan.filter(
                                                    (task) => task.completed
                                                ).length /
                                                    studyPlan.length) *
                                                100
                                                : 0
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="study-plan-task-list">
                            {studyPlan.length === 0 ? (
                                <p className="study-plan-empty">
                                    Your study plan is empty. Add your first task above!
                                </p>
                            ) : (
                                studyPlan.map((task) => (
                                    <div
                                        className={`study-plan-task ${task.completed ? "study-task-completed" : ""
                                            }`}
                                        key={task.id}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleStudyTask(task.id)}
                                            aria-label={`Mark ${task.subject} as completed`}
                                        />

                                        <div className="study-plan-task-info">
                                            <strong>{task.subject}</strong>

                                            <span>
                                                {new Date(
                                                    `2000-01-01T${task.time}`
                                                ).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>

                                            {task.description && (
                                                <p>{task.description}</p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="study-plan-delete-button"
                                            onClick={() => deleteStudyTask(task.id)}
                                            aria-label={`Delete ${task.subject}`}
                                            title="Delete task"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default StudentDashboard;