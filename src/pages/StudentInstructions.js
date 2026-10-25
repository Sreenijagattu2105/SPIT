
import {
    UserRound,
    FileText,
    BriefcaseBusiness,
    ClipboardCheck,
    Bookmark,
    Bell,
    Settings,
    BookOpen,
    FileCheck,
    Search,
    ShieldCheck,
    ChevronRight,
    CircleHelp
} from "lucide-react";



const guideSections = [
    {
        id: "profile",
        number: "01",
        title: "My Profile",
        icon: UserRound,
        description: "Keep your student information accurate and up to date.",
        steps: [
            "Open My Profile.",
            "Review your personal and academic information.",
            "Update the fields and save your changes, if editing is available.",
            "Check that your contact details and skills are correct."
        ],
        tip: "Review your profile before applying for an opportunity."
    },
    {
        id: "resume",
        number: "02",
        title: "My Resume",
        icon: FileText,
        description: "Prepare your resume so it is ready for placement opportunities.",
        steps: [
            "Open My Resume. ",
            "Review the resume options and instructions available on the page.",
            "Add relevant education, technical skills, projects and certifications where supported.",
            "Use the available save, view, download and delete options to manage your resume."
        ],
        tip: "Keep your resume clear, accurate and tailored to the role."
    },
    {
        id: "opportunities",
        number: "03",
        title: "Find Opportunities",
        icon: BriefcaseBusiness,
        description: "Explore opportunities published for students.",
        steps: [
            "Open Opportunities.",
            "Browse available opportunities and use search or filters if required.",
            "Open an opportunity to read its description, eligibility criteria and deadline.",
            "Check all requirements before deciding to apply.",
            "Use the available Apply action and follow the form instructions.",
            "Look for confirmation and check My Applications afterwards."
        ],
        tip: "Read the eligibility criteria and deadline carefully before applying."
    },
    {
        id: "applications",
        number: "04",
        title: "My Applications",
        icon: ClipboardCheck,
        description: "Review the opportunities you have applied for.",
        steps: [
            "Open My Applications.",
            "Find the opportunity you want to review.",
            "Follow any instructions or updates provided by the coordinator.",
            "If an application does not appear, check whether submission was completed.",
            "Delete the application when not required.",
            "Check the status of applications in Interview Progress."
        ],
        tip: "The exact meaning of each status depends on the statuses implemented in SPIT."
    },
    {
        id: "saved",
        number: "05",
        title: "Saved Opportunities",
        icon: Bookmark,
        description: "Keep track of opportunities you want to revisit.",
        steps: [
            "Open an opportunity and look for its Save option.",
            "Save opportunities you want to review later.",
            "Open Saved Opportunities from the navigation menu.",
            "Review the saved listings and check their deadlines before applying.",
            "Delete the application when not required."
        ],
        tip: "Saving an opportunity does not necessarily submit an application."
    },
    {
        id: "interview-progress",
        number: "06",
        title: "Interview Progress",
        icon: FileCheck,
        description: "Review the interview progress information available to you.",
        steps: [
            "Open Interview Progress.",
            "You can Review the interview information or progress displayed on the page.",
            "Add/Update your application overall status.",
            "Select each round and update its status specific application.",
            "Write and save notes when required."
        ],
        tip: "Track your application to reach your goal."
    },
    {
        id: "notifications",
        number: "07",
        title: "Notifications",
        icon: Bell,
        description: "Check alerts and updates available in your account.",
        steps: [
            "Open Notifications.",
            "Review each notification and check them.",
            "Check for available application, opportunity, interview or coordinator updates.",
            "Use any available mark-as-read or clear options as appropriate."
        ],
        tip: "Notification types and available actions depend on the features enabled in SPIT."
    },
    {
        id: "career-resources",
        number: "08",
        title: "Career Resources",
        icon: BookOpen,
        description: "Use the learning material to prepare for placements and interviews.",
        resources: [
            {
                title: "Resume Tips",
                description: "Guidance for presenting your education, skills and projects."
            },
            {
                title: "Resume Templates",
                description: "Templates to help structure your resume."
            },
            {
                title: "Interview Preparation",
                description: "Preparation guidance for interviews."
            },
            {
                title: "Aptitude Resources",
                description: "Material for aptitude practice."
            },
            {
                title: "HR Interview Questions",
                description: "Practice common HR interview questions."
            },
            {
                title: "Technical Interview Questions",
                description: "Revise technical concepts and practice technical questions."
            }
        ],
        tip: "Practise regularly and use these resources alongside your own preparation."
    },
    {
        id: "settings",
        number: "09",
        title: "Settings and Account Security",
        icon: Settings,
        description: "Manage account options available in your SPIT settings.",
        steps: [
            "Open Settings.",
            "Review the settings and account options shown on the page.",
            "Use Change and update your password when required.",
            "Enable or disable the notification preferences as per your choice.",
            "Log out when you finish using SPIT, especially on a shared computer.",
        ],
        tip: "Never share your password or password-reset link with anyone."
    }
];

function InstructionCard({ section }) {
    const Icon = section.icon;

    return (
        <section
            className="student-guide-card"
            id={section.id}
        >
            <div className="student-guide-card-heading">
                <span className="student-guide-number">
                    {section.number}
                </span>

                <div className="student-guide-icon">
                    <Icon size={23} />
                </div>

                <div className="student-guide-heading-text">
                    <h2>{section.title}</h2>
                    <p>{section.description}</p>
                </div>
            </div>

            {section.steps && (
                <ol className="student-guide-steps">
                    {section.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            )}

            {section.resources && (
                <div className="student-guide-resources">
                    {section.resources.map((resource) => (
                        <div
                            className="student-guide-resource"
                            key={resource.title}
                        >
                            <BookOpen size={18} />
                            <div>
                                <h3>{resource.title}</h3>
                                <p>{resource.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="student-guide-tip">
                <ShieldCheck size={18} />
                <p>
                    <strong>Tip:</strong> {section.tip}
                </p>
            </div>
        </section>
    );
}

export default function StudentInstructions() {
    return (
        <div className="student-guide-page">
            <header className="student-guide-hero">
                <div className="student-guide-hero-icon">
                    <BookOpen size={20} />
                </div>

                <span className="student-guide-eyebrow">
                    STUDENT HELP CENTER
                </span>

                <h1>STUDENT INSTRUCTIONS</h1>

                <p>
                    Your step-by-step guide to using SPIT for
                    opportunities, applications, resume management
                    and career preparation.
                </p>

            </header>

            <div className="student-guide-layout">
                <aside className="student-guide-toc">
                    <h2>On this page</h2>

                    {guideSections.map((section) => {
                        const Icon = section.icon;

                        return (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                            >
                                <Icon size={17} />
                                <span>{section.title}</span>
                                <ChevronRight size={15} />
                            </a>
                        );
                    })}
                </aside>

                <div className="student-guide-content">
                    <section className="student-guide-welcome">
                        <CircleHelp size={24} />
                        <div>
                            <h2>How to use this guide</h2>
                            <p>
                                Choose a section to learn how the feature
                                is intended to be used. The exact buttons
                                and actions available depend on your
                                SPIT account and the features implemented
                                on each page.
                            </p>
                        </div>
                    </section>

                    {guideSections.map((section) => (
                        <InstructionCard
                            key={section.id}
                            section={section}
                        />
                    ))}

                    <footer className="student-guide-footer">
                        <Search size={20} />
                        <p>
                            Need help? Review the relevant SPIT page
                            first. If a feature fails or information
                            is missing, contact your placement
                            coordinator.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
