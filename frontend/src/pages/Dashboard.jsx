import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { TrendingUp, Target, CheckCircle, Zap, ArrowRight, UserPlus2, Camera, CalendarDays, Star, AlertTriangle, UserPen, LucideTrophy, Pencil, Activity, Flame, BarChart3 } from 'lucide-react';
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

  const productivityInsights = useMemo(() => {
    const completedDailyTasks = todayPlannedTasks.filter(task => task.completed).length;
    const completedTasks = tasks.filter(task => task.completed || task.status === 'completed').length;
    const completedHabits = habits.filter(habit => habit.completed).length;
    const goalProgressValues = goals.map(goal => {
      const progress = calculateGoalProgress(goal.id);
      return progress || Number(goal.progress) || 0;
    });
    const avgGoalProgress = goalProgressValues.length
      ? Math.round(goalProgressValues.reduce((sum, value) => sum + value, 0) / goalProgressValues.length)
      : 0;
    const habitCompletion = habits.length
      ? Math.round((completedHabits / habits.length) * 100)
      : 0;
    const taskCompletion = tasks.length
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;
    const consistencyDays = weeklyData.filter(day => {
      const dailyScore = Math.round(((day.productivity || 0) + (day.discipline || 0)) / 2);
      return dailyScore >= 70;
    }).length;
    const consistencyScore = weeklyData.length
      ? Math.round((consistencyDays / weeklyData.length) * 100)
      : productivityScore;
    const firstHalf = weeklyData.slice(0, Math.ceil(weeklyData.length / 2));
    const secondHalf = weeklyData.slice(Math.ceil(weeklyData.length / 2));
    const avg = (items, key) => items.length
      ? items.reduce((sum, item) => sum + (item[key] || 0), 0) / items.length
      : 0;
    const trendDelta = weeklyData.length > 1
      ? Math.round(avg(secondHalf, 'productivity') - avg(firstHalf, 'productivity'))
      : 0;
    const heatmap = weeklyData.length
      ? weeklyData.map(day => ({
          name: day.name,
          value: Math.round(((day.productivity || 0) + (day.discipline || 0)) / 2)
        }))
      : [
          { name: 'Today', value: productivityScore },
        ];

    return {
      completedDailyTasks,
      avgGoalProgress,
      habitCompletion,
      taskCompletion,
      consistencyScore,
      trendDelta,
      heatmap,
    };
  }, [todayPlannedTasks, tasks, habits, goals, weeklyData, productivityScore, calculateGoalProgress]);

  const insightCards = [
    {
      title: 'Weekly Consistency',
      value: `${productivityInsights.consistencyScore}%`,
      detail: `${productivityInsights.heatmap.filter(day => day.value >= 70).length}/${productivityInsights.heatmap.length} strong days`,
      icon: <Flame size={22} />,
      accent: 'from-amber-500/25 to-orange-500/10',
      text: 'text-amber-300',
    },
    {
      title: 'Habit Completion',
      value: `${productivityInsights.habitCompletion}%`,
      detail: `${habits.filter(habit => habit.completed).length}/${habits.length || 0} habits done`,
      icon: <Activity size={22} />,
      accent: 'from-emerald-500/25 to-teal-500/10',
      text: 'text-emerald-300',
    },
    {
      title: 'Goal Progress',
      value: `${productivityInsights.avgGoalProgress}%`,
      detail: `${goals.length} active goals tracked`,
      icon: <Target size={22} />,
      accent: 'from-sky-500/25 to-cyan-500/10',
      text: 'text-sky-300',
    },
    {
      title: 'Task Completion',
      value: `${productivityInsights.taskCompletion}%`,
      detail: `${productivityInsights.completedDailyTasks}/${todayPlannedTasks.length || 0} planned today`,
      icon: <BarChart3 size={22} />,
      accent: 'from-fuchsia-500/25 to-rose-500/10',
      text: 'text-fuchsia-300',
    },
  ];

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
        {/* Top Dashboard Grid: Profile Card & Clock/Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
          {/* Profile Card */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 h-full"
          >
            <Card className="h-full relative overflow-hidden bg-gradient-to-b from-white/10 to-slate-900/40 backdrop-blur-2xl border border-white/15 shadow-2xl p-6 flex flex-col justify-between">
              
              {/* Premium Glass Sheen Overlay */}
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pointer-events-none" />

              <div>
                <div className="w-full mb-6 flex flex-col items-center relative z-10">
                  {/* Edit profile button */}
                  <div className='w-full flex items-end justify-end mb-2'>
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className='bg-white/5 hover:bg-white/10 cursor-pointer border border-white/10 hover:border-white/20 hover:scale-105 p-2.5 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 animate-none'
                    >
                      <UserPen size={18} />
                    </button>
                  </div>

                  {/* Avatar wrapper with double border and pulse status dot */}
                  <div className='h-28 w-28 rounded-full relative group border border-indigo-500/20 p-1.5 shadow-[0_0_25px_rgba(99,102,241,0.25)] shrink-0 transition-transform duration-300 hover:scale-102'>
                    <div className="w-full h-full rounded-full overflow-hidden border border-white/10 relative">
                      <img src={user.profile_picture || profile_pic} className='w-full h-full object-cover' alt="Profile Avatar" />
                      <div
                        onClick={() => setShowEditProfilePic(true)}
                        className='w-full h-full bg-black/60 absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10'
                      >
                        <Camera size={18} className='text-white' />
                      </div>
                    </div>
                    {/* Status Dot with pulse ping */}
                    <div className='absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900 z-10'>
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                    </div>
                  </div>

                  {/* Profile info */}
                  <div className='flex flex-col items-center mt-4 text-center'>
                    <span className='text-2xl md:text-3xl default-bold text-white tracking-tight leading-tight'>{user.name || 'User'}</span>
                    <span className='text-xs text-indigo-400 font-semibold tracking-wider mt-1'>@{user.username || 'username'}</span>
                  </div>
                </div>

                {/* Bio text block */}
                <div className='text-slate-300 text-xs md:text-sm leading-relaxed text-center italic bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 mb-6 relative z-10'>
                  {user.bio || 'Add Bio to express yourself...'}
                </div>
              </div>

              {/* Bottom section: metrics & connect button */}
              <div className="relative z-10 mt-auto space-y-5">
                {/* Visual Progress Widgets */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-indigo-400">{productivityScore}%</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Productivity</p>
                    <div className="w-full bg-slate-950/60 rounded-full h-1 mt-2 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${productivityScore}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-emerald-400">{disciplineScore}%</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Discipline</p>
                    <div className="w-full bg-slate-950/60 rounded-full h-1 mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${disciplineScore}%` }} />
                    </div>
                  </div>
                </div>

                <Motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <GradientButton className="w-full flex items-center justify-center gap-2 py-3 shadow-[0_4px_20px_rgba(99,102,241,0.35)] relative overflow-hidden group">
                    <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    <UserPlus2 size={18} />
                    <span className="font-semibold tracking-wide">Connect</span>
                  </GradientButton>
                </Motion.div>
              </div>

            </Card>
          </Motion.div>

          {/* Clock Widget & Stat Cards Column */}
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col justify-between gap-6"
          >
            {/* Clock Widget */}
            <ClockWidget />

            {/* Stats Grid */}
            {loading ? (
              <DashboardStatsSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
                <StatCard
                  title="Productivity"
                  value={`${productivityScore}%`}
                  icon={<Zap size={20} />}
                  data-testid="productivity-score-card"
                />
                <StatCard
                  title="Discipline"
                  value={`${disciplineScore}%`}
                  icon={<TrendingUp size={20} />}
                  data-testid="discipline-score-card"
                />
                <StatCard
                  title="Active Goals"
                  value={goals.length.toString()}
                  icon={<Target size={20} />}
                  data-testid="active-goals-card"
                />
                <StatCard
                  title="Tasks Today"
                  value={`${dailyPlan?.plannedTasks.filter(t => t.completed).length}/${dailyPlan?.plannedTasks.length}`}
                  icon={<CheckCircle size={20} />}
                  data-testid="tasks-today-card"
                />
              </div>
            )}
          </Motion.div>
        </div>

        {/* Productivity Insights */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Productivity Insights</h2>
              <p className="text-sm text-gray-400">Live signals from your goals, habits, tasks, and weekly rhythm</p>
            </div>
            <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5 ${productivityInsights.trendDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">
                {productivityInsights.trendDelta >= 0 ? '+' : ''}{productivityInsights.trendDelta}% trend
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            {insightCards.map((insight, index) => (
              <Motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-4 border border-white/10 bg-gradient-to-br ${insight.accent} backdrop-blur-xl shadow-[0_0_28px_rgba(99,102,241,0.12)]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-400">{insight.title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{insight.value}</p>
                  </div>
                  <div className={`p-2 rounded-xl bg-white/10 ${insight.text}`}>
                    {insight.icon}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">{insight.detail}</p>
              </Motion.div>
            ))}
          </div>

          <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Weekly completion heatmap</h3>
                <p className="text-sm text-gray-400">
                  Daily blend of productivity and discipline scores.
                </p>
              </div>
              <div className="grid grid-cols-7 gap-2 w-full lg:w-auto">
                {productivityInsights.heatmap.map(day => (
                  <div key={day.name} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-full min-w-9 h-12 rounded-xl border flex items-end overflow-hidden ${
                        day.value >= 80
                          ? 'border-emerald-400/40 bg-emerald-400/15'
                          : day.value >= 60
                            ? 'border-amber-400/40 bg-amber-400/15'
                            : 'border-rose-400/40 bg-rose-400/15'
                      }`}
                      title={`${day.name}: ${day.value}%`}
                    >
                      <div
                        className={`w-full ${
                          day.value >= 80
                            ? 'bg-emerald-400'
                            : day.value >= 60
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                        }`}
                        style={{ height: `${Math.max(12, day.value)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-400">{day.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
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
