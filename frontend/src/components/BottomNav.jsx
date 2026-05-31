import { Link, useLocation } from 'react-router-dom';
import { Home, ListChecks, Focus, Sparkles, Library, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../store/AppContext';

const BottomNav = () => {
  const location = useLocation();
  const { setToken, navigate } = useApp();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('wisemind_user');
    setToken('');
    navigate('/login');
  };

  const navItems = [
    { type: 'route', path: '/dashboard', icon: Home, label: 'Dashboard' },
    { type: 'route', path: '/trackers', icon: ListChecks, label: 'Trackers' },
    { type: 'route', path: '/focus-room', icon: Focus, label: 'Focus' },
    { type: 'route', path: '/future-twin', icon: Sparkles, label: 'FutureTwin' },
    { type: 'route', path: '/library', icon: Library, label: 'Library' },
    { type: 'action', onClick: logout, icon: LogOut, label: 'LogOut', isDestructive: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] select-none">
      {/* Top Border Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1px bg-gradient from-transparent via-indigo-500 to-transparent opacity-80" />
      
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.type === 'route' && location.pathname === item.path;
          
          // Compute semantic text states based on item traits
          const getTextColorClass = () => {
            if (isActive) return "text-indigo-400";
            if (item.isDestructive) return "text-slate-500 hover:text-rose-400";
            return "text-slate-400 hover:text-slate-200";
          };

          const innerContent = (
            <motion.div
              className={`relative flex flex-col items-center justify-center w-full h-full py-1.5 rounded-xl transition-colors duration-200 ${getTextColorClass()}`}
              whileTap={{ scale: 0.92 }}
            >
              {/* Active Background Pill Glow */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 mx-auto w-12 h-10 my-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)] -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              {/* Animated Icon Container */}
              <motion.div
                animate={isActive ? { scale: [1, 1.12, 1], y: -2 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`${isActive ? "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""} flex items-center justify-center`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              </motion.div>

              {/* Label */}
              <span className={`text-[9px] font-medium tracking-wide mt-1 transition-all duration-200 ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </motion.div>
          );

          // Render as a button if it executes an action, otherwise render as link
          if (item.type === 'action') {
            return (
              <button
                key={`action-${idx}`}
                onClick={item.onClick}
                className="flex-1 h-full flex items-center justify-center bg-transparent border-none outline-none cursor-pointer"
                title={item.label}
              >
                {innerContent}
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className="flex-1 h-full flex items-center justify-center"
            >
              {innerContent}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;