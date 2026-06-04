import { Outlet, Navigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useApp } from '../store/AppContext';

const AppLayout = () => {
  const { token } = useApp();

  // Protect all routes inside this layout
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="wm-page-shell">
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default AppLayout;
