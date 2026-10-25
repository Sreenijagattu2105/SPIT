# SPIT – Student Placement & Interview Tracker

SPIT (Student Placement & Interview Tracker) is a web-based application designed to help students manage their placement preparation, explore job and internship opportunities, track applications and interview progress, and access career development resources.

The platform also provides placement coordinators with tools to manage opportunities and support student placement activities.

## 🎯 Objectives

- Simplify placement preparation and interview tracking.
- Help students discover job and internship opportunities.
- Track applications and interview progress.
- Allow students to save opportunities for future reference.
- Provide interview preparation and career development resources.
- Help placement coordinators manage opportunities and student-related activities.

## ✨ Key Features

### 👨‍🎓 Student Module

- Student registration and login.
- Student dashboard.
- Browse published job and internship opportunities.
- View opportunity details and application deadlines.
- Save and remove saved opportunities.
- Track applications and interview progress.
- Manage profile and resume information.
- Receive notifications and deadline reminders.
- Access interview preparation questions and career resources.

### 🧑‍💼 Coordinator Module

- Coordinator dashboard.
- Create and manage job and internship opportunities.
- Publish, unpublish, edit, and delete opportunities.
- View and manage student-related placement activities.
- Access placement reports.
- Manage coordinator settings and notification preferences.

### 🔔 Notifications

- Student notifications and deadline reminders.
- Coordinator notifications for relevant placement activities.
- Notification preferences and read/unread status.

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Axios
- React Router
- Lucide React

### Backend

- Java
- Spring MVC
- Maven
- REST API endpoints

### Database

- MySQL
- SQL

### Development Tools

- Visual Studio Code
- Eclipse IDE
- Git
- GitHub
- Vercel

## 📁 Project Structure

```text
SPIT/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── .project
│   ├── .classpath
│   └── .settings/
├── package.json
├── README.md
└── ...
```

The `backend/` directory contains the Spring MVC backend project. The SQL schema and database scripts will be maintained separately in a `database/` directory.

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sreenijagattu2105/SPIT.git
cd SPIT
```

### 2. Run the Frontend

Install Node.js and npm, then run:

```bash
npm install
npm start
```

The React development server will start, typically at:

`http://localhost:3000`

### 3. Set Up the MySQL Database

1. Install and start MySQL Server.
2. Create the SPIT database.
3. Execute the SQL schema and database scripts.
4. Configure the backend's database connection using your local MySQL credentials.

The SQL scripts will be added to the repository's `database/` directory.

### 4. Run the Spring MVC Backend

1. Install a compatible JDK, Eclipse IDE, and Maven.
2. Import the `backend/` directory into Eclipse as an existing project.
3. Resolve the Maven dependencies if the project uses Maven.
4. Configure the database connection and required server settings.
5. Deploy the application to a compatible servlet container, such as Apache Tomcat.
6. Start the server and verify the API endpoints.

**Note:** The exact database configuration, servlet context path, and backend port depend on the project configuration.

## 🚀 Deployment

- **Frontend:** Deployed using Vercel.
- **Backend:** Requires deployment to a publicly accessible Java hosting environment.
- **Database:** Requires a configured MySQL server accessible to the deployed backend.

The deployed frontend must use the public backend API URL rather than a localhost address to support users accessing the application from other devices.

## 🔐 Security Notes

- Never commit database passwords, API keys, or other secrets.
- Keep private credentials in local configuration or environment variables.
- Do not upload real student passwords or private student information.
- Configure appropriate authentication, authorization, and CORS policies before public deployment.

## 🎓 Project Purpose

SPIT aims to provide students and placement coordinators with a centralized platform for managing placement opportunities, applications, interview preparation, and placement-related activities.

---

*SPIT – Student Placement & Interview Tracker*

