import { useState } from 'react';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import ToggleSwitch from '../components/ToggleSwitch';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import { mockHabits, mockTasks, mockProjects, mockDailyLog } from '../data/mockData';

const Tracker = () => {
  const [dailyLog, setDailyLog] = useState(mockDailyLog);
  const [habits, setHabits] = useState(mockHabits);
  const [tasks, setTasks] = useState(mockTasks);
  const [projects, setProjects] = useState(mockProjects);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' });
  const [newHabit, setNewHabit] = useState('');

  const handleHabitToggle = (id) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const handleTaskStatusToggle = (id) => {
    setTasks(tasks.map(t => 
      t.id === id 
        ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } 
        : t
    ));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      status: 'pending',
      priority: newTask.priority
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', priority: 'medium' });
    setShowAddTask(false);
  };

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit,
      completed: false,
      streak: 0
    };
    setHabits([...habits, habit]);
    setNewHabit('');
    setShowAddHabit(false);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleDeleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const priorityColors = {
    high: 'text-red-400 border-red-400',
    medium: 'text-yellow-400 border-yellow-400',
    low: 'text-green-400 border-green-400'
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Daily Tracker</h1>

        {/* Daily Logs Input */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Today's Logs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Study Hours"
              type="number"
              value={dailyLog.studyHours}
              onChange={(e) => setDailyLog({ ...dailyLog, studyHours: e.target.value })}
              placeholder="0"
              data-testid="study-hours-input"
            />
            <InputField
              label="Sleep Hours"
              type="number"
              value={dailyLog.sleepHours}
              onChange={(e) => setDailyLog({ ...dailyLog, sleepHours: e.target.value })}
              placeholder="0"
              data-testid="sleep-hours-input"
            />
            <InputField
              label="Tasks Completed"
              type="number"
              value={dailyLog.tasksCompleted}
              onChange={(e) => setDailyLog({ ...dailyLog, tasksCompleted: e.target.value })}
              placeholder="0"
              data-testid="tasks-completed-input"
            />
          </div>
          <GradientButton className="mt-4 w-full sm:w-auto" data-testid="save-daily-log-btn">
            Save Daily Log
          </GradientButton>
        </Card>

        {/* Habit Tracker */}
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Habit Tracker (21 Days)</h2>
            <button
              onClick={() => setShowAddHabit(true)}
              data-testid="add-habit-btn"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="space-y-3">
            {habits.map((habit) => (
              <div 
                key={habit.id} 
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  habit.completed 
                    ? 'bg-indigo-900/20 border-indigo-500/50' 
                    : 'bg-gray-700/30 border-gray-600'
                }`}
                data-testid={`habit-${habit.id}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => handleHabitToggle(habit.id)}
                    data-testid={`habit-toggle-${habit.id}`}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      habit.completed 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'border-gray-500'
                    }`}
                  >
                    {habit.completed && <Check size={16} className="text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${habit.completed ? 'text-white' : 'text-gray-300'}`}>
                      {habit.name}
                    </p>
                    <p className="text-sm text-gray-500">🔥 {habit.streak} day streak</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  data-testid={`delete-habit-${habit.id}`}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Task Manager */}
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Task Manager</h2>
            <button
              onClick={() => setShowAddTask(true)}
              data-testid="add-task-btn"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  task.status === 'completed' 
                    ? 'bg-green-900/20 border-green-500/50' 
                    : 'bg-gray-700/30 border-gray-600'
                }`}
                data-testid={`task-${task.id}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => handleTaskStatusToggle(task.id)}
                    data-testid={`task-toggle-${task.id}`}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      task.status === 'completed' 
                        ? 'bg-green-600 border-green-600' 
                        : 'border-gray-500'
                    }`}
                  >
                    {task.status === 'completed' && <Check size={16} className="text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      task.status === 'completed' 
                        ? 'text-gray-400 line-through' 
                        : 'text-white'
                    }`}>
                      {task.title}
                    </p>
                    <span className={`text-xs border px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  data-testid={`delete-task-${task.id}`}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Tracker */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Project Tracker</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-700/30 p-4 rounded-lg" data-testid={`project-${project.id}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  <span className="text-sm text-gray-400">
                    {project.tasksCompleted}/{project.totalTasks} tasks
                  </span>
                </div>
                <ProgressBar progress={project.progress} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="Add New Task">
        <div className="space-y-4">
          <InputField
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
            data-testid="new-task-title-input"
          />
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Priority</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setNewTask({ ...newTask, priority })}
                  data-testid={`priority-${priority}`}
                  className={`flex-1 py-2 rounded-lg capitalize transition-all ${
                    newTask.priority === priority
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
          
          <GradientButton onClick={handleAddTask} className="w-full" data-testid="submit-new-task-btn">
            Add Task
          </GradientButton>
        </div>
      </Modal>

      {/* Add Habit Modal */}
      <Modal isOpen={showAddHabit} onClose={() => setShowAddHabit(false)} title="Add New Habit">
        <div className="space-y-4">
          <InputField
            label="Habit Name"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter habit name"
            data-testid="new-habit-input"
          />
          
          <GradientButton onClick={handleAddHabit} className="w-full" data-testid="submit-new-habit-btn">
            Add Habit
          </GradientButton>
        </div>
      </Modal>
    </div>
  );
};

export default Tracker;