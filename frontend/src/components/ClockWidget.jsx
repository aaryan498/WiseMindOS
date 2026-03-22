import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import Card from './Card';

const ClockWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30" data-testid="clock-widget">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/20 rounded-xl">
          <Clock size={32} className="text-indigo-400" />
        </div>
        <div>
          <div className="text-3xl font-bold text-white" data-testid="clock-time">
            {format(currentTime, 'HH:mm:ss')}
          </div>
          <div className="text-sm text-gray-400" data-testid="clock-date">
            {format(currentTime, 'EEEE, MMMM dd, yyyy')}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClockWidget;