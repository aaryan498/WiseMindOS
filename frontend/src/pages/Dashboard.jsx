import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Target, CheckCircle, Zap } from 'lucide-react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ChartWrapper from '../components/ChartWrapper';
import { weeklyProductivityData, habitCompletionData, mockHabits } from '../data/mockData';
import { getProductivityScore, getConsistencyScore } from '../utils/helpers';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('wisemind_user') || '{}');
  const productivityScore = getProductivityScore(weeklyProductivityData);
  const consistencyScore = getConsistencyScore(mockHabits);

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'];

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border border-indigo-500/20">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, {user.name || 'User'}! 👋
          </h1>
          <p className="text-gray-300">Here's your progress overview for today</p>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Productivity Score"
            value={`${productivityScore}%`}
            icon={<Zap size={24} />}
            trend={{ positive: true, value: '+5% this week' }}
            data-testid="productivity-score-card"
          />
          <StatCard
            title="Habit Consistency"
            value={`${consistencyScore}%`}
            icon={<TrendingUp size={24} />}
            trend={{ positive: true, value: '+12% this week' }}
            data-testid="consistency-score-card"
          />
          <StatCard
            title="Active Goals"
            value="3"
            icon={<Target size={24} />}
            data-testid="active-goals-card"
          />
          <StatCard
            title="Tasks Done Today"
            value="5/8"
            icon={<CheckCircle size={24} />}
            data-testid="tasks-done-card"
          />
        </div>

        {/* Today's Summary */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Today's Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Study Hours</p>
              <p className="text-3xl font-bold text-white">4.0h</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Sleep Hours</p>
              <p className="text-3xl font-bold text-white">7.5h</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Tasks Completed</p>
              <p className="text-3xl font-bold text-white">5</p>
            </div>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Productivity Chart */}
          <Card>
            <ChartWrapper 
              data={weeklyProductivityData}
              dataKey="productivity"
              title="Weekly Productivity Trend"
              xKey="name"
            />
          </Card>

          {/* Habit Completion Bar Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Habit Completion Rate</h3>
            <ResponsiveContainer width="100%" height={250}>
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
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors">
              Log Activity
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors">
              Add Task
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors">
              New Goal
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors">
              View Reports
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;