import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Library,
  Settings
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const MobileNav = () => {
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/trackers/goals', icon: Target, label: 'Goals' },
    { path: '/trackers/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav
      aria-label="Mobile navigation tab bar"
      className="
        sm:hidden fixed bottom-0 left-0 right-0 z-50
        bg-black/40 backdrop-blur-xl border-t border-white/10
        shadow-[0_-4px_12px_rgba(0,0,0,0.4)]
      "
      style={{
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
      }}
    >
      <div className="flex justify-around items-center h-14 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              aria-label={`Go to ${tab.label}`}
              aria-current={isActive ? 'page' : undefined}
              className="flex-1 h-full flex flex-col items-center justify-center focus:outline-none cursor-pointer"
            >
              <Motion.div
                className={`
                  flex flex-col items-center justify-center relative
                  px-3 py-1 rounded-xl transition-all duration-200
                  ${isActive ? 'text-blue-400 font-semibold' : 'text-gray-400'}
                `}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={22} />
                <span className="text-[10px] mt-0.5">{tab.label}</span>
                {isActive && (
                  <Motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute -bottom-1 w-8 h-[2px] bg-blue-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
