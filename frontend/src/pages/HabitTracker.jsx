import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import HabitCard from '../components/HabitCard';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import ToggleSwitch from '../components/ToggleSwitch';

const HabitTracker = () => {
  const { habits, addHabit, updateHabit, deleteHabit } = useApp();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    type: 'build',
    startTime: '',
    endTime: '',
    mode: '21-day'
  });

  const handleAddHabit = () => {
    if (!newHabit.name.trim() || !newHabit.startTime || !newHabit.endTime) {
      alert('Please fill in all required fields');
      return;
    }
    addHabit(newHabit);
    setNewHabit({ name: '', type: 'build', startTime: '', endTime: '', mode: '21-day' });
    setShowAddHabit(false);
  };

  const handleCompleteHabit = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;

    if (lastCompleted === today) {
      // Already completed today
      return;
    }

    // Check if it's consecutive
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = habit.streak;
    if (lastCompleted === yesterdayStr) {
      // Consecutive day
      newStreak = habit.streak + 1;
    } else if (lastCompleted === null) {
      // First time
      newStreak = 1;
    } else {
      // Streak broken, restart
      newStreak = 1;
    }

    updateHabit(habitId, {
      streak: newStreak,
      lastCompleted: new Date().toISOString()
    });
  };

  const buildHabits = habits.filter(h => h.type === 'build');
  const breakHabits = habits.filter(h => h.type === 'break');

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Habit Tracker</h1>
            <p className="text-gray-400">Build good habits and break bad ones</p>
          </div>
          <button
            onClick={() => setShowAddHabit(true)}
            data-testid="add-habit-btn"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Build Habits */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={24} className="text-green-400" />
            <h2 className="text-xl font-bold text-white">Build Habits ({buildHabits.length})</h2>
          </div>
          {buildHabits.length > 0 ? (
            <div className="space-y-3">
              {buildHabits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleCompleteHabit}
                  onDelete={() => deleteHabit(habit.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No build habits yet. Add one to get started!</p>
          )}
        </Card>

        {/* Break Habits */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={24} className="text-red-400" />
            <h2 className="text-xl font-bold text-white">Break Habits ({breakHabits.length})</h2>
          </div>
          {breakHabits.length > 0 ? (
            <div className="space-y-3">
              {breakHabits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleCompleteHabit}
                  onDelete={() => deleteHabit(habit.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No break habits yet.</p>
          )}
        </Card>

        {/* Overall Stats */}
        {habits.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Flame size={24} className="text-orange-400" />
              <h2 className="text-xl font-bold text-white">Overall Stats</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-orange-400">{habits.length}</p>
                <p className="text-sm text-gray-400 mt-1">Total Habits</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-400">
                  {Math.max(...habits.map(h => h.streak), 0)}
                </p>
                <p className="text-sm text-gray-400 mt-1">Longest Streak</p>
              </div>
            </div>
          </Card>
        )}

        {habits.length === 0 && (
          <Card>
            <div className="text-center py-16">
              <Flame size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No habits yet. Start building your routine!</p>
              <GradientButton onClick={() => setShowAddHabit(true)} data-testid="add-first-habit-btn">
                Add Your First Habit
              </GradientButton>
            </div>
          </Card>
        )}
      </div>

      {/* Add Habit Modal */}
      <Modal isOpen={showAddHabit} onClose={() => setShowAddHabit(false)} title="Create New Habit">
        <div className="space-y-4">
          <InputField
            label="Habit Name"
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            placeholder="e.g., Morning Exercise, Read 30 pages"
            required
            data-testid="habit-name-input"
          />

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Habit Type</label>
            <div className="flex gap-3">
              <button
                onClick={() => setNewHabit({ ...newHabit, type: 'build' })}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  newHabit.type === 'build'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                data-testid="habit-type-build"
              >
                <TrendingUp size={20} className="inline mr-2" />
                Build
              </button>
              <button
                onClick={() => setNewHabit({ ...newHabit, type: 'break' })}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  newHabit.type === 'break'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                data-testid="habit-type-break"
              >
                <TrendingDown size={20} className="inline mr-2" />
                Break
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Start Time"
              type="time"
              value={newHabit.startTime}
              onChange={(e) => setNewHabit({ ...newHabit, startTime: e.target.value })}
              required
              data-testid="habit-start-time"
            />
            <InputField
              label="End Time"
              type="time"
              value={newHabit.endTime}
              onChange={(e) => setNewHabit({ ...newHabit, endTime: e.target.value })}
              required
              data-testid="habit-end-time"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Mode</label>
            <div className="flex gap-3">
              <button
                onClick={() => setNewHabit({ ...newHabit, mode: '21-day' })}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  newHabit.mode === '21-day'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                data-testid="habit-mode-21day"
              >
                21-Day Challenge
              </button>
              <button
                onClick={() => setNewHabit({ ...newHabit, mode: 'permanent' })}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  newHabit.mode === 'permanent'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
                data-testid="habit-mode-permanent"
              >
                Permanent
              </button>
            </div>
          </div>

          <GradientButton onClick={handleAddHabit} className="w-full" data-testid="submit-habit-btn">
            Create Habit
          </GradientButton>
        </div>
      </Modal>
    </div>
  );
};

export default HabitTracker;