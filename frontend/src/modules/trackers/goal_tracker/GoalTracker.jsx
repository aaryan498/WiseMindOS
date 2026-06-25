import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ListTodo, Plus, ArrowLeft, Target } from 'lucide-react';
import { useApp } from '../../../store/AppContext';
import Card from '../../../components/Card';
import DonutChart from '../../../components/DonutChart';
import GoalCard from '../../../components/GoalCard';
import GradientButton from '../../../components/GradientButton';
import InputField from '../../../components/InputField';
import Modal from '../../../components/Modal';
import TaskItem from '../../../components/TaskItem';
import ProjectCard from '../../../components/ProjectCard';
import EmptyState from '../../../components/EmptyState';
import { motion as Motion } from 'framer-motion';
import { SkeletonBlock, SkeletonCard, TrackerGridSkeleton } from '../../../components/LoadingSkeleton';
import { getGoalDuplicateError } from '../../../utils/helpers';

const GoalTracker = () => {
  const navigate = useNavigate();
  const {
    goals,
    loading,
    addGoal,
    addProject,
    addTask,
    calculateGoalProgress,
    getTasksByGoal,
    getProjectsByGoal,
    getTasksByProject,
    calculateProjectProgress,
    toggleTaskCompletion
  } = useApp();

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddProjectTask, setShowAddProjectTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', deadline: '', projectId: '', isImportant: false });
  const [newProjectTask, setNewProjectTask] = useState({ title: '', deadline: '', isImportant: false });
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', deadline: '', description: '' });
  const [newGoal, setNewGoal] = useState({ title: '', type: 'mid-term', description: '', deadline: '' });
  const [goalError, setGoalError] = useState('');

  const handleAddGoal = (e) => {
    e.preventDefault();
    const trimmedTitle = newGoal.title.trim();
    if (!trimmedTitle) return;

    const duplicateError = getGoalDuplicateError(trimmedTitle, goals);
    if (duplicateError) {
      setGoalError(duplicateError);
      return;
    }

    addGoal({ ...newGoal, title: trimmedTitle });
    setNewGoal({ title: '', type: 'mid-term', description: '', deadline: '' });
    setGoalError('');
    setShowAddGoal(false);
  };

  const handleAddProject = () => {
    if (!newProject.title.trim() || !selectedGoal) return;
    addProject({
      ...newProject,
      goalId: selectedGoal.id,
      createdFrom: 'goal'
    });
    setNewProject({ title: '', deadline: '', description: '' });
    setShowAddProject(false);
  };

  const handleAddProjectTask = () => {
    if (!newProjectTask.title.trim() || !selectedProject) return;
    addTask({
      ...newProjectTask,
      projectId: selectedProject.id,
      goalId: selectedProject.goalId,
      createdFrom: 'project'
    });
    setNewProjectTask({ title: '', deadline: '', isImportant: false });
    setShowAddProjectTask(false);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !selectedGoal) return;
    addTask({
      ...newTask,
      goalId: selectedGoal.id,
      createdFrom: 'goal'
    });
    setNewTask({ title: '', deadline: '', projectId: '', isImportant: false });
    setShowAddTask(false);
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
    setSelectedGoal(goal);
  };

  const handleBackToList = () => {
    setSelectedGoal(null);
  };

  // Calculate overall goals progress
  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, goal) => sum + calculateGoalProgress(goal.id), 0) / goals.length)
    : 0;

  if (selectedProject) {
    const projectTasks = getTasksByProject(selectedProject.id);
    const progress = calculateProjectProgress(selectedProject.id);
    const linkedGoal = goals.find(g => g.id === selectedProject.goalId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
        <Motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <Motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-all hover:-translate-x-1 cursor-pointer"
            data-testid="back-to-projects-btn"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>

          <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600">
                    <Target size={22} className="text-white" />
                  </div>

                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {selectedProject.title}
                    </h1>

                    <p className="text-sm text-emerald-400 mt-1">
                      Progress: {progress}%
                    </p>

                    {linkedGoal && (
                      <span className="text-xs mt-1 inline-block text-indigo-400">
                        Linked to: {linkedGoal.title}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <DonutChart value={progress} size={100} color="#10b981" />
                </div>
              </div>
              {selectedProject.description && (
                <p className="text-gray-400 mt-4">{selectedProject.description}</p>
              )}
            </Card>
          </Motion.div>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Tasks</h2>
              <button
                onClick={() => setShowAddProjectTask(true)}
                data-testid="add-task-btn"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 text-white px-4 py-2 rounded-lg transition-all cursor-pointer"
              >
                <Plus size={20} className="inline mr-2" />
                Add Task
              </button>
            </div>
            {projectTasks.length > 0 ? (
              <div className="space-y-3">
                {projectTasks.map((task, index) => (
                  <Motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <TaskItem
                      task={task}
                      onToggle={toggleTaskCompletion}
                    />
                  </Motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No tasks yet. Add your first task!</p>
            )}
          </Card>
        </div>

        {/* Add Task Modal */}
        <Modal isOpen={showAddProjectTask} onClose={() => setShowAddProjectTask(false)} title="Add Task to Project">
          <div className="space-y-4">
            <InputField
              label="Task Title"
              value={newProjectTask.title}
              onChange={(e) => setNewProjectTask({ ...newProjectTask, title: e.target.value })}
              placeholder="Enter task title"
              data-testid="task-title-input"
            />
            <InputField
              label="Deadline (Optional)"
              type="date"
              value={newProjectTask.deadline}
              onChange={(e) => setNewProjectTask({ ...newProjectTask, deadline: e.target.value })}
              data-testid="task-deadline-input"
            />
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <label htmlFor="important" className="text-gray-300 text-sm">
                Mark as Important
              </label>

              <input
                type="checkbox"
                id="important"
                checked={newProjectTask.isImportant}
                onChange={(e) => setNewProjectTask({ ...newProjectTask, isImportant: e.target.checked })}
                className="w-5 h-5 accent-orange-500"
                data-testid="task-important-checkbox"
              />
            </div>
            <GradientButton onClick={handleAddProjectTask} className="w-full" data-testid="submit-task-btn">
              Add Task
            </GradientButton>
          </div>
        </Modal>
      </div>
    );
  }

  if (selectedGoal) {
    const goalTasks = getTasksByGoal(selectedGoal.id);
    const goalProjects = getProjectsByGoal(selectedGoal.id);
    const progress = calculateGoalProgress(selectedGoal.id);

    if(selectedProject) return;

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
        <Motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <Motion.div
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

          <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
          </Motion.div>

          {goalProjects.length > 0 ? (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Projects</h2>
                <button
                  onClick={() => setShowAddProject(true)}
                  data-testid="add-project-btn"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 text-white px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Project
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goalProjects.map((project, index) => (
                  <Motion.div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
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
                  </Motion.div>
                ))}
              </div>
            </div>
          ) : goalTasks.length > 0 && (
            <Card className="bg-white/5 mb-4 backdrop-blur-xl border border-white/10 text-center">
              <h2 className="text-xl font-bold text-white mb-4 text-start">Projects</h2>
              <EmptyState
                icon={FolderKanban}
                title="No projects linked to this goal"
                description="Create a project when this goal needs a larger milestone or workstream."
                actionLabel="Add Project"
                onAction={() => setShowAddProject(true)}
                testId="empty-goal-add-project-btn"
                className="border-0 bg-transparent shadow-none"
              />
            </Card>
          )}

          {goalTasks.length > 0 ? (
            <Card className="bg-white/5 mb-4 backdrop-blur-xl border border-white/10">
              {/* <h2 className="text-xl font-bold text-white">Tasks</h2> */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Tasks</h2>
                <button
                  onClick={() => setShowAddTask(true)}
                  data-testid="add-task-btn"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 text-white px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Task
                </button>
              </div>
              <div className="space-y-3">
                {goalTasks.map((task) => (
                  <Motion.div
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                  >
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTaskCompletion}
                    />
                  </Motion.div>
                ))}
              </div>
            </Card>
          ) : goalProjects.length > 0 && (
            <Card className="bg-white/5 mb-4 backdrop-blur-xl border border-white/10 text-center">
              <h2 className="text-xl font-bold text-white mb-4 text-start">Tasks</h2>
              <EmptyState
                icon={ListTodo}
                title="No direct tasks yet"
                description="Add a focused next action for this goal, or keep tasks inside its projects."
                actionLabel="Add Task"
                onAction={() => setShowAddTask(true)}
                testId="empty-goal-add-task-btn"
                className="border-0 bg-transparent shadow-none"
              />
            </Card>
          )}


          {goalProjects.length === 0 && goalTasks.length === 0 && (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-center">
              <EmptyState
                icon={Target}
                title="No execution steps yet"
                description="Add a project or a direct task to turn this goal into visible progress."
                className="border-0 bg-transparent py-0 shadow-none"
              />
              <div className='flex flex-col gap-3 justify-center sm:flex-row'>
                <button
                  onClick={() => setShowAddProject(true)}
                  data-testid="add-project-btn"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 text-white px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Project
                </button>
                <button
                  onClick={() => setShowAddTask(true)}
                  data-testid="add-task-btn"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 text-white px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Task
                </button>
              </div>
            </Card>
          )}
        </div>
        {/* Add Task Modal */}
        <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="Add Task to Project">
          <div className="space-y-4">
            <InputField
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Enter task title"
              data-testid="task-title-input"
            />
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Link to Project (Optional)</label>
              <select
                value={newTask.projectId}
                onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="task-project-select"
              >
                <option value="">No Project (independent)</option>
                {goalProjects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
            </div>
            <InputField
              label="Deadline (Optional)"
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              data-testid="task-deadline-input"
            />
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
              Add Task
            </GradientButton>
          </div>
        </Modal>
        {/* Add Project Modal */}
        <Modal isOpen={showAddProject} onClose={() => setShowAddProject(false)} title="Create New Project">
          <div className="space-y-4">
            <InputField
              label="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Enter project title"
              required
              data-testid="project-title-input"
            />

            <InputField
              label="Deadline (Optional)"
              type="date"
              value={newProject.deadline}
              onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
              required
              data-testid="project-deadline-input"
            />

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Describe your project..."
                data-testid="project-description-input"
                required
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
              />
            </div>

            <GradientButton onClick={handleAddProject} className="w-full" data-testid="submit-project-btn">
              Create Project
            </GradientButton>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
      <Motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="max-w-6xl mx-auto">
        <Motion.div
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
        </Motion.div>

        {/* Overall Progress */}
        {loading ? (
          <SkeletonCard className="mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 w-full">
                <SkeletonBlock className="h-6 w-44" />
                <SkeletonBlock className="h-4 w-72 max-w-full" />
                <SkeletonBlock className="h-4 w-28" />
              </div>
              <SkeletonBlock className="h-32 w-32 rounded-full" />
              <div className="flex gap-6">
                <SkeletonBlock className="h-12 w-16" />
                <SkeletonBlock className="h-12 w-16" />
                <SkeletonBlock className="h-12 w-16" />
              </div>
            </div>
          </SkeletonCard>
        ) : goals.length > 0 && (
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
        {loading ? (
          <TrackerGridSkeleton count={6} />
        ) : goals.length > 0 ? (
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
          <EmptyState
            icon={Target}
            title="No goals yet"
            description="Create your first goal, then connect projects and tasks to make it actionable."
            actionLabel="Add Your First Goal"
            onAction={() => setShowAddGoal(true)}
            testId="add-first-goal-btn"
          />
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={showAddGoal}
        onClose={() => {
          setShowAddGoal(false);
          setGoalError('');
        }}
        title="Create New Goal"
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <InputField
            label="Goal Title"
            value={newGoal.title}
            onChange={(e) => {
              setNewGoal({ ...newGoal, title: e.target.value });
              if (goalError) setGoalError('');
            }}
            placeholder="Enter goal title"
            required
            data-testid="goal-title-input"
          />
          {goalError && (
            <p className="text-sm text-red-400" role="alert" data-testid="goal-duplicate-error">
              {goalError}
            </p>
          )}

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
