import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'wisemind_focus_timer';
const AUDIO_SETTINGS_KEY = 'wisemind_focus_audio_settings';

const MODE_DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const DEFAULT_AUDIO_SETTINGS = {
  alertSound: 'digitalChime',
  alertVolume: 0.7,
};

const ALERT_SOUND_OPTIONS = [
  { value: 'digitalChime', label: 'Digital Chime' },
  { value: 'softBell', label: 'Soft Bell' },
  { value: 'focusPing', label: 'Focus Ping' },
];

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

const loadAudioSettings = () => {
  try {
    const saved = localStorage.getItem(AUDIO_SETTINGS_KEY);
    if (!saved) return DEFAULT_AUDIO_SETTINGS;

    const parsed = JSON.parse(saved);
    return {
      alertSound: parsed.alertSound ?? DEFAULT_AUDIO_SETTINGS.alertSound,
      alertVolume:
        typeof parsed.alertVolume === 'number'
          ? Math.min(Math.max(parsed.alertVolume, 0), 1)
          : DEFAULT_AUDIO_SETTINGS.alertVolume,
    };
  } catch {
    return DEFAULT_AUDIO_SETTINGS;
  }
};

const playGeneratedAlert = (soundType, volume = 0.7) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audioContext = new AudioContext();
  const safeVolume = Math.min(Math.max(volume, 0), 1);

  const playTone = (frequency, startTime, duration, type = 'sine') => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
    gainNode.gain.linearRampToValueAtTime(safeVolume * 0.22, audioContext.currentTime + startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + duration);
  };

  if (soundType === 'softBell') {
    playTone(660, 0, 0.45, 'sine');
    playTone(880, 0.12, 0.5, 'sine');
  } else if (soundType === 'focusPing') {
    playTone(520, 0, 0.18, 'triangle');
    playTone(780, 0.22, 0.22, 'triangle');
    playTone(1040, 0.46, 0.25, 'triangle');
  } else {
    playTone(740, 0, 0.25, 'sine');
    playTone(980, 0.18, 0.28, 'sine');
  }

  setTimeout(() => audioContext.close(), 1200);
};

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
  const [alertSound, setAlertSound] = useState(() => loadAudioSettings().alertSound);
  const [alertVolume, setAlertVolume] = useState(() => loadAudioSettings().alertVolume);
  const [completionAlert, setCompletionAlert] = useState(null);

  const modeRef = useRef(mode);
  const pomodoroCountRef = useRef(pomodoroCount);
  const alertSoundRef = useRef(alertSound);
  const alertVolumeRef = useRef(alertVolume);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    pomodoroCountRef.current = pomodoroCount;
  }, [pomodoroCount]);

  useEffect(() => {
    alertSoundRef.current = alertSound;
  }, [alertSound]);

  useEffect(() => {
    alertVolumeRef.current = alertVolume;
  }, [alertVolume]);

  useEffect(() => {
    localStorage.setItem(
      AUDIO_SETTINGS_KEY,
      JSON.stringify({ alertSound, alertVolume })
    );
  }, [alertSound, alertVolume]);

  useEffect(() => {
    persistState({ mode, pomodoroCount, isActive, timeLeftSeconds, endTimestamp });
  }, [mode, pomodoroCount, isActive, timeLeftSeconds, endTimestamp]);

  const previewAlertSound = useCallback(() => {
    playGeneratedAlert(alertSoundRef.current, alertVolumeRef.current);
  }, []);

  const dismissCompletionAlert = useCallback(() => {
    setCompletionAlert(null);
  }, []);

  const applyTimerComplete = useCallback(() => {
    const currentMode = modeRef.current;
    const currentCount = pomodoroCountRef.current;
    const nextMode = currentMode === 'work'
      ? (currentCount + 1) % 4 === 0
        ? 'longBreak'
        : 'shortBreak'
      : 'work';

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

    playGeneratedAlert(alertSoundRef.current, alertVolumeRef.current);

    setCompletionAlert({
      completedMode: currentMode,
      nextMode,
      message: currentMode === 'work' ? 'Focus session complete. Time for a break!' : 'Break complete. Time to focus!',
    });

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
    setCompletionAlert(null);
    setTimeLeftSeconds(getDurationForMode(mode));
  }, [mode]);

  const switchMode = useCallback((newMode) => {
    setIsActive(false);
    setEndTimestamp(null);
    setCompletionAlert(null);
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
    alertSound,
    alertVolume,
    alertSoundOptions: ALERT_SOUND_OPTIONS,
    completionAlert,
    setAlertSound,
    setAlertVolume,
    previewAlertSound,
    dismissCompletionAlert,
    toggleTimer,
    resetTimer,
    switchMode,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};