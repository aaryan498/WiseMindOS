import { Link, useLocation } from 'react-router-dom';
import { Home, ListChecks, Focus, Sparkles, Library } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/trackers', icon: ListChecks, label: 'Trackers' },
    { path: '/focus-room', icon: Focus, label: 'Focus Room' },
    { path: '/future-twin', icon: Sparkles, label: 'FutureTwin' },
    { path: '/library', icon: Library, label: 'Library' },
  ];

  return (
    <nav className="
fixed bottom-0 left-0 right-0 z-50
bg-black/40 backdrop-blur-xl 
border-t border-white/10
shadow-[0_-10px_30px_rgba(0,0,0,0.5)]
">
      <div className="flex justify-around items-center h-16 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px]
before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1 h-full flex items-center justify-center"
            >
              <motion.div
                className={`
      flex flex-col items-center justify-center 
      px-3 py-1 rounded-xl transition-all duration-300
      ${isActive
                    ? "text-indigo-400"
                    : "text-gray-400"
                  }
    `}
                whileTap={{ scale: 0.9 }}
              >

                {/* Active Background Glow */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute w-14 h-10 rounded-xl bg-indigo-500/10 blur-md"
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={isActive ? { y: [0, -4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={isActive ? "drop-shadow-[0_0_10px_rgba(99,102,241,0.7)]" : ""}
                >
                  {item.path.endsWith("/focus-room") ? <Icon size={30} /> : <Icon size={22} />}
                </motion.div>

                {/* Label */}
                <span className="text-[10px] mt-1">
                  {item.path.endsWith("/focus-room") ? "" : item.label}
                </span>

              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;