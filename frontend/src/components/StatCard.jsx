const StatCard = ({ title, value, icon, trend, className = '' }) => {
  return (
    <div
      className={`group relative rounded-2xl p-5 md:p-6 hover:-translate-y-1.5 transform-gpu transition-all duration-300 ease-out overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--wm-surface-strong) 0%, var(--wm-surface) 100%)',
        border: '1px solid var(--wm-border)',
        boxShadow: 'var(--wm-shadow-soft)'
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute -inset-x-20 -top-20 h-32 bg-white/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:translate-y-4 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <p className="wm-text-secondary text-xs md:text-sm font-semibold tracking-wider uppercase">{title}</p>
          <p className="wm-text-primary text-2xl md:text-3xl font-black mt-1">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:text-indigo-300 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all duration-300">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className={`mt-4 text-xs font-medium flex items-center gap-1 relative z-10 ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
        </div>
      )}
    </div>
  );
};

export default StatCard;
