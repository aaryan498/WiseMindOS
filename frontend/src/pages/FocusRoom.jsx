import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import TaskItem from '../components/TaskItem';

const FocusRoom = () => {
  const { tasks, toggleTaskCompletion, deleteTask } = useApp();
  
  // Pomodoro Timer State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  // Notes State
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('wisemind_focus_notes');
    return saved || '';
  });

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  useEffect(() => {
    localStorage.setItem('wisemind_focus_notes', notes);
  }, [notes]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (mode === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      // After 4 pomodoros, long break
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
    
    // Play notification sound (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to work!',
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    
    // Request notification permission
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

  const todayTasks = tasks.filter(t => !t.completed).slice(0, 5);

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

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Focus Room</h1>
          <p className="text-gray-400">Minimize distractions, maximize productivity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <Card className="text-center">
              {/* Mode Selector */}
              <div className="flex justify-center gap-2 mb-6">
                <button
                  onClick={() => switchMode('work')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    mode === 'work'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  data-testid="mode-work"
                >
                  Work
                </button>
                <button
                  onClick={() => switchMode('shortBreak')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    mode === 'shortBreak'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  data-testid="mode-short-break"
                >
                  Short Break
                </button>
                <button
                  onClick={() => switchMode('longBreak')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    mode === 'longBreak'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  data-testid="mode-long-break"
                >
                  Long Break
                </button>
              </div>

              {/* Timer Display */}
              <div className={`bg-gradient-to-r ${getModeColor()} rounded-2xl p-12 mb-6`}>
                <p className="text-white text-xl mb-4">{getModeText()}</p>
                <div className="text-8xl font-bold text-white mb-4" data-testid="timer-display">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <p className="text-white/80 text-sm">Pomodoros completed: {pomodoroCount}</p>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  data-testid="timer-toggle"
                  className={`bg-gradient-to-r ${getModeColor()} hover:opacity-90 text-white px-8 py-4 rounded-xl transition-all flex items-center gap-2 text-lg font-semibold`}
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
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl transition-all"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            </Card>

            {/* Notes Section */}
            <Card className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Focus Notes</h2>
                {notes && (
                  <button
                    onClick={() => setNotes('')}
                    className="text-gray-400 hover:text-gray-300 text-sm"
                    data-testid="clear-notes"
                  >
                    <X size={18} className="inline" /> Clear
                  </button>
                )}
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your thoughts, ideas, or focus notes here..."
                data-testid="focus-notes"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] resize-none"
              />
            </Card>
          </div>

          {/* Today's Tasks */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-bold text-white mb-4">Today's Tasks</h2>
              {todayTasks.length > 0 ? (
                <div className="space-y-3">
                  {todayTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTaskCompletion}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No pending tasks</p>
                  <p className="text-sm text-gray-500 mt-2">Great job! 🎉</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusRoom;