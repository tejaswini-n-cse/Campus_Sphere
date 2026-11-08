<div align="center">

# 🎓 CampusSphere
### Intelligent Campus Management Ecosystem

*An enterprise-grade, centralized campus ERP connecting Students, Faculty, Placement Officers, and University Administrators through intelligent rule-based automation.*

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[System Overview](#-system-overview) • [Screenshots](#-system-preview--dashboards) • [Architecture](#-system-architecture) • [ER Diagram](#-database-design--er-diagram) • [Intelligent Engines](#-intelligent-engines) • [Installation](#-installation--setup)

</div>

---

## 📌 System Overview

**CampusSphere** solves the operational fragmentation common in tertiary institutions by consolidating disparate student management, faculty scheduling, daily attendance, coursework submissions, and campus recruitment pipelines into a unified, role-governed web application.

### Key Highlights
- **Role-Based Access Control (RBAC)**: Dedicated, isolated functional dashboards for **Administrator**, **Faculty**, **Student**, and **Placement Officer**.
- **Automated Defaulter Alert Engine**: Real-time evaluation of lecture attendance with automatic alerts when attendance dips below 75%.
- **Deterministic Placement Matcher**: Multi-variable rule engine comparing student CGPA, branch, and graduation year against corporate criteria, delivering transparent skill gap feedback.
- **Interactive Daily Attendance Sheet**: Faculty attendance logging with instant status toggling (`Present`, `Late`, `Absent`).
- **Resilient Hybrid Architecture**: Seamlessly connects to Supabase PostgreSQL with local memory/browser fallback for offline evaluation.

---

## 📸 System Preview & Dashboards

### 1. University Administrator Console
> Provides full CRUD authority over student records, department analytics, and automatic campus-wide attendance defaulter monitoring.

<p align="center">
  <img src="./screenshots/admin-dashboard.png" alt="CampusSphere Administrator Console" width="950" style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</p>

---

### 2. Student Dashboard & Automated Placement Matcher
> Visualizes academic progression trajectories, attendance percentages, course deliverables, and active corporate recruitment drives with automated qualification badges.

<p align="center">
  <img src="./screenshots/student-dashboard.png" alt="CampusSphere Student Portal" width="950" style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</p>

---

### 3. Faculty Academic Workspace
> Features a live daily attendance marking sheet for assigned subjects, coursework assignment generation, and student grade tracking.

<p align="center">
  <img src="./screenshots/faculty-dashboard.png" alt="CampusSphere Faculty Workspace" width="950" style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</p>

---

### 4. Placement Officer Recruitment Console
> Drives campus recruitment by posting jobs, setting cut-off criteria, reviewing applicant portfolios, and updating candidate selection stages.

<p align="center">
  <img src="./screenshots/placement-dashboard.png" alt="CampusSphere Placement Hub" width="950" style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</p>

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Module / Action | Administrator | Faculty Member | Student | Placement Officer |
| :--- | :---: | :---: | :---: | :---: |
| **Manage Student Profiles (CRUD)** | ✅ Full Access | 👁️ View Roster | ✏️ Permitted Only | 👁️ View Eligible |
| **Manage Faculty & Departments** | ✅ Full Access | ❌ Restricted | ❌ Restricted | ❌ Restricted |
| **Mark / Update Attendance Sheet** | 👁️ View Defaulters | ✅ Full Access | 👁️ View Own Record | ❌ Restricted |
| **Post Coursework & Grade Work** | 👁️ Audit View | ✅ Full Access | 📤 Submit Links | ❌ Restricted |
| **Publish Campus Job Drives** | 👁️ View Statistics | ❌ Restricted | ❌ Restricted | ✅ Full Access |
| **Apply to Placement Openings** | ❌ Restricted | ❌ Restricted | ✅ (If Qualified) | ❌ Restricted |
| **Update Selection Stages** | 👁️ Audit View | ❌ Restricted | 👁️ View Own Status | ✅ Full Access |
| **Attendance Defaulter Flagging** | ✅ Automated Alerts | ✅ Subject Alerts | ⚠️ Warning Notice | ❌ Restricted |

---

## 🏗️ System Architecture

CampusSphere is built using a modern 3-tier decoupled architecture:

```mermaid
graph TD
    subgraph Presentation_Layer ["Presentation Layer (React 18 + TypeScript)"]
        UI["Tailwind CSS + Lucide Icons + Recharts"]
        Router["React Router v6 Protected RBAC Routes"]
    end

    subgraph Intelligence_Layer ["State & Intelligent Engine Layer"]
        AuthContext["Auth Context & 1-Click Role Switcher"]
        DefaulterEngine["Attendance Defaulter Engine (<75% Flag)"]
        EligibilityEngine["Placement Criteria & Skill Gap Matcher"]
        AcademicEngine["Academic Performance Trajectory Monitor"]
    end

    subgraph Data_Layer ["Persistence & Database Layer"]
        HybridStore["Hybrid Data Store / Local Persistence"]
        Postgres["PostgreSQL Database (Supabase)"]
        RLS["Row Level Security (RLS) Policies"]
    end

    UI --> Router
    Router --> AuthContext
    AuthContext --> DefaulterEngine
    AuthContext --> EligibilityEngine
    AuthContext --> AcademicEngine
    DefaulterEngine --> HybridStore
    EligibilityEngine --> HybridStore
    AcademicEngine --> HybridStore
    HybridStore -.-> RLS
    RLS --> Postgres

    🗄️ Database Design & ER Diagram
The database utilizes a normalized relational schema with foreign key constraints and Row Level Security (RLS) policies:
Diagram
Mermaid diagram
📋 Database Schema & Key Columns
Table Name	Primary Key	Foreign Keys	Key Columns	Purpose
departments	id (UUID)	None	code, name, hod_name	Academic branch catalog (CSE, ECE, MECH)
profiles	id (UUID)	auth.users(id)	email, first_name, role	Base user identity and role assignment
student_profiles	id (UUID)	profile_id, department_id	registration_number, cgpa, skills	Extended academic record for students
faculty_profiles	id (UUID)	profile_id, department_id	employee_code, designation	Academic credentials and assignments
attendance	id (UUID)	subject_id, student_id	date, status (present/absent/late)	Session-by-session student presence log
job_openings	id (UUID)	company_id	package_lpa, min_cgpa, required_skills	Corporate hiring drives & criteria
placement_applications	id (UUID)	job_id, student_id	stage, applied_at	Candidate hiring pipeline stages
🧠 Intelligent Engines
1. Automated Attendance Defaulter Alert Engine
The system audits attendance records mathematically rather than relying on manual reporting:
Attendance Rate
=
(
Sessions Attended
Total Sessions Scheduled
)
×
100
Attendance Rate=( 
Total Sessions Scheduled
Sessions Attended
​
 )×100
Threshold: Set to 75%.
Action: Students with an attendance rate below 75% are dynamically flagged as Critical in the Administrator Console and assigned a warning badge on their student dashboard.
2. Deterministic Placement Eligibility & Skill Gap Matcher
When a student evaluates an open job posting, CampusSphere executes an automated evaluation pipeline:
Diagram
Mermaid diagram
💻 Tech Stack
Frontend Framework: React 18 (TypeScript)
Application Bundler: Vite 5
Styling Architecture: Tailwind CSS 3
Iconography: Lucide React
Data Visualization: Recharts (Dynamic Bar & Area Charts)
Database & Auth: PostgreSQL via Supabase
State Management: React Context API
📁 Project Directory Structure
Text
campussphere/
├── screenshots/                     # Preview images for repository documentation
│   ├── admin-dashboard.png
│   ├── student-dashboard.png
│   ├── faculty-dashboard.png
│   └── placement-dashboard.png
├── supabase/
│   ├── schema.sql                   # Normalized PostgreSQL DDL & RLS policies
│   └── seed.sql                     # Comprehensive campus seed data
├── src/
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces and model types
│   ├── lib/
│   │   └── supabase.ts              # Data provider and repository state
│   ├── services/
│   │   └── intelligenceEngine.ts    # Rule engines (Defaulters & Placement Matcher)
│   ├── contexts/
│   │   └── AuthContext.tsx          # Multi-role authentication & instant switcher
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.tsx           # Global header with instant role switcher
│   │       └── DashboardLayout.tsx  # Master container
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx   # Student CRUD, KPIs, Defaulters list
│   │   ├── student/
│   │   │   └── StudentDashboard.tsx # CGPA radar, job applications, submissions
│   │   ├── faculty/
│   │   │   └── FacultyDashboard.tsx # Interactive attendance sheet manager
│   │   └── placement/
│   │       └── PlacementDashboard.tsx# Corporate drives, applicant stage updater
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Vite entry point
│   └── index.css                    # Tailwind utility directives
├── package.json
└── README.md
⚡ Installation & Setup
Prerequisites
Node.js: v18.0.0 or higher
npm: v9.0.0 or higher
1. Clone the Repository
Bash
git clone https://github.com/your-username/campussphere.git
cd campussphere
2. Install Dependencies
Bash
npm install
3. Launch Development Server
Bash
npm run dev
Open your browser and navigate to:
Text
http://localhost:5173
🧪 Interactive Testing Guide
CampusSphere includes an Instant Role Switcher in the top navigation bar, allowing you to test all four user roles without configuring credentials:
Test Administrator:
Navigate to the Enrol New Student Record form, enter student details, and click Save Student to test real-time state insertion.
Inspect the Attendance Flagged (<75%) card to view students automatically caught by the rule engine.
Test Faculty Member:
Toggle attendance buttons (Present, Late, Absent) on the student roster.
Click Save Attendance to persist session records.
Test Student:
View your CGPA trajectory chart and check your attendance rate.
Browse the Placement Openings section. Notice how ineligible jobs display explicit reasons (e.g., minimum CGPA requirements) and recommend specific skills to improve.
Click Apply Now on qualified listings.
Test Placement Officer:
Open the Student Placement Pipeline.
Change an applicant's selection stage from Applied to Shortlisted, Interview, or Selected