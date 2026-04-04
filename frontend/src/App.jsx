import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FutureTwin from './modules/simulator_room/FutureTwin';
import AppLayout from './layouts/AppLayout';
import './App.css';

import Onboarding from './pages/Onboarding';

import Trackers from './modules/trackers/Trackers';
import GoalTracker from './modules/trackers/goal_tracker/GoalTracker';
import ProjectTracker from './modules/trackers/project_tracker/ProjectTracker';
import SoloTaskTracker from './modules/trackers/solo_task_tracker/SoloTaskTracker';
import HabitTracker from './modules/trackers/habit_tracker/HabitTracker';
import DailyTaskTracker from './modules/trackers/daily_task_tracker/DailyTaskTracker';
import FocusRoom from './modules/focus_room/FocusRoom';
import Library from './modules/library_room/Library';

function App() {
  return (
    
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Protected Routes with AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trackers" element={<Trackers />} />
          <Route path="/trackers/goals" element={<GoalTracker />} />
          <Route path="/trackers/projects" element={<ProjectTracker />} />
          <Route path="/trackers/tasks" element={<SoloTaskTracker />} />
          <Route path="/trackers/habits" element={<HabitTracker />} />
          <Route path="/trackers/daily-tasks" element={<DailyTaskTracker />} />
          <Route path="/focus-room" element={<FocusRoom />} />
          <Route path="/future-twin" element={<FutureTwin />} />
          <Route path="/future" element={<FutureTwin />} />
          <Route path="/library" element={<Library />} />

        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default App;