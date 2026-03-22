import { Folder, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Card from './Card';
import DonutChart from './DonutChart';

const ProjectCard = ({ project, progress, linkedGoal, onClick }) => {
  const getTimeRemaining = (deadline) => {
    if (!deadline) return 'No deadline';
    try {
      return formatDistanceToNow(new Date(deadline), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Card 
      className="hover:scale-105 transition-transform duration-300 cursor-pointer" 
      onClick={onClick}
      data-testid={`project-card-${project.id}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
          <Folder size={24} className="text-white" />
        </div>
        {linkedGoal && (
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
            {linkedGoal}
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
      
      {project.deadline && (
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <Calendar size={14} className="mr-2" />
          <span>{getTimeRemaining(project.deadline)}</span>
        </div>
      )}
      
      <div className="flex justify-center">
        <DonutChart value={progress} size={100} strokeWidth={8} color="#10b981" />
      </div>
    </Card>
  );
};

export default ProjectCard;