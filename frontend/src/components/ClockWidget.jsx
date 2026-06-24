import { useState, useEffect, useMemo } from 'react';
import { format, getHours } from 'date-fns';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TIME_FORMAT_STORAGE_KEY = 'wisemindos-clock-time-format';

const normalizeTimeZone = (timeZone) =>
  timeZone === 'Asia/Calcutta' ? 'Asia/Kolkata' : timeZone;

const getTimezoneInfo = (date) => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  const offsetParts = new Intl.DateTimeFormat(undefined, {
    timeZoneName: 'shortOffset',
  }).formatToParts(date);
  const offset = offsetParts.find((p) => p.type === 'timeZoneName')?.value ?? '';

  return { timeZone: normalizeTimeZone(timeZone), offset };
};

const getInitialTimeFormat = () => {
  if (typeof window === 'undefined') return '24h';

  const savedFormat = window.localStorage.getItem(TIME_FORMAT_STORAGE_KEY);
  return savedFormat === '12h' || savedFormat === '24h' ? savedFormat : '24h';
};

const ClockWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeFormat, setTimeFormat] = useState(getInitialTimeFormat);

  useEffect(() => {
    const tick = () => setCurrentTime(new Date());

    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('focus', tick);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('focus', tick);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(TIME_FORMAT_STORAGE_KEY, timeFormat);
  }, [timeFormat]);

  const { timeZone, offset } = useMemo(
    () => getTimezoneInfo(currentTime),
    [currentTime]
  );

  const isTwelveHourFormat = timeFormat === '12h';
  const hourFormat = isTwelveHourFormat ? 'hh' : 'HH';
  const periodLabel = isTwelveHourFormat ? format(currentTime, 'a') : null;

  const dateTimeLabel = `${format(currentTime, 'EEEE, MMMM dd, yyyy')} • ${timeZone}${offset ? ` (${offset})` : ''}`;

  const toggleTimeFormat = () => {
    setTimeFormat((prevFormat) => (prevFormat === '24h' ? '12h' : '24h'));
  };

  const getGreeting = () => {
    const hour = getHours(currentTime);
    if (hour < 12) return 'Good Morning, time for deep work';
    if (hour < 18) return 'Good Afternoon, stay focused';
    return 'Good Evening, wrap up your day';
  };

  const seconds = currentTime.getSeconds();
  const progress = (seconds / 60) * 100;
  const circumference = 377;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-br from-[#0f1015]/80 to-indigo-950/30 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-2xl overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="flex flex-col items-center md:items-start z-10 mb-6 md:mb-0">
        <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-1">
          {getGreeting()}
        </h3>
        <p className="text-gray-400 text-sm flex items-start gap-2 text-center md:text-left max-w-full">
          <Clock size={14} className="text-indigo-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed break-words">{dateTimeLabel}</span>
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 shadow-inner backdrop-blur-md">
          {['12h', '24h'].map((formatOption) => {
            const isActive = timeFormat === formatOption;

            return (
              <button
                key={formatOption}
                type="button"
                onClick={() => setTimeFormat(formatOption)}
                aria-pressed={isActive}
                className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-[0_0_18px_rgba(99,102,241,0.55)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {formatOption}
              </button>
            );
          })}
          <button
            type="button"
            onClick={toggleTimeFormat}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:text-white hover:bg-indigo-500/20 transition-all duration-300"
            aria-label={`Switch to ${isTwelveHourFormat ? '24-hour' : '12-hour'} time format`}
          >
            Toggle
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center z-10">
        <svg className="absolute w-36 h-36 -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="3"
          />
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="url(#clock-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="clock-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex flex-col items-center justify-center w-28 h-28 bg-black/40 rounded-full shadow-[inset_0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md border border-white/5 relative">
          <div className="flex items-baseline text-white drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]">
            <span className="text-4xl font-black tracking-tighter">
              {format(currentTime, hourFormat)}
            </span>
            <motion.span
              className="text-2xl text-indigo-400 mx-0.5 mb-2"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
              :
            </motion.span>
            <span className="text-4xl font-black tracking-tighter">
              {format(currentTime, 'mm')}
            </span>
          </div>

          <span className="text-[9px] text-indigo-300/70 font-semibold tracking-[0.2em] uppercase mt-1">
            {format(currentTime, 'ss')} SEC{periodLabel ? ` • ${periodLabel}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClockWidget;