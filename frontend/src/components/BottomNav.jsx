import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListChecks, Focus, Sparkles, Library, LogOut, Trophy } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useApp } from '../store/AppContext';
import Modal from './Modal';

const BottomNav = () => {
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { setToken, navigate } = useApp();

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    localStorage.removeItem('wisemind_user');
    setToken('');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/trackers', icon: ListChecks, label: 'Trackers' },
    { path: '/focus-room', icon: Focus, label: 'Focus' },
    { path: '/future-twin', icon: Sparkles, label: 'FutureTwin' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/leaderboard', icon: Trophy, label: 'Rankings' },
    { path: '/login', icon: LogOut, label: 'LogOut' },
  ];

  return (
    <>
      <nav
        aria-label="Primary app navigation"
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-black/40 backdrop-blur-xl
          border-t border-white/10
          shadow-[0_-10px_30px_rgba(0,0,0,0.5)]
        "
      >
        <div className="flex justify-around items-center h-16 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isLogout = item.label === 'LogOut';

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={isLogout ? 'Log out' : `Go to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  if (isLogout) {
                    e.preventDefault();
                    setIsLogoutModalOpen(true);
                  }
                }}
                className="flex-1 h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-inset"
              >
                <Motion.div
                  className={`
                    flex flex-col items-center justify-center
                    px-3 py-1 rounded-xl transition-all duration-300
                    ${isActive ? 'text-indigo-400' : 'text-gray-400'}
                  `}
                  whileTap={{ scale: 0.9 }}
                >
                  {isActive && (
                    <Motion.div
                      layoutId="nav-pill"
                      className="absolute w-14 h-10 rounded-xl bg-indigo-500/10 blur-md"
                    />
                  )}

                  <Motion.div
                    animate={isActive ? { y: [0, -4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={isActive ? 'drop-shadow-[0_0_10px_rgba(99,102,241,0.7)]' : ''}
                  >
                    <Icon aria-hidden="true" size={22} />
                  </Motion.div>

                  <span className="text-[10px] mt-1">
                    {item.label}
                  </span>
                </Motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Log Out">
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20">
            <LogOut aria-hidden="true" size={32} />
          </div>
          <p className="text-gray-300 mb-6 text-sm">
            Are you sure you want to log out? Any unsaved progress will be lost.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors cursor-pointer text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogoutModalOpen(false);
                logout();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all cursor-pointer text-sm font-semibold active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BottomNav;
