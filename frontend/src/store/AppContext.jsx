import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {

  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Load initial data from localStorage or use defaults
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('wisemind_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('wisemind_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wisemind_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('wisemind_habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyTasks, setDailyTasks] = useState(() => {
    const saved = localStorage.getItem('wisemind_daily_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('wisemind_scores');
    return saved ? JSON.parse(saved) : { productivity: 0, discipline: 0 };
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('wisemind_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('wisemind_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('wisemind_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('wisemind_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('wisemind_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem('wisemind_scores', JSON.stringify(scores));
  }, [scores]);

  // Add Goal
  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      title: goal.title,
      type: goal.type,
      createdAt: new Date().toISOString(),
      ...goal
    };
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  // Add Project
  const addProject = (project) => {
    const newProject = {
      id: Date.now().toString(),
      title: project.title,
      goalId: project.goalId || null,
      deadline: project.deadline,
      createdAt: new Date().toISOString(),
      ...project
    };
    setProjects([...projects, newProject]);
    return newProject;
  };

  // Add Task
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString() + Math.random(),
      title: task.title,
      deadline: task.deadline,
      completed: false,
      goalId: task.goalId || null,
      projectId: task.projectId || null,
      isImportant: task.isImportant || false,
      createdFrom: task.createdFrom || 'manual',
      createdAt: new Date().toISOString(),
      ...task
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  // Add Habit
  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      type: habit.type,
      startTime: habit.startTime,
      endTime: habit.endTime,
      streak: 0,
      mode: habit.mode || '21-day',
      createdAt: new Date().toISOString(),
      lastCompleted: null,
      ...habit
    };
    setHabits([...habits, newHabit]);
    return newHabit;
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    setDailyTasks(dailyTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setDailyTasks(dailyTasks.filter(task => task.id !== taskId));
  };

  const updateGoal = (goalId, updates) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const updateProject = (projectId, updates) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const updateHabit = (habitId, updates) => {
    setHabits(habits.map(habit =>
      habit.id === habitId ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const calculateGoalProgress = (goalId) => {
    const goalTasks = tasks.filter(task => task.goalId === goalId);
    if (goalTasks.length === 0) return 0;
    const completedTasks = goalTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / goalTasks.length) * 100);
  };

  const calculateProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const getTasksByGoal = (goalId) => tasks.filter(task => task.goalId === goalId);
  const getTasksByProject = (projectId) => tasks.filter(task => task.projectId === projectId);
  const getProjectsByGoal = (goalId) => projects.filter(project => project.goalId === goalId);
  const getImportantTasks = () => tasks.filter(task => !task.completed && task.isImportant);

  const getBehindTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (task.completed || !task.deadline) return false;
      const deadline = new Date(task.deadline);

      if (deadline < now) return true;

      if (task.createdAt) {
        const createdAt = new Date(task.createdAt);
        const totalTime = deadline - createdAt;
        const usedTime = now - createdAt;
        return (usedTime / totalTime) >= 0.75;
      }

      return false;
    });
  };

  const updateScores = (newScores) => {
    setScores({ ...scores, ...newScores });
  };

  const calculateProductivityScore = () => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(task =>
      new Date(task.createdAt).toDateString() === today
    );

    if (todayTasks.length === 0) return 0;
    const completed = todayTasks.filter(task => task.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  };

  const calculateDisciplineScore = () => {
    if (habits.length === 0) return 0;
    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const maxPossibleStreak = habits.length * 21;
    return Math.min(Math.round((totalStreak / maxPossibleStreak) * 100), 100);
  };

  const setDailyTasksList = (tasksList) => {
    setDailyTasks(tasksList);
  };

  const clearAllData = () => {
    setGoals([]);
    setProjects([]);
    setTasks([]);
    setHabits([]);
    setDailyTasks([]);
    setScores({ productivity: 0, discipline: 0 });
  };

  const value = {
    token,
    setToken,
    navigate,
    backendURL,
    goals,
    projects,
    tasks,
    habits,
    dailyTasks,
    scores,
    addGoal,
    addProject,
    addTask,
    addHabit,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
    updateGoal,
    deleteGoal,
    updateProject,
    deleteProject,
    updateHabit,
    deleteHabit,
    updateScores,
    setDailyTasksList,
    clearAllData,
    calculateGoalProgress,
    calculateProjectProgress,
    getTasksByGoal,
    getTasksByProject,
    getProjectsByGoal,
    getImportantTasks,
    getBehindTasks,
    calculateProductivityScore,
    calculateDisciplineScore
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};