import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { 
  TrendingUp, Target, CheckCircle, Zap, ArrowRight, UserPlus2, 
  Camera, CalendarDays, Star, AlertTriangle, UserPen, LucideTrophy, Pencil 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../store/AppContext';
import { statsAPI } from '../api/apiService';

import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ClockWidget from '../components/ClockWidget';
import DonutChart from '../components/DonutChart';
import GoalCard from '../components/GoalCard';
import ProjectCard from '../components/ProjectCard';
import TaskItem from '../components/TaskItem';
import HabitCard from '../components/HabitCard';
import GradientButton from '../components/GradientButton';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import profile_pic from '../assets/profile_pic.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    goals,
    user,
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

  // Local State
  const [weeklyData, setWeeklyData] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditProfilePic, setShowEditProfilePic] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: user.name, username: user.username, bio: user.bio });
  const [newProfilePic, setNewProfilePic] = useState(null);

  // Fetch Analytics Analytics Metrics
  useEffect(() => {
    const fetchStats = async () => {
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
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Performance Memoizations
  const scores = useMemo(() => ({
    productivity: calculateProductivityScore(),
    discipline: calculateDisciplineScore()
  }), [tasks, habits, goals, calculateProductivityScore, calculateDisciplineScore]);

  const averages = useMemo(() => {
    if (weeklyData.length === 0) return { productivity: 0, discipline: 0 };
    const prodSum = weeklyData.reduce((sum, d) => sum + d.productivity, 0);
    const discSum = weeklyData.reduce((sum, d) => sum + d.discipline, 0);
    return {
      productivity: Math.round(prodSum / weeklyData.length),
      discipline: Math.round(discSum / weeklyData.length)
    };
  }, [weeklyData]);

  const taskFilters = useMemo(() => {
    const todayPlanned = dailyPlan?.plannedTasks || [];
    return {
      todayPlanned,
      pendingPlanned: todayPlanned.filter(t => !t.completed),
      hasPlanned: todayPlanned.length > 0,
      important: getImportantTasks(),
      behind: getBehindTasks()
    };
  }, [dailyPlan, getImportantTasks, getBehindTasks]);

  const slices = useMemo(() => ({
    goals: goals.slice(0, 4),
    projects: projects.slice(0, 4),
    habits: habits.slice(0, 3)
  }), [goals, projects, habits]);

  // Form Submission Handlers
  const handleEditProfile = async (e) => {
    e.preventDefault();
    const updates = {};

    if (newProfile.name.trim() && newProfile.name !== user.name) updates.name = newProfile.name;
    if (newProfile.username.trim() && newProfile.username !== user.username) updates.username = newProfile.username;
    if (newProfile.bio !== user.bio) updates.bio = newProfile.bio;

    if (Object.keys(updates).length === 0) {
      setShowEditProfile(false);
      return;
    }

    const success = await updateUser(updates);
    if (success) {
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
    if (!newProfilePic) {
      setShowEditProfilePic(false);
      return;
    }

    const formData = new FormData();
    formData.append("profile", newProfilePic);

    const success = await updateUserProfilePic(formData);
    if (success) {
      setNewProfilePic(null);
      setShowEditProfilePic(false);
    }
  };

  // Sub-view Render Layout Triggers
  const renderPlannedTasksSection = () => {
    const { hasPlanned, pendingPlanned } = taskFilters;

    if (hasPlanned && pendingPlanned.length > 0) {
      return (
        <Card className="mb-6 bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl shadow-black/20">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-white tracking-wide">Today's Planned Tasks</h2>
            <Link to="/trackers/daily-tasks" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {pendingPlanned.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="p-3.5 bg-slate-850/40 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all flex items-start gap-3.5"
                data-testid={`planned-task-${item.id}`}
              >
                <div className="text-center min-w-[65px] border-r border-white/5 pr-3">
                  <p className="text-xs text-indigo-400 font-bold tracking-wide">{item.startTime}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.endTime}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm tracking-wide truncate ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md uppercase border ${
                      item.source === 'task' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      item.source === 'habit' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {item.source}
                    </span>
                    {item.isImportant && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Important
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleDailyPlanTaskCompletion(item.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    item.completed ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/5'
                  }`}
                  data-testid={`toggle-planned-task-${item.id}`}
                >
                  <CheckCircle size={18} />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-4 mt-5 pt-2">
            <Link to="/focus-room" className="flex-1">
              <GradientButton className="w-full shadow-lg shadow-indigo-600/10" data-testid="focus-room-cta">
                <span>Enter Focus Room</span>
                <ArrowRight size={16} />
              </GradientButton>
            </Link>
            <Link to="/trackers/daily-tasks" className="flex-1">
              <GradientButton className="w-full shadow-lg shadow-indigo-600/10" data-testid="plan-now-btn">
                <span>Plan Ahead</span>
                <ArrowRight size={16} />
              </GradientButton>
            </Link>
          </div>
        </Card>
      );
    }

    if (hasPlanned && pendingPlanned.length === 0) {
      return (
        <Card className="mb-6 bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl shadow-black/20 text-center py-8">
          <LucideTrophy size={44} className="text-amber-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-bounce" />
          <h3 className="text-xl font-bold text-slate-100 tracking-wide">Excellent Routine Work!</h3>
          <p className="text-slate-400 text-sm mt-1.5 mb-5 max-w-sm mx-auto">All dynamic tasks configured for today are completed. Keep executing your goals.</p>
          <Link to="/trackers/daily-tasks">
            <GradientButton data-testid="plan-now-btn">Plan Ahead</GradientButton>
          </Link>
        </Card>
      );
    }

    return (
      <Card className="mb-6 bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl shadow-black/20 text-center py-8">
        <CalendarDays size={40} className="text-indigo-400 mx-auto mb-3 drop-shadow-[0_0_12px_rgba(99,102,241,0.3)]" />
        <h3 className="text-lg font-bold text-slate-100 tracking-wide">Plan Your System Architecture</h3>
        <p className="text-slate-400 text-sm mt-1.5 mb-5 max-w-xs mx-auto">Create an explicit structured dynamic layout routine to scale daily productivity milestones.</p>
        <Link to="/trackers/daily-tasks">
          <GradientButton data-testid="plan-now-btn">Plan System Flow</GradientButton>
        </Link>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black pb-20 px-4 pt-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Decorative Glow Elements */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full blur-[130px] opacity-15 pointer-events-none"
        animate={{ x: [0, 30, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600 rounded-full blur-[130px] opacity-15 pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Welcome Block Profile Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-6 w-full relative overflow-hidden bg-slate-900/30 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 p-6">
            <div className="w-full flex flex-col items-center relative">
              <button 
                onClick={() => setShowEditProfile(true)} 
                className="absolute right-0 top-0 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 p-2.5 rounded-xl text-slate-300 transition-all shadow-md cursor-pointer"
                title="Edit Core Meta Configuration"
              >
                <UserPen size={18} />
              </button>
              
              {/* Profile Image View Wrapper */}
              <div className="h-28 w-28 rounded-full relative group border-4 border-slate-950 shadow-xl shrink-0 mb-4">
                <img src={user.profile_picture || profile_pic} className="w-full h-full object-cover rounded-full" alt="User Profile context" />
                <button 
                  onClick={() => setShowEditProfilePic(true)} 
                  className="w-full h-full bg-black/60 absolute rounded-full inset-0 cursor-pointer opacity-0 group-hover:opacity-100 border-none flex items-center justify-center transition-all"
                >
                  <Camera size={18} className="text-slate-200" />
                </button>
                <span className="h-4 w-4 rounded-full border-2 border-slate-950 bottom-1 absolute right-1 bg-emerald-500 shadow-md" />
              </div>

              <div className="text-center flex flex-col gap-0.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">{user.name || 'Core Account Developer'}</h1>
                <p className="text-sm font-medium text-indigo-400">@{user.username || 'username'}</p>
              </div>
            </div>

            <p className="text-slate-400 text-sm text-center leading-relaxed max-w-md mx-auto my-4 border-t border-b border-white/5 py-3">
              {user.bio || 'Add account bio text infrastructure...'}
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-5">
              <div className="text-center p-2.5 bg-slate-950/40 rounded-xl border border-white/5">
                <p className="text-xl font-bold text-indigo-400">{scores.productivity}%</p>
                <p className="text-[11px] uppercase font-bold tracking-wide text-slate-400 mt-0.5">Productivity</p>
              </div>
              <div className="text-center p-2.5 bg-slate-950/40 rounded-xl border border-white/5">
                <p className="text-xl font-bold text-emerald-400">{scores.discipline}%</p>
                <p className="text-[11px] uppercase font-bold tracking-wide text-slate-400 mt-0.5">Discipline</p>
              </div>
            </div>

            <GradientButton className="w-full shadow-md shadow-indigo-600/10">
              <UserPlus2 size={16} />
              <span>Connect Distributed Teams</span>
            </GradientButton>
          </Card>
        </motion.div>

        {/* Central Widgets Pipeline */}
        <div className="rounded-2xl p-5 mb-6 bg-slate-900/10 border border-white/5 backdrop-blur-2xl shadow-xl">
          <div className="mb-5"><ClockWidget /></div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Productivity" value={`${scores.productivity}%`} icon={<Zap size={20} />} data-testid="productivity-score-card" />
            <StatCard title="Discipline" value={`${scores.discipline}%`} icon={<TrendingUp size={20} />} data-testid="discipline-score-card" />
            <StatCard title="Active Goals" value={goals.length.toString()} icon={<Target size={20} />} data-testid="active-goals-card" />
            <StatCard 
              title="Tasks Today" 
              value={`${dailyPlan?.plannedTasks.filter(t => t.completed).length || 0}/${dailyPlan?.plannedTasks.length || 0}`} 
              icon={<CheckCircle size={20} />} 
              data-testid="tasks-today-card" 
            />
          </div>
        </div>

        {/* Analytics Charts Infrastructure */}
        <h2 className="text-lg font-bold text-white tracking-wide mb-4">Weekly Dashboard Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <Card className="bg-slate-900/40 border border-white/5 text-center p-4">
            <h3 className="text-sm font-semibold tracking-wide text-slate-400 text-left mb-4">// Avg Productivity</h3>
            <div className="flex justify-center"><DonutChart value={averages.productivity} size={130} color="#6366f1" label="Weekly Index" /></div>
          </Card>

          <Card className="bg-slate-900/40 border border-white/5 text-center p-4">
            <h3 className="text-sm font-semibold tracking-wide text-slate-400 text-left mb-4">// Avg Discipline</h3>
            <div className="flex justify-center"><DonutChart value={averages.discipline} size={130} color="#10b981" label="Weekly Index" /></div>
          </Card>

          <Card className="bg-slate-900/40 border border-white/5 p-4 flex flex-col justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-slate-400 mb-4">// Core Progress Scaling</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyData} margin={{ top: 15, right: 0, left: -10, bottom: 0 }} barGap={6}>
                <defs>
                  <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="productivity" fill="#6366f1" radius={[4, 4, 4, 4]} barSize={6} filter="url(#purpleGlow)">
                  <LabelList dataKey="productivity" position="top" fill="#818cf8" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                </Bar>
                <Bar dataKey="discipline" fill="#10b981" radius={[4, 4, 4, 4]} barSize={6} filter="url(#greenGlow)">
                  <LabelList dataKey="discipline" position="top" fill="#34d399" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Priority Warnings Grid Section */}
        {(taskFilters.important.length > 0 || taskFilters.behind.length > 0) && (
          <div className="border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl rounded-2xl p-5 mb-6 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {taskFilters.important.length > 0 && (
                <div className="p-1">
                  <h2 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
                    <Star className="text-amber-400 fill-amber-400/10" size={16} /> Important Tasks
                  </h2>
                  <p className="text-slate-400 text-xs mb-4">Complete these high-priority operations inside current execution stacks.</p>
                  <div className="space-y-2.5">
                    {taskFilters.important.slice(0, 3).map(task => (
                      <TaskItem key={task.id} task={task} onToggle={toggleTaskCompletion} />
                    ))}
                  </div>
                </div>
              )}

              {taskFilters.behind.length > 0 && (
                <div className="p-1 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-6">
                  <h2 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
                    <AlertTriangle className="text-rose-400" size={16} /> Latency Expired
                  </h2>
                  <p className="text-slate-400 text-xs mb-4">Urgent corrective action needed; task deadlines have already passed.</p>
                  <div className="space-y-2.5">
                    {taskFilters.behind.slice(0, 3).map(task => (
                      <TaskItem key={task.id} task={task} onToggle={toggleTaskCompletion} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mt-5 pt-3 border-t border-white/5">
              <Link to="/focus-room" className="flex-1">
                <GradientButton className="w-full text-xs" data-testid="focus-room-cta">
                  <span>Enter Focus Room</span> <ArrowRight size={14} />
                </GradientButton>
              </Link>
              <Link to="/trackers/daily-tasks" className="flex-1">
                <GradientButton className="w-full text-xs" data-testid="plan-now-btn">
                  <span>Modify Today's Buffer</span> <ArrowRight size={14} />
                </GradientButton>
              </Link>
            </div>
          </div>
        )}

        {/* Render Dynamic Task Layout Module Container */}
        {renderPlannedTasksSection()}

        {/* Lower Entity Progress Tracks Mapping */}
        {slices.goals.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white tracking-wide">Goals Framework</h2>
              <Link to="/trackers/goals" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-all">
                View Tracking Node <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {slices.goals.map((goal, idx) => (
                <motion.div key={goal.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} viewport={{ once: true }}>
                  <GoalCard goal={goal} progress={calculateGoalProgress(goal.id)} onClick={() => {}} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {slices.projects.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white tracking-wide">Projects Architecture</h2>
              <Link to="/trackers/projects" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-all">
                View Repositories <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {slices.projects.map((project, idx) => {
                const linkedGoal = goals.find(g => g.id === project.goalId);
                return (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} viewport={{ once: true }}>
                    <ProjectCard project={project} progress={calculateProjectProgress(project.id)} linkedGoal={linkedGoal?.title} onClick={() => {}} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {slices.habits.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white tracking-wide">System Compilers (Habits)</h2>
              <Link to="/trackers/habits" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-all">
                View Trackers <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {slices.habits.map((habit, idx) => (
                <motion.div key={habit.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} viewport={{ once: true }} onClick={() => navigate('/trackers/habits')}>
                  <HabitCard habit={habit} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FutureTwin Prediction Prompt Section */}
        <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl p-6 text-center">
          <h2 className="text-xl font-bold text-white tracking-wide mb-1.5">Algorithmic Vector Processing (FutureTwin)</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-5">Query your localized FutureTwin array configuration parameters to predict state updates and outcomes ahead of release dates.</p>
          <Link to="/future-twin">
            <GradientButton data-testid="future-twin-cta">Initiate FutureTwin Query</GradientButton>
          </Link>
        </Card>
      </div>

      {/* Edit Profile Meta Data Modal */}
      <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Configuration Core">
        <form onSubmit={handleEditProfile} className="space-y-4">
          <InputField
            label="Name (Full Identity Header)"
            value={newProfile.name}
            onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
            placeholder="Enter Name String"
            required
            data-testid="profile-name-input"
          />
          <InputField
            label="Namespace Handle"
            value={newProfile.username}
            onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })}
            placeholder="Username mapping"
            required
            data-testid="profile-username-input"
          />
          <div>
            <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">Account Bio Infrastructure</label>
            <textarea
              value={newProfile.bio}
              onChange={(e) => setNewProfile({ ...newProfile, bio: e.target.value })}
              placeholder="State structural summary constraints details..."
              data-testid="profile-bio-input"
              required
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none leading-relaxed"
            />
          </div>
          <GradientButton type="submit" className="w-full" data-testid="submit-new-profile-btn">
            Save Structural Changes
          </GradientButton>
        </form>
      </Modal>

      {/* Profile Picture Upload Buffer Modal */}
      <Modal isOpen={showEditProfilePic} onClose={() => setShowEditProfilePic(false)} title="Change Matrix Avatar">
        <form onSubmit={handleEditProfilePic} className="space-y-5 text-center">
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="profile_picture" className="block text-slate-400 text-sm cursor-pointer group/label">
              <span className="font-semibold text-indigo-400 group-hover/label:underline">Click to upload image block</span>
              <input hidden type="file" accept="image/*" id="profile_picture" onChange={(e) => setNewProfilePic(e.target.files[0])} />

              <div className="relative w-24 h-24 mx-auto mt-4 rounded-full border border-white/5 shadow-inner flex items-center justify-center overflow-hidden">
                <img src={newProfilePic ? URL.createObjectURL(newProfilePic) : user.profile_picture || profile_pic} alt="Preview payload container" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Pencil className="w-4 h-4 text-white" />
                </div>
              </div>
            </label>
          </div>
          <GradientButton type="submit" className="w-full" data-testid="submit-new-profile-picture-btn">
            Commit Avatar Buffer
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;