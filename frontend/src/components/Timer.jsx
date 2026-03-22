import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Card from './Card';
import GradientButton from './GradientButton';

const Timer = ({ defaultMinutes = 25 }) => {
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Timer completed
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30" data-testid="timer-widget">
      <div className="text-center">
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => switchMode('focus')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
            data-testid="timer-focus-btn"
          >
            Focus (25m)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'break'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
            data-testid="timer-break-btn"
          >
            Break (5m)
          </button>
        </div>

        <div className="text-6xl font-bold text-white mb-6" data-testid="timer-display">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={toggleTimer}
            data-testid="timer-toggle-btn"
            className="p-4 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors"
          >
            {isRunning ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white" />}
          </button>
          <button
            onClick={resetTimer}
            data-testid="timer-reset-btn"
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
          >
            <RotateCcw size={24} className="text-white" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Timer;