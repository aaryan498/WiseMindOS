import { Flame, Clock } from 'lucide-react';
import Card from './Card';

const HabitCard = ({ habit, onToggle }) => {
  const isCompleted = habit.lastCompleted === new Date().toDateString();

  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isCompleted ? 'bg-indigo-900/20 border-indigo-500/50' : 'hover:scale-105'
      }`}
      onClick={() => onToggle && onToggle(habit.id)}
      data-testid={`habit-card-${habit.id}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`px-3 py-1 rounded-full text-xs ${
          habit.type === 'build' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {habit.type === 'build' ? 'Build' : 'Break'}
        </div>
        <div className="flex items-center gap-1">
          <Flame size={16} className="text-orange-400" />
          <span className="text-sm font-bold text-orange-400">{habit.streak}</span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">{habit.name}</h3>
      
      {habit.startTime && habit.endTime && (
        <div className="flex items-center text-sm text-gray-400">
          <Clock size={14} className="mr-2" />
          <span>{habit.startTime} - {habit.endTime}</span>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        Mode: {habit.mode === '21-day' ? '21-Day Challenge' : 'Permanent'}
      </div>
    </Card>
  );
};

export default HabitCard;