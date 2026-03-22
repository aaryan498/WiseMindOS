import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import ProjectCard from '../components/ProjectCard';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import TaskItem from '../components/TaskItem';
import DonutChart from '../components/DonutChart';

const ProjectTracker = () => {
  const navigate = useNavigate();
  const {
    projects,
    goals,
    addProject,
    calculateProjectProgress,
    getTasksByProject,
    toggleTaskCompletion,
    addTask
  } = useApp();

  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', goalId: '', deadline: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', deadline: '' });

  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    addProject(newProject);
    setNewProject({ title: '', goalId: '', deadline: '', description: '' });
    setShowAddProject(false);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !selectedProject) return;
    addTask({
      ...newTask,
      projectId: selectedProject.id,
      goalId: selectedProject.goalId,
      createdFrom: 'project'
    });
    setNewTask({ title: '', deadline: '' });
    setShowAddTask(false);
  };

  if (selectedProject) {
    const projectTasks = getTasksByProject(selectedProject.id);
    const progress = calculateProjectProgress(selectedProject.id);
    const linkedGoal = goals.find(g => g.id === selectedProject.goalId);

    return (
      <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            data-testid="back-to-projects-btn"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>

          <Card className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h1>
                {linkedGoal && (
                  <span className="text-sm px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                    Goal: {linkedGoal.title}
                  </span>
                )}
              </div>
              <div>
                <DonutChart value={progress} size={100} color="#10b981" />
              </div>
            </div>
            {selectedProject.description && (
              <p className="text-gray-400 mt-4">{selectedProject.description}</p>
            )}
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Tasks</h2>
              <button
                onClick={() => setShowAddTask(true)}
                data-testid="add-task-btn"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} className="inline mr-2" />
                Add Task
              </button>
            </div>
            {projectTasks.length > 0 ? (
              <div className="space-y-3">
                {projectTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompletion}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No tasks yet. Add your first task!</p>
            )}
          </Card>
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
            <InputField
              label="Deadline (Optional)"
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              data-testid="task-deadline-input"
            />
            <GradientButton onClick={handleAddTask} className="w-full" data-testid="submit-task-btn">
              Add Task
            </GradientButton>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Tracker</h1>
            <p className="text-gray-400">Manage projects linked to your goals</p>
          </div>
          <button
            onClick={() => setShowAddProject(true)}
            data-testid="add-project-btn"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const linkedGoal = goals.find(g => g.id === project.goalId);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  progress={calculateProjectProgress(project.id)}
                  linkedGoal={linkedGoal?.title}
                  onClick={() => setSelectedProject(project)}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">No projects yet. Start by adding your first project!</p>
              <GradientButton onClick={() => setShowAddProject(true)} data-testid="add-first-project-btn">
                Add Your First Project
              </GradientButton>
            </div>
          </Card>
        )}
      </div>

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

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Link to Goal (Optional)</label>
            <select
              value={newProject.goalId}
              onChange={(e) => setNewProject({ ...newProject, goalId: e.target.value })}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              data-testid="project-goal-select"
            >
              <option value="">No goal (independent)</option>
              {goals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
          </div>

          <InputField
            label="Deadline (Optional)"
            type="date"
            value={newProject.deadline}
            onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
            data-testid="project-deadline-input"
          />

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Describe your project..."
              data-testid="project-description-input"
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
};

export default ProjectTracker;