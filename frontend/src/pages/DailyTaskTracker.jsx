import { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import TaskItem from '../components/TaskItem';
import DonutChart from '../components/DonutChart';
import GradientButton from '../components/GradientButton';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const DailyTaskTracker = () => {
  const {
    tasks,
    habits,
    dailyTasks,
    setDailyTasksList,
    toggleTaskCompletion,
    deleteTask,
    calculateProductivityScore,
    calculateDisciplineScore
  } = useApp();

  const [isPlanned, setIsPlanned] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const currentHour = new Date().getHours();

  useEffect(() => {
    // Check if today's tasks are already planned
    const today = new Date().toDateString();
    const planned = localStorage.getItem(`wisemind_daily_planned_${today}`);
    if (planned) {
      setIsPlanned(true);
    }
  }, []);

  const mockLLMSchedule = () => {
    // Mock LLM generates schedule based on tasks and habits
    const schedule = [];
    const today = new Date().toDateString();

    // Add incomplete tasks
    const incompleteTasks = tasks.filter(t => !t.completed).slice(0, 5);

    // Add today's habits based on time
    const currentTime = format(new Date(), 'HH:mm');
    const todayHabits = habits.filter(habit => {
      // Include habits that haven't been completed today
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
      return lastCompleted !== today;
    });

    // Combine tasks and habits
    const scheduledItems = [
      ...incompleteTasks.map(task => ({
        ...task,
        scheduledTime: task.deadline ? format(new Date(task.deadline), 'HH:mm') : '09:00',
        type: 'task'
      })),
      ...todayHabits.map(habit => ({
        id: habit.id,
        title: habit.name,
        scheduledTime: habit.startTime,
        completed: false,
        type: 'habit',
        habitId: habit.id
      }))
    ];

    // Sort by time
    scheduledItems.sort((a, b) => {
      const timeA = a.scheduledTime || '09:00';
      const timeB = b.scheduledTime || '09:00';
      return timeA.localeCompare(timeB);
    });

    setDailyTasksList(scheduledItems);
    setIsPlanned(true);
    localStorage.setItem(`wisemind_daily_planned_${today}`, 'true');
  };

  const handleManualPlan = () => {
    if (selectedTasks.length === 0) {
      alert('Please select at least one task to plan');
      return;
    }

    const today = new Date().toDateString();
    const plannedTasks = selectedTasks.map(taskId => {
      const task = tasks.find(t => t.id === taskId);
      return {
        ...task,
        scheduledTime: task.deadline ? format(new Date(task.deadline), 'HH:mm') : '09:00',
        type: 'task'
      };
    });

    // Add today's habits
    const todayHabits = habits.filter(habit => {
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
      return lastCompleted !== today;
    }).map(habit => ({
      id: habit.id,
      title: habit.name,
      scheduledTime: habit.startTime,
      completed: false,
      type: 'habit',
      habitId: habit.id
    }));

    const allTasks = [...plannedTasks, ...todayHabits].sort((a, b) => {
      const timeA = a.scheduledTime || '09:00';
      const timeB = b.scheduledTime || '09:00';
      return timeA.localeCompare(timeB);
    });

    setDailyTasksList(allTasks);
    setIsPlanned(true);
    localStorage.setItem(`wisemind_daily_planned_${today}`, 'true');
  };

  const handleToggleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const productivityScore = calculateProductivityScore();
  const disciplineScore = calculateDisciplineScore();

  const pendingDailyTasks = dailyTasks.filter(t => !t.completed);
  const completedDailyTasks = dailyTasks.filter(t => t.completed);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl young-serif-regular font-bold text-gray-200 mb-2">Daily Task Tracker</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={20} />
              <p>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            </div>
            {/* <p className="text-xs text-indigo-400 mt-1">
            Plan → Execute → Win your day
          </p> */}
          </motion.div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <h3 className="text-sm text-gray-400 mb-3 text-center">Productivity Score</h3>
              <motion.div whileHover={{ scale: 1.05 }}>
                <DonutChart value={productivityScore} color="#10b981" size={120} />
              </motion.div>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <h3 className="text-sm text-gray-400 mb-3 text-center">Discipline Score</h3>
              <motion.div whileHover={{ scale: 1.05 }}>
                <DonutChart value={disciplineScore} color="#f59e0b" size={120} />
              </motion.div>
            </Card>
          </div>

          {!isPlanned ? (
            <>
              {/* Warning if past 8 AM */}
              {currentHour >= 8 && (
                <Card className="mb-6 bg-orange-900/20 border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                  <div className="flex items-center gap-3">
                    <Clock size={24} className="text-orange-400" />
                    <div>
                      <p className="text-orange-400 font-semibold">You haven't planned your day yet!</p>
                      <p className="text-sm text-gray-400">It's recommended to plan before 8 AM</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Manual Planning */}
              <Card className="mb-6">
                <h2 className="text-xl font-bold text-white mb-4">Plan Your Day</h2>
                <p className="text-gray-400 mb-4">Select tasks you want to complete today:</p>

                {tasks.filter(t => !t.completed).length > 0 ? (
                  <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                    {tasks.filter(t => !t.completed).map(task => (
                      <motion.div
                        key={task.id}
                        onClick={() => handleToggleTaskSelection(task.id)}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                        data-testid={`select-task-${task.id}`}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${selectedTasks.includes(task.id)
                          ? 'bg-indigo-600/30 border border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                          : 'bg-gray-700/50 hover:bg-gray-700'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => { }}
                            className="w-5 h-5"
                          />
                          <div className="flex-1">
                            <p className="text-white font-medium">{task.title}</p>
                            {task.deadline && (
                              <p className="text-xs text-gray-400">Due: {format(new Date(task.deadline), 'MMM d, h:mm a')}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🎯</div>
                    <p className="text-gray-400 text-lg">
                      All tasks completed!
                    </p>
                    <p className="text-indigo-400 text-sm mt-1">
                      You're winning today 🔥
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <GradientButton onClick={handleManualPlan} className="w-full" data-testid="manual-plan-btn">
                    Plan Manually
                  </GradientButton>
                  <button
                    onClick={mockLLMSchedule}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:-translate-y-1 active:scale-95 text-white rounded-xl transition-all flex items-center justify-center gap-2"
                    data-testid="auto-plan-btn"
                  >
                    <Sparkles size={20} />
                    Auto-Plan with AI
                  </button>
                </div>
              </Card>
            </>
          ) : (
            <>
              {/* Today's Schedule */}
              <Card className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Today's Schedule ({pendingDailyTasks.length})</h2>
                  <button
                    onClick={() => {
                      setIsPlanned(false);
                      setDailyTasksList([]);
                      const today = new Date().toDateString();
                      localStorage.removeItem(`wisemind_daily_planned_${today}`);
                    }}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                    data-testid="replan-btn"
                  >
                    Replan Day
                  </button>
                </div>

                {pendingDailyTasks.length > 0 ? (
                  <div className="space-y-3">
                    {pendingDailyTasks.map(item => (
                      <div key={item.id} className="flex items-start gap-3" data-testid={`daily-task-${item.id}`}>
                        <div className="mt-1">
                          <p className="text-xs text-indigo-400 font-semibold">{item.scheduledTime}</p>
                        </div>
                        <div className="flex-1">
                          <TaskItem
                            task={item}
                            onToggle={toggleTaskCompletion}
                            onDelete={item.type === 'task' ? deleteTask : null}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">All tasks completed! Great job! 🎉</p>
                )}
              </Card>

              {/* Completed Tasks */}
              {completedDailyTasks.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 opacity-80">
                  <h2 className="text-xl font-bold text-white mb-4">Completed ({completedDailyTasks.length})</h2>
                  <div className="space-y-3">
                    {completedDailyTasks.map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1">
                          <p className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-1 rounded-md">
                            {item.scheduledTime}
                          </p>
                        </div>
                        <div className="flex-1">
                          <TaskItem
                            task={item}
                            onToggle={toggleTaskCompletion}
                            onDelete={item.type === 'task' ? deleteTask : null}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DailyTaskTracker;