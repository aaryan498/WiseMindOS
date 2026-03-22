import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';

const Onboarding = () => {
  const navigate = useNavigate();
  const { addGoal, addProject, addTask } = useApp();
  const [step, setStep] = useState(1);
  const [goals, setGoals] = useState([]);
  const [currentGoal, setCurrentGoal] = useState({ title: '', type: 'mid-term' });
  const [executionMap, setExecutionMap] = useState({}); // goalId -> { projects: [], tasks: [] }
  const [currentExecution, setCurrentExecution] = useState({ type: 'task', title: '', deadline: '' });

  const predefinedGoals = [
    'Improve Productivity',
    'Build Better Habits',
    'Achieve Fitness Goals',
    'Learn New Skills',
    'Career Growth',
    'Mental Wellness',
    'Financial Freedom',
    'Better Sleep Schedule'
  ];

  // Step 1: Add Goals
  const handleAddGoal = () => {
    if (!currentGoal.title.trim()) return;
    const newGoal = {
      id: `temp-${Date.now()}`,
      title: currentGoal.title,
      type: currentGoal.type
    };
    setGoals([...goals, newGoal]);
    setCurrentGoal({ title: '', type: 'mid-term' });
  };

  const handleAddPredefinedGoal = (goalTitle) => {
    const newGoal = {
      id: `temp-${Date.now()}`,
      title: goalTitle,
      type: 'mid-term'
    };
    setGoals([...goals, newGoal]);
  };

  const handleRemoveGoal = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));
    const newMap = { ...executionMap };
    delete newMap[goalId];
    setExecutionMap(newMap);
  };

  const handleStep1Next = () => {
    if (goals.length === 0) {
      alert('Please add at least one goal to continue');
      return;
    }
    setStep(2);
  };

  // Step 2: Map Goals to Execution
  const [selectedGoalForMapping, setSelectedGoalForMapping] = useState(null);

  const handleAddExecution = () => {
    if (!currentExecution.title.trim() || !selectedGoalForMapping) return;

    const goalMap = executionMap[selectedGoalForMapping] || { projects: [], tasks: [] };
    
    if (currentExecution.type === 'project') {
      goalMap.projects.push({
        id: `temp-${Date.now()}`,
        title: currentExecution.title,
        deadline: currentExecution.deadline
      });
    } else {
      goalMap.tasks.push({
        id: `temp-${Date.now()}`,
        title: currentExecution.title,
        deadline: currentExecution.deadline
      });
    }

    setExecutionMap({ ...executionMap, [selectedGoalForMapping]: goalMap });
    setCurrentExecution({ type: 'task', title: '', deadline: '' });
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  // Step 3: Initialize System
  const handleFinishOnboarding = () => {
    // Create all goals
    const goalIdMap = {};
    goals.forEach(goal => {
      const createdGoal = addGoal(goal);
      goalIdMap[goal.id] = createdGoal.id;
    });

    // Create all projects and tasks
    Object.keys(executionMap).forEach(tempGoalId => {
      const realGoalId = goalIdMap[tempGoalId];
      const { projects, tasks } = executionMap[tempGoalId];

      // Create projects
      projects.forEach(project => {
        const createdProject = addProject({
          ...project,
          goalId: realGoalId
        });

        // If project has no tasks, you might want to add a default task
      });

      // Create tasks
      tasks.forEach(task => {
        addTask({
          ...task,
          goalId: realGoalId,
          createdFrom: 'onboarding'
        });
      });
    });

    // Set onboarding flag
    localStorage.setItem('wisemind_hasOnboarded', 'true');
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Wise<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Mind</span>OS
          </h1>
          <p className="text-gray-400">Let's set up your Life Operating System</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-12 h-2 rounded-full transition-all ${
                  s === step ? 'bg-indigo-500' : s < step ? 'bg-indigo-700' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        <Card>
          {step === 1 && (
            <div data-testid="onboarding-step-1">
              <h2 className="text-2xl font-bold text-white mb-2">Step 1: Set Your Goals</h2>
              <p className="text-gray-400 mb-6">Add one or more goals and categorize them</p>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Goal Title"
                    value={currentGoal.title}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, title: e.target.value })}
                    placeholder="Enter goal title"
                    data-testid="goal-title-input"
                  />
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                    <select
                      value={currentGoal.type}
                      onChange={(e) => setCurrentGoal({ ...currentGoal, type: e.target.value })}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      data-testid="goal-type-select"
                    >
                      <option value="final">Final Goal</option>
                      <option value="long-term">Long-term Goal</option>
                      <option value="mid-term">Mid-term Goal</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddGoal}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  data-testid="add-goal-btn"
                >
                  + Add Goal
                </button>
              </div>

              {goals.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Your Goals ({goals.length})</h3>
                  <div className="space-y-2">
                    {goals.map(goal => (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                        data-testid={`goal-item-${goal.id}`}
                      >
                        <div>
                          <p className="text-white font-medium">{goal.title}</p>
                          <span className="text-xs text-gray-400 capitalize">{goal.type}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveGoal(goal.id)}
                          className="text-red-400 hover:text-red-300"
                          data-testid={`remove-goal-${goal.id}`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Or choose from suggestions:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {predefinedGoals.map(goal => (
                    <button
                      key={goal}
                      onClick={() => handleAddPredefinedGoal(goal)}
                      className="p-3 text-sm bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-left"
                      data-testid={`predefined-goal-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <GradientButton onClick={handleStep1Next} className="w-full" data-testid="step-1-next-btn">
                Next: Map to Execution
              </GradientButton>
            </div>
          )}

          {step === 2 && (
            <div data-testid="onboarding-step-2">
              <h2 className="text-2xl font-bold text-white mb-2">Step 2: Map to Execution</h2>
              <p className="text-gray-400 mb-6">Define projects or tasks for each goal</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Select Goal</label>
                  <select
                    value={selectedGoalForMapping || ''}
                    onChange={(e) => setSelectedGoalForMapping(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-testid="select-goal-mapping"
                  >
                    <option value="">Choose a goal...</option>
                    {goals.map(goal => (
                      <option key={goal.id} value={goal.id}>{goal.title}</option>
                    ))}
                  </select>
                </div>

                {selectedGoalForMapping && (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentExecution({ ...currentExecution, type: 'project' })}
                        className={`flex-1 py-2 rounded-lg transition-all ${
                          currentExecution.type === 'project'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                        data-testid="execution-type-project"
                      >
                        Project
                      </button>
                      <button
                        onClick={() => setCurrentExecution({ ...currentExecution, type: 'task' })}
                        className={`flex-1 py-2 rounded-lg transition-all ${
                          currentExecution.type === 'task'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                        data-testid="execution-type-task"
                      >
                        Solo Task
                      </button>
                    </div>

                    <InputField
                      label={currentExecution.type === 'project' ? 'Project Title' : 'Task Title'}
                      value={currentExecution.title}
                      onChange={(e) => setCurrentExecution({ ...currentExecution, title: e.target.value })}
                      placeholder={`Enter ${currentExecution.type} title`}
                      data-testid="execution-title-input"
                    />

                    <InputField
                      label="Deadline (Optional)"
                      type="date"
                      value={currentExecution.deadline}
                      onChange={(e) => setCurrentExecution({ ...currentExecution, deadline: e.target.value })}
                      data-testid="execution-deadline-input"
                    />

                    <button
                      onClick={handleAddExecution}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      data-testid="add-execution-btn"
                    >
                      + Add {currentExecution.type === 'project' ? 'Project' : 'Task'}
                    </button>
                  </>
                )}
              </div>

              {Object.keys(executionMap).length > 0 && (
                <div className="mb-6 max-h-64 overflow-y-auto">
                  <h3 className="text-white font-semibold mb-3">Mapped Execution</h3>
                  {goals.map(goal => {
                    const map = executionMap[goal.id];
                    if (!map || (map.projects.length === 0 && map.tasks.length === 0)) return null;
                    
                    return (
                      <div key={goal.id} className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-indigo-400 font-semibold mb-2">{goal.title}</p>
                        {map.projects.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Projects:</p>
                            {map.projects.map(p => (
                              <p key={p.id} className="text-sm text-gray-300 ml-3">• {p.title}</p>
                            ))}
                          </div>
                        )}
                        {map.tasks.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Tasks:</p>
                            {map.tasks.map(t => (
                              <p key={t.id} className="text-sm text-gray-300 ml-3">• {t.title}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  data-testid="step-2-back-btn"
                >
                  Back
                </button>
                <GradientButton onClick={handleStep2Next} className="flex-1" data-testid="step-2-next-btn">
                  Next: Initialize
                </GradientButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div data-testid="onboarding-step-3">
              <h2 className="text-2xl font-bold text-white mb-2">Step 3: System Ready! 🎉</h2>
              <p className="text-gray-400 mb-6">Your WiseMindOS is being initialized...</p>

              <div className="bg-gray-700/30 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-indigo-400">{goals.length}</p>
                    <p className="text-sm text-gray-400">Goals</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-400">
                      {Object.values(executionMap).reduce((sum, map) => sum + map.projects.length, 0)}
                    </p>
                    <p className="text-sm text-gray-400">Projects</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-400">
                      {Object.values(executionMap).reduce((sum, map) => sum + map.tasks.length, 0)}
                    </p>
                    <p className="text-sm text-gray-400">Tasks</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <p className="text-white">Goal Tracker populated</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <p className="text-white">Project Tracker initialized</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                  <p className="text-white">Solo Task Tracker ready</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                You can add more goals, projects, tasks, and habits anytime from the Trackers section.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  data-testid="step-3-back-btn"
                >
                  Back
                </button>
                <GradientButton onClick={handleFinishOnboarding} className="flex-1" data-testid="finish-onboarding-btn">
                  Enter Dashboard
                </GradientButton>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;