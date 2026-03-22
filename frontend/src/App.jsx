import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import FutureTwin from './pages/FutureTwin';
import Reports from './pages/Reports';
import AppLayout from './layouts/AppLayout';
import './App.css';

import Onboarding from './pages/Onboarding';

import Trackers from './pages/Trackers';
import GoalTracker from './pages/GoalTracker';
import ProjectTracker from './pages/ProjectTracker';
import SoloTaskTracker from './pages/SoloTaskTracker';
import HabitTracker from './pages/HabitTracker';
import DailyTaskTracker from './pages/DailyTaskTracker';
import FocusRoom from './pages/FocusRoom';

function App() {
  return (
    <BrowserRouter>
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
          <Route path="/goals" element={<Goals />} />
          <Route path="/future" element={<FutureTwin />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;