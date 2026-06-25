import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'wisemind_focus_timer';

const MODE_DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const DEFAULT_STATE = {
  mode: 'work',
  pomodoroCount: 0,
  isActive: false,
  timeLeftSeconds: MODE_DURATIONS.work,
  endTimestamp: null,
};

const FocusContext = createContext();

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within FocusProvider');
  }
  return context;
};

const getDurationForMode = (mode) => MODE_DURATIONS[mode] ?? MODE_DURATIONS.work;

const loadPersistedState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_STATE;

    const parsed = JSON.parse(saved);
    const mode = parsed.mode ?? 'work';
    const pomodoroCount = parsed.pomodoroCount ?? 0;

    if (parsed.isActive && parsed.endTimestamp) {
      const remaining = Math.ceil((parsed.endTimestamp - Date.now()) / 1000);
      if (remaining > 0) {
        return {
          mode,
          pomodoroCount,
          isActive: true,
          timeLeftSeconds: remaining,
          endTimestamp: parsed.endTimestamp,
        };
      }
      let newMode = mode;
      let newPomodoroCount = pomodoroCount;
      let newTimeLeft = 0;

      if (mode === 'work') {
        newPomodoroCount += 1;
        if (newPomodoroCount % 4 === 0) {
          newMode = 'longBreak';
          newTimeLeft = MODE_DURATIONS.longBreak;
        } else {
          newMode = 'shortBreak';
          newTimeLeft = MODE_DURATIONS.shortBreak;
        }
      } else {
        newMode = 'work';
        newTimeLeft = MODE_DURATIONS.work;
      }

      return {
        mode: newMode,
        pomodoroCount: newPomodoroCount,
        isActive: false,
        timeLeftSeconds: newTimeLeft,
        endTimestamp: null,
        _expiredWhileAway: mode,
      };
    }

    return {
      mode,
      pomodoroCount,
      isActive: false,
      timeLeftSeconds: parsed.timeLeftSeconds ?? getDurationForMode(mode),
      endTimestamp: null,
    };
  } catch {
    return DEFAULT_STATE;
  }
};

const persistState = ({ mode, pomodoroCount, isActive, timeLeftSeconds, endTimestamp }) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ mode, pomodoroCount, isActive, timeLeftSeconds, endTimestamp })
  );
};

export const FocusProvider = ({ children }) => {
  const initial = loadPersistedState();
  const expiredMode = initial._expiredWhileAway;
  delete initial._expiredWhileAway;

  const [mode, setMode] = useState(initial.mode);
  const [pomodoroCount, setPomodoroCount] = useState(initial.pomodoroCount);
  const [isActive, setIsActive] = useState(initial.isActive);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(initial.timeLeftSeconds);
  const [endTimestamp, setEndTimestamp] = useState(initial.endTimestamp);

  const modeRef = useRef(mode);
  const pomodoroCountRef = useRef(pomodoroCount);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    pomodoroCountRef.current = pomodoroCount;
  }, [pomodoroCount]);

  useEffect(() => {
    persistState({ mode, pomodoroCount, isActive, timeLeftSeconds, endTimestamp });
  }, [mode, pomodoroCount, isActive, timeLeftSeconds, endTimestamp]);

  const applyTimerComplete = useCallback(() => {
    const currentMode = modeRef.current;
    const currentCount = pomodoroCountRef.current;

    setIsActive(false);
    setEndTimestamp(null);

    if (currentMode === 'work') {
      const newCount = currentCount + 1;
      setPomodoroCount(newCount);

      if (newCount % 4 === 0) {
        setMode('longBreak');
        setTimeLeftSeconds(MODE_DURATIONS.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeftSeconds(MODE_DURATIONS.shortBreak);
      }
    } else {
      setMode('work');
      setTimeLeftSeconds(MODE_DURATIONS.work);
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: currentMode === 'work' ? 'Time for a break!' : 'Time to work!',
      });
    }
  }, []);

  useEffect(() => {
    if (!isActive || !endTimestamp) return;

    const tick = () => {
      const remaining = Math.ceil((endTimestamp - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeftSeconds(0);
        applyTimerComplete();
      } else {
        setTimeLeftSeconds(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isActive, endTimestamp, applyTimerComplete]);

  useEffect(() => {
    if (expiredMode) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
          body: expiredMode === 'work' ? 'Time for a break!' : 'Time to work!',
        });
      }
    }
  }, [expiredMode]);

  const toggleTimer = useCallback(() => {
    if (isActive) {
      const remaining = endTimestamp
        ? Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000))
        : timeLeftSeconds;
      setTimeLeftSeconds(remaining);
      setIsActive(false);
      setEndTimestamp(null);
    } else {
      const remaining = timeLeftSeconds > 0 ? timeLeftSeconds : getDurationForMode(mode);
      setTimeLeftSeconds(remaining);
      setIsActive(true);
      setEndTimestamp(Date.now() + remaining * 1000);

      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [isActive, endTimestamp, timeLeftSeconds, mode]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setEndTimestamp(null);
    setTimeLeftSeconds(getDurationForMode(mode));
  }, [mode]);

  const switchMode = useCallback((newMode) => {
    setIsActive(false);
    setEndTimestamp(null);
    setMode(newMode);
    setTimeLeftSeconds(getDurationForMode(newMode));
  }, []);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;

  const value = {
    mode,
    pomodoroCount,
    isActive,
    minutes,
    seconds,
    toggleTimer,
    resetTimer,
    switchMode,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};
