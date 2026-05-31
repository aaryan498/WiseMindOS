import React, { useMemo } from 'react';
import { Check, Calendar, Flag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const TaskItem = ({ task, onToggle, onDelete, showGoal = true, showProject = true }) => {
  // Memoize date comparisons to optimize performance during rendering list cycles
  const isLate = useMemo(() => {
    if (!task.deadline || task.completed) return false;
    return new Date(task.deadline) < new Date();
  }, [task.deadline, task.completed]);

  // Unified styles configuration mapping for explicit visual state detection
  const cardStyle = useMemo(() => {
    if (task.completed) {
      return 'bg-emerald-950/10 border-emerald-500/30 shadow-sm shadow-emerald-500/5';
    }
    if (isLate) {
      return 'bg-rose-950/10 backdrop-blur-md border-rose-500/40 shadow-sm shadow-rose-500/5';
    }
    return 'bg-slate-900/40 backdrop-blur-md border-slate-800 hover:border-slate-700';
  }, [task.completed, isLate]);

  return (
    <div 
      className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${cardStyle}`}
      data-testid={`task-item-${task.id}`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Toggle Complete Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          data-testid={`task-toggle-${task.id}`}
          aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
          className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            task.completed 
              ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/20' 
              : isLate
              ? 'border-rose-400/60 hover:bg-rose-500/10'
              : 'border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/5'
          }`}
        >
          {task.completed && <Check size={13} strokeWidth={3} className="text-white" />}
        </button>
        
        {/* Core Content Layout Area */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium tracking-wide transition-all duration-300 break-words ${
            task.completed 
              ? 'text-slate-500 line-through decoration-slate-600 font-normal' 
              : 'text-slate-100'
          }`}>
            {task.title}
          </p>
          
          {/* Metadata Badges Layout Line */}
          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
            {task.deadline && (
              <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800/60 border border-white/5 ${
                isLate ? 'text-rose-400' : 'text-slate-400'
              }`}>
                <Calendar size={12} className="mr-1.5 shrink-0" />
                <span>{format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
              </div>
            )}
            
            {task.isImportant && (
              <div className="flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Flag size={12} className="mr-1.5 shrink-0 fill-amber-500/10" />
                <span>Important</span>
              </div>
            )}
            
            {isLate && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md">
                Late
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Interactive Contextual Delete Option */}
      {onDelete && (
        <button
          onClick={() => onDelete(task.id)}
          data-testid={`task-delete-${task.id}`}
          aria-label="Delete task item"
          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-200 ml-3 outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
};

export default TaskItem;