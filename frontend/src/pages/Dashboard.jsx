import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ClockWidget from '../components/ClockWidget';
import DonutChart from '../components/DonutChart';
import GoalCard from '../components/GoalCard';
import ProjectCard from '../components/ProjectCard';
import TaskItem from '../components/TaskItem';
import HabitCard from '../components/HabitCard';
import GradientButton from '../components/GradientButton';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('wisemind_user') || '{}');
  const {
    goals,
    projects,
    tasks,
    habits,
    scores,
    calculateGoalProgress,
    calculateProjectProgress,
    getImportantTasks,
    getBehindTasks,
    toggleTaskCompletion,
    getProjectsByGoal,
    calculateProductivityScore,
    calculateDisciplineScore
  } = useApp();

  const productivityScore = calculateProductivityScore();
  const disciplineScore = calculateDisciplineScore();

  // Weekly mock data for charts
  const weeklyData = [
    { name: 'Mon', productivity: productivityScore - 10, discipline: disciplineScore - 5 },
    { name: 'Tue', productivity: productivityScore - 5, discipline: disciplineScore - 3 },
    { name: 'Wed', productivity: productivityScore - 8, discipline: disciplineScore },
    { name: 'Thu', productivity: productivityScore + 2, discipline: disciplineScore + 5 },
    { name: 'Fri', productivity: productivityScore, discipline: disciplineScore + 2 },
    { name: 'Sat', productivity: productivityScore + 5, discipline: disciplineScore + 8 },
    { name: 'Sun', productivity: productivityScore + 3, discipline: disciplineScore + 3 },
  ];

  const todayTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = task.createdAt ? new Date(task.createdAt).toDateString() : today;
    return taskDate === today && !task.completed;
  });

  const importantTasks = getImportantTasks();
  const behindTasks = getBehindTasks();

  const topGoals = goals.slice(0, 4);
  const topProjects = projects.slice(0, 4);
  const topHabits = habits.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border border-indigo-500/20" data-testid="welcome-card">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, {user.name || 'User'}! 👋
          </h1>
          <p className="text-gray-300">Here's your progress overview for today</p>
        </Card>

        {/* Clock Widget & Focus Room */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <ClockWidget />
          </div>
          <Link to="/focus-room">
            <GradientButton className="w-full h-full flex items-center justify-center gap-2" data-testid="focus-room-cta">
              <span>Enter Focus Room</span>
              <ArrowRight size={20} />
            </GradientButton>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Productivity"
            value={`${productivityScore}%`}
            icon={<Zap size={24} />}
            data-testid="productivity-score-card"
          />
          <StatCard
            title="Discipline"
            value={`${disciplineScore}%`}
            icon={<TrendingUp size={24} />}
            data-testid="discipline-score-card"
          />
          <StatCard
            title="Active Goals"
            value={goals.length.toString()}
            icon={<Target size={24} />}
            data-testid="active-goals-card"
          />
          <StatCard
            title="Tasks Today"
            value={`${tasks.filter(t => t.completed).length}/${tasks.length}`}
            icon={<CheckCircle size={24} />}
            data-testid="tasks-today-card"
          />
        </div>

        {/* Weekly Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Productivity Score</h3>
            <div className="flex justify-center">
              <DonutChart value={productivityScore} size={140} color="#6366f1" label="This Week" />
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Discipline Score</h3>
            <div className="flex justify-center">
              <DonutChart value={disciplineScore} size={140} color="#10b981" label="This Week" />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
                <Line type="monotone" dataKey="productivity" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="discipline" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Goals Progress */}
        {goals.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Goals Progress</h2>
              <Link to="/trackers/goals" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All <ArrowRight size={16} className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={calculateGoalProgress(goal.id)}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Projects Progress */}
        {projects.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Projects Progress</h2>
              <Link to="/trackers/projects" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All <ArrowRight size={16} className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topProjects.map(project => {
                const linkedGoal = goals.find(g => g.id === project.goalId);
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    progress={calculateProjectProgress(project.id)}
                    linkedGoal={linkedGoal?.title}
                    onClick={() => {}}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Habits */}
        {habits.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Habits</h2>
              <Link to="/trackers/habits" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All <ArrowRight size={16} className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topHabits.map(habit => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          </div>
        )}

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Today's Task Checklist</h2>
              <Link to="/trackers/daily-tasks" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {todayTasks.slice(0, 5).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Important Tasks */}
        {importantTasks.length > 0 && (
          <Card className="mb-6 border-orange-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-400">⭐</span> Important Tasks
            </h2>
            <div className="space-y-3">
              {importantTasks.slice(0, 5).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Behind Tasks */}
        {behindTasks.length > 0 && (
          <Card className="mb-6 border-red-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">⚠️</span> Behind Schedule
            </h2>
            <div className="space-y-3">
              {behindTasks.slice(0, 5).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                />
              ))}
            </div>
          </Card>
        )}

        {/* FutureTwin CTA */}
        <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/30">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Simulate Your Future 🔮</h2>
            <p className="text-gray-300 mb-4">Use AI to predict outcomes and optimize your decisions</p>
            <Link to="/future-twin">
              <GradientButton data-testid="future-twin-cta">
                Try FutureTwin
              </GradientButton>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;