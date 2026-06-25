import { exportWorkspaceData } from '../utils/exportData';
import { Outlet, Navigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useApp } from '../store/AppContext';
import CustomCursor from "../components/CustomCursor";

const AppLayout = () => {
  const { token } = useApp();

  // Protect all routes inside this layout
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-24 relative">
      <CustomCursor />
      
      {/* Main Content Area */}
      <Outlet />
      
      {/* Export Data Glassmorphic Trigger Button */}
      <div className="fixed bottom-20 right-4 z-50 max-w-xs">
        <button
          onClick={() => {
            const simulatedStateData = {
              goals: localStorage.getItem('goals') ? JSON.parse(localStorage.getItem('goals')) : [],
              tasks: localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [],
              planner: localStorage.getItem('planner') ? JSON.parse(localStorage.getItem('planner')) : []
            };
            exportWorkspaceData(simulatedStateData);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-md active:scale-95"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export Workspace</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default AppLayout;