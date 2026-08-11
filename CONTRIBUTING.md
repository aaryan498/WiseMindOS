# Contributing to WiseMindOS

Thank you for considering contributing to WiseMindOS.

WiseMindOS is a full-stack productivity and life-management platform focused on helping users transform long-term goals into structured daily execution through interconnected planning systems, productivity tracking, analytics, and focused workflows.

We welcome contributors of all experience levels, whether you are:
- fixing bugs,
- improving UI/UX,
- writing documentation,
- optimizing backend logic,
- adding new features,
- improving accessibility,
- or enhancing developer experience.

Every contribution helps improve the project and the open-source community around it.

---

# Table of Contents

- Getting Started
- Development Setup
- Project Structure
- Finding Issues
- Contribution Workflow
- Branch Naming Convention
- Commit Message Guidelines
- Pull Request Process
- Code Style Guidelines
- Testing Guidelines
- Contribution Areas
- GSSoC'26 Contributors
- Need Help?

---

# Getting Started

## Prerequisites

Before contributing, make sure you have:

- Git
- Node.js 18+
- npm
- MongoDB installed locally or MongoDB Atlas connection

---

# Fork and Clone the Repository

```bash
# Fork the repository first

# Clone your fork
git clone https://github.com/<your-username>/WiseMindOS.git

# Move into the project directory
cd WiseMindOS

# Add upstream remote
git remote add upstream https://github.com/aaryan498/WiseMindOS.git
```

---

# Development Setup

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=change-me-to-a-random-secret
CLIENT_URL=http://localhost:5173
```

## How to Generate a Strong Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run backend:

```bash
npm run dev
```

---

# Project Structure

```text
WiseMindOS/
│
├── frontend/
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
│   └── public/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── docs/
└── README.md
```

---

# Finding Issues

We maintain issues across multiple contribution levels.

| Level | Labels |
|---|---|
| Beginner | `good first issue` |
| Intermediate | `enhancement` |
| Advanced | `feature` |
| Bug Fixes | `bug` |
| Documentation | `documentation` |
| Performance | `performance` |
| UI/UX | `ui/ux` |
| Backend | `backend` |
| Frontend | `frontend` |

---

# Before Working on an Issue

Before starting work on an issue:

1. Check whether someone is already assigned.
2. Comment on the issue expressing your interest.
3. Wait for issue assignment before starting work.
4. Keep communication active during development.

Inactive issues may be reassigned after prolonged inactivity.

---

# Contribution Workflow

## 1. Create a Branch

Use meaningful branch names.

```bash
git checkout -b feat/feature-name
```

Examples:

```bash
git checkout -b feat/google-auth
git checkout -b fix/dashboard-bug
git checkout -b docs/update-readme
git checkout -b refactor/task-controller
```

---

# Branch Naming Convention

| Type | Prefix |
|---|---|
| Feature | `feat/` |
| Bug Fix | `fix/` |
| Documentation | `docs/` |
| Refactor | `refactor/` |
| Testing | `test/` |
| Chore | `chore/` |

---

# Commit Message Guidelines

Use clean and descriptive commit messages.

## Examples

```bash
feat: add Google authentication support
fix: resolve habit streak calculation issue
docs: update installation guide
refactor: optimize dashboard API structure
```

---

# Making Changes

While contributing:

- Keep PRs focused and small
- Follow project structure
- Avoid unrelated modifications
- Maintain code readability
- Reuse existing components whenever possible
- Test your changes before submission

---

# Pull Request Process

## Before Submitting a PR

Make sure:

- The application runs correctly
- No build errors exist
- No unnecessary files are included
- Code follows project structure
- Environment variables are not committed
- PR addresses only one issue or feature

---

## PR Submission Steps

1. Push your branch

```bash
git push origin feat/feature-name
```

2. Open a Pull Request

3. Include:
   - Clear description
   - Issue reference
   - Screenshots for UI changes
   - Testing details

4. Wait for maintainer review

---

# Pull Request Checklist

Before submitting a PR:

- [ ] Code compiles successfully
- [ ] No console errors
- [ ] UI is responsive
- [ ] Existing functionality remains unaffected
- [ ] Code follows project structure
- [ ] Branch is up to date with upstream
- [ ] PR description is properly filled
- [ ] Relevant issue is linked

---

# Code Style Guidelines

## Frontend

- Use functional React components
- Prefer reusable components
- Use proper folder structure
- Avoid unnecessary re-renders
- Keep UI responsive

## Backend

- Keep controllers modular
- Use proper route separation
- Follow REST API practices
- Validate request data properly
- Avoid duplicated logic

---

# General Coding Guidelines

- Write clean and readable code
- Use meaningful variable names
- Remove unused imports
- Avoid unnecessary comments
- Keep functions modular
- Avoid hardcoded values where possible

---

# Testing Guidelines

Before submitting changes:

## Frontend

```bash
npm run dev
```

Verify:
- Responsive UI
- Navigation
- Forms
- State updates
- API integrations

---

## Backend

Verify:
- APIs work correctly
- Database operations work
- Authentication works properly
- No server crashes occur

---

# Contribution Areas

Contributors can work on multiple areas of the project.

## Frontend

- UI/UX improvements
- Responsive design
- Dashboard enhancements
- Planner improvements
- Accessibility

## Backend

- API optimization
- Authentication enhancements
- Database optimizations
- Modular architecture improvements

## Future Systems

- FutureTwin AI assistant
- Gamification systems
- Finance tracker
- Productivity analytics
- Smart recommendations

## Documentation

- README improvements
- Setup documentation
- API documentation
- Contributor guides

---

# GSSoC'26 Contributors

WiseMindOS is an open-source project participating in GirlScript Summer of Code 2026.

## Guidelines for GSSoC Contributors

1. Read the issue completely before starting.
2. Comment on the issue before working.
3. Wait for assignment confirmation.
4. Submit quality contributions instead of quantity-focused PRs.
5. Maintain proper communication with maintainers.
6. Avoid spam PRs or copied solutions.

---

# Best Practices for Contributors

- Focus on quality over quantity
- Maintain clean code standards
- Keep pull requests focused
- Respect maintainers and contributors
- Write scalable and maintainable code
- Ask questions if anything is unclear

---

# Need Help?

If you face issues while contributing:

- Open a discussion
- Create an issue
- Ask questions in issue comments
- Reach out to maintainers politely

---

# Thank You

Thank you for contributing to WiseMindOS and helping improve the project for the open-source community.
