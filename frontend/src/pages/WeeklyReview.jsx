import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Activity, ArrowLeft, ArrowRight, BarChart3, BookOpen,
    CheckCircle2, Flame, Lightbulb, Pencil, RefreshCw, Send,
    Star, Target, Trash2, TrendingUp, CalendarDays, Clock
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bar, BarChart, Cell, RadialBar, RadialBarChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from 'recharts';
import { retrospectiveAPI, statsAPI } from '../api/apiService';
import { useApp } from '../store/AppContext';
import { showToast } from '../utils/toastHelper';

// ─── constants ───────────────────────────────────────────────────────────────
const GUIDED_PROMPTS = [
    {
        id: 'went_well',
        question: 'What went well this week?',
        placeholder: 'Describe your wins, no matter how small...',
        icon: <Star size={18} />,
        accent: 'indigo'
    },
    {
        id: 'bottleneck',
        question: 'What was the main bottleneck or challenge?',
        placeholder: 'What slowed you down or blocked your progress?',
        icon: <Lightbulb size={18} />,
        accent: 'amber'
    },
    {
        id: 'next_week',
        question: 'What will you do differently next week?',
        placeholder: 'One concrete change or intention for the coming week...',
        icon: <TrendingUp size={18} />,
        accent: 'emerald'
    },
    {
        id: 'gratitude',
        question: 'What are you most grateful for this week?',
        placeholder: 'Reflect on something that brought you energy or meaning...',
        icon: <Flame size={18} />,
        accent: 'rose'
    }
];

const ACCENT_MAP = {
    indigo: { ring: 'ring-indigo-500/50', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', grad: 'from-indigo-600 to-violet-600' },
    amber:  { ring: 'ring-amber-500/50',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/30',  grad: 'from-amber-500 to-orange-500' },
    emerald:{ ring: 'ring-emerald-500/50',bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/30',grad: 'from-emerald-500 to-teal-500' },
    rose:   { ring: 'ring-rose-500/50',   bg: 'bg-rose-500/10',   text: 'text-rose-400',   border: 'border-rose-500/30',   grad: 'from-rose-500 to-pink-500' }
};

const STEPS = ['metrics', 'prompts', 'rating', 'done'];

// ─── helpers ─────────────────────────────────────────────────────────────────
const getWeekBounds = () => {
    const now  = new Date();
    const day  = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const fmtShort = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const fmtFull = (d) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const isToday = (date) => {
    if (!date) return false;
    const d = new Date(date);
    return !isNaN(d.getTime()) &&
        d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
};

// ─── sub-components ──────────────────────────────────────────────────────────
const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}>
        {children}
    </div>
);

const MetricPill = ({ icon, label, value, accent = 'indigo' }) => {
    const a = ACCENT_MAP[accent];
    return (
        <div className={`flex items-center gap-3 ${a.bg} border ${a.border} rounded-xl px-4 py-3`}>
            <span className={a.text}>{icon}</span>
            <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-white font-bold text-lg leading-tight">{value}</p>
            </div>
        </div>
    );
};

const StepIndicator = ({ current }) => (
    <div className="flex items-center justify-center gap-3 mb-8">
        {STEPS.map((s, i) => {
            const idx = STEPS.indexOf(current);
            const done   = i < idx;
            const active = i === idx;
            return (
                <div key={s} className="flex items-center gap-3">
                    <Motion.div
                        animate={active ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 0.8, repeat: active ? Infinity : 0 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            done   ? 'bg-indigo-600 text-white' :
                            active ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-2 ring-indigo-400/50 ring-offset-2 ring-offset-gray-950' :
                                     'bg-white/10 text-gray-500'
                        }`}
                    >
                        {done ? <CheckCircle2 size={14} /> : i + 1}
                    </Motion.div>
                    {i < STEPS.length - 1 && (
                        <div className={`w-10 h-px transition-all duration-500 ${i < idx ? 'bg-indigo-500' : 'bg-white/10'}`} />
                    )}
                </div>
            );
        })}
    </div>
);

// ─── main component ───────────────────────────────────────────────────────────
const WeeklyReview = () => {
    const navigate = useNavigate();
    const {
        tasks, habits, goals, dailyPlan,
        calculateGoalProgress
    } = useApp();

    const { start: weekStart, end: weekEnd } = useMemo(getWeekBounds, []);

    // ── fetch weekly stats ───────────────────────────────────────────────────
    const [weeklyStats, setWeeklyStats]   = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [step, setStep]   = useState('metrics');
    const [answers, setAnswers]   = useState({});
    const [rating, setRating] = useState(7);
    const [submitting, setSubmitting] = useState(false);
    const [retros, setRetros]   = useState([]);
    const [retrosLoading, setRetrosLoading] = useState(true);
    const [historyView, setHistoryView] = useState(false);
    const [expandedRetro, setExpandedRetro] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        const load = async () => {
            setStatsLoading(true);
            try {
                const res = await statsAPI.getWeekly();
                if (res.success) {
                    const fmt = res.data.map(item => ({
                        date: new Date(item.date).toISOString().split('T')[0],
                        name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
                        productivity: item.productivity,
                        discipline:   item.discipline
                    }));
                    setWeeklyStats(fmt);
                }
            } catch (e) {
                console.error('Stats fetch failed:', e);
            } finally {
                setStatsLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const loadRetros = async () => {
            setRetrosLoading(true);
            try {
                const res = await retrospectiveAPI.getAll();
                if (res.success) setRetros(res.retrospectives);
            } catch (e) {
                console.error('Retros fetch failed:', e);
            } finally {
                setRetrosLoading(false);
            }
        };
        loadRetros();
    }, []);

    // ── derived metrics ──────────────────────────────────────────────────────
    const metrics = useMemo(() => {
        const completedTasks   = tasks.filter(t => t.completed).length;
        const totalTasks       = tasks.length;
        const completedHabits  = habits.filter(h => isToday(h.lastCompleted)).length;
        const totalHabits      = habits.length;
        const avgProd = weeklyStats.length
            ? Math.round(weeklyStats.reduce((s, d) => s + d.productivity, 0) / weeklyStats.length)
            : 0;
        const avgDisc = weeklyStats.length
            ? Math.round(weeklyStats.reduce((s, d) => s + d.discipline, 0) / weeklyStats.length)
            : 0;

        return {
            habitsCompleted:    completedHabits,
            totalHabits,
            tasksCompleted:     completedTasks,
            totalTasks,
            avgProductivity:    avgProd,
            avgDiscipline:      avgDisc,
            focusSessionsCount: 0,
            goalsCount:         goals.length
        };
    }, [tasks, habits, goals, weeklyStats]);

    const chartData = useMemo(() => weeklyStats.map(d => ({
        ...d,
        avg: Math.round((d.productivity + d.discipline) / 2)
    })), [weeklyStats]);

    const radialData = useMemo(() => [
        { name: 'Productivity', value: metrics.avgProductivity, fill: '#6366f1' },
        { name: 'Discipline',   value: metrics.avgDiscipline,   fill: '#10b981' },
    ], [metrics]);

    // ── handlers ─────────────────────────────────────────────────────────────
    const handleAnswer = useCallback((id, val) => {
        setAnswers(prev => ({ ...prev, [id]: val }));
    }, []);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const responses = GUIDED_PROMPTS.map(p => ({
                question: p.question,
                answer:   answers[p.id] || ''
            }));

            const res = await retrospectiveAPI.create({
                weekStartDate:  weekStart.toISOString(),
                weekEndDate:    weekEnd.toISOString(),
                metricsSummary: metrics,
                responses,
                overallRating:  rating
            });

            if (res.success) {
                setRetros(prev => [res.retrospective, ...prev]);
                showToast({ message: '✅ Retrospective saved to your Library!', status: 'success' });
                setStep('done');
            } else {
                showToast({ message: res.message || 'Failed to save', status: 'error' });
            }
        } catch (e) {
            showToast({ message: e.message || 'Error saving retrospective', status: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRetro = async (retroId) => {
        setDeleting(retroId);
        try {
            const res = await retrospectiveAPI.delete(retroId);
            if (res.success) {
                setRetros(res.retrospectives);
                if (expandedRetro === retroId) setExpandedRetro(null);
                showToast({ message: 'Retrospective deleted', status: 'success' });
            } else {
                showToast({ message: res.message || 'Failed to delete', status: 'error' });
            }
        } catch (e) {
            showToast({ message: e.message || 'Error deleting', status: 'error' });
        } finally {
            setDeleting(null);
        }
    };

    // ── custom chart tooltip ─────────────────────────────────────────────────
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-gray-900/90 backdrop-blur border border-white/10 rounded-xl p-3 text-xs shadow-xl">
                <p className="text-gray-400 mb-1 font-semibold">{label}</p>
                {payload.map(p => (
                    <p key={p.dataKey} style={{ color: p.color }} className="font-bold">
                        {p.name}: {p.value}%
                    </p>
                ))}
            </div>
        );
    };

    // ── render step: metrics ─────────────────────────────────────────────────
    const renderMetrics = () => (
        <Motion.div
            key="metrics"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Your Week in Review
                </h2>
                <p className="text-gray-400 text-sm">
                    {fmtFull(weekStart)} &rarr; {fmtShort(weekEnd)}
                </p>
            </div>

            {/* Metric pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <MetricPill icon={<Activity size={16} />} label="Habits Done" value={`${metrics.habitsCompleted}/${metrics.totalHabits}`} accent="emerald" />
                <MetricPill icon={<CheckCircle2 size={16} />} label="Tasks Done"  value={`${metrics.tasksCompleted}/${metrics.totalTasks}`}   accent="indigo" />
                <MetricPill icon={<Target size={16} />}       label="Goals"       value={metrics.goalsCount}                                    accent="amber" />
                <MetricPill icon={<BarChart3 size={16} />}    label="Avg Focus"   value={`${metrics.avgProductivity}%`}                         accent="rose" />
            </div>

            {/* Charts */}
            {statsLoading ? (
                <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
                    <RefreshCw size={18} className="animate-spin mr-2" /> Loading analytics...
                </div>
            ) : chartData.length > 0 ? (
                <div className="grid md:grid-cols-5 gap-6 mb-6">
                    {/* Bar Chart – 5 cols */}
                    <GlassCard className="md:col-span-3 p-4">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            Daily Productivity & Discipline
                        </p>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
                                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                <Bar dataKey="productivity" name="Productivity" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={20} />
                                <Bar dataKey="discipline"   name="Discipline"   fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </GlassCard>

                    {/* Radial chart – 2 cols */}
                    <GlassCard className="md:col-span-2 p-4 flex flex-col items-center justify-center">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                            Weekly Averages
                        </p>
                        <ResponsiveContainer width="100%" height={160}>
                            <RadialBarChart
                                cx="50%" cy="50%"
                                innerRadius={35} outerRadius={70}
                                data={radialData}
                                startAngle={90} endAngle={-270}
                            >
                                <RadialBar dataKey="value" cornerRadius={8} />
                                <Tooltip content={<CustomTooltip />} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="flex gap-4 mt-1">
                            {radialData.map(d => (
                                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                                    {d.name}: <span className="text-white font-bold">{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            ) : (
                <GlassCard className="p-6 mb-6 text-center text-gray-500 text-sm">
                    No weekly analytics data yet — complete tasks in your Daily Planner to generate insights.
                </GlassCard>
            )}

            <div className="flex justify-end">
                <button
                    onClick={() => setStep('prompts')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                    Start Reflection <ArrowRight size={18} />
                </button>
            </div>
        </Motion.div>
    );

    // ── render step: prompts ─────────────────────────────────────────────────
    const renderPrompts = () => (
        <Motion.div
            key="prompts"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Guided Reflection</h2>
                <p className="text-gray-400 text-sm">Answer at your own pace — there are no wrong answers.</p>
            </div>

            <div className="space-y-6 mb-8">
                {GUIDED_PROMPTS.map((p, i) => {
                    const a = ACCENT_MAP[p.accent];
                    return (
                        <Motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <GlassCard className="p-5 hover:border-white/20 transition-colors duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${a.bg} border ${a.border} ${a.text}`}>
                                        {p.icon}
                                    </div>
                                    <p className="text-white font-semibold text-sm">{p.question}</p>
                                </div>
                                <textarea
                                    id={`prompt-${p.id}`}
                                    value={answers[p.id] || ''}
                                    onChange={e => handleAnswer(p.id, e.target.value)}
                                    placeholder={p.placeholder}
                                    rows={3}
                                    className={`w-full bg-white/5 text-gray-200 text-sm placeholder-gray-600 rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 ${a.ring} resize-none transition-all duration-200`}
                                />
                            </GlassCard>
                        </Motion.div>
                    );
                })}
            </div>

            <div className="flex justify-between">
                <button
                    onClick={() => setStep('metrics')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-semibold cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={() => setStep('rating')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                    Rate Your Week <ArrowRight size={18} />
                </button>
            </div>
        </Motion.div>
    );

    // ── render step: rating ─────────────────────────────────────────────────
    const renderRating = () => {
        const stars = Array.from({ length: 10 }, (_, i) => i + 1);
        return (
            <Motion.div
                key="rating"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
            >
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Rate Your Focus</h2>
                    <p className="text-gray-400 text-sm">How focused and productive did this week feel overall?</p>
                </div>

                <GlassCard className="p-8 mb-8 text-center">
                    {/* Big rating display */}
                    <Motion.div
                        key={rating}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-300 mb-6 tabular-nums"
                    >
                        {rating}
                        <span className="text-3xl text-gray-500">/10</span>
                    </Motion.div>

                    {/* Star buttons */}
                    <div className="flex justify-center gap-2 flex-wrap">
                        {stars.map(n => (
                            <Motion.button
                                key={n}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setRating(n)}
                                id={`rating-${n}`}
                                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer border ${
                                    n <= rating
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-400/50 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                                        : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'
                                }`}
                            >
                                {n}
                            </Motion.button>
                        ))}
                    </div>

                    {/* Contextual label */}
                    <p className="mt-6 text-gray-400 text-sm">
                        {rating <= 3 ? '😔 Tough week — be kind to yourself.'
                         : rating <= 5 ? '😐 Decent week with room to grow.'
                         : rating <= 7 ? '😊 Solid week, keep up the momentum!'
                         : rating <= 9 ? '🔥 Great week, you crushed it!'
                         : '🏆 Perfect week — legendary focus!'}
                    </p>
                </GlassCard>

                <div className="flex justify-between">
                    <button
                        onClick={() => setStep('prompts')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-semibold cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {submitting ? (
                            <><RefreshCw size={16} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Send size={16} /> Archive to Library</>
                        )}
                    </button>
                </div>
            </Motion.div>
        );
    };

    // ── render step: done ────────────────────────────────────────────────────
    const renderDone = () => (
        <Motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
        >
            <Motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-6xl mb-6"
            >
                🎉
            </Motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">Retrospective Complete!</h2>
            <p className="text-gray-400 mb-2">
                Your weekly reflection has been saved and archived in your{' '}
                <span className="text-indigo-400 font-semibold">Retrospectives</span> notebook.
            </p>
            <p className="text-gray-500 text-sm mb-8">
                Keep showing up — consistency compounds. 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    to="/library"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.03]"
                >
                    <BookOpen size={18} /> View in Library
                </Link>
                <button
                    onClick={() => setHistoryView(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-semibold cursor-pointer"
                >
                    <Clock size={18} /> Past Retrospectives
                </button>
            </div>
        </Motion.div>
    );

    // ── history view ─────────────────────────────────────────────────────────
    const renderHistory = () => (
        <Motion.div
            key="history"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => setHistoryView(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all cursor-pointer"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-white">Past Retrospectives</h2>
                    <p className="text-gray-400 text-xs mt-0.5">{retros.length} entries archived</p>
                </div>
            </div>

            {retrosLoading ? (
                <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
                    <RefreshCw size={18} className="animate-spin mr-2" /> Loading...
                </div>
            ) : retros.length === 0 ? (
                <GlassCard className="p-10 text-center">
                    <Pencil size={36} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 font-semibold">No retrospectives yet</p>
                    <p className="text-gray-600 text-sm mt-1">Complete your first weekly review to see it here.</p>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    {retros.map((r) => {
                        const isExpanded = expandedRetro === r._id;
                        const taskRate  = r.metricsSummary?.totalTasks > 0
                            ? Math.round((r.metricsSummary.tasksCompleted / r.metricsSummary.totalTasks) * 100)
                            : 0;
                        const habitRate = r.metricsSummary?.totalHabits > 0
                            ? Math.round((r.metricsSummary.habitsCompleted / r.metricsSummary.totalHabits) * 100)
                            : 0;

                        return (
                            <Motion.div
                                key={r._id}
                                layout
                                className="group"
                            >
                                <GlassCard className="hover:border-white/20 transition-all duration-300 overflow-hidden">
                                    {/* Header row */}
                                    <button
                                        onClick={() => setExpandedRetro(isExpanded ? null : r._id)}
                                        className="w-full text-left p-4 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                                    <CalendarDays size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">
                                                        {fmtShort(r.weekStartDate)} – {fmtShort(r.weekEndDate)}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        Rating: <span className="text-indigo-400 font-bold">{r.overallRating}/10</span>
                                                        &nbsp;·&nbsp; Tasks: {taskRate}%
                                                        &nbsp;·&nbsp; Habits: {habitRate}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    id={`delete-retro-${r._id}`}
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteRetro(r._id); }}
                                                    disabled={deleting === r._id}
                                                    className="p-1.5 rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-30"
                                                >
                                                    {deleting === r._id
                                                        ? <RefreshCw size={14} className="animate-spin" />
                                                        : <Trash2 size={14} />}
                                                </button>
                                                <Motion.div
                                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-gray-500"
                                                >
                                                    <ArrowRight size={16} />
                                                </Motion.div>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <Motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="border-t border-white/10 px-4 py-4 space-y-4">
                                                    {r.responses?.map((resp, i) => (
                                                        <div key={i}>
                                                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-1">
                                                                {resp.question}
                                                            </p>
                                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                                {resp.answer || <span className="text-gray-600 italic">No answer provided.</span>}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Motion.div>
                                        )}
                                    </AnimatePresence>
                                </GlassCard>
                            </Motion.div>
                        );
                    })}
                </div>
            )}
        </Motion.div>
    );

    // ── main render ──────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-24 px-3 sm:px-4 pt-6 relative overflow-hidden">
            {/* Ambient blobs */}
            <Motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10 pointer-events-none"
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 12, repeat: Infinity }}
            />
            <Motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10 pointer-events-none"
                animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                transition={{ duration: 14, repeat: Infinity }}
            />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Page header */}
                <Motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all"
                            aria-label="Back to dashboard"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">Weekly Retrospective</h1>
                            <p className="text-gray-500 text-xs">
                                {fmtShort(weekStart)} – {fmtShort(weekEnd)}
                            </p>
                        </div>
                    </div>

                    {!historyView && step !== 'done' && (
                        <button
                            onClick={() => setHistoryView(true)}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-indigo-500/30 cursor-pointer"
                        >
                            <Clock size={14} /> History
                        </button>
                    )}
                </Motion.div>

                {/* Step indicator (only during wizard) */}
                {!historyView && (
                    <StepIndicator current={step} />
                )}

                {/* Main card */}
                <GlassCard className="p-5 md:p-8 shadow-[0_0_60px_rgba(99,102,241,0.1)]">
                    <AnimatePresence mode="wait">
                        {historyView ? renderHistory() :
                         step === 'metrics' ? renderMetrics() :
                         step === 'prompts' ? renderPrompts() :
                         step === 'rating'  ? renderRating()  :
                         renderDone()}
                    </AnimatePresence>
                </GlassCard>
            </div>
        </div>
    );
};

export default WeeklyReview;
