import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Navigation/Sidebar';
import MobileNav from '../components/Navigation/MobileNav';
import { NavigationProvider } from '../context/NavigationContext';
import { useApp } from '../store/AppContext';
import CustomCursor from "../components/CustomCursor";

const AppLayout = () => {
  const { token } = useApp();

  // Protect all routes inside this layout
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-900 flex">
        <CustomCursor />
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 sm:pl-64 pb-20 sm:pb-0">
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <MobileNav />
      </div>
    </NavigationProvider>
  );
};

export default AppLayout;