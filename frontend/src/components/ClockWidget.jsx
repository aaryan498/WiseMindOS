import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Sun, CloudSun, Moon, MoonStar, Compass } from 'lucide-react';
import { motion } from "framer-motion";

const ClockWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return { text: 'Good Morning', icon: <Sun size={20} className="text-amber-400" style={{ animation: 'spin 12s linear infinite' }} /> };
    if (hours < 17) return { text: 'Good Afternoon', icon: <CloudSun size={20} className="text-orange-400" /> };
    if (hours < 21) return { text: 'Good Evening', icon: <MoonStar size={20} className="text-indigo-400" /> };
    return { text: 'Good Night', icon: <Moon size={20} className="text-slate-400" /> };
  };

  const greeting = getGreeting();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white/5 via-slate-900/10 to-white/0 border border-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center min-h-[180px]">
      
      {/* Premium Glass Ambient Glows inside the widget */}
      <motion.div
        className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-15"
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-15"
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Dynamic OS Greeting */}
        <div className="flex items-center gap-2 mb-3 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
          {greeting.icon}
          <span className="text-slate-300 font-semibold text-[10px] tracking-wider uppercase">
            {greeting.text}
          </span>
        </div>

        {/* Digital Time */}
        <div className="flex items-center gap-2 md:gap-3 text-4xl md:text-5xl font-extrabold text-white tracking-wider">
          <TimeBlock value={format(currentTime, 'HH')} />
          <BlinkColon />
          <TimeBlock value={format(currentTime, 'mm')} />
          <BlinkColon />
          <TimeBlock value={format(currentTime, 'ss')} />
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 mt-4 text-xs md:text-sm text-indigo-300 font-semibold tracking-widest uppercase">
          <Compass size={14} className="text-indigo-400" style={{ animation: 'spin 16s linear infinite' }} />
          <span>{format(currentTime, 'EEEE, MMMM dd, yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

const TimeBlock = ({ value }) => {
  return (
    <motion.div
      key={value}
      initial={{ y: -6, opacity: 0.8 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="
        px-3.5 py-2.5 rounded-2xl
        bg-slate-950/65 backdrop-blur-md
        border border-white/10
        shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_0_15px_rgba(99,102,241,0.15)]
        font-mono text-white select-none
      "
    >
      {value}
    </motion.div>
  );
};

const BlinkColon = () => {
  return (
    <motion.span
      className="text-indigo-400 text-3xl md:text-4xl select-none"
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      :
    </motion.span>
  );
};

export default ClockWidget;