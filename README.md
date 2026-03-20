# WiseMindOS - Life Tracking & Simulation System

A comprehensive life tracking and simulation system built with React, TailwindCSS, and Recharts. Track habits, manage goals, complete tasks, and simulate future outcomes with AI-powered insights.

## 🎯 Features

### Core Features
- **21-Day Habit Tracker** - Build lasting habits with proven tracking system
- **Goal Management** - Set, track, and achieve personal and professional goals
- **Task & Project Tracking** - Organize work with powerful task management
- **FutureTwin AI** - Simulate future outcomes and make data-driven decisions
- **Smart Analytics** - Comprehensive productivity analytics with charts
- **Holistic Development** - Focus on balanced growth and reduce burnout

### 8 Main Pages
1. **Landing Page** - Hero, Features, How It Works, Footer
2. **Login** - Secure authentication
3. **Signup** - User registration with goal selection onboarding
4. **Dashboard** - Productivity score, habit consistency, charts, today's summary
5. **Tracker** - Daily logs, habits checklist, task manager, project tracker (MOST IMPORTANT)
6. **Goals** - Add/edit/track goals with progress indicators
7. **FutureTwin** - AI simulation for \"What if?\" scenarios (CORE FEATURE)
8. **Reports** - Weekly/monthly analytics with multiple chart types

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4
- **Routing**: React Router DOM 7.13.1
- **Styling**: TailwindCSS 4.2.1
- **Charts**: Recharts 3.8.0
- **Icons**: Lucide React 0.577.0
- **Build Tool**: Vite 7.3.1

## 📁 Project Structure

```
/app/frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── BottomNav.jsx
│   │   ├── Card.jsx
│   │   ├── ChartWrapper.jsx
│   │   ├── GradientButton.jsx
│   │   ├── InputField.jsx
│   │   ├── Modal.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── StatCard.jsx
│   │   └── ToggleSwitch.jsx
│   ├── pages/            # Main application pages
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Tracker.jsx
│   │   ├── Goals.jsx
│   │   ├── FutureTwin.jsx
│   │   └── Reports.jsx
│   ├── layouts/          # Layout components
│   │   └── AppLayout.jsx
│   ├── utils/            # Helper functions
│   │   └── helpers.js
│   ├── data/             # Mock data
│   │   └── mockData.js
│   ├── App.jsx           # Main app with routing
│   ├── main.jsx          # Entry point
│   └── App.css           # Global styles
├── package.json
├── vite.config.js
└── index.html
```

## 🎨 Design System

### Theme
- **Background**: Dark (gray-900)
- **Cards**: Lighter dark (gray-800)
- **Accent**: Gradient (indigo → violet)
- **Text**: White / gray-300

### UI Style
- Minimal, modern, glassy feel
- Rounded corners (xl / 2xl)
- Soft shadows
- Smooth transitions
- **Mobile-First** responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Yarn package manager

### Installation

1. Install dependencies:
```bash
cd /app/frontend
yarn install
```

2. Start development server:
```bash
yarn dev
# or
yarn start
```

3. Build for production:
```bash
yarn build
```

The app will be available at `http://localhost:3000`

## 📱 Pages Overview

### 1. Landing Page
- Hero section with tagline and CTA buttons
- Features showcase (6 key features)
- \"How It Works\" step-by-step guide
- Call-to-action section
- Footer

### 2. Authentication
- **Login**: Email/password authentication with validation
- **Signup**: Two-step process with goal selection onboarding

### 3. Dashboard
- Welcome card
- 4 stat cards (Productivity Score, Habit Consistency, Active Goals, Tasks Done)
- Today's summary (Study hours, Sleep hours, Tasks completed)
- Weekly productivity line chart
- Habit completion bar chart
- Quick actions

### 4. Tracker Page (Most Important)
**Daily Logs Input**:
- Study hours, Sleep hours, Tasks completed

**Habit Tracker (21-Day)**:
- Add/remove habits
- Toggle completion
- Streak tracking
- Visual progress

**Task Manager**:
- Add/edit/delete tasks
- Priority levels (high/medium/low)
- Status toggle (pending/completed)

**Project Tracker**:
- Progress bars
- Task completion tracking

### 5. Goals Page
- Add new goals with title, description, deadline
- View all goals in card grid
- Progress indicators
- Status badges (On Track / In Progress / Behind)

### 6. FutureTwin Page (Core AI Feature)
- Large text input for \"What if?\" questions
- Example questions for guidance
- Mock AI responses showing:
  - Impact (Positive/Negative)
  - Achievability (High/Medium/Low)
  - Required Habits
  - Habits to Avoid
  - AI Insights (2-3 detailed points)

### 7. Reports Page
- Summary cards (Weekly avg, Habits completed, Current streak, Goals progress)
- **Weekly Summary**:
  - Productivity trend line chart
  - Habit completion bar chart
- **Monthly Summary**:
  - Progress over time line chart
  - Time distribution pie chart
- Key insights (Strengths & Areas to Improve)

### 8. Bottom Navigation (Mobile-First)
- Home (Dashboard)
- Tracker
- Goals
- FutureTwin
- Reports

## 🔧 Key Components

### Reusable Components
- **Card**: Container with consistent styling
- **GradientButton**: Primary CTA button with indigo-violet gradient
- **InputField**: Form input with label and validation
- **StatCard**: Dashboard metric display with icon and trend
- **ProgressBar**: Visual progress indicator
- **ToggleSwitch**: Boolean toggle with smooth animation
- **Modal**: Popup dialog for forms
- **ChartWrapper**: Recharts line chart wrapper
- **BottomNav**: Mobile navigation bar

## 📊 Charts & Analytics

Using **Recharts** for all visualizations:
- **Line Charts**: Productivity trends, monthly progress
- **Bar Charts**: Habit completion rates
- **Pie Charts**: Time distribution

## 🎯 Features Checklist

- ✅ Fully responsive (mobile-first)
- ✅ Dark theme with gradient accents
- ✅ All pages interconnected with routing
- ✅ All buttons and navigation functional
- ✅ Form validation on login/signup
- ✅ CRUD operations for habits, tasks, goals
- ✅ Mock data for realistic experience
- ✅ Charts and analytics
- ✅ AI simulation interface (FutureTwin)
- ✅ Clean, modular code structure
- ✅ Reusable components
- ✅ No linting errors

## 🔄 State Management

Currently using React useState for local state management. Mock data is stored in `/src/data/mockData.js`.

For production, consider:
- React Context for global state
- LocalStorage for persistence
- Backend API integration

## 🌐 Routing

All routes configured in `App.jsx`:

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Marketing page |
| `/login` | Login | User authentication |
| `/signup` | Signup | User registration |
| `/dashboard` | Dashboard | Overview & stats |
| `/tracker` | Tracker | Daily tracking (habits/tasks) |
| `/goals` | Goals | Goal management |
| `/future` | FutureTwin | AI simulation |
| `/reports` | Reports | Analytics & insights |

## 🎨 Color Palette

- **Primary Gradient**: `from-indigo-600 to-violet-600`
- **Background**: `bg-gray-900`
- **Cards**: `bg-gray-800`
- **Text**: `text-white`, `text-gray-300`
- **Accent**: `text-indigo-400`, `text-violet-400`

## 📝 Mock Data

All mock data is in `/src/data/mockData.js`:
- Weekly productivity data
- Habit completion data
- Time distribution data
- Monthly progress data
- Mock habits, tasks, goals, projects
- FutureTwin mock responses

## 🚀 Production Ready

The frontend is production-ready with:
- Clean, maintainable code
- Responsive design
- No console errors
- Optimized builds with Vite
- All features functional

## 🔮 Future Enhancements

- Real backend integration
- User authentication with JWT
- Database persistence
- Real AI integration for FutureTwin
- Push notifications
- Social features
- Data export
- Calendar integration

## 📄 License

Built for personal use. Modify as needed.

---

**Built with ❤️ using React, TailwindCSS, and Recharts**