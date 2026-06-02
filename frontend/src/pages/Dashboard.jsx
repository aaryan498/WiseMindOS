import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { TrendingUp, Target, CheckCircle, Zap, ArrowRight, UserPlus2, Camera, CalendarDays, Star, AlertTriangle, UserPen, LucideTrophy, Pencil } from 'lucide-react';
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
import { motion as Motion } from 'framer-motion'
import { useMemo } from 'react';
import profile_pic from '../assets/profile_pic.svg'
import { useState, useEffect } from 'react';
import { statsAPI } from '../api/apiService';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { AnalyticsSkeleton, DashboardStatsSkeleton, SkeletonCard, SkeletonBlock, TrackerGridSkeleton } from '../components/LoadingSkeleton';


const Dashboard = () => {

  const [weeklyData, setWeeklyData] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditProfilePic, setShowEditProfilePic] = useState(false);

  const {
    goals,
    user,
    loading,
    projects,
    tasks,
    habits,
    dailyPlan,
    updateUser,
    updateUserProfilePic,
    calculateGoalProgress,
    calculateProjectProgress,
    toggleDailyPlanTaskCompletion,
    getImportantTasks,
    getBehindTasks,
    toggleTaskCompletion,
    calculateProductivityScore,
    calculateDisciplineScore
  } = useApp();

  const [newProfile, setNewProfile] = useState({ name: user.name, username: user.username, bio: user.bio });
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setWeeklyLoading(true);
      try {
        const res = await statsAPI.getWeekly();

        if (res.success) {
          const formatted = res.data.map(item => ({
            name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
            productivity: item.productivity,
            discipline: item.discipline
          }));

          setWeeklyData(formatted);
        }

      } catch (error) {
        console.log("Failed to fetch stats:", error);
      } finally {
        setWeeklyLoading(false);
      }
    };

    fetchStats();
    console.log("Weekly Data:", weeklyData);
  }, []);

  const avgProductivity =
    weeklyData.length > 0
      ? Math.round(weeklyData.reduce((sum, d) => sum + d.productivity, 0) / weeklyData.length)
      : 0;

  const avgDiscipline =
    weeklyData.length > 0
      ? Math.round(weeklyData.reduce((sum, d) => sum + d.discipline, 0) / weeklyData.length)
      : 0;

  const productivityScore = useMemo(() => calculateProductivityScore(), [tasks, habits, goals]);
  const disciplineScore = useMemo(() => calculateDisciplineScore(), [tasks, habits]);

  // Get today's planned tasks from dailyPlan
  const todayPlannedTasks = dailyPlan?.plannedTasks || [];
  const pendingPlannedTasks = todayPlannedTasks.filter(t => !t.completed);
  const hasPlannedTasks = todayPlannedTasks.length > 0;

  const importantTasks = getImportantTasks();
  const behindTasks = getBehindTasks();

  const topGoals = goals.slice(0, 4);
  const topProjects = projects.slice(0, 4);
  const topHabits = habits.slice(0, 3);

  const handleEditProfile = async (e) => {
    e.preventDefault();

    // Prepare only changed fields
    const updates = {};

    if (newProfile.name !== "" && newProfile.name !== user.name) {
      updates.name = newProfile.name;
    }

    if (newProfile.username !== "" && newProfile.username !== user.username) {
      updates.username = newProfile.username;
    }

    if (newProfile.bio !== user.bio) {
      updates.bio = newProfile.bio;
    }

    // If nothing changed → don't call API
    if (Object.keys(updates).length === 0) {
      setShowEditProfile(false);
      return;
    }

    // Call context API
    const success = await updateUser(updates);

    if (success) {
      // Reset form with updated values
      setNewProfile({
        name: updates.name ?? user.name,
        username: updates.username ?? user.username,
        bio: updates.bio ?? user.bio
      });

      setShowEditProfile(false);
    }
  };


  const handleEditProfilePic = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    let hasChanges = false;

    // 🔥 IMAGE FIELD (IMPORTANT)
    if (newProfilePic) {
      formData.append("profile", newProfilePic);
      hasChanges = true;
    }

    // If nothing changed
    if (!hasChanges) {
      setShowEditProfile(false);
      return;
    }

    // Call API
    const success = await updateUserProfilePic(formData);

    if (success) {
      // Reset form with updated values
      setNewProfilePic(null);
      setShowEditProfilePic(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-3 sm:px-4 pt-4 sm:pt-6 relative overflow-hidden">
      <Motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-6 w-full  relative overflow-hidden bg-white/15 backdrop-blur-xl border-20 border-black/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]">

            <div className="rounded w-full mb-6 flex flex-col items-center">
              <div className='w-full flex items-end justify-end'>
                <button onClick={() => setShowEditProfile(true)} className='bg-white/10 hover:bg-white/15 cursor-pointer border flex gap-2 border-white/15 hover:border-white/25 hover:translate-y-0.5 px-3 py-3 rounded-full text-white default-bold shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300'> <UserPen size={20} /></button>
              </div>
              {/* Image div  */}
              <div className='h-30 w-30 rounded-full relative group border-6 border-black/15 shadow-[0_0_40px_rgba(99,102,241,0.2)] shrink-0'>
                <img src={user.profile_picture || profile_pic} className='w-full h-full object-cover rounded-full' alt="" />
                <div onClick={()=>setShowEditProfilePic(true)} className='w-full h-full bg-black/50 absolute rounded-full inset-0 cursor-pointer opacity-0 z-10 group-hover:opacity-100'>
                  <div className='h-full w-full flex items-center justify-center'>
                    <Camera size={18} className='text-white' />
                  </div>
                </div>
                <div className='border-6 h-5 w-5 rounded-full z-10 bottom-1 absolute right-1 border-green-400'></div>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-3xl md:text-4xl text-center default-bold text-gray-100'>{user.name || 'User'}</span>
                <span className='cursor-pointer text-sm text-gray-300'>@{user.username || 'username'}</span>
              </div>
            </div>

            <div className='text-gray-400 mb-6'>{user.bio || 'Add Bio'}</div>

            <div className='flex flex-wrap justify-around gap-4 mb-4'>
              <div className="text-center">
                <p className="text-lg font-bold text-indigo-400">{productivityScore}%</p>
                <p className="text-xs text-gray-400">Productivity</p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{disciplineScore}%</p>
                <p className="text-xs text-gray-400">Discipline</p>
              </div>
            </div>

            <GradientButton className="w-full h-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <UserPlus2 size={20} />
              <span>Connect</span>
            </GradientButton>

          </Card>

        </Motion.div>


        <div className='rounded-2xl p-6 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]'>

          {/* Clock Widget & Focus Room */}
          <div className="mb-6">
            <ClockWidget />
          </div>

          {/* Stats Grid */}
          {loading ? (
            <DashboardStatsSkeleton />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

              <StatCard
                title="Productivity"
                value={`${productivityScore}%`}
                icon={<Zap size={24} />}
                // trend={{positive: false, value: 20}}
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
                value={`${dailyPlan?.plannedTasks.filter(t => t.completed).length}/${dailyPlan?.plannedTasks.length}`}
                icon={<CheckCircle size={24} />}
                data-testid="tasks-today-card"
              />
            </div>
          )}
        </div>


        {/* Weekly Analytics */}
        <h2 className="text-xl font-bold text-white mb-4">Weekly Analytics</h2>
        {weeklyLoading ? (
          <AnalyticsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-transparent border cursor-pointer border-white/10 hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Productivity Score</h3>
            <div className="flex justify-center">
              <DonutChart value={avgProductivity} size={140} color="#7C3AED" label="This Week" />
            </div>
          </Card>

          <Card className="bg-transparent border cursor-pointer border-white/10 hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Discipline Score</h3>
            <div className="flex justify-center">
              <DonutChart value={avgDiscipline} size={140} color="#10B981" label="This Week" />
            </div>
          </Card>

          <Card className="bg-transparent border cursor-pointer border-white/10 hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              {/* <LineChart data={weeklyData}>
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
              </LineChart> */}
              <BarChart data={weeklyData} margin={{ top: 20, right: 0, left: -10, bottom: 0 }} barGap={8} >
                <defs>
                  {/* Purple Glow (Productivity) */}
                  <filter id="purpleGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Green Glow (Discipline) */}
                  <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#374151" /> */}

                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                // axisLine={false}
                // tickLine={false}
                />

                <YAxis
                  // stroke="#9ca3af"
                  // style={{ fontSize: '12px' }}
                  hide
                />

                {/* <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  // fontSize: '12px'
                }}
              /> */}

                {/* <Legend /> */}

                {/* Productivity Bar */}
                {/* <Bar
                dataKey="productivity"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              /> */}

                {/* Discipline Bar */}
                {/* <Bar
                dataKey="discipline"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              /> */}

                <Bar
                  dataKey="productivity"
                  fill="#6366f1"
                  radius={[10, 10, 10, 10]}
                  barSize={8}
                  filter="url(#purpleGlow)"
                >
                  <LabelList dataKey="productivity" position="top" fill="#6366f1" style={{ fontSize: '8px' }} />
                </Bar>

                <Bar
                  dataKey="discipline"
                  fill="#10b981"
                  radius={[10, 10, 10, 10]}
                  barSize={8}
                  filter="url(#greenGlow)"
                >
                  <LabelList dataKey="discipline" position="top" fill="#10b981" style={{ fontSize: '8px' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          </div>
        )}


        {(importantTasks.length > 0 || behindTasks.length > 0) && (
          <div className='border-orange-500/30 bg-orange-500/5 backdrop-blur-lg rounded-2xl p-6 shadow-lg items-stretch mb-4'>
            <div className='flex gap-2 flex-col lg:flex-row'>
              {/* Important Tasks */}
              {importantTasks.length > 0 && (
                <div className="bg-transparent flex-1 p-4">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {/* <span className="text-orange-400">⭐</span> */}
                    <Star className="text-orange-400 " size={18} />
                    Important Tasks
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">High Priority Tasks, Complete these first.</p>
                  <div className="space-y-3">
                    {importantTasks.slice(0, 4).map(task => (
                      <Motion.div key={task.id} whileHover={{ scale: 1.005 }}>
                        <TaskItem
                          task={task}
                          onToggle={toggleTaskCompletion}
                        />
                      </Motion.div>
                    ))}
                  </div>
                </div>
              )}

              {importantTasks.length > 0 && behindTasks.length > 0 && (
                <div className="self-stretch border-2 border-red-500/50 rounded-full opacity-0 lg:opacity-100"></div>)}

              {/* Behind Tasks */}
              {behindTasks.length > 0 && (
                <div className="bg-transparent flex-1 p-4">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <AlertTriangle className="text-red-400" size={18} /> Deadline Expired
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">Act fast on these tasks, You are already running late.</p>
                  <div className="space-y-3">
                    {behindTasks.slice(0, 4).map(task => (
                      <Motion.div key={task.id} whileHover={{ scale: 1.005 }}>
                        <TaskItem
                          task={task}
                          onToggle={toggleTaskCompletion}
                        />
                      </Motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          <div className='flex flex-col sm:flex-row gap-2 w-full mt-4 pt-4'>
              <Link to="/focus-room" className='flex-1'>
                <GradientButton className="w-full h-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]" data-testid="focus-room-cta">
                  <span>Enter Focus Room</span>
                  <ArrowRight size={20} />
                </GradientButton>
              </Link>
              <Link to="/trackers/daily-tasks" className='flex-1'>
                <GradientButton className='w-full h-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]' data-testid="plan-now-btn">
                  <span>Add To Today's Plan</span> <ArrowRight size={20} />
                </GradientButton>
              </Link>
            </div>
          </div>)}

        {/* Today's Tasks */}
        {loading ? (
          <SkeletonCard className="mb-6">
            <div className="flex justify-between items-center mb-5">
              <SkeletonBlock className="h-6 w-48" />
              <SkeletonBlock className="h-4 w-16" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-16 w-full" />
              ))}
            </div>
          </SkeletonCard>
        ) : hasPlannedTasks && pendingPlannedTasks.length > 0 ? (
          <Card className="mb-6 bg-white/5 border border-white/10 backdrop-blur-lg shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Today's Planned Tasks</h2>
              <Link to="/trackers/daily-tasks" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {pendingPlannedTasks.slice(0, 5).map((item, index) => (
                <Motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-indigo-500/50 transition-all"
                  data-testid={`planned-task-${item.id}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Time */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-indigo-400 font-semibold">{item.startTime}</p>
                      <p className="text-xs text-gray-500">{item.endTime}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${item.source === 'task'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : item.source === 'habit'
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                              }`}>
                              {item.source === 'task' ? 'Task' : item.source === 'habit' ? 'Habit' : 'Manual'}
                            </span>
                            {item.isImportant && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                Important
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Completion Toggle */}
                        <button
                          onClick={() => toggleDailyPlanTaskCompletion(item.id)}
                          className={`p-2 rounded-lg transition-all ${item.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
                            }`}
                          data-testid={`toggle-planned-task-${item.id}`}
                        >
                          <CheckCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Motion.div>
              ))}
            <div className='flex flex-col sm:flex-row gap-2 w-full h-full justify-between mt-4'>
                <Link to="/focus-room">
                  <GradientButton className="w-full h-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]" data-testid="focus-room-cta">
                    <span>Enter Focus Room</span>
                    <ArrowRight size={20} />
                  </GradientButton>
                </Link>
                <Link to="/trackers/daily-tasks">
                  <GradientButton className='flex items-center' data-testid="plan-now-btn">
                    Plan Ahead
                  </GradientButton>
                </Link>
              </div>
            </div>
          </Card>
        ) : hasPlannedTasks && pendingPlannedTasks.length == 0 ? (
          <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <div className="text-center py-8">
              <LucideTrophy size={48} className="text-indigo-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
              <h3 className="text-xl font-bold text-white mb-2">"Hooray !!"</h3>
              <h3 className="text-xl font-bold text-white mb-2">All tasks for today is completed.</h3>
              <p className="text-gray-400 mb-4">
                Plan Ahead, Keep pushing yourself...
              </p>
              <Link to="/trackers/daily-tasks">
                <GradientButton data-testid="plan-now-btn">
                  Plan Ahead
                </GradientButton>
              </Link>
            </div>
          </Card>
        ) : !hasPlannedTasks && (
          <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <div className="text-center py-8">
              <CalendarDays size={48} className="text-indigo-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
              <h3 className="text-xl font-bold text-white mb-2">Plan Your Day to Stay Productive</h3>
              <p className="text-gray-400 mb-4">
                Create a structured daily plan to maximize your productivity
              </p>
              <Link to="/trackers/daily-tasks">
                <GradientButton data-testid="plan-now-btn">
                  Plan Now
                </GradientButton>
              </Link>
            </div>
          </Card>
        )}


        {/* Goals Progress */}
        {loading ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-4 w-16" />
            </div>
            <TrackerGridSkeleton count={4} />
          </div>
        ) : goals.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Goals Progress</h2>
              <Link to="/trackers/goals" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All <ArrowRight size={16} className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topGoals.map((goal, index) => (
                <Motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    progress={calculateGoalProgress(goal.id)}
                    onClick={() => { }}
                  />
                </Motion.div>
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
              {topProjects.map((project, index) => {
                const linkedGoal = goals.find(g => g.id === project.goalId);
                return (
                  <Motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard
                      key={project.id}
                      project={project}
                      progress={calculateProjectProgress(project.id)}
                      linkedGoal={linkedGoal?.title}
                      onClick={() => { }}
                    />
                  </Motion.div>
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
              {topHabits.map((habit, index) => (
                <Motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate('/trackers/habits')}
                >
                  <HabitCard key={habit.id} habit={habit} />
                </Motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FutureTwin CTA */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Doubt on Self ? Ask Your Twin...</h2>
            <p className="text-gray-300 mb-4">Use FutureTwin to predict outcomes and optimize your decisions.</p>
            <Link to="/future-twin">
              <GradientButton data-testid="future-twin-cta">
                Question your FutureTwin
              </GradientButton>
            </Link>
          </div>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile Info">
        <form onSubmit={handleEditProfile} className="space-y-4">
          <InputField
            label="Name (Full Name)"
            value={newProfile.name}
            onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
            placeholder="Enter Full Name"
            required
            data-testid="profile-name-input"
          />
          <InputField
            label="Username"
            value={newProfile.username}
            onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })}
            placeholder="Username"
            required
            data-testid="profile-username-input"
          />

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
            <textarea
              value={newProfile.bio}
              onChange={(e) => setNewProfile({ ...newProfile, bio: e.target.value })}
              placeholder="Say something intresting about you..."
              data-testid="profile-bio-input"
              required
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <GradientButton type="submit" className="w-full" data-testid="submit-new-profile-btn">
            Save Changes
          </GradientButton>
        </form>
      </Modal>

      <Modal isOpen={showEditProfilePic} onClose={() => setShowEditProfilePic(false)} title="Change Profile Picture">
        <form onSubmit={handleEditProfilePic} className="space-y-4">
          {/* Profile Picture */}
          <div className='flex flex-col gap-3 items-center'>
            <label htmlFor="profile_picture" className='block text-gray-300 text-sm font-medium mb-2'>
              Click to upload
              <input hidden type="file" accept='image/*' id='profile_picture' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => setNewProfilePic(e.target.files[0])} />

              <div className='group/profile relative'>
                <img src={newProfilePic ? URL.createObjectURL(newProfilePic) : user.profile_picture || profile_pic} alt="" className='w-24 h-24 rounded-full object-cover mt-2' />
                <div className='absolute hidden cursor-pointer group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                  <Pencil className='w-5 h-5 text-white' />
                </div>
              </div>
            </label>
          </div>

          <GradientButton type="submit" className="w-full" data-testid="submit-new-profile-picture-btn">
            Upload
          </GradientButton>
        </form>
      </Modal>

    </div>
  );
};

export default Dashboard;
