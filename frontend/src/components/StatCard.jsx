const StatCard = ({ title, value, icon, trend, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-xl p-4 shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-3 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;