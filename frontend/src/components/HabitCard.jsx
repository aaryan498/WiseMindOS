import { Flame, Clock } from 'lucide-react';
import Card from './Card';
import { motion } from 'framer-motion';
import ToggleSwitch from './ToggleSwitch';

const HabitCard = ({ habit, onComplete }) => {
  const isCompleted = habit.lastCompleted === new Date().toDateString();

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: isCompleted ? 1 : 1.03 }}
    >
      <Card
        className={`
          cursor-pointer transition-all duration-300
          bg-white/5 backdrop-blur-xl border border-white/10
          shadow-[0_0_20px_rgba(0,0,0,0.2)]
          ${isCompleted
            ? 'bg-indigo-900/30 border-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.4)]'
            : 'hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]'
          }
        `}
        onClick={() => onComplete && onComplete(habit.id)}
        data-testid={`habit-card-${habit.id}`}
      >
        {/* TOP ROW */}
        <div className="flex justify-between items-start mb-3">

          {/* TYPE BADGE */}
          <div className={`
    px-3 py-1 rounded-full text-xs font-medium
    ${habit.type === 'build'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
            }
  `}>
            {habit.type === 'build' ? 'Build Habit' : 'Break Habit'}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* TOGGLE SWITCH */}
            <ToggleSwitch
              checked={isCompleted}
              onChange={() => onComplete && onComplete(habit.id)}
            />

            {/* STREAK */}
            <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-lg">
              <Flame size={14} className="text-orange-400" />
              <span className="text-sm font-bold text-orange-400">
                {habit.streak}
              </span>
            </div>

          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2 leading-tight">
          {habit.name}
        </h3>

        {/* TIME */}
        {habit.startTime && habit.endTime && (
          <div className="flex items-center text-sm text-gray-400 mb-2">
            <Clock size={14} className="mr-2" />
            <span>{habit.startTime} → {habit.endTime}</span>
          </div>
        )}

        {/* MODE + STATUS */}
        <div className="flex items-center justify-between mt-3">

          {/* MODE */}
          <span className="text-xs text-gray-500">
            {habit.mode === '21-day' ? '21-Day Challenge' : 'Permanent'}
          </span>

          {/* COMPLETION STATUS */}
          {isCompleted && (
            <span className="text-xs text-indigo-400 font-medium">
              ✔ Completed Today
            </span>
          )}
        </div>

      </Card>
    </motion.div>
  );
};

export default HabitCard;