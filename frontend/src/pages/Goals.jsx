import { useState } from 'react';
import { Plus, Calendar, Target } from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import { mockGoals } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const Goals = () => {
  const [goals, setGoals] = useState(mockGoals);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      deadline: newGoal.deadline,
      progress: 0
    };
    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', deadline: '' });
    setShowAddGoal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Goals</h1>
          <button
            onClick={() => setShowAddGoal(true)}
            data-testid="add-goal-btn"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:scale-105 transition-transform duration-300" data-testid={`goal-card-${goal.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-3 rounded-lg">
                  <Target className="text-white" size={24} />
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  goal.progress >= 80 
                    ? 'bg-green-500/20 text-green-400' 
                    : goal.progress >= 50 
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {goal.progress >= 80 ? 'On Track' : goal.progress >= 50 ? 'In Progress' : 'Behind'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{goal.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{goal.description}</p>
              
              <ProgressBar progress={goal.progress} className="mb-3" />
              
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar size={16} className="mr-2" />
                <span>Due: {formatDate(goal.deadline)}</span>
              </div>
            </Card>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-16">
            <Target size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No goals yet. Start by adding your first goal!</p>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} title="Create New Goal">
        <div className="space-y-4">
          <InputField
            label="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Enter goal title"
            required
            data-testid="goal-title-input"
          />
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Describe your goal..."
              data-testid="goal-description-input"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px]"
            />
          </div>
          
          <InputField
            label="Deadline"
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            data-testid="goal-deadline-input"
          />
          
          <GradientButton onClick={handleAddGoal} className="w-full" data-testid="submit-goal-btn">
            Create Goal
          </GradientButton>
        </div>
      </Modal>
    </div>
  );
};

export default Goals;