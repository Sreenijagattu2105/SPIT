// Import icons used in the coordinator dashboard.
import {
    CalendarDays,
    Clock
} from "lucide-react";

// Import React hooks.
import { useCallback, useEffect, useState } from "react";

// Import navigation.
import { useNavigate } from "react-router-dom";


function CoordinatorLiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="coordinator-clock-time">
            {time.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata"
            })}
        </div>
    );
}

function CoordinatorDashboard() {
    const navigate = useNavigate();
    
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const [dashboardStats, setDashboardStats] = useState({
        totalStudents: 0,
        totalOpportunities: 0,
        publishedOpportunities: 0,
        draftOpportunities: 0,
        unpublishedOpportunities: 0,
        totalApplications: 0,
        totalJobs: 0,
        totalInternships: 0,
        selectedOrPlacedApplications: 0,
        awaitingReviewApplications: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [plannerDate, setPlannerDate] = useState(
        new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        })
    );

    const [plannerTasks, setPlannerTasks] = useState([]);
    const [plannerTitle, setPlannerTitle] = useState("");
    const [plannerTime, setPlannerTime] = useState("");
    const [plannerNotes, setPlannerNotes] = useState("");

    const plannerStorageKey = `coordinatorPlanner:${plannerDate}`;

    useEffect(() => {
        try {
            const savedTasks = JSON.parse(
                localStorage.getItem(plannerStorageKey) || "[]"
            );

            setPlannerTasks(
                Array.isArray(savedTasks) ? savedTasks : []
            );
        } catch {
            setPlannerTasks([]);
        }
    }, [plannerStorageKey]);

    const savePlannerTasks = (updatedTasks) => {
        setPlannerTasks(updatedTasks);

        localStorage.setItem(
            plannerStorageKey,
            JSON.stringify(updatedTasks)
        );
    };

    const addPlannerTask = (event) => {
        event.preventDefault();

        if (!plannerTitle.trim() || !plannerTime) {
            return;
        }

        const newTask = {
            id: `${Date.now()}-${Math.random()}`,
            title: plannerTitle.trim(),
            time: plannerTime,
            notes: plannerNotes.trim(),
            completed: false
        };

        savePlannerTasks([...plannerTasks, newTask]);

        setPlannerTitle("");
        setPlannerTime("");
        setPlannerNotes("");
    };

    const togglePlannerTask = (id) => {
        savePlannerTasks(
            plannerTasks.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const deletePlannerTask = (id) => {
        savePlannerTasks(
            plannerTasks.filter((task) => task.id !== id)
        );
    };


    const loadDashboardData = useCallback(async () => {
        try {
            setError("");

            const response = await fetch(
                "http://localhost:8080/spit-backend/api/coordinator/dashboard-stats",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Unable to load dashboard statistics (${response.status}).`
                );
            }

            const data = await response.json();
            setDashboardStats(data);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Dashboard statistics error:", err);
            setError(err.message || "Unable to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const selectedApplications =
        dashboardStats.selectedOrPlacedApplications;

    const awaitingReviewApplications =
        dashboardStats.awaitingReviewApplications;

    const stats = [
        {
            title: "Active Students",
            count: dashboardStats.totalStudents,
            description: "Accounts currently active",
            path: "/coordinator/students"
        },
        {
            title: "Total Opportunities",
            count: dashboardStats.totalOpportunities,
            description: "All opportunities",
            path: "/coordinator/opportunities"
        },
        {
            title: "Published Opportunities",
            count: dashboardStats.publishedOpportunities,
            description: "Published opportunities",
            path: "/coordinator/opportunities"
        },
        {
            title: "Draft Opportunities",
            count: dashboardStats.draftOpportunities,
            description: "Opportunities being prepared",
            path: "/coordinator/opportunities"
        },
        {
            title: "Unpublished Opportunities",
            count: dashboardStats.unpublishedOpportunities,
            description: "Hidden from students",
            path: "/coordinator/opportunities"
        },
        {
            title: "Total Applications",
            count: dashboardStats.totalApplications,
            description: "Student applications",
            path: "/coordinator/applications"
        },
        {
            title: "Total Jobs",
            count: dashboardStats.totalJobs,
            description: "Job opportunities",
            path: "/coordinator/opportunities"
        },
        {
            title: "Total Internships",
            count: dashboardStats.totalInternships,
            description: "Internship opportunities",
            path: "/coordinator/opportunities"
        }
    ];


    return (

        <div className="coordinator-dashboard-container">

            <section className="coordinator-welcome">
                <h1>Welcome, Coordinator! 👋</h1>
                <p>
                    Manage students, opportunities and placement
                    activities from one place.
                </p>
            </section>

            {/* Coordinator Calendar and Clock */}
            <section className="coordinator-time-section">

                {/* Live Clock */}
                <div className="coordinator-time-card">
                    <div className="coordinator-time-icon">
                        <Clock size={30} />
                    </div>

                    <h2>Current Time</h2>

                    <CoordinatorLiveClock />

                    <p>Indian Standard Time (IST)</p>
                </div>

                {/* Today's Calendar */}
                <div className="coordinator-time-card">
                    <div className="coordinator-time-icon">
                        <CalendarDays size={30} />
                    </div>

                    <h2>Today's Date</h2>

                    <div className="coordinator-calendar-date">
                        {new Date().toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "Asia/Kolkata"
                        })}
                    </div>

                    <p>Stay organized with your placement activities.</p>
                </div>

            </section>

            {loading && <p>Loading dashboard statistics...</p>}

            {error && (
                <p role="alert">
                    {error}
                    <button type="button" onClick={loadDashboardData}>
                        Retry
                    </button>
                </p>
            )}
            <section className="coordinator-summary">
                <div className="coordinator-section-heading">
                    <h2>Dashboard Summary</h2>
                    <span className="coordinator-updated">
                        Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                </div>

                <div className="coordinator-stats">
                    {stats.map((stat) => (
                        <button
                            type="button"
                            className="coordinator-stat-card"
                            key={stat.title}
                            onClick={() => navigate(stat.path)}
                            title={`Open ${stat.title}`}
                        >
                            <h3>{stat.count}</h3>
                            <hr />
                            <p>{stat.title}</p>
                            <small>{stat.description}</small>
                        </button>
                    ))}
                </div>
            </section>

            <section className="coordinator-summary">
                <h2 className="coordinator-centered-heading">
                    Placement Snapshot
                </h2>

                <div className="coordinator-placement-snapshot">
                    <div>
                        <span>Applications selected / placed</span>
                        <strong>{selectedApplications}</strong>
                    </div>

                    <div>
                        <span>Applications awaiting review</span>
                        <strong>{awaitingReviewApplications}</strong>
                    </div>
                </div>
            </section>


            {/* Coordinator's Daily Planner */}
            <section className="coordinator-planner">

                <div className="coordinator-planner-header">
                    <div>
                        <h2>Coordinator's Daily Planner</h2>
                        <p>
                            Organize your meetings, schedules, tasks and placement plans.
                        </p>
                    </div>

                    <div className="coordinator-planner-date">
                        <CalendarDays size={20} />

                        <input
                            type="date"
                            value={plannerDate}
                            onChange={(event) => setPlannerDate(event.target.value)}
                            aria-label="Select planner date"
                        />
                    </div>
                </div>

                {/* Add a schedule or task */}
                <form
                    className="coordinator-planner-form"
                    onSubmit={addPlannerTask}
                >
                    <div className="coordinator-planner-field">
                        <label htmlFor="plannerTitle">Task / Schedule Title</label>

                        <input
                            id="plannerTitle"
                            type="text"
                            placeholder="e.g. Meeting with placement team"
                            value={plannerTitle}
                            onChange={(event) => setPlannerTitle(event.target.value)}
                            required
                        />
                    </div>

                    <div className="coordinator-planner-field">
                        <label htmlFor="plannerTime">Time</label>

                        <input
                            id="plannerTime"
                            type="time"
                            value={plannerTime}
                            onChange={(event) => setPlannerTime(event.target.value)}
                            required
                        />
                    </div>

                    <div className="coordinator-planner-field coordinator-planner-notes">
                        <label htmlFor="plannerNotes">Notes / Plan Details</label>

                        <textarea
                            id="plannerNotes"
                            rows="3"
                            placeholder="Write meeting details, company requirements, reminders or your placement plan..."
                            value={plannerNotes}
                            onChange={(event) => setPlannerNotes(event.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="coordinator-planner-add-button"
                    >
                        + Add to Schedule
                    </button>
                </form>

                {/* Schedule progress */}
                <div className="coordinator-planner-progress">
                    <div className="coordinator-planner-progress-heading">
                        <strong>Daily Progress</strong>

                        <span>
                            {plannerTasks.filter((task) => task.completed).length}
                            {" of "}
                            {plannerTasks.length} completed
                        </span>
                    </div>

                    <div className="coordinator-planner-progress-track">
                        <div
                            className="coordinator-planner-progress-fill"
                            style={{
                                width: `${plannerTasks.length
                                    ? (plannerTasks.filter(
                                        (task) => task.completed
                                    ).length / plannerTasks.length) * 100
                                    : 0
                                    }%`
                            }}
                        />
                    </div>
                </div>

                {/* Saved schedule items */}
                <div className="coordinator-planner-task-list">
                    <h3>Scheduled Activities</h3>

                    {plannerTasks.length === 0 ? (
                        <div className="coordinator-planner-empty">
                            <CalendarDays size={34} />

                            <strong>No activities planned for this date</strong>

                            <p>
                                Add a meeting, task or placement activity using the form above.
                            </p>
                        </div>
                    ) : (
                        plannerTasks.map((task) => (
                            <div
                                className={`coordinator-planner-task ${task.completed
                                    ? "coordinator-planner-task-completed"
                                    : ""
                                    }`}
                                key={task.id}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => togglePlannerTask(task.id)}
                                    aria-label={`Mark ${task.title} as completed`}
                                />

                                <div className="coordinator-planner-task-time">
                                    <Clock size={17} />

                                    {new Date(
                                        `2000-01-01T${task.time}`
                                    ).toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>

                                <div className="coordinator-planner-task-details">
                                    <strong>{task.title}</strong>

                                    {task.notes && <p>{task.notes}</p>}

                                    <span>
                                        {task.completed ? "Completed" : "Pending"}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="coordinator-planner-delete"
                                    onClick={() => deletePlannerTask(task.id)}
                                    aria-label={`Delete ${task.title}`}
                                    title="Delete activity"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </section>

        </div>

    );

}

export default CoordinatorDashboard;
