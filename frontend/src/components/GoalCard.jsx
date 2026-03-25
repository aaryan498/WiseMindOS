import { Target, Calendar } from 'lucide-react';
import Card from './Card';
import DonutChart from './DonutChart';
import ProgressBar from './ProgressBar';

const GoalCard = ({ goal, progress, onClick }) => {

  const handleGoalClick = (goal) => {
    console.log("Clicked:", goal);
    setSelectedGoal(goal);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'final': return 'from-purple-600 to-pink-600';
      case 'long-term': return 'from-indigo-600 to-blue-600';
      case 'mid-term': return 'from-blue-600 to-cyan-600';
      default: return 'from-indigo-600 to-violet-600';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'final': return 'bg-purple-500/20 text-purple-400';
      case 'long-term': return 'bg-indigo-500/20 text-indigo-400';
      case 'mid-term': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatus = () => {
    if (progress >= 80) return { text: 'On Track', style: 'bg-green-500/20 text-green-400' };
    if (progress >= 50) return { text: 'In Progress', style: 'bg-yellow-500/20 text-yellow-400' };
    return { text: 'Behind', style: 'bg-red-500/20 text-red-400' };
  };

  const status = getStatus();

  return (
    <Card
      className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
      onClick={()=>handleGoalClick(goal)}
      data-testid={`goal-card-${goal.id}`}
    >
      {/* TOP */}
      <div className="flex items-start justify-between mb-3">
        
        {/* Icon */}
        <div className={`p-3 bg-gradient-to-r ${getTypeColor(goal.type)} rounded-xl`}>
          <Target size={22} className="text-white" />
        </div>

        {/* Status Badge */}
        <span className={`text-xs px-3 py-1 rounded-full ${status.style}`}>
          {status.text}
        </span>
      </div>

      {/* TITLE */}
      <h3 className="text-lg md:text-xl font-bold text-white mb-1">
        {goal.title}
      </h3>

      {/* TYPE */}
      <span className={`inline-block text-xs px-3 py-1 rounded-full capitalize mb-3 ${getTypeBadgeColor(goal.type)}`}>
        {goal.type || 'goal'}
      </span>

      {/* DESCRIPTION */}
      {goal.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {goal.description}
        </p>
      )}

      {/* PROGRESS SECTION */}
      <div className="flex flex-col items-center justify-between mb-4">

        {/* Percentage */}
        <div className="text-right mb-2">
          <p className="text-2xl font-bold text-white">{progress}%</p>
          <p className="text-xs text-gray-400">Progress</p>
        </div>
        <ProgressBar showLabel={false} progress={progress} className="mb-3" />
      </div>

      {/* DEADLINE */}
      {goal.deadline && (
        <div className="flex items-center text-gray-400 text-xs border-t border-white/10 pt-3">
          <Calendar size={14} className="mr-2" />
          <span>Due: {goal.deadline}</span>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;