import { Moon, SunMedium } from 'lucide-react';
import { useApp } from '../store/AppContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useApp();
  const isLightTheme = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="wm-theme-toggle focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
      aria-label={`Switch to ${isLightTheme ? 'dark' : 'light'} theme`}
      aria-pressed={isLightTheme}
    >
      <span className="wm-theme-toggle__icon">
        {isLightTheme ? <Moon size={18} /> : <SunMedium size={18} />}
      </span>
      <span className="wm-theme-toggle__label">
        <span className="wm-theme-toggle__eyebrow">Theme</span>
        <span className="wm-theme-toggle__value">{isLightTheme ? 'Light Mode' : 'Dark Mode'}</span>
      </span>
    </button>
  );
};

export default ThemeToggle;
