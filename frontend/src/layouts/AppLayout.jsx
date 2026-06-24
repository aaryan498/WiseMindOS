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
    <div className="min-h-screen bg-gray-900">
      <CustomCursor />
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default AppLayout;