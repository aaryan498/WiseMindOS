import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default AppLayout;