const StatCard = ({ title, value, icon, trend, className = '' }) => {
  return (
    <div className={`group relative bg-[#0f1015]/80 border border-white/5 hover:border-indigo-500/50 backdrop-blur-3xl rounded-2xl p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] hover:-translate-y-1.5 transform-gpu transition-all duration-300 ease-out overflow-hidden ${className}`}>
      
      {/* Liquid Glass Overlay Hover Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute -inset-x-20 -top-20 h-32 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:translate-y-4 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <p className="text-gray-400 text-xs md:text-sm font-semibold tracking-wider uppercase">{title}</p>
          <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mt-1">{value}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:text-indigo-300 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all duration-300">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className={`mt-4 text-xs font-medium flex items-center gap-1 ${trend.positive ? 'text-emerald-400' : 'text-rose-400'} relative z-10`}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
        </div>
      )}
    </div>
  );
};

export default StatCard;