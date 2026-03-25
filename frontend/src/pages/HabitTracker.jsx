import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import HabitCard from '../components/HabitCard';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import { motion } from 'framer-motion';

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
    const lastCompleted = habit.lastCompleted || null;

    if (lastCompleted === today) {
      // 🔁 UNDO today's completion

      let newStreak = habit.streak > 0 ? habit.streak - 1 : 0;

      // Set lastCompleted to yesterday (simulate rollback)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      updateHabit(habitId, {
        streak: newStreak,
        lastCompleted: newStreak === 0 ? null : yesterday.toDateString()
      });

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
      lastCompleted: new Date().toDateString()
    });
  };

  const buildHabits = habits.filter(h => h.type === 'build');
  const breakHabits = habits.filter(h => h.type === 'break');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-red-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-200 young-serif-regular">Habit Tracker</h1>
            <p className="text-gray-400">Build good habits and break bad ones</p>
          </div>
          <button
            onClick={() => setShowAddHabit(true)}
            data-testid="add-habit-btn"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:-translate-y-1 active:scale-95 text-white p-3 rounded-xl transition-all cursor-pointer"
          >
            <Plus size={24} />
          </button>
        </motion.div>

        {/* Overall Stats */}
        {habits.length > 0 && (
          <Card className="bg-white/5 mb-6 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(249,115,22,0.2)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* LEFT */}
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Habit Analytics
                </h2>
                <p className="text-gray-400 text-sm">
                  Consistency builds your identity 🔥
                </p>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-orange-400">{habits.length}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Habits</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-400">
                    {Math.max(...habits.map(h => h.streak), 0)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Longest Streak</p>
                </div>

              </div>

            </div>
          </Card>
        )}

        {/* Build Habits */}
        <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={24} className="text-green-400" />
              <h2 className="text-xl font-bold text-white">
                Build Habits ({buildHabits.length})
              </h2>
            </div>

            <span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
              Growth Zone
            </span>
          </div>
          {buildHabits.length > 0 ? (
            <div className="space-y-3">
              {buildHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <HabitCard
                    habit={habit}
                    onComplete={handleCompleteHabit}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No build habits yet. Add one to get started!</p>
          )}
        </Card>

        {/* Break Habits */}
        <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown size={24} className="text-red-400" />
              <h2 className="text-xl font-bold text-white">
                Break Habits ({breakHabits.length})
              </h2>
            </div>

            <span className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
              Discipline Zone
            </span>
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



        {habits.length === 0 && (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-center">
            <div className="text-center py-16">
              <Flame size={64} className="text-orange-400 mx-auto mb-4 animate-pulse" />

              <p className="text-gray-400 text-lg mb-2">
                No habits yet.
              </p>

              <p className="text-indigo-400 text-sm mb-6">
                Start building your discipline system 🚀
              </p>

              <GradientButton onClick={() => setShowAddHabit(true)}>
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
                className={`flex-1 py-3 rounded-lg transition-all ${newHabit.type === 'build'
                  ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                  : 'bg-gray-700 text-gray-300'
                  }`}
                data-testid="habit-type-build"
              >
                <TrendingUp size={20} className="inline mr-2" />
                Build
              </button>
              <button
                onClick={() => setNewHabit({ ...newHabit, type: 'break' })}
                className={`flex-1 py-3 rounded-lg transition-all ${newHabit.type === 'break'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
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
                className={`flex-1 py-3 rounded-lg transition-all ${newHabit.mode === '21-day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300'
                  }`}
                data-testid="habit-mode-21day"
              >
                21-Day Challenge
              </button>
              <button
                onClick={() => setNewHabit({ ...newHabit, mode: 'permanent' })}
                className={`flex-1 py-3 rounded-lg transition-all ${newHabit.mode === 'permanent'
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
    </div >
  );
};

export default HabitTracker;