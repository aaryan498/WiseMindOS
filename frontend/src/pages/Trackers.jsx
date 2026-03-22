import { Link } from 'react-router-dom';
import { Target, Folder, CheckSquare, Repeat, Calendar } from 'lucide-react';
import Card from '../components/Card';

const Trackers = () => {
  const trackerOptions = [
    {
      icon: Target,
      title: 'Goals',
      description: 'Track your final, long-term, and mid-term goals',
      path: '/trackers/goals',
      color: 'from-purple-600 to-pink-600',
      testId: 'tracker-goals'
    },
    {
      icon: Folder,
      title: 'Projects',
      description: 'Manage projects linked to your goals',
      path: '/trackers/projects',
      color: 'from-green-600 to-emerald-600',
      testId: 'tracker-projects'
    },
    {
      icon: CheckSquare,
      title: 'Solo Tasks',
      description: 'Track individual tasks and to-dos',
      path: '/trackers/tasks',
      color: 'from-blue-600 to-cyan-600',
      testId: 'tracker-tasks'
    },
    {
      icon: Repeat,
      title: 'Habits',
      description: 'Build good habits and break bad ones',
      path: '/trackers/habits',
      color: 'from-orange-600 to-red-600',
      testId: 'tracker-habits'
    },
    {
      icon: Calendar,
      title: 'Daily Tasks',
      description: 'Plan and track your daily schedule',
      path: '/trackers/daily-tasks',
      color: 'from-indigo-600 to-violet-600',
      testId: 'tracker-daily'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trackers</h1>
          <p className="text-gray-400">Manage all aspects of your life operating system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trackerOptions.map((tracker) => {
            const Icon = tracker.icon;
            return (
              <Link key={tracker.path} to={tracker.path} data-testid={tracker.testId}>
                <Card className="hover:scale-105 transition-transform duration-300 cursor-pointer h-full">
                  <div className={`p-4 bg-gradient-to-r ${tracker.color} rounded-xl w-fit mb-4`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tracker.title}</h3>
                  <p className="text-gray-400">{tracker.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Trackers;