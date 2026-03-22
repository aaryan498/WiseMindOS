import { Target } from 'lucide-react';
import Card from './Card';
import DonutChart from './DonutChart';

const GoalCard = ({ goal, progress, onClick }) => {
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

  return (
    <Card 
      className="hover:scale-105 transition-transform duration-300 cursor-pointer" 
      onClick={onClick}
      data-testid={`goal-card-${goal.id}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 bg-gradient-to-r ${getTypeColor(goal.type)} rounded-xl`}>
          <Target size={24} className="text-white" />
        </div>
        <span className={`text-xs px-3 py-1 rounded-full capitalize ${getTypeBadgeColor(goal.type)}`}>
          {goal.type || 'goal'}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-4">{goal.title}</h3>
      
      <div className="flex justify-center">
        <DonutChart value={progress} size={100} strokeWidth={8} color="#6366f1" />
      </div>
    </Card>
  );
};

export default GoalCard;