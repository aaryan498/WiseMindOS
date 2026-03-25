import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, ChevronRight, Target } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import DonutChart from '../components/DonutChart';
import GoalCard from '../components/GoalCard';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import TaskItem from '../components/TaskItem';
import ProjectCard from '../components/ProjectCard';
import { motion } from 'framer-motion';

const GoalTracker = () => {
  const navigate = useNavigate();
  const {
    goals,
    projects,
    addGoal,
    updateGoal,
    deleteGoal,
    calculateGoalProgress,
    getTasksByGoal,
    getProjectsByGoal,
    calculateProjectProgress,
    toggleTaskCompletion
  } = useApp();

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', type: 'mid-term', description: '', deadline: '' });

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    addGoal(newGoal);
    setNewGoal({ title: '', type: 'mid-term', description: '', deadline: '' });
    setShowAddGoal(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'final': return 'from-purple-600 to-pink-600';
      case 'long-term': return 'from-indigo-600 to-blue-600';
      case 'mid-term': return 'from-blue-600 to-cyan-600';
      default: return 'from-indigo-600 to-violet-600';
    }
  };

  const handleGoalClick = (goal) => {
    console.log("Clicked:", goal);
    setSelectedGoal(goal);
  };

  const handleBackToList = () => {
    setSelectedGoal(null);
  };

  // Calculate overall goals progress
  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, goal) => sum + calculateGoalProgress(goal.id), 0) / goals.length)
    : 0;

  if (selectedGoal) {
    const goalTasks = getTasksByGoal(selectedGoal.id);
    const goalProjects = getProjectsByGoal(selectedGoal.id);
    const progress = calculateGoalProgress(selectedGoal.id);

    console.log(selectedGoal)

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-all hover:-translate-x-1 cursor-pointer"
            data-testid="back-to-goals-btn"
          >
            <ArrowLeft size={20} />
            Back to Goals
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:shadow-[0_0_50px_rgba(99,102,241,0.3)] transition-all">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* LEFT SECTION */}
                <div className="flex flex-col gap-3 w-full">

                  {/* Top Row: Icon + Title + Badge */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex gap-3 items-center">
                      <div className={`p-3 h-12 w-12 flex items-center justify-center bg-gradient-to-r ${getTypeColor(selectedGoal.type)} rounded-xl`}>
                        <Target size={20} className="text-white" />
                      </div>

                      <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                          {selectedGoal.title}
                        </h1>

                        <p className="text-sm text-indigo-400">
                          {progress}% completed
                        </p>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <span className="text-xs md:text-sm px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 whitespace-nowrap">
                      {selectedGoal.type}
                    </span>

                  </div>

                </div>

                {/* RIGHT SECTION → Donut */}
                <div className="flex justify-center md:justify-end">
                  <DonutChart value={progress} size={100} color="#6366f1" />
                </div>

              </div>

              {/* DESCRIPTION */}
              {selectedGoal.description && (
                <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                  {selectedGoal.description}
                </p>
              )}

            </Card>
          </motion.div>

          {goalProjects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goalProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard
                      key={project.id}
                      project={project}
                      progress={calculateProjectProgress(project.id)}
                      onClick={() => navigate(`/trackers/projects/${project.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {goalTasks.length > 0 && (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Tasks</h2>
              <div className="space-y-3">
                {goalTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                  >
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTaskCompletion}
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {goalProjects.length === 0 && goalTasks.length === 0 && (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-center">
              <p className="text-gray-400 text-center py-8">
                No projects or tasks yet.
                <br />
                <span className="text-indigo-400">Start building your execution system</span>
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl young-serif-regular font-bold text-gray-200">Goal Tracker</h1>
            <p className="text-gray-400">Track your final, long-term, and mid-term goals</p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            data-testid="add-goal-btn"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 text-white p-3 rounded-xl transition-all cursor-pointer"
          >
            <Plus size={24} />
          </button>
        </motion.div>

        {/* Overall Progress */}
        {goals.length > 0 && (
          <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Left */}
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Overall Progress
                </h2>
                <p className="text-gray-400 text-sm">
                  Keep pushing — consistency builds success 🚀
                </p>

                <div className="mt-3 text-sm text-gray-400">
                  Total Goals: <span className="text-white font-semibold">{goals.length}</span>
                </div>
              </div>

              {/* Center Donut */}
              <div>
                <DonutChart value={overallProgress} size={140} color="#6366f1" />
              </div>

              {/* Right Stats */}
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-green-400 text-xl font-bold">
                    {goals.filter(g => calculateGoalProgress(g.id) >= 80).length}
                  </p>
                  <p className="text-xs text-gray-400">On Track</p>
                </div>

                <div>
                  <p className="text-yellow-400 text-xl font-bold">
                    {goals.filter(g => {
                      const p = calculateGoalProgress(g.id);
                      return p >= 50 && p < 80;
                    }).length}
                  </p>
                  <p className="text-xs text-gray-400">In Progress</p>
                </div>

                <div>
                  <p className="text-red-400 text-xl font-bold">
                    {goals.filter(g => calculateGoalProgress(g.id) < 50).length}
                  </p>
                  <p className="text-xs text-gray-400">Behind</p>
                </div>
              </div>

            </div>
          </Card>
        )}

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <div onClick={() => handleGoalClick(goal)}>


                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={calculateGoalProgress(goal.id)}
                  onClick={() => handleGoalClick(goal)}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-center">
            <div className="text-center py-16">
              <Target size={64} className="mx-auto text-indigo-400 mb-4 animate-pulse" />
              <p className="text-gray-400 text-lg mb-4">No goals yet. Start by adding your first goal!</p>
              <GradientButton onClick={() => setShowAddGoal(true)} data-testid="add-first-goal-btn">
                Add Your First Goal
              </GradientButton>
            </div>
          </Card>
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} title="Create New Goal">
        <form onSubmit={handleAddGoal} className="space-y-4">
          <InputField
            label="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Enter goal title"
            required
            data-testid="goal-title-input"
          />

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
            <select
              value={newGoal.type}
              onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="goal-type-select"
            >
              <option value="final">Final Goal</option>
              <option value="long-term">Long-term Goal</option>
              <option value="mid-term">Mid-term Goal</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Describe your goal..."
              data-testid="goal-description-input"
              required
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <InputField
            label="Deadline"
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            data-testid="goal-deadline-input"
            required
          />

          <GradientButton type="submit" className="w-full" data-testid="submit-goal-btn">
            Create Goal
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
};

export default GoalTracker;