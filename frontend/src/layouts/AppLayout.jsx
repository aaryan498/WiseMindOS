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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <CustomCursor />

      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;