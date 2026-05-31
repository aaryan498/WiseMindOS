import React, { useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Calendar, TrendingUp, Zap, CheckCircle, Flame, Target, Award, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import { 
  weeklyProductivityData, 
  habitCompletionData, 
  timeDistributionData, 
  monthlyProgressData 
} from '../data/mockData';

const Reports = () => {
  // Cohesive premium design token palette mapping
  const BRAND_COLORS = useMemo(() => ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc'], []);

  // Shared reusable premium Tooltip template configuration for Recharts
  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-white/10 backdrop-blur-xl shadow-2xl rounded-xl p-3 select-none">
          {label && <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">{label}</p>}
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              <span>{item.name}:</span>
              <span className="text-indigo-400 font-mono font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black pb-20 px-4 pt-6 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Decorative Ambient Radials */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Main Dashboard Header */}
        <div className="mb-6 px-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">Analytics & Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">Visualize your productivity, trends, and discipline architecture</p>
        </div>

        {/* Operational Metrics Performance Summary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl shadow-black/20 p-4.5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">// Weekly Avg</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"><Zap size={15} /></span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight">78%</h3>
            </div>
            <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1 mt-3">
              <span>↑ 12%</span> <span className="text-slate-500 font-normal">from last cycle</span>
            </p>
          </Card>
          
          <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl shadow-black/20 p-4.5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">// Habits Hit</span>
                <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400"><CheckCircle size={15} /></span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight">42</h3>
            </div>
            <p className="text-emerald-400 text-xs font-semibold mt-3">
              Completed <span className="text-slate-500 font-normal">this week</span>
            </p>
          </Card>
          
          <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl shadow-black/20 p-4.5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">// Active Streak</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400"><Flame size={15} className="fill-amber-500/10" /></span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight flex items-center gap-1">
                15 <span className="text-sm font-normal text-amber-400 animate-pulse">🔥</span>
              </h3>
            </div>
            <p className="text-slate-400 text-xs font-medium mt-3">Consecutive Days</p>
          </Card>
          
          <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-xl shadow-black/20 p-4.5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">// Goals Track</span>
                <span className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400"><Target size={15} /></span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight">65%</h3>
            </div>
            <p className="text-amber-400 text-xs font-semibold mt-3">3 Active Objectives</p>
          </Card>
        </div>

        {/* Weekly Micro-Analytics View Wrapper */}
        <Card className="mb-6 bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 p-5">
          <div className="flex items-center gap-2.5 mb-6 border-b border-white/5 pb-4">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"><Calendar size={18} /></span>
            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-wide">Weekly Sync Module</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Micro-trend data for the ongoing execution block</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Productivity Line Chart */}
            <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4">
              <h4 className="text-sm font-bold text-slate-400 tracking-wide mb-4">// Productivity Trend</h4>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={weeklyProductivityData} margin={{ right: 5, left: -25 }}>
                  <XAxis dataKey="name" stroke="#475569" style={{ fontSize: '11px', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" style={{ fontSize: '11px', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip content={renderCustomTooltip} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
                  <Line 
                    type="monotone" 
                    dataKey="productivity" 
                    name="Productivity"
                    stroke="#6366f1" 
                    strokeWidth={2.5}
                    dot={{ fill: '#6366f1', stroke: '#000', strokeWidth: 1.5, r: 4 }}
                    activeDot={{ fill: '#818cf8', stroke: '#fff', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Habit Completion Bar Chart */}
            <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4">
              <h4 className="text-sm font-bold text-slate-400 tracking-wide mb-4">// Habit Completion Rate</h4>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={habitCompletionData} margin={{ right: 5, left: -25 }}>
                  <XAxis dataKey="name" stroke="#475569" style={{ fontSize: '11px', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" style={{ fontSize: '11px', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip content={renderCustomTooltip} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="completion" name="Completion Rate" radius={[5, 5, 5, 5]} barSize={12}>
                    {habitCompletionData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={BRAND_COLORS[idx % BRAND_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Monthly Core Matrix Summary Block */}
        <Card className="mb-6 bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 p-5">
          <div className="flex items-center gap-2.5 mb-6 border-b border-white/5 pb-4">
            <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400"><TrendingUp size={18} /></span>
            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-wide">Monthly Progress Analytics</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Macro-level structural metric tracking</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Progress Line Chart */}
            <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4">
              <h3 className="text-sm font-bold text-slate-400 tracking-wide mb-4">// Progress Over Time</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyProgressData} margin={{ right: 5, left: -25 }}>
                  <XAxis dataKey="name" stroke="#475569" style={{ fontSize: '11px', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" style={{ fontSize: '11px', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip content={renderCustomTooltip} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    name="Macro Progress"
                    stroke="#a855f7" 
                    strokeWidth={2.5}
                    dot={{ fill: '#a855f7', stroke: '#000', strokeWidth: 1.5, r: 4 }}
                    activeDot={{ fill: '#c084fc', stroke: '#fff', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Time Distribution Pie Chart */}
            <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-slate-400 tracking-wide mb-2">// Time Resource Distribution</h3>
              <div className="flex-1 min-h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={75}
                      innerRadius={45}
                      padAngle={3}
                      dataKey="value"
                    >
                      {timeDistributionData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={BRAND_COLORS[idx % BRAND_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        {/* Key System Insights List Footer */}
        <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-xl shadow-2xl p-5">
          <h2 className="text-base font-bold text-slate-200 tracking-wide mb-4">// System Insights Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex gap-3">
              <Award className="text-emerald-400 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-emerald-400 text-sm font-bold tracking-wide mb-1.5">Identified Strengths</p>
                <ul className="text-slate-400 space-y-1.5 text-xs font-medium leading-relaxed">
                  <li>• Consistent meditation practice maintained at <span className="text-emerald-400 font-bold">90%</span> completion boundary</li>
                  <li>• Optimized productivity scores during weekend blocks</li>
                  <li>• Active 15-day streak maintained on core goal nodes</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-3">
              <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-amber-400 text-sm font-bold tracking-wide mb-1.5">Areas for Tuning</p>
                <ul className="text-slate-400 space-y-1.5 text-xs font-medium leading-relaxed">
                  <li>• Core study allocation metrics dropped below expected target on Wed</li>
                  <li>• Reading habits require focus; currently trailing at 70% threshold</li>
                  <li>• Mid-week compilation dip detected across dynamic trackers</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;