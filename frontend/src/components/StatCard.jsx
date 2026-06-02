import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, className = '', ...props }) => {
  const lowerTitle = title.toLowerCase();
  
  let cardGradient = 'from-indigo-500/10 via-transparent to-violet-500/5';
  let hoverBorder = 'hover:border-indigo-500/40';
  let hoverGlow = 'hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]';
  let iconBg = 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]';
  let barColor = 'bg-indigo-500';
  
  let progressPercent = 0;
  let showProgressBar = false;
  
  if (lowerTitle.includes('productivity')) {
    cardGradient = 'from-indigo-500/12 via-indigo-950/5 to-purple-900/5';
    hoverBorder = 'hover:border-indigo-500/40';
    hoverGlow = 'hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]';
    iconBg = 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]';
    barColor = 'bg-indigo-500';
    
    const parsed = parseInt(value);
    if (!isNaN(parsed)) {
      progressPercent = parsed;
      showProgressBar = true;
    }
  } else if (lowerTitle.includes('discipline')) {
    cardGradient = 'from-emerald-500/12 via-emerald-950/5 to-teal-900/5';
    hoverBorder = 'hover:border-emerald-500/40';
    hoverGlow = 'hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]';
    iconBg = 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]';
    barColor = 'bg-emerald-500';
    
    const parsed = parseInt(value);
    if (!isNaN(parsed)) {
      progressPercent = parsed;
      showProgressBar = true;
    }
  } else if (lowerTitle.includes('goals')) {
    cardGradient = 'from-amber-500/12 via-amber-950/5 to-orange-900/5';
    hoverBorder = 'hover:border-amber-500/40';
    hoverGlow = 'hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]';
    iconBg = 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]';
    barColor = 'bg-amber-500';
    
    showProgressBar = false;
  } else if (lowerTitle.includes('tasks')) {
    cardGradient = 'from-sky-500/12 via-blue-950/5 to-indigo-900/5';
    hoverBorder = 'hover:border-sky-500/40';
    hoverGlow = 'hover:shadow-[0_0_25px_rgba(14,165,233,0.15)]';
    iconBg = 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]';
    barColor = 'bg-sky-500';
    
    const parts = value.split('/');
    if (parts.length === 2) {
      const completed = parseInt(parts[0]);
      const total = parseInt(parts[1]);
      if (!isNaN(completed) && !isNaN(total) && total > 0) {
        progressPercent = Math.round((completed / total) * 100);
        showProgressBar = true;
      }
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-4 shadow-lg transition-colors duration-300 ${hoverBorder} ${hoverGlow} ${className}`}
      {...props}
    >
      {/* Decorative Radial Glass Reflection Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-40 transition-opacity duration-300 group-hover:opacity-60 pointer-events-none`} />

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[90px]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-slate-400 font-semibold tracking-wider text-[10px] md:text-xs uppercase">
              {title}
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
              {value}
            </p>
          </div>
          {icon && (
            <div className={`p-2.5 md:p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${iconBg}`}>
              {icon}
            </div>
          )}
        </div>

        {/* Dynamic bottom metrics indicators */}
        <div className="mt-4 w-full">
          {showProgressBar ? (
            <div className="space-y-1">
              <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full ${barColor} rounded-full`}
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium text-right tracking-wider">
                {progressPercent}% Complete
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 py-0.5">
              <div className={`w-2.5 h-2.5 rounded-full ${barColor} animate-pulse`} />
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                {lowerTitle.includes('goals') ? `${value} active trackers` : 'Active'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;