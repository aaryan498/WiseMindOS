import { useState, useEffect } from 'react';
import { format, getHours } from 'date-fns';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ClockWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = getHours(currentTime);
    if (hour < 12) return 'Good Morning, time for deep work';
    if (hour < 18) return 'Good Afternoon, stay focused';
    return 'Good Evening, wrap up your day';
  };

  const seconds = currentTime.getSeconds();
  const progress = (seconds / 60) * 100;
  const circumference = 377;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl border overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, var(--wm-surface-strong) 0%, var(--wm-surface) 100%)',
        borderColor: 'var(--wm-border)',
        boxShadow: 'var(--wm-shadow)'
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

      <motion.div
        className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="flex flex-col items-center md:items-start z-10 mb-6 md:mb-0 text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-1">
          {getGreeting()}
        </h3>
        <p className="wm-text-secondary text-sm flex items-center gap-2">
          <Clock size={14} className="text-indigo-400" />
          {format(currentTime, 'EEEE, MMMM dd, yyyy')}
        </p>
      </div>

      <div className="relative flex items-center justify-center z-10">
        <svg className="absolute w-36 h-36 -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="rgba(148,163,184,0.15)"
            strokeWidth="3"
          />
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>

        <div
          className="flex flex-col items-center justify-center w-28 h-28 rounded-full backdrop-blur-md relative"
          style={{
            backgroundColor: 'var(--wm-surface-soft)',
            border: '1px solid var(--wm-border)',
            boxShadow: 'inset 0 0 20px rgba(99,102,241,0.12)'
          }}
        >
          <div className="flex items-baseline drop-shadow-[0_0_15px_rgba(167,139,250,0.35)]">
            <span className="wm-text-primary text-4xl font-black tracking-tighter">{format(currentTime, 'HH')}</span>
            <motion.span
              className="text-2xl text-indigo-400 mx-0.5 mb-2"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
              :
            </motion.span>
            <span className="wm-text-primary text-4xl font-black tracking-tighter">{format(currentTime, 'mm')}</span>
          </div>
          <span className="text-[9px] text-indigo-400/80 font-semibold tracking-[0.2em] uppercase mt-1">
            {format(currentTime, 'ss')} SEC
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClockWidget;
