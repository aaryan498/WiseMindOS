import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2, CalendarDays, LucideTrophy, Brain } from 'lucide-react';
import { useApp } from '../../store/AppContext';

import Card from '../../components/Card';
import Bag from '../../components/Bag';
import GradientButton from '../../components/GradientButton';

const FocusRoom = () => {
  const { dailyPlan, toggleDailyPlanTaskCompletion } = useApp();

  // Pomodoro Timer State Machine
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Intentional Countdown Timer Orchestration Core Engine
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(prev => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(prev => prev - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);

    if (mode === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);

      // Automated State Transitions logic check
      if (newCount % 4 === 0) {
        setMode('longBreak');
        setMinutes(15);
      } else {
        setMode('shortBreak');
        setMinutes(5);
      }
    } else {
      setMode('work');
      setMinutes(25);
    }
    setSeconds(0);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Workspace Notification Reset!', {
        body: mode === 'work' ? 'Time for an optimization break!' : 'Break finalized. Initialize deep work cycle!',
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    if (mode === 'work') setMinutes(25);
    else if (mode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setSeconds(0);
    if (newMode === 'work') setMinutes(25);
    else if (newMode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
  };

  // Performance Memoizations for Credentials Context
  const taskData = useMemo(() => {
    const todayPlanned = dailyPlan?.plannedTasks || [];
    return {
      todayPlanned,
      pendingPlanned: todayPlanned.filter(t => !t.completed).slice(0, 8),
      hasPlanned: todayPlanned.length > 0
    };
  }, [dailyPlan]);

  const modeMetadata = useMemo(() => {
    switch (mode) {
      case 'shortBreak':
        return { text: 'Short Break Buffer', color: 'from-emerald-600 to-teal-600 shadow-emerald-500/10' };
      case 'longBreak':
        return { text: 'Extended Rest Cycle', color: 'from-blue-600 to-indigo-600 shadow-indigo-500/10' };
      default:
        return { text: 'Deep Focus Execution', color: 'from-rose-600 to-orange-600 shadow-rose-500/10' };
    }
  }, [mode]);

  // Static badge stylistic mapping layout dictionary
  const sourceBadgeMap = {
    task: { label: 'Task', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    habit: { label: 'Habit', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    manual: { label: 'Manual', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' }
  };

  // Sub-view component layout routing pipeline
  const renderTasksSidebar = () => {
    const { hasPlanned, pendingPlanned } = taskData;

    if (hasPlanned && pendingPlanned.length > 0) {
      return (
        <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
          {pendingPlanned.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="p-3.5 bg-slate-900/40 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all flex items-start justify-between gap-3"
              data-testid={`focus-task-${item.id}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-xs text-indigo-400 font-mono font-bold pt-0.5 shrink-0">
                  {item.startTime}
                </span>
                <div className="min-w-0">
                  <h4 className={`text-sm font-medium tracking-wide truncate ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {item.title}
                  </h4>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border mt-2 inline-block ${
                    sourceBadgeMap[item.source]?.color || sourceBadgeMap.manual.color
                  }`}>
                    {sourceBadgeMap[item.source]?.label || sourceBadgeMap.manual.label}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleDailyPlanTaskCompletion(item.id)}
                className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  item.completed ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/5'
                }`}
                data-testid={`toggle-focus-task-${item.id}`}
              >
                <CheckCircle2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      );
    }

    if (!hasPlanned) {
      return (
        <Card className="bg-slate-950/40 border border-white/5 text-center py-8 px-4">
          <CalendarDays size={38} className="text-indigo-400 mx-auto mb-3 drop-shadow-[0_0_12px_rgba(99,102,241,0.3)]" />
          <h3 className="text-base font-bold text-slate-200 tracking-wide">Empty Routine Flow</h3>
          <p className="text-slate-400 text-xs mt-1.5 mb-5 leading-relaxed">No custom schedule parameters exist for today's index layout.</p>
          <Link to="/trackers/daily-tasks" className="block w-full">
            <GradientButton data-testid="plan-now-btn" className="w-full text-xs py-2.5">Allocate System Schedule</GradientButton>
          </Link>
        </Card>
      );
    }

    return (
      <Card className="bg-slate-950/40 border border-white/5 text-center py-8 px-4">
        <LucideTrophy size={38} className="text-amber-400 mx-auto mb-3 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse" />
        <h3 className="text-base font-bold text-slate-200 tracking-wide">Stack Tasks Completed!</h3>
        <p className="text-slate-400 text-xs mt-1.5 mb-5 leading-relaxed">Every localized schedule item allocation block has computed successfully.</p>
        <Link to="/trackers/daily-tasks" className="block w-full">
          <GradientButton data-testid="plan-now-btn" className="w-full text-xs py-2.5">Extend Strategy Buffer</GradientButton>
        </Link>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black pb-20 px-4 pt-6 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Dynamic Background Light Fields */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-rose-600 rounded-full blur-[130px] opacity-10 pointer-events-none"
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600 rounded-full blur-[130px] opacity-10 pointer-events-none"
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Core Section Workspace Header */}
        <div className="text-center mb-8 px-1">
          <motion.h1
            className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight mb-1.5"
            animate={{ textShadow: ["0px 0px 0px rgba(99,102,241,0)", "0px 0px 20px rgba(99,102,241,0.4)", "0px 0px 0px rgba(99,102,241,0)"] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Focus Room
          </motion.h1>
          <p className="text-slate-400 text-xs font-medium">Minimize multi-thread system alerts, lock deep execution parameters.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Visual Clock Countdown Interface Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl p-5 shadow-2xl shadow-black/40 text-center">
              
              {/* Context Mode Tab Selection Interface Links */}
              <div className="flex p-1 bg-slate-950/50 border border-white/5 rounded-xl max-w-sm mx-auto mb-6">
                {['work', 'shortBreak', 'longBreak'].map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      mode === m
                        ? m === 'work' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10' :
                          m === 'shortBreak' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' :
                          'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                    data-testid={`mode-${m}`}
                  >
                    {m === 'work' ? 'Work' : m === 'shortBreak' ? 'Short' : 'Long'}
                  </button>
                ))}
              </div>

              {/* Dynamic Countdown Display Wrapper */}
              <motion.div animate={{ scale: isActive ? [1, 1.01, 1] : 1 }} transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}>
                <div className={`bg-gradient-to-br shadow-xl ${modeMetadata.color} rounded-2xl p-8 md:p-12 mb-6 text-center select-none`}>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/70 bg-black/10 px-3 py-1 rounded-full border border-white/5">{modeMetadata.text}</span>
                  <div className="text-7xl md:text-8xl font-black font-mono tracking-tighter text-white mt-6 mb-4 drop-shadow-md" data-testid="timer-display">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <p className="text-xs font-semibold text-white/60 tracking-wide mt-2">
                    Cycles Finalized: <span className="text-white font-bold font-mono">{pomodoroCount}</span>
                  </p>
                </div>
              </motion.div>

              {/* Interactive Dashboard Engine Execution Keys */}
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={toggleTimer}
                  data-testid="timer-toggle"
                  className={`bg-gradient-to-r ${modeMetadata.color} hover:contrast-125 text-white px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2 text-base font-bold tracking-wide`}
                  aria-label={isActive ? "Pause active tracker clock" : "Initiate execution countdown loop"}
                >
                  {isActive ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} strokeWidth={2.5} />}
                  <span>{isActive ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={resetTimer}
                  data-testid="timer-reset"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-3.5 rounded-xl transition-all duration-200 hover:rotate-180 cursor-pointer border border-white/5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Flush counter boundaries to base configuration"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </Card>

            {/* Markdown Workspace Textarea Extension Module Container */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl rounded-2xl p-5 shadow-xl flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                  <h2 className="text-slate-200 text-sm font-bold tracking-wide flex items-center gap-2">
                    <Brain size={14} className="text-indigo-400" /> Focus Workspace Logs
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Isolation Layer Active</span>
                </div>
                <div className="flex-1 min-h-0">
                  <Bag />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Today's Tasks Tracking Sidebar Module Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl p-5 shadow-2xl shadow-black/40">
              <div className="mb-5">
                <h2 className="text-base font-bold text-slate-100 tracking-wide">Target Micro-Nodes</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Assigned schedules filtered for the active cycle</p>
              </div>
              {renderTasksSidebar()}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FocusRoom;