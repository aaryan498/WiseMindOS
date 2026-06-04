import { Check, Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const isLate = task.deadline && new Date(task.deadline) < new Date() && !task.completed;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
        task.completed
          ? 'bg-green-500/15 border-green-400/35'
          : isLate
            ? 'bg-red-500/10 backdrop-blur-2xl border-red-400/35'
            : 'wm-inline-field'
      }`}
      data-testid={`task-item-${task.id}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          data-testid={`task-toggle-${task.id}`}
          aria-label={`${task.completed ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}
          aria-pressed={task.completed}
          className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
            task.completed
              ? 'bg-green-600 border-green-600'
              : 'border-[var(--wm-input-border)] hover:border-indigo-400'
          }`}
        >
          {task.completed && <Check aria-hidden="true" size={16} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`font-medium ${task.completed ? 'wm-text-muted line-through' : 'wm-text-primary'}`}>
            {task.title}
          </p>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {task.deadline && (
              <div className="wm-text-muted flex items-center text-xs">
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
          type="button"
          onClick={() => onDelete(task.id)}
          data-testid={`task-delete-${task.id}`}
          aria-label={`Delete task: ${task.title}`}
          className="text-[var(--wm-text-muted)] hover:text-red-400 transition-colors ml-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
};

export default TaskItem;
