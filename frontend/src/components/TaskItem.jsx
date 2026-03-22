import { Check, Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';

const TaskItem = ({ task, onToggle, onDelete, showGoal = true, showProject = true }) => {
  const isLate = task.deadline && new Date(task.deadline) < new Date() && !task.completed;

  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
        task.completed 
          ? 'bg-green-900/20 border-green-500/50' 
          : isLate
          ? 'bg-red-900/20 border-red-500/50'
          : 'bg-gray-700/30 border-gray-600'
      }`}
      data-testid={`task-item-${task.id}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => onToggle(task.id)}
          data-testid={`task-toggle-${task.id}`}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            task.completed 
              ? 'bg-green-600 border-green-600' 
              : 'border-gray-500 hover:border-gray-400'
          }`}
        >
          {task.completed && <Check size={16} className="text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${
            task.completed 
              ? 'text-gray-400 line-through' 
              : 'text-white'
          }`}>
            {task.title}
          </p>
          
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {task.deadline && (
              <div className="flex items-center text-xs text-gray-400">
                <Calendar size={12} className="mr-1" />
                {format(new Date(task.deadline), 'MMM dd, yyyy')}
              </div>
            )}
            
            {task.isImportant && (
              <div className="flex items-center text-xs text-orange-400">
                <Flag size={12} className="mr-1" />
                Important
              </div>
            )}
            
            {isLate && (
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                Late
              </span>
            )}
          </div>
        </div>
      </div>
      
      {onDelete && (
        <button
          onClick={() => onDelete(task.id)}
          data-testid={`task-delete-${task.id}`}
          className="text-gray-500 hover:text-red-400 transition-colors ml-2"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TaskItem;