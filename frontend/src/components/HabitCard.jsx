import { Flame, Clock } from 'lucide-react';
import Card from './Card';
import ToggleSwitch from './ToggleSwitch';

const HabitCard = ({ habit, onComplete }) => {
  const isCompleted = new Date(habit.lastCompleted).toDateString() === new Date().toDateString();

  return (
    <Card
      className={`
        wm-card
        cursor-pointer transition-all duration-300
        shadow-[0_0_20px_rgba(0,0,0,0.2)]
        ${isCompleted
          ? 'bg-indigo-500/12 border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.3)]'
          : 'hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]'
        }
      `}
      onClick={() => onComplete && onComplete(habit.id)}
      data-testid={`habit-card-${habit.id}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div
          className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${habit.type === 'build'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
            }
          `}
        >
          {habit.type === 'build' ? 'Build Habit' : 'Break Habit'}
        </div>

        <div className="flex items-center gap-3">
          <ToggleSwitch
            checked={isCompleted}
            onChange={(e) => {
              e.stopPropagation();
              onComplete && onComplete(habit.id);
            }}
          />

          <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-lg">
            <Flame size={14} className="text-orange-400" />
            <span className="text-sm font-bold text-orange-400">
              {habit.streak}
            </span>
          </div>
        </div>
      </div>

      <h3 className="wm-text-primary text-lg md:text-xl font-semibold mb-2 leading-tight">
        {habit.name}
      </h3>

      {habit.startTime && habit.endTime && (
        <div className="wm-text-secondary flex items-center text-sm mb-2">
          <Clock size={14} className="mr-2" />
          <span>{habit.startTime} → {habit.endTime}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="wm-text-muted text-xs">
          {habit.mode === '21-day' ? '21-Day Challenge' : 'Permanent'}
        </span>

        {isCompleted && (
          <span className="text-xs text-indigo-400 font-medium">
            ✓ Completed Today
          </span>
        )}
      </div>
    </Card>
  );
};

export default HabitCard;
