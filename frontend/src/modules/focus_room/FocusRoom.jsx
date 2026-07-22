import { Play, Pause, RotateCcw, CheckCircle2, CalendarDays, LucideTrophy, Volume2, X } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { useFocus } from '../../store/FocusContext';
import Card from '../../components/Card';
import { motion } from 'framer-motion'
import Bag from '../../components/Bag';
import GradientButton from '../../components/GradientButton';
import { Link } from 'react-router-dom';

const FocusRoom = () => {
  const { dailyPlan, toggleDailyPlanTaskCompletion } = useApp();
  const {
    mode,
    pomodoroCount,
    isActive,
    minutes,
    seconds,
    toggleTimer,
    resetTimer,
    switchMode,
    alertSound,
    alertVolume,
    alertSoundOptions,
    completionAlert,
    setAlertSound,
    setAlertVolume,
    previewAlertSound,
    dismissCompletionAlert,
  } = useFocus();

  // Get today's planned tasks from dailyPlan
  const todayPlannedTasks = dailyPlan?.plannedTasks || [];
  const pendingPlannedTasks = todayPlannedTasks.filter(t => !t.completed).slice(0, 8);
  const hasPlannedTasks = todayPlannedTasks.length > 0;

  const getModeColor = () => {
    if (mode === 'work') return 'from-red-600 to-orange-600';
    if (mode === 'shortBreak') return 'from-green-600 to-emerald-600';
    return 'from-blue-600 to-cyan-600';
  };

  const getModeText = () => {
    if (mode === 'work') return 'Focus Time';
    if (mode === 'shortBreak') return 'Short Break';
    return 'Long Break';
  };

  const getSourceBadge = (source) => {
    if (source === 'task') return { label: 'Task', color: 'bg-blue-500/20 text-blue-400' };
    if (source === 'habit') return { label: 'Habit', color: 'bg-green-500/20 text-green-400' };
    return { label: 'Manual', color: 'bg-purple-500/20 text-purple-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl opacity-10"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-10"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl young-serif-regular font-extrabold text-white mb-2"
            animate={{
              textShadow: [
                "0px 0px 0px rgba(99,102,241,0)",
                "0px 0px 15px rgba(99,102,241,0.6)",
                "0px 0px 0px rgba(99,102,241,0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Focus Room
          </motion.h1>
          <p className="text-gray-400">Minimize distractions, maximize productivity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden text-center bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
              {/* Mode Selector */}
              <div className="flex justify-center gap-2 mb-6">
                <button
                  onClick={() => switchMode('work')}
                  className={`px-4 py-2 rounded-lg border cursor-pointer border-white/10 transition-all duration-300 ${mode === 'work'
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  data-testid="mode-work"
                >
                  Work
                </button>
                <button
                  onClick={() => switchMode('shortBreak')}
                  className={`px-4 py-2 rounded-lg border cursor-pointer border-white/10 transition-all duration-300 ${mode === 'shortBreak'
                    ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  data-testid="mode-short-break"
                >
                  Short Break
                </button>
                <button
                  onClick={() => switchMode('longBreak')}
                  className={`px-4 py-2 rounded-lg border cursor-pointer border-white/10 transition-all duration-300 ${mode === 'longBreak'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  data-testid="mode-long-break"
                >
                  Long Break
                </button>
              </div>

              {/* Timer Display */}
              <motion.div
                animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
              >
                {/* Timer */}

                <div className={`bg-gradient-to-r flex flex-col items-center ${getModeColor()} rounded-2xl p-12 mb-6`}>
                  <p className="text-white text-xl mb-4">{getModeText()}</p>
                  <div className="text-8xl font-bold text-white mb-4" data-testid="timer-display">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <p className="text-white mt-4 text-sm">
                    Completed Sessions: <span className="text-white font-semibold">{pomodoroCount}</span>
                  </p>
                </div>
              </motion.div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  data-testid="timer-toggle"
                  className={`bg-gradient-to-r ${getModeColor()} hover:opacity-90 text-white px-8 py-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] 
hover:scale-105 cursor-pointer active:scale-95 transition-all flex items-center gap-2 text-lg font-semibold`}
                >
                  {isActive ? (
                    <>
                      <Pause size={24} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={24} />
                      Start
                    </>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  data-testid="timer-reset"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] 
hover:scale-110 active:scale-95 cursor-pointer transition-all"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
                            {/* Audio Alert Settings */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 size={20} className="text-indigo-300" />
                  <h3 className="text-white font-semibold">Audio Alert Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <label className="flex flex-col gap-2 text-sm text-gray-300">
                    Alert Sound
                    <select
                      value={alertSound}
                      onChange={(event) => setAlertSound(event.target.value)}
                      className="bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      data-testid="alert-sound-select"
                    >
                      {alertSoundOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-gray-300">
                    Volume: {Math.round(alertVolume * 100)}%
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={alertVolume}
                      onChange={(event) => setAlertVolume(Number(event.target.value))}
                      className="accent-indigo-500"
                      data-testid="alert-volume-slider"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={previewAlertSound}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                    data-testid="alert-preview-button"
                  >
                    Preview Sound
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Choose a notification tone and volume that will play when a focus or break session ends.
                </p>
              </div>

              {completionAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-left"
                  role="status"
                  aria-live="polite"
                  data-testid="timer-completion-alert"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-emerald-300 font-semibold">Session Complete</p>
                      <p className="text-white mt-1">{completionAlert.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={dismissCompletionAlert}
                      className="text-gray-300 hover:text-white"
                      aria-label="Dismiss completion alert"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </Card>

            {/* Notes Section */}
            {/* Focus Workspace */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >

              {/* 🧠 BAG (MAIN AREA) */}
              <div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_0_40px_rgba(99,102,241,0.15)] min-h-[92vh] flex flex-col">

                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-white text-lg font-semibold">
                      Focus Notes
                    </h2>
                    <span className="text-xs text-gray-400">
                      Deep Work Mode
                    </span>
                  </div>

                  {/* Bag */}
                  <div className="flex-1 min-h-0">
                    <Bag />
                  </div>

                </div>
              </div>
            </motion.div>
          </div>

          {/* Today's Tasks */}
          <div className="lg:col-span-1">
            <Card className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.15)]'>

              <h2 className="text-xl font-bold text-white mb-4">Today's Planned Tasks</h2>
              {hasPlannedTasks && pendingPlannedTasks.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {pendingPlannedTasks.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-indigo-500/50 transition-all"
                      data-testid={`focus-task-${item.id}`}
                    >

                      <div className="flex items-start gap-2">
                        {/* Time */}
                        <div className="text-center min-w-[50px]">
                          <p className="text-xs text-indigo-400 font-semibold">{item.startTime}</p>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {item.title}
                          </h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getSourceBadge(item.source).color} inline-block mt-1`}>
                            {getSourceBadge(item.source).label}
                          </span>
                        </div>

                        {/* Completion Toggle */}
                        <button
                          onClick={() => toggleDailyPlanTaskCompletion(item.id)}
                          className={`p-2 rounded-lg transition-all flex-shrink-0 ${item.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
                            }`}
                          data-testid={`toggle-focus-task-${item.id}`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : !hasPlannedTasks ? (
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

              ) : hasPlannedTasks && pendingPlannedTasks.length == 0 && (
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
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusRoom;