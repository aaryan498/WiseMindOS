import { Link, useLocation } from 'react-router-dom';
// import { Home, Target, TrendingUp, Sparkles, BarChart3 } from 'lucide-react';
import { Home, ListChecks, Focus, Sparkles } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/trackers', icon: ListChecks, label: 'Trackers' },
    { path: '/focus-room', icon: Focus, label: 'Focus Room' },
    { path: '/future-twin', icon: Sparkles, label: 'FutureTwin' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-indigo-400' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;