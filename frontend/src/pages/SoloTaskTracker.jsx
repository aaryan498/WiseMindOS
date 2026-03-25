import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import TaskItem from '../components/TaskItem';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold young-serif-regular text-gary-200">Solo Task Tracker</h1>
            <p className="text-gray-400">Track individual tasks and to-dos</p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            data-testid="add-task-btn"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:-translate-y-1 active:scale-95 text-white p-3 rounded-xl transition-all cursor-pointer"
          >
            <Plus size={24} />
          </button>
        </motion.div>

        {/* Filters */}
        <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Filters</h2>
            </div>

            {(filterGoal || filterProject) && (
              <button
                onClick={() => {
                  setFilterGoal('');
                  setFilterProject('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Reset
              </button>
            )}
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
        <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <h2 className="text-xl font-bold text-white mb-4">Pending Tasks ({pendingTasks.length})</h2>
          {pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {pendingTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <TaskItem
                    task={task}
                    onToggle={toggleTaskCompletion}
                    onDelete={deleteTask}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No pending tasks. Great job! 🎉</p>
          )}
        </Card>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 opacity-80">
            <h2 className="text-xl font-bold text-white mb-4">
              Completed Tasks ({completedTasks.length})
            </h2>
            <p className="text-xs text-gray-400 mb-3">Well done! Keep the streak going 🔥</p>
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
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-center">
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📋</div>

              <p className="text-gray-400 text-lg mb-2">
                No tasks yet.
              </p>

              <p className="text-indigo-400 text-sm mb-6">
                Start organizing your day like a pro 🚀
              </p>

              <GradientButton onClick={() => setShowAddTask(true)}>
                Add Your First Task
              </GradientButton>
            </div>
          </Card>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="Create New Task">
        <div className="space-y-5">
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

          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
            <label htmlFor="important" className="text-gray-300 text-sm">
              Mark as Important
            </label>

            <input
              type="checkbox"
              id="important"
              checked={newTask.isImportant}
              onChange={(e) => setNewTask({ ...newTask, isImportant: e.target.checked })}
              className="w-5 h-5 accent-orange-500"
              data-testid="task-important-checkbox"
            />
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