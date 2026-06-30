import { Outlet, Navigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useApp } from '../store/AppContext';
import { useTheme } from '../store/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import CustomCursor from "../components/CustomCursor";

const AppLayout = () => {
  const { token } = useApp();
  const { theme, toggleTheme } = useTheme();

  // Protect all routes inside this layout
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <CustomCursor />
      
      {/* Floating Theme Toggle Switch */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-lg text-gray-800 dark:text-yellow-400 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;