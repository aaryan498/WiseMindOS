import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Folder,
  CheckSquare,
  Flame,
  Library,
  Focus,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import Modal from '../Modal';
import './Navigation.css';

const Sidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { setToken, navigate } = useApp();

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    localStorage.removeItem('wisemind_user');
    setToken('');
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview of your personal growth and statistics'
    },
    {
      path: '/trackers/goals',
      icon: Target,
      label: 'Goals',
      description: 'Define and track your long-term life objectives'
    },
    {
      path: '/trackers/projects',
      icon: Folder,
      label: 'Projects',
      description: 'Manage larger multi-step projects'
    },
    {
      path: '/trackers/tasks',
      icon: CheckSquare,
      label: 'Tasks',
      description: 'Manage individual action items and tasks'
    },
    {
      path: '/trackers/habits',
      icon: Flame,
      label: 'Habits',
      description: 'Form and monitor daily positive habits'
    },
    {
      path: '/library',
      icon: Library,
      label: 'Library',
      description: 'Browse saved guides, books, and references'
    },
    {
      path: '/focus-room',
      icon: Focus,
      label: 'Focus Room',
      description: 'Enter deep work session with distraction blocker'
    },
    {
      path: '/report',
      icon: TrendingUp,
      label: 'Analytics',
      description: 'View performance and tracking analytics reports'
    }
  ];

  const footerItems = [
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      description: 'Configure account and theme settings'
    },
    {
      path: '/help',
      icon: HelpCircle,
      label: 'Help',
      description: 'Get help and documentation'
    }
  ];

  return (
    <>
      <aside 
        className="hidden sm:flex flex-col w-64 h-screen fixed left-0 top-0 bg-black/40 backdrop-blur-xl border-r border-white/10 text-gray-300 select-none z-30"
        aria-label="Desktop sidebar navigation"
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            WiseMindOS
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="relative nav-item-container">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold border-l-4 nav-transition cursor-pointer
                    ${isActive
                      ? 'border-blue-500 bg-white/5 text-blue-400'
                      : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
                <div className="nav-tooltip" role="tooltip">
                  {item.description}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer Items */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {footerItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="relative nav-item-container">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold border-l-4 nav-transition cursor-pointer
                    ${isActive
                      ? 'border-blue-500 bg-white/5 text-blue-400'
                      : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
                <div className="nav-tooltip" role="tooltip">
                  {item.description}
                </div>
              </div>
            );
          })}
          
          <div className="relative nav-item-container">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold border-l-4 border-transparent text-gray-400 hover:bg-white/5 hover:text-white nav-transition cursor-pointer text-left"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span>Logout</span>
            </button>
            <div className="nav-tooltip" role="tooltip">
              Sign out of your account
            </div>
          </div>
        </div>
      </aside>

      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Log Out">
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20">
            <LogOut aria-hidden="true" size={32} />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
            Are you sure you want to log out? Any unsaved progress will be lost.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-sm font-semibold focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogoutModalOpen(false);
                logout();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all cursor-pointer text-sm font-semibold active:scale-95 focus:outline-none"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
