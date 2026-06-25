import { useState } from 'react';
import { Calendar, Clock, Plus, ListTodo, X, CheckCircle2, CalendarSyncIcon, CheckSquare, CalendarClock } from 'lucide-react';
import { useApp } from '../../../store/AppContext';
import Card from '../../../components/Card';
import DonutChart from '../../../components/DonutChart';
import GradientButton from '../../../components/GradientButton';
import InputField from '../../../components/InputField';
import EmptyState from '../../../components/EmptyState';
import { format } from 'date-fns';
import { motion as Motion } from 'framer-motion';
import Modal from '../../../components/Modal';
import { showToast } from '../../../utils/toastHelper';
import { PlannerSkeleton } from '../../../components/LoadingSkeleton';

const DailyTaskTracker = () => {
  const {
    tasks,
    habits,
    dailyPlan,
    loading,
    addToDailyPlan,
    removeFromDailyPlan,
    createManualDailyTask,
    toggleDailyPlanTaskCompletion,
    clearDailyPlan,
    calculateProductivityScore,
    calculateDisciplineScore
  } = useApp();

  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'add'
  const [addMode, setAddMode] = useState('tasks'); // 'tasks' | 'habits' | 'manual'
  const [activeView, setActiveView] = useState('timeline');
  const [manualTaskForm, setManualTaskForm] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    isImportant: false
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const [timeForm, setTimeForm] = useState({
    startTime: '09:00',
    endTime: '10:00'
  });

  const currentHour = new Date().getHours();
  const productivityScore = calculateProductivityScore();
  const disciplineScore = calculateDisciplineScore();

  const START_HOUR = 0;
  const END_HOUR = 24;
  const HOUR_HEIGHT = 145;

  const hours = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => i + START_HOUR
  );

  const activeTasks = dailyPlan.plannedTasks.filter(t => !t.completed);
  const completedTasks = dailyPlan.plannedTasks.filter(t => t.completed);

  const isPlanEmpty = dailyPlan.plannedTasks.length === 0;

  // Get tasks not yet in daily plan
  const availableTasks = tasks.filter(
    task => !task.completed &&
      !dailyPlan.plannedTasks.some(pt => pt.taskId === task.id)
  );

  // Get habits with time that aren't in daily plan
  const suggestedHabits = habits.filter(
    habit => habit.startTime &&
      !dailyPlan.plannedTasks.some(pt => pt.habitId === habit.id)
  );

  const completedCount = dailyPlan.plannedTasks.filter(t => t.completed).length;

  // Add habit to plan
  const handleAddHabitToPlan = (habit) => {
    const start = new Date(`2000-01-01T${habit.startTime}:00`);
    let endTime = habit.endTime;

    if (!endTime) {
      const newEnd = new Date(start.getTime() + 30 * 60 * 1000); // 30 min
      endTime = format(newEnd, 'HH:mm');
    } else {
      const end = new Date(`2000-01-01T${endTime}:00`);
      const diffMinutes = (end - start) / (1000 * 60);

      if (diffMinutes < 30) {
        const newEnd = new Date(start.getTime() + 30 * 60 * 1000);
        endTime = format(newEnd, 'HH:mm');
        showToast({ message: "Minimum 30 minutes applied" });
      }
    }
    addToDailyPlan({
      source: 'habit',
      habitId: habit.id,
      title: habit.name,
      startTime: habit.startTime,
      endTime: endTime,
      completed: false,
      isImportant: false
    });
  };

  // Create manual task
  const handleCreateManualTask = (e) => {
    e.preventDefault();
    if (!manualTaskForm.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    const start = new Date(`2000-01-01T${manualTaskForm.startTime}:00`);
    const end = new Date(`2000-01-01T${manualTaskForm.endTime}:00`);

    let diffMinutes = (end - start) / (1000 * 60)
    if (diffMinutes < 0) diffMinutes += 24 * 60

    if (diffMinutes < 30) {
        showToast({
            message: "Minimum task duration should be 30 minutes",
            status: "error",
        })
        return
    }

    createManualDailyTask(manualTaskForm);
    setManualTaskForm({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      isImportant: false
    });
  };

  const handleAddTaskToPlan = async () => {
    if (!selectedTask) return;

    const start = new Date(`2000-01-01T${timeForm.startTime}:00`);
    const end = new Date(`2000-01-01T${timeForm.endTime}:00`);

    let diffMinutes = (end - start) / (1000 * 60)
    if (diffMinutes < 0) diffMinutes += 24 * 60
    if (diffMinutes < 30) {
        showToast({
            message: "Minimum task duration should be 30 minutes",
            status: "error",
        })
        return
    }

    await addToDailyPlan({
      source: 'task',
      taskId: selectedTask.id,
      title: selectedTask.title,
      startTime: timeForm.startTime,
      endTime: timeForm.endTime,
      completed: selectedTask.completed,
      isImportant: selectedTask.isImportant
    });

    setSelectedTask(null);
    setShowTimeModal(false);
  };

  const getSourceBadge = (source) => {
    if (source === 'task') return { label: 'Task', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (source === 'habit') return { label: 'Habit', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    return { label: 'Manual', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
  };

  if (loading) {
    return (
      <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
          <Motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
            animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <Motion.div
            className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
            animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="mb-6">
              <h1 className="text-3xl young-serif-regular font-bold text-gray-200 mb-2">Daily Task Planner</h1>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={20} />
                <p>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </div>
            <PlannerSkeleton />
          </div>
        </div>
      </Motion.div>
    );
  }

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
        <Motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <Motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl young-serif-regular font-bold text-gray-200 mb-2">Daily Task Planner</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={20} />
              <p>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </Motion.div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-sm text-gray-400 mb-3 text-center">Productivity Score</h3>
              <DonutChart value={productivityScore} color="#10b981" size={120} />
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-sm text-gray-400 mb-3 text-center">Discipline Score</h3>
              <DonutChart value={disciplineScore} color="#f59e0b" size={120} />
            </Card>
          </div>

          {/* Warning if past 8 AM and no plan */}
          {currentHour >= 8 && isPlanEmpty && (
            <Card className="mb-6 bg-orange-900/20 border border-orange-500/30">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-orange-400" />
                <div>
                  <p className="text-orange-400 font-semibold">You haven't planned your day yet!</p>
                  <p className="text-sm text-gray-400">It's recommended to plan before 8 AM</p>
                </div>
              </div>
            </Card>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setActiveTab('timeline');
                setActiveView('timeline');

              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${activeTab === 'timeline'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              data-testid="timeline-tab"
            >
              <ListTodo size={20} className="inline mr-2" />
              Today's Timeline ({dailyPlan.plannedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${activeTab === 'add'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              data-testid="add-tasks-tab"
            >
              <Plus size={20} className="inline mr-2" />
              Add to Plan
            </button>
          </div>

          {/* TIMELINE VIEW */}
          {activeTab === 'timeline' && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isPlanEmpty ? (
                <EmptyState
                  icon={CalendarSyncIcon}
                  title="Your day is wide open"
                  description="Add tasks, habits, or a manual focus block to build a clear timeline."
                  actionLabel="Start Planning"
                  onAction={() => setActiveTab('add')}
                  testId="start-planning-btn"
                  className="shadow-[0_0_30px_rgba(99,102,241,0.15)]"
                />
              ) : (
                <>
                  {/* Progress Summary */}
                  <Card className="bg-white/10 backdrop-blur-3xl border-2 border-white/25 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Today's Progress</h3>
                        <p className="text-gray-400 text-sm">
                          {completedCount} of {dailyPlan.plannedTasks.length} tasks completed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl default-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]">
                          {dailyPlan.plannedTasks.length > 0
                            ? Math.round((completedCount / dailyPlan.plannedTasks.length) * 100)
                            : 0}%
                        </p>
                        <button
                          onClick={clearDailyPlan}
                          className="text-sm text-red-400 hover:text-red-300 mt-1"
                          data-testid="clear-plan-btn"
                        >
                          Clear Plan
                        </button>
                      </div>
                    </div>
                  </Card>

                  {/* Tab Navigation */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setActiveView('timeline')}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${activeView === 'timeline'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      data-testid="timeline-view-tab"
                    >
                      <CalendarClock size={20} className="inline mr-2" />
                      Timeline View ({dailyPlan.plannedTasks.length})
                    </button>
                    <button
                      onClick={() => setActiveView('list')}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${activeView === 'list'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      data-testid="tasks-list-view-tab"
                    >
                      <CheckSquare size={20} className="inline mr-2" />
                      Task List View
                    </button>
                  </div>

                  {/* NEW TIME GRID VIEW - POLISHED */}
                  {activeView === 'timeline' && (
                    <div className="flex relative mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

                      {/* LEFT TIME COLUMN */}
                      <div className="w-20 bg-black/30 border-r border-white/10">
                        {hours.map(hour => (
                          <div
                            key={hour}
                            className="h-[145px] flex items-start justify-end pr-3 pt-1 text-xs text-gray-400 border-b border-white/5"
                          >
                            {`${hour.toString().padStart(2, '0')}:00`}
                          </div>
                        ))}
                      </div>

                      {/* RIGHT GRID AREA */}
                      <div className="flex-1 relative">

                        {/* GRID BACKGROUND */}
                        <div className="absolute inset-0">
                          {hours.map(hour => (
                            <div
                              key={hour}
                              className="h-[145px] border-b border-white/5"
                            />
                          ))}
                        </div>

                        {/* SUBTLE VERTICAL GRID LINES */}
                        <div className="absolute inset-0 grid grid-cols-4 opacity-20">
                          <div className="border-r border-white/10"></div>
                          <div className="border-r border-white/10"></div>
                          <div className="border-r border-white/10"></div>
                          <div></div>
                        </div>

                        {/* EMPTY STATE (temporary) */}
                        {dailyPlan.plannedTasks.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-500 text-sm">
                              No tasks scheduled yet
                            </p>
                          </div>
                        )}

                        {/* (Tasks will come next step) */}
                        {activeTasks.map((task) => {
                          const [sh, sm] = task.startTime.split(':').map(Number);
                          const [eh, em] = task.endTime.split(':').map(Number);

                          const startInHours = sh + sm / 60;
                          const endInHours = eh + em / 60;

                          const top = (startInHours - START_HOUR) * HOUR_HEIGHT;
                          const height = (endInHours - startInHours) * HOUR_HEIGHT;

                          // 🔥 Adaptive UI logic
                          const isSmall = height < 60;
                          const isMedium = height >= 30 && height < 40;

                          return (
                            <div
                              key={task.id}
                              className={`group absolute left-4 right-4 pointer-events-auto rounded-xl p-2 backdrop-blur-lg border shadow-lg transition-all
        ${task.completed
                                  ? 'opacity-50 border-gray-500'
                                  : 'border-indigo-400 hover:scale-[1.02]'
                                }`}
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                backgroundColor:
                                  task.source === 'task'
                                    ? 'rgba(59,130,246,0.3)'
                                    : task.source === 'habit'
                                      ? 'rgba(34,197,94,0.3)'
                                      : 'rgba(168,85,247,0.3)'
                              }}
                            >

                              {/* 🔥 ACTION BUTTONS (FIXED) */}
                              <div
                                className="absolute top-1 right-1 flex gap-1 transition z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDailyPlanTaskCompletion(task.id);
                                  }}
                                  className={`p-2 rounded ${task.completed
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-black/40 text-gray-300 hover:bg-green-500/20 hover:text-green-400'
                                    }`}
                                >
                                  <CheckCircle2 size={14} />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromDailyPlan(task.id);
                                  }}
                                  className="p-2 rounded bg-black/40 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
                                >
                                  <X size={14} />
                                </button>
                              </div>

                              {/* 🔥 CONTENT */}
                              <div className="h-full flex flex-col justify-start overflow-hidden">

                                {/* TITLE (ALWAYS VISIBLE) */}
                                <p className={`text-sm font-semibold truncate ${task.completed
                                  ? 'line-through text-gray-400'
                                  : 'text-white'
                                  }`}>
                                  {task.title}
                                </p>

                                {/* TIME (ONLY IF SPACE AVAILABLE) */}
                                {!isSmall && (
                                  <p className="text-xs text-gray-300 mt-1 truncate">
                                    {task.startTime} - {task.endTime}
                                  </p>
                                )}

                                {/* BADGES (ONLY IF LARGE BLOCK) */}
                                {!isSmall && !isMedium && (
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-gray-300">
                                      {task.source}
                                    </span>

                                    {task.isImportant && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                                        Important
                                      </span>
                                    )}
                                  </div>
                                )}

                              </div>
                            </div>
                          );
                        })}

                      </div>
                    </div>
                  )}
                  {activeView === 'list' && (
                    <div className="space-y-3 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                      <h2 className="text-xl font-bold text-white mb-4">Today's Planned Tasks</h2>
                      {activeTasks.map((item, index) => (
                        <Motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative"
                        >
                          <div className="bg-white/5 rounded-lg shadow-lg backdrop-blur-lg p-3 border border-white/10 hover:border-white/50 transition-all">
                            <div className="flex items-start gap-3">
                              {/* Time */}
                              <div className="text-center min-w-[60px]">
                                <p className="text-xs text-indigo-400 font-semibold">{item.startTime}</p>
                                <p className="text-xs text-gray-500">{item.endTime}</p>
                              </div>

                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex-1">
                                    <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                      {item.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getSourceBadge(item.source).color}`}>
                                        {getSourceBadge(item.source).label}
                                      </span>
                                      {item.isImportant && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                          Important
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => toggleDailyPlanTaskCompletion(item.id)}
                                      className={`p-2 rounded-lg transition-all ${item.completed
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
                                        }`}
                                      data-testid={`complete-daily-task-${item.id}`}
                                    >
                                      <CheckCircle2 size={20} />
                                    </button>
                                    <button
                                      onClick={() => removeFromDailyPlan(item.id)}
                                      className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                                      data-testid={`remove-daily-task-${item.id}`}
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Motion.div>
                      ))}
                    </div>
                  )}
                  {completedTasks.length > 0 && (
                    <div className="mt-8">

                      {/* HEADER */}
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">
                        Completed Tasks ({completedTasks.length})
                      </h3>

                      {/* LIST */}
                      <div className="space-y-3">
                        {completedTasks.map(task => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
                          >

                            {/* LEFT */}
                            <div>
                              <p className="text-gray-400 line-through">
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {task.startTime} - {task.endTime}
                              </p>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-2">

                              {/* UNDO (bring back to timeline) */}
                              <button
                                onClick={() => toggleDailyPlanTaskCompletion(task.id)}
                                className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              >
                                <CheckCircle2 size={18} />
                              </button>

                              {/* DELETE */}
                              <button
                                onClick={() => removeFromDailyPlan(task.id)}
                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              >
                                <X size={18} />
                              </button>

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </Motion.div>
          )}

          {/* ADD TO PLAN VIEW */}
          {activeTab === 'add' && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sub-tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setAddMode('tasks')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${addMode === 'tasks'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  data-testid="add-from-tasks-tab"
                >
                  From Tasks ({availableTasks.length})
                </button>
                <button
                  onClick={() => setAddMode('habits')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${addMode === 'habits'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  data-testid="add-from-habits-tab"
                >
                  Suggested Habits ({suggestedHabits.length})
                </button>
                <button
                  onClick={() => setAddMode('manual')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${addMode === 'manual'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  data-testid="create-manual-task-tab"
                >
                  Create Manual
                </button>
              </div>

              {/* Add from Tasks */}
              {addMode === 'tasks' && (
                <Card className='bg-white/5 border border-white/10 '>
                  <h3 className="text-lg font-semibold text-white mb-4">Select Task to Add</h3>
                  {availableTasks.length > 0 ? (
                    <>
                      <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-3">
                        {availableTasks.map(task => (
                          <Motion.div
                            key={task.id}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-green-500/50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="text-white font-medium">{task.title}</p>
                                {task.deadline && (
                                  <p className="text-xs text-gray-400">
                                    Due: {format(new Date(task.deadline), 'MMM d, h:mm a')}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedTask(task);
                                  setShowTimeModal(true);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                                data-testid={`select-task-${task.id}`}
                              >
                                Add to Plan
                              </button>
                            </div>
                          </Motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      icon={CheckSquare}
                      title="No available tasks"
                      description="All tasks are completed or already placed in today's plan."
                      className="border-0 bg-transparent shadow-none"
                    />
                  )}
                </Card>
              )}

              {/* Suggested Habits */}
              {addMode === 'habits' && (
                <Card className='bg-white/5 border backdrop-blur-2xl border-white/10'>
                  <h3 className="text-lg font-semibold text-white mb-4">Suggested Habits</h3>
                  {suggestedHabits.length > 0 ? (
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto px-3">
                      {suggestedHabits.map(habit => (
                        <Motion.div
                          key={habit.id}
                          whileHover={{ scale: 1.005 }}
                          className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-green-500/50 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium">{habit.name}</h4>
                              <p className="text-sm text-gray-400">
                                {habit.startTime} - {habit.endTime || 'No end time'}
                              </p>
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 inline-block mt-1">
                                Habit
                              </span>
                            </div>
                            <button
                              onClick={() => handleAddHabitToPlan(habit)}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                              data-testid={`add-habit-${habit.id}`}
                            >
                              Add to Plan
                            </button>
                          </div>
                        </Motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={CalendarClock}
                      title="No habits available"
                      description="Habits without a time or already in the plan are hidden from suggestions."
                      className="border-0 bg-transparent shadow-none"
                    />
                  )}
                </Card>
              )}

              {/* Create Manual Task */}
              {addMode === 'manual' && (
                <Card className='bg-white/5 border border-white/10 backdrop-blur-2xl'>
                  <h3 className="text-lg font-semibold text-white mb-4">Create Manual Task</h3>
                  <form onSubmit={handleCreateManualTask} className="space-y-4">
                    <InputField
                      label="Task Title"
                      type="text"
                      value={manualTaskForm.title}
                      onChange={(e) => setManualTaskForm({ ...manualTaskForm, title: e.target.value })}
                      placeholder="What do you need to do?"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Start Time"
                        type="time"
                        value={manualTaskForm.startTime}
                        onChange={(e) => setManualTaskForm({ ...manualTaskForm, startTime: e.target.value })}
                        required
                      />
                      <InputField
                        label="End Time"
                        type="time"
                        value={manualTaskForm.endTime}
                        onChange={(e) => setManualTaskForm({ ...manualTaskForm, endTime: e.target.value })}
                        required
                      />
                    </div>

                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualTaskForm.isImportant}
                        onChange={(e) => setManualTaskForm({ ...manualTaskForm, isImportant: e.target.checked })}
                        className="w-5 h-5"
                      />
                      Mark as Important
                    </label>

                    <GradientButton type="submit" className="w-full" data-testid="create-manual-task-btn">
                      Create & Add to Plan
                    </GradientButton>
                  </form>
                </Card>
              )}
            </Motion.div>
          )}
        </div>
      </div>
      {showTimeModal && selectedTask && (
        <Modal
          isOpen={showTimeModal}
          onClose={() => setShowTimeModal(false)}
          title={`Set time for ${selectedTask.title}`}
        >
          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Start Time"
                type="time"
                value={timeForm.startTime}
                onChange={(e) =>
                  setTimeForm({ ...timeForm, startTime: e.target.value })
                }
                required
              />

              <InputField
                label="End Time"
                type="time"
                value={timeForm.endTime}
                onChange={(e) =>
                  setTimeForm({ ...timeForm, endTime: e.target.value })
                }
                required
              />
            </div>

            <GradientButton
              onClick={handleAddTaskToPlan}
              className="w-full"
            >
              Add to Plan
            </GradientButton>
          </div>
        </Modal>
      )}
    </Motion.div>
  );
};

export default DailyTaskTracker;
