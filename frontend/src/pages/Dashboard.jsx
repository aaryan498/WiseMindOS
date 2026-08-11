import { motion as Motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowRight, BarChart3, CalendarDays, Camera, CheckCircle, Download, Flame, LucideTrophy, Pencil, Search, Star, Target, Timer, TrendingUp, UserPen, UserPlus2, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { statsAPI } from '../api/apiService';
import profile_pic from '../assets/profile_pic.svg';
import Card from '../components/Card';
import ClockWidget from '../components/ClockWidget';
import DonutChart from '../components/DonutChart';
import GoalCard from '../components/GoalCard';
import GradientButton from '../components/GradientButton';
import HabitCard from '../components/HabitCard';
import InputField from '../components/InputField';
import { exportWorkspaceData } from '../utils/exportData';
import { AnalyticsSkeleton, DashboardStatsSkeleton, SkeletonBlock, SkeletonCard, TrackerGridSkeleton } from '../components/LoadingSkeleton';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';
import TaskItem from '../components/TaskItem';
import { useApp } from '../store/AppContext';

const formatWeeklyAnalyticsDate = (value) => new Date(value).toISOString().split('T')[0];

const escapeCsvValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const downloadWeeklyAnalyticsCsv = (weeklyData) => {
  const csvRows = [
    ['Date', 'Day', 'Productivity Score', 'Discipline Score'],
    ...weeklyData.map((entry) => [
      entry.date,
      entry.name,
      entry.productivity,
      entry.discipline
    ])
  ];

  const csvContent = csvRows
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n');

  const fileLabel = weeklyData.length
    ? `${weeklyData[0].date}-to-${weeklyData[weeklyData.length - 1].date}`
    : formatWeeklyAnalyticsDate(new Date());
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = downloadUrl;
  anchor.download = `weekly-analytics-${fileLabel}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
};

const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return !isNaN(d.getTime()) && d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
};

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
    notebooks,
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

  const [newProfile, setNewProfile] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || ''
  });
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [taskSearch, setTaskSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setWeeklyLoading(true);
      try {
        const res = await statsAPI.getWeekly();

        if (res.success) {
          const formatted = res.data.map(item => ({
            date: formatWeeklyAnalyticsDate(item.date),
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

  const userLevel = useMemo(
    () => Math.max(1, (goals?.length || 0) + (habits?.length || 0) + Math.floor((productivityScore + disciplineScore) / 20)),
    [goals?.length, habits?.length, productivityScore, disciplineScore]
  );

  // Get today's planned tasks from dailyPlan
  const todayPlannedTasks = dailyPlan?.plannedTasks || [];
  const hasPlannedTasks = todayPlannedTasks.length > 0;

  const importantTasks = getImportantTasks() || [];
  const behindTasks = getBehindTasks() || [];

  const filteredImportantTasks = useMemo(() => {
    return importantTasks.filter(t => t.title?.toLowerCase().includes(taskSearch.toLowerCase()));
  }, [importantTasks, taskSearch]);

  const filteredBehindTasks = useMemo(() => {
    return behindTasks.filter(t => t.title?.toLowerCase().includes(taskSearch.toLowerCase()));
  }, [behindTasks, taskSearch]);

  const filteredTodayPlannedTasks = useMemo(() => {
    return todayPlannedTasks.filter(t => t.title?.toLowerCase().includes(taskSearch.toLowerCase()));
  }, [todayPlannedTasks, taskSearch]);

  const pendingPlannedTasks = useMemo(() => {
    return filteredTodayPlannedTasks.filter(t => !t.completed);
  }, [filteredTodayPlannedTasks]);

  const hasAnyTasks = useMemo(() => {
    return importantTasks.length > 0 || behindTasks.length > 0 || todayPlannedTasks.length > 0;
  }, [importantTasks, behindTasks, todayPlannedTasks]);

  const topGoals = (goals || []).slice(0, 4);
  const topProjects = (projects || []).slice(0, 4);
  const topHabits = (habits || []).slice(0, 3);

  const productivityInsights = useMemo(() => {
    const completedDailyTasks = (todayPlannedTasks || []).filter(task => task.completed).length;
    const completedTasks = (tasks || []).filter(task => task.completed || task.status === 'completed').length;
    const completedHabits = (habits || []).filter(habit => habit.lastCompleted && isToday(habit.lastCompleted)).length;
    const goalProgressValues = (goals || []).map(goal => {
      const progress = calculateGoalProgress(goal.id);
      return progress || Number(goal.progress) || 0;
    });
    const avgGoalProgress = goalProgressValues.length
      ? Math.round(goalProgressValues.reduce((sum, value) => sum + value, 0) / goalProgressValues.length)
      : 0;
    const habitCompletion = (habits || []).length
      ? Math.round((completedHabits / habits.length) * 100)
      : 0;
    const taskCompletion = (tasks || []).length
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
      detail: `${habits.filter(habit => habit.lastCompleted && isToday(habit.lastCompleted)).length}/${habits.length || 0} habits done`,
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

  const handleWeeklyAnalyticsExport = () => {
    if (!weeklyData.length) {
      return;
    }

    downloadWeeklyAnalyticsCsv(weeklyData);
  };

  const handleExportData = () => {
    exportWorkspaceData({ goals, tasks, projects, habits, dailyPlan, notebooks, user });
  };
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
          <Card
            className="mb-6 w-full relative overflow-hidden bg-white/15 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.2)] p-4 sm:p-6"
            data-testid="dashboard-profile-card"
          >
            {/* FIXED: Moved edit button inside the grid layout to prevent overlap */}
            <div
              className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] md:grid-cols-[7.5rem_1fr_auto] gap-x-5 gap-y-4 md:gap-x-6 lg:gap-x-8 w-full items-start"
              data-testid="profile-card-layout"
            >
              <div className="flex justify-center sm:justify-start sm:row-span-2 md:row-span-1">
                <div className="relative p-1 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-400 shadow-[0_0_30px_rgba(99,102,241,0.45)]">
                  <div className='relative'>

                    <div className="h-28 w-28 sm:h-[7.5rem] sm:w-[7.5rem] rounded-full relative group border-4 border-black/20 bg-black/30 overflow-hidden">
                      <img
                        src={user.profile_picture || profile_pic}
                        className="w-full h-full object-cover rounded-full"
                        alt={`${user.name || 'User'} profile`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditProfilePic(true)}
                        aria-label="Change profile picture"
                        className="w-full h-full bg-black/50 absolute rounded-full inset-0 cursor-pointer opacity-0 z-10 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                      >
                        <div className="h-full w-full flex items-center justify-center">
                          <Camera aria-hidden="true" size={18} className="text-white" />
                        </div>
                      </button>
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-green-500 border-[3px] border-gray-900 z-20" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start min-w-0 text-center sm:text-left sm:col-start-2">
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-semibold">
                    <Flame size={12} aria-hidden="true" />
                    Builder
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    Level {userLevel}
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3 max-w-full">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl default-bold text-white truncate">
                    {user.name || 'User'}
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowEditProfile(true)}
                    aria-label="Edit profile details"
                    data-testid="edit-profile-btn"
                    className="
      p-2
      rounded-full
      bg-white/10
      hover:bg-white/15
      border border-white/15
      hover:border-white/25
      text-white
      shadow-[0_0_10px_rgba(255,255,255,0.2)]
      hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
      transition-all duration-300
      hover:scale-110
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-indigo-300
      cursor-pointer
    "
                  >
                    <UserPen size={19} />
                  </button>
                </div>
                <span className="cursor-pointer text-sm font-medium text-indigo-400 mb-2 truncate max-w-full">
                  @{user.username || 'username'}
                </span>
                <p className="text-gray-300 text-sm md:text-base mb-4 max-w-full leading-relaxed break-words">
                  {user.bio || 'Add Bio'}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 sm:gap-x-6 w-full">
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg sm:text-xl font-bold text-white">{productivityScore}%</p>
                    <p className="text-[10px] sm:text-xs text-indigo-300 uppercase tracking-wider font-semibold">Productivity</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block" />
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg sm:text-xl font-bold text-white">{disciplineScore}%</p>
                    <p className="text-[10px] sm:text-xs text-emerald-300 uppercase tracking-wider font-semibold">Discipline</p>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <div className="flex items-end gap-1 h-7">
                      {productivityInsights?.heatmap?.slice(-7)?.map((d, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-indigo-500 rounded-t-sm opacity-80"
                          style={{ height: `${Math.max(15, d.value)}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-semibold">7D Activity</p>
                  </div>
                </div>
              </div>

              {/* FIXED: Profile action buttons section - properly integrated into grid */}
              <div className="w-full sm:col-span-2 md:col-span-1 md:col-start-3 md:row-start-1 flex flex-col gap-3 shrink-0">


                <GradientButton
                  className="w-full md:min-w-[9.5rem] px-6 py-3 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:scale-[1.05] transform-gpu transition-all duration-300 ease-in-out border border-indigo-400/20"
                  data-testid="profile-connect-btn"
                >
                  <UserPlus2 size={20} />
                  <span>Connect</span>
                </GradientButton>
                <GradientButton
                  onClick={handleExportData}
                  className="w-full max-w-xs sm:max-w-none md:min-w-[9.5rem] px-6 py-3 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:scale-[1.05] transform-gpu transition-all duration-300 ease-in-out border border-indigo-400/20 mt-2"
                  data-testid="export-data-btn"
                >
                  <Download size={20} />
                  <span>Export Data</span>
                </GradientButton>
              </div>
            </div>
          </Card>

        </Motion.div>


        <div className="mb-6">
          <ClockWidget />
        </div>

        {/* Stats Grid */}
        {loading ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">

            <StatCard
              title="Productivity"
              value={`${productivityScore}%`}
              icon={<Zap size={24} />}
              trend={{ positive: productivityInsights.trendDelta >= 0, value: Math.abs(productivityInsights.trendDelta) }}
              data-testid="productivity-score-card"
            />
            <StatCard
              title="Discipline"
              value={`${disciplineScore}%`}
              icon={<TrendingUp size={24} />}
              data-testid="discipline-score-card"
            />
            <StatCard
              title="Focus Hours"
              value="12.5h"
              icon={<Timer size={24} />}
              trend={{ positive: true, value: 15 }}
              data-testid="focus-hours-card"
            />
            <StatCard
              title="Habit Streak"
              value="14 Days"
              icon={<Flame size={24} />}
              data-testid="habit-streak-card"
            />
            <StatCard
              title="Active Goals"
              value={goals.length.toString()}
              icon={<Target size={24} />}
              data-testid="active-goals-card"
            />
            <StatCard
              title="Tasks Today"
              value={`${dailyPlan?.plannedTasks.filter(t => t.completed).length}/${dailyPlan?.plannedTasks.length || 0}`}
              icon={<CheckCircle size={24} />}
              data-testid="tasks-today-card"
            />
          </div>
        )}

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
                      className={`w-full min-w-9 h-12 rounded-xl border flex items-end overflow-hidden ${day.value >= 80
                        ? 'border-emerald-400/40 bg-emerald-400/15'
                        : day.value >= 60
                          ? 'border-amber-400/40 bg-amber-400/15'
                          : 'border-rose-400/40 bg-rose-400/15'
                        }`}
                      title={`${day.name}: ${day.value}%`}
                    >
                      <div
                        className={`w-full ${day.value >= 80
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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Weekly Analytics</h2>
            <p className="text-sm text-gray-400">Download your weekly scores for Excel or Google Sheets.</p>
          </div>
          <GradientButton
            onClick={handleWeeklyAnalyticsExport}
            disabled={!weeklyData.length}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 px-5 py-2.5"
            data-testid="weekly-analytics-export-btn"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </GradientButton>
        </div>
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

            {/* Search Bar */}
            {hasAnyTasks && (
              <div className="mb-6 relative max-w-full" data-testid="task-search-bar-container">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Filter tasks by title..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  className="w-full bg-white/5 text-white border border-white/10 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-xl text-sm"
                  data-testid="task-search-input"
                />
              </div>
            )}
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
                    {filteredImportantTasks.length > 0 ? (
                      filteredImportantTasks.slice(0, 4).map(task => (
                        <Motion.div key={task.id} whileHover={{ scale: 1.005 }}>
                          <TaskItem
                            task={task}
                            onToggle={toggleTaskCompletion}
                          />
                        </Motion.div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm py-4 text-center">
                        No matching important tasks
                      </div>
                    )}
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
                    {filteredBehindTasks.length > 0 ? (
                      filteredBehindTasks.slice(0, 4).map(task => (
                        <Motion.div key={task.id} whileHover={{ scale: 1.005 }}>
                          <TaskItem
                            task={task}
                            onToggle={toggleTaskCompletion}
                          />
                        </Motion.div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm py-4 text-center">
                        No matching overdue tasks
                      </div>
                    )}
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
        ) : hasPlannedTasks && (pendingPlannedTasks.length > 0 || taskSearch !== "") ? (
          <Card className="mb-6 bg-white/5 border border-white/10 backdrop-blur-lg shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Today's Planned Tasks</h2>
              <Link to="/trackers/daily-tasks" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {pendingPlannedTasks.length > 0 ? (
                pendingPlannedTasks.slice(0, 5).map((item, index) => (
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
                            aria-label={`${item.completed ? 'Mark incomplete' : 'Mark complete'}: ${item.title}`}
                            aria-pressed={item.completed}
                            className={`p-2 rounded-lg transition-all ${item.completed
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
                              } focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900`}
                            data-testid={`toggle-planned-task-${item.id}`}
                          >
                            <CheckCircle aria-hidden="true" size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                ))) : (
                <div className="text-gray-400 text-sm py-6 text-center">
                  No planned tasks match "{taskSearch}"
                </div>
              )}
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
          <Card className="mb-6 relative overflow-hidden bg-gradient-to-br from-emerald-900/20 to-teal-900/10 backdrop-blur-3xl border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-4 md:p-2 gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <LucideTrophy size={32} className="text-emerald-400" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Hooray! All tasks completed.</h3>
                  <p className="text-gray-400 text-sm">Plan Ahead, Keep pushing yourself or take a break.</p>
                </div>
              </div>
              <Link to="/trackers/daily-tasks" className="w-full md:w-auto shrink-0">
                <GradientButton className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-8" data-testid="plan-now-btn">
                  Plan Ahead
                </GradientButton>
              </Link>
            </div>
          </Card>
        ) : !hasPlannedTasks && (
          <Card className="mb-6 relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/10 backdrop-blur-3xl border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)] group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-4 md:p-2 gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <CalendarDays size={32} className="text-indigo-400" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Plan Your Day to Stay Productive</h3>
                  <p className="text-gray-400 text-sm">Create a structured daily plan to maximize your productivity</p>
                </div>
              </div>
              <Link to="/trackers/daily-tasks" className="w-full md:w-auto shrink-0">
                <GradientButton className="w-full md:w-auto px-8" data-testid="plan-now-btn">
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
        <Card className="mb-6 relative overflow-hidden bg-gradient-to-br from-fuchsia-900/20 to-purple-900/10 backdrop-blur-3xl border border-fuchsia-500/20 shadow-[0_0_40px_rgba(192,38,211,0.1)] group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-4 md:p-2 gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full">
              <div className="p-4 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20 shadow-[0_0_15px_rgba(192,38,211,0.2)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Star size={32} className="text-fuchsia-400" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold text-white mb-1 drop-shadow-md">Doubt on Self ? Ask Your Twin...</h2>
                <p className="text-gray-400 text-sm">Use FutureTwin to predict outcomes and optimize your decisions.</p>
              </div>
            </div>
            <Link to="/future-twin" className="w-full md:w-auto shrink-0">
              <GradientButton className="w-full md:w-auto bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500" data-testid="future-twin-cta">
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
            <label htmlFor="profile-bio" className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
            <textarea
              id="profile-bio"
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
              <input hidden type="file" accept='.png, .jpg, .jpeg, .webp' id='profile_picture' className='w-full p-3 border border-gray-200 rounded-lg' onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                  if (allowedTypes.includes(file.type)) {
                    setNewProfilePic(file);
                  } else {
                    alert('Please upload a valid picture format (.png, .jpg, .jpeg, .webp)');
                    e.target.value = '';
                  }
                }
              }} />

              <div className='group/profile relative'>
                <img src={newProfilePic ? URL.createObjectURL(newProfilePic) : user.profile_picture || profile_pic} alt="Profile picture preview" className='w-24 h-24 rounded-full object-cover mt-2' />
                <div className='absolute hidden cursor-pointer group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                  <Pencil aria-hidden="true" className='w-5 h-5 text-white' />
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
