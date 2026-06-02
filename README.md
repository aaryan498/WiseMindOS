# WiseMindOS

<div align="center">

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)]()
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge)]()
[![Open Source](https://img.shields.io/badge/Open%20Source-GSSoC-orange?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

### Full-Stack Productivity & Life Management Platform

Transform long-term goals into structured daily execution through interconnected planning systems, habit tracking, productivity analytics, and focused workflow management.

</div>

---

## Live Demo

| Platform | Link |
|---|---|
| Live Application | https://wise-mind-os.vercel.app |
| GitHub Repository | https://github.com/aaryan498/WiseMindOS.git |

---

# Overview
**WiseMindOS** is an open-source, modular full-stack "Life Operating System" designed to align daily execution with long-term ambitions. 

While traditional tools offer fragmented task tracking, WiseMindOS unifies goals, projects, habits, deep-work systems, and bi-directional analytics into a single, cohesive engine. The platform is architected to transition personal growth from passive tracking to an active, data-driven workflow.

### The FutureTwin 
The ecosystem is scaling toward an intelligent productivity framework powered by **FutureTwin**—a personalized AI assistant that evaluates user analytics, counters behavioral friction, and continuously optimizes your daily trajectory toward high-level milestones.

---
# Screenshots
<div align="center">
   
## Dashboard
![Dashboard](assets/screenshots/Dashboard.jpeg)
*A central view that shows overall productivity insights, including goals progress, tasks, habits, and performance analytics in one place.*


## Trackers
![Trackers](assets/screenshots/Trackers.jpeg)
*It monitors habits, tasks, and goals to measure consistency, progress, and productivity over time.*


## FutureTwin
![FutureTwinAI](assets/screenshots/FutureTwinAI.jpeg)
*An intelligent assistant that analyzes user behavior and productivity patterns to provide personalized recommendations and improve daily performance.*


## Library
![Library](assets/screenshots/YourLibrary.jpeg)
*A personal knowledge space to store, organize, and revisit notes, ideas, and important information in a structured way.*

</div>

---

# Core Features

| Module | Description |
|---|---|
| Goal Management | Create and manage long-term goals with progress tracking |
| Project System | Break goals into actionable projects |
| Task Management | Manage solo tasks and productivity workflows |
| Daily Planner | Structured daily execution planning |
| Habit Tracking | Track habits and maintain productivity streaks |
| Productivity Dashboard | Visual analytics and productivity insights |
| Focus Room | Dedicated distraction-free focus workspace |
| Library & Notes | Notebook and page-based knowledge management |
| Authentication System | Secure JWT-based authentication and protected routes |
| Progress Analytics | Weekly productivity statistics and tracking systems |


---

# Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Router
- Axios
- Context API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Deployment

- Vercel

---
# Project Architecture

```text
WiseMindOS/
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── documentation.md
│   │   └── feature_request.md
│   │
│   └── PULL_REQUEST_TEMPLATE.md
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
│
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── README.md
└── .gitignore
```

---

# Productivity Workflow Structure

```text
Goals
   ↓
Projects
   ↓
Tasks
   ↓
Daily Planning
   ↓
Habit Consistency
   ↓
Analytics & Productivity Tracking
```

---

# Current Implemented Modules

| Status | Module |
|---|---|
| Completed | Authentication System |
| Completed | Goals Management |
| Completed | Projects Management |
| Completed | Solo Tasks |
| Completed | Daily Planner |
| Completed | Habit Tracker |
| Completed | Dashboard Analytics |
| Completed | Focus Room |
| Completed | Library & Notebook System |
| Completed | Productivity Streak System |
| Planned | FutureTwin AI Assistant |
| Planned | Reward & Ranking System |
| Planned | Finance Tracker |
| Planned | Diet Tracker |

---
# Getting Started

## Prerequisites

Before running WiseMindOS locally, ensure you have the following installed:

- Node.js (v18 or later)
- npm (comes with Node.js)
- MongoDB (local installation or MongoDB Atlas)
- Git

Verify your installation:

```bash
node -v
npm -v
git --version
```

Then immediately follow it with:



## Quick Start

Follow these steps to run WiseMindOS on your local machine.

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/aaryan498/WiseMindOS.git
cd WiseMindOS
```

### 2. Create Backend Environment Variables

Navigate to the backend folder and create a `.env` file:

```bash
cd backend
```

Add the following:

```env 
PORT=4000
MONGODB_URI=your_mongodb_connection_string
DB_NAME="wise-mind-os"
JWT_SECRET=replace_with_a_secure_random_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMAGEKIT_PUBLIC_KEY=placeholder_public_key
IMAGEKIT_PRIVATE_KEY=placeholder_private_key
IMAGEKIT_URL_ENDPOINT=placeholder_url_endpoint
```

or

```bash
cp .env.example .env
```

### 3. Create Frontend Environment Variables

Navigate to the frontend folder and create a `.env` file:

```bash
cd ../frontend
```

Add the following:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID:your_google_client_id
```

### 4. Install Backend Dependencies

Open a terminal in the `backend` folder and run:

```bash
npm install
```

### 5. Install Frontend Dependencies

Open a terminal in the `frontend` folder and run:

```bash
npm install
```

### 6. Start the Backend Server

Open **Terminal 1**:

```bash
cd WiseMindOS/backend
npm run dev
```

Wait until the backend starts successfully.

### 7. Start the Frontend Server

Open **Terminal 2**:

```bash
cd WiseMindOS/frontend
npm run dev
```

### 8. Open the Application

Once both servers are running, open the **Local** URL displayed in Terminal 2.

By default, it is usually:

```text
http://localhost:5173
```


### Project Running Order

1. Start MongoDB
2. Start the backend server (Terminal 1)
3. Start the frontend server (Terminal 2)
4. Open the application in your browser

---

## Troubleshooting

### Backend Fails to Start

* Verify that all required environment variables are configured correctly.
* Ensure your MongoDB instance is running and the connection string is valid.
* Reinstall dependencies if required:

```bash
npm install
```

### Frontend Fails to Start

* Verify that all frontend environment variables are configured correctly.
* Make sure dependencies are installed:

```bash
npm install
```

### Frontend Cannot Connect to Backend

* Ensure the backend server is running.
* Verify that `VITE_BACKEND_URL` points to the correct backend URL.

### Port Already in Use
- If the application fails to start because a port is already in use, stop the conflicting process or update the port configuration.

---

# API Structure

| Endpoint Category | Description |
|---|---|
| `/auth` | Authentication APIs |
| `/goals` | Goal management APIs |
| `/projects` | Project management APIs |
| `/tasks` | Task management APIs |
| `/planner` | Daily planner APIs |
| `/habits` | Habit tracking APIs |
| `/library` | Notebook and notes APIs |
| `/dashboard` | Productivity analytics APIs |

---
# Contribution Areas

WiseMindOS is built with a modular architecture, allowing contributors to work on different parts of the platform independently. Whether you're a beginner exploring open source or an experienced developer, there are multiple ways to contribute.

## Available Contribution Areas

### Frontend Development

* UI/UX improvements
* Responsive design enhancements
* Component development and optimization

### Backend Development

* API development and improvements
* Database integration and optimization
* Authentication and authorization features

### Productivity Systems

* Goal management enhancements
* Task and habit tracking improvements
* Productivity analytics and reporting

### AI & Smart Features

* FutureTwin AI assistant development
* Intelligent productivity recommendations
* Behavioral analytics features

### Quality & Performance

* Testing and bug fixes
* Accessibility improvements
* Performance optimization

### Documentation & Community

* README and documentation improvements
* Contributor onboarding
* Issue triaging and community support

### DevOps & Deployment

* CI/CD improvements
* Deployment workflows
* Infrastructure and monitoring
---
## New Contributors

New to open source? You're welcome here.

Before contributing, please take a moment to:

1. Read the `CONTRIBUTING.md` guidelines.
2. Review the `CODE_OF_CONDUCT.md`.
3. Browse existing issues and discussions.
4. Comment on an issue before starting work to avoid duplicate efforts.
5. Keep pull requests focused on a single feature, fix, or improvement.
6. Write clear commit messages and pull request descriptions.

If you're looking for a place to start, consider contributing to:

* Documentation improvements
* UI/UX enhancements
* Bug fixes
* Accessibility improvements
* Testing and quality assurance

- Every contribution, no matter how small, helps improve WiseMindOS.
---
# Why WiseMindOS?

Most productivity apps help you manage tasks.

WiseMindOS helps you manage progress.

By connecting goals, projects, tasks, habits, planning, focus systems, and analytics into one ecosystem, WiseMindOS turns long-term ambitions into consistent daily action.

Rather than tracking productivity in isolated modules, WiseMindOS creates a structured workflow where every action contributes to a larger objective. The platform is designed to help users build momentum, maintain consistency, and stay aligned with their long-term vision.

- The goal is simple: stay focused, stay consistent, and make measurable progress every day.
---
# Future Roadmap

WiseMindOS is continuously evolving to become a comprehensive productivity and life-management platform. Upcoming features and planned enhancements include:

## AI & Intelligence

* AI-powered FutureTwin productivity assistant
* Smart productivity recommendations
* Behavioral analytics and insights
* Burnout prediction system

## Productivity & Planning

* Smart scheduling assistant
* Calendar integrations
* Advanced analytics dashboards
* Real-time notifications

## Personal Growth & Wellness

* Finance tracking module
* Diet and wellness tracking
* Gamification and reward systems

## Community & Engagement

* Productivity rankings and leaderboards

## Platform Expansion

* Google OAuth authentication
* Mobile application
* Desktop application
* Cross-platform synchronization

These features are part of the long-term vision of making WiseMindOS an intelligent, data-driven platform for productivity, personal growth, and goal achievement.


# Repository Structure

```text
.github/        GitHub issue templates and pull request templates
backend/        Express backend APIs, middleware, models, and server logic
frontend/       React frontend application and UI components
```

---

# License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.

---

# Maintainer

Aaryan Kumar

Building WiseMindOS with the vision of creating an intelligent productivity ecosystem where goals, habits, planning, and analytics work together to turn ambition into measurable progress.

---
# Support the Project

If you find WiseMindOS useful, consider supporting the project by:

* Starring the repository
* Forking the project
* Contributing features, fixes, or improvements
* Sharing feedback and suggestions

Every contribution, whether it's code, documentation, testing, or feedback, helps make WiseMindOS better for the entire community.
