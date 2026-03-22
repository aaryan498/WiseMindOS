import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import TaskItem from '../components/TaskItem';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import Modal from '../components/Modal';

const SoloTaskTracker = () => {
  const {
    tasks,
    goals,
    projects,
    addTask,
    toggleTaskCompletion,
    deleteTask
  } = useApp();

  const [showAddTask, setShowAddTask] = useState(false);
  const [filterGoal, setFilterGoal] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    goalId: '',
    projectId: '',
    isImportant: false
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({ ...newTask, createdFrom: 'solo' });
    setNewTask({ title: '', deadline: '', goalId: '', projectId: '', isImportant: false });
    setShowAddTask(false);
  };

  // Filter tasks
  let filteredTasks = tasks.filter(task => !task.projectId || task.createdFrom === 'solo');
  
  if (filterGoal) {
    filteredTasks = filteredTasks.filter(task => task.goalId === filterGoal);
  }
  
  if (filterProject) {
    filteredTasks = filteredTasks.filter(task => task.projectId === filterProject);
  }

  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Solo Task Tracker</h1>
            <p className="text-gray-400">Track individual tasks and to-dos</p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            data-testid="add-task-btn"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Filter by Goal</label>
              <select
                value={filterGoal}
                onChange={(e) => setFilterGoal(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="filter-goal-select"
              >
                <option value="">All Goals</option>
                {goals.map(goal => (
                  <option key={goal.id} value={goal.id}>{goal.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Filter by Project</label>
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="filter-project-select"
              >
                <option value="">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>
          </div>
          {(filterGoal || filterProject) && (
            <button
              onClick={() => {
                setFilterGoal('');
                setFilterProject('');
              }}
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
              data-testid="clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </Card>

        {/* Pending Tasks */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Pending Tasks ({pendingTasks.length})</h2>
          {pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No pending tasks. Great job! 🎉</p>
          )}
        </Card>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Completed Tasks ({completedTasks.length})</h2>
            <div className="space-y-3">
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </Card>
        )}

        {filteredTasks.length === 0 && (
          <Card>
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">No tasks yet. Start by adding your first task!</p>
              <GradientButton onClick={() => setShowAddTask(true)} data-testid="add-first-task-btn">
                Add Your First Task
              </GradientButton>
            </div>
          </Card>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="Create New Task">
        <div className="space-y-4">
          <InputField
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
            required
            data-testid="task-title-input"
          />

          <InputField
            label="Deadline (Optional)"
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            data-testid="task-deadline-input"
          />

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Link to Goal (Optional)</label>
            <select
              value={newTask.goalId}
              onChange={(e) => setNewTask({ ...newTask, goalId: e.target.value })}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="task-goal-select"
            >
              <option value="">No goal</option>
              {goals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Link to Project (Optional)</label>
            <select
              value={newTask.projectId}
              onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="task-project-select"
            >
              <option value="">No project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="important"
              checked={newTask.isImportant}
              onChange={(e) => setNewTask({ ...newTask, isImportant: e.target.checked })}
              className="w-5 h-5 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-orange-500"
              data-testid="task-important-checkbox"
            />
            <label htmlFor="important" className="text-gray-300">Mark as Important</label>
          </div>

          <GradientButton onClick={handleAddTask} className="w-full" data-testid="submit-task-btn">
            Create Task
          </GradientButton>
        </div>
      </Modal>
    </div>
  );
};

export default SoloTaskTracker;