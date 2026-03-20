import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import { weeklyProductivityData, habitCompletionData, timeDistributionData, monthlyProgressData } from '../data/mockData';

const Reports = () => {
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc'];

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Analytics & Reports</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/30">
            <p className="text-gray-400 text-sm mb-1">Weekly Avg</p>
            <p className="text-3xl font-bold text-white">78%</p>
            <p className="text-green-400 text-sm mt-1">+12% from last week</p>
          </Card>
          
          <Card className="bg-gradient-to-br from-violet-900/30 to-violet-800/30">
            <p className="text-gray-400 text-sm mb-1">Habits Completed</p>
            <p className="text-3xl font-bold text-white">42</p>
            <p className="text-green-400 text-sm mt-1">This week</p>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30">
            <p className="text-gray-400 text-sm mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-white">15 🔥</p>
            <p className="text-gray-400 text-sm mt-1">Days</p>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-900/30 to-pink-800/30">
            <p className="text-gray-400 text-sm mb-1">Goals Progress</p>
            <p className="text-3xl font-bold text-white">65%</p>
            <p className="text-yellow-400 text-sm mt-1">3 active goals</p>
          </Card>
        </div>

        {/* Weekly Summary */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-indigo-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Weekly Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Productivity Line Chart */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Productivity Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#818cf8" 
                    strokeWidth={3}
                    dot={{ fill: '#818cf8', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Habit Completion Bar Chart */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Habit Completion Rate</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={habitCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
                    {habitCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Monthly Summary */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-violet-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Monthly Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Progress Line Chart */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Progress Over Time</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Time Distribution Pie Chart */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Time Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={timeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {timeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Key Insights */}
        <Card>
          <h2 className="text-2xl font-bold text-white mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-semibold mb-2">✓ Strengths</p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Consistent meditation practice (90% completion)</li>
                <li>• Strong productivity on weekends</li>
                <li>• 15-day streak maintained</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400 font-semibold mb-2">⚠ Areas to Improve</p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Study hours below target on Wed</li>
                <li>• Reading habit needs attention (70%)</li>
                <li>• Mid-week productivity dip</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;