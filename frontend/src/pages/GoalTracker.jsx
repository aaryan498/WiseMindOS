import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import DonutChart from '../components/DonutChart';
import GoalCard from '../components/GoalCard';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import TaskItem from '../components/TaskItem';
import ProjectCard from '../components/ProjectCard';

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
  const [newGoal, setNewGoal] = useState({ title: '', type: 'mid-term', description: '' });

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    addGoal(newGoal);
    setNewGoal({ title: '', type: 'mid-term', description: '' });
    setShowAddGoal(false);
  };

  const handleGoalClick = (goal) => {
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

    return (
      <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            data-testid="back-to-goals-btn"
          >
            <ArrowLeft size={20} />
            Back to Goals
          </button>

          <Card className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{selectedGoal.title}</h1>
                <span className="text-sm px-3 py-1 rounded-full capitalize bg-indigo-500/20 text-indigo-400">
                  {selectedGoal.type}
                </span>
              </div>
              <div>
                <DonutChart value={progress} size={100} color="#6366f1" />
              </div>
            </div>
            {selectedGoal.description && (
              <p className="text-gray-400 mt-4">{selectedGoal.description}</p>
            )}
          </Card>

          {goalProjects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goalProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    progress={calculateProjectProgress(project.id)}
                    onClick={() => navigate(`/trackers/projects/${project.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {goalTasks.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold text-white mb-4">Tasks</h2>
              <div className="space-y-3">
                {goalTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompletion}
                  />
                ))}
              </div>
            </Card>
          )}

          {goalProjects.length === 0 && goalTasks.length === 0 && (
            <Card>
              <p className="text-gray-400 text-center py-8">
                No projects or tasks linked to this goal yet.
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Goal Tracker</h1>
            <p className="text-gray-400">Track your final, long-term, and mid-term goals</p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            data-testid="add-goal-btn"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Overall Progress */}
        {goals.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Overall Goals Progress</h2>
            <div className="flex justify-center">
              <DonutChart value={overallProgress} size={160} color="#6366f1" label="All Goals" />
            </div>
          </Card>
        )}

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                progress={calculateGoalProgress(goal.id)}
                onClick={() => handleGoalClick(goal)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-16">
              <Target size={64} className="mx-auto text-gray-600 mb-4" />
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
        <div className="space-y-4">
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
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <GradientButton onClick={handleAddGoal} className="w-full" data-testid="submit-goal-btn">
            Create Goal
          </GradientButton>
        </div>
      </Modal>
    </div>
  );
};

export default GoalTracker;