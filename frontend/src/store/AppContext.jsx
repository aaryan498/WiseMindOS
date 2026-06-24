import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { goalAPI, projectAPI, taskAPI, habitAPI, dailyPlanAPI, statsAPI, notebookAPI, pageAPI, authAPI } from '../api/apiService';
import { showToast } from '../utils/toastHelper';
import { DUPLICATE_GOAL_MESSAGE, isDuplicateGoalTitle } from '../utils/helpers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('wisemind_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('wisemind_user', JSON.stringify(user));
    }
  }, [user]);

  const [notebooks, setNotebooks] = useState([]);
  const [pages, setPages] = useState([]);

  // HYBRID: Load initial data from localStorage or use defaults (fallback)
  const goalsRef = useRef([]);
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('wisemind_goals');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    goalsRef.current = goals;
  }, [goals]);

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

  // NEW: Daily Plan with date-specific structure
  const [dailyPlan, setDailyPlan] = useState(() => {
    const saved = localStorage.getItem('wisemind_daily_plan');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      // Reset if date changed
      if (parsed.date !== today) {
        return { date: today, plannedTasks: [] };
      }
      return parsed;
    }
    return {
      date: new Date().toISOString().split('T')[0],
      plannedTasks: []
    };
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('wisemind_scores');
    return saved ? JSON.parse(saved) : { productivity: 0, discipline: 0 };
  });





  async function loadInitialData() {
    try {
      setLoading(true);

      // Fetch all data from backend
      const [goalsRes, projectsRes, tasksRes, habitsRes, dailyPlanRes, notebooksRes] = await Promise.all([
        goalAPI.getAll(),
        projectAPI.getAll(),
        taskAPI.getAll(),
        habitAPI.getAll(),
        dailyPlanAPI.getToday(),
        notebookAPI.getAll(),
      ]);

      // Update state with backend data
      if (goalsRes.success) {
        const goalsData = goalsRes.goals.map(g => ({
          ...g,
          id: g._id
        }));
        setGoals(goalsData);
      }

      if (projectsRes.success) {
        const projectsData = projectsRes.projects.map(p => ({
          ...p,
          id: p._id
        }));
        setProjects(projectsData);
      }

      if (tasksRes.success) {
        const tasksData = tasksRes.tasks.map(t => ({
          ...t,
          id: t._id
        }));
        setTasks(tasksData);
      }

      if (habitsRes.success) {
        const habitsData = habitsRes.habits.map(h => ({
          ...h,
          id: h._id
        }));
        setHabits(habitsData);
      }

      if (dailyPlanRes.success && dailyPlanRes.dailyPlan) {
        const planData = {
          ...dailyPlanRes.dailyPlan,
          plannedTasks: dailyPlanRes.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id,
            taskId: pt.taskId || null,
            habitId: pt.habitId || null,
            completedAt: pt.completedAt || null
          }))
        };
        setDailyPlan(planData);
      }

      if (notebooksRes.success) {
        const data = notebooksRes.notebooks.map(n => ({
          ...n,
          id: n._id
        }));
        setNotebooks(data);
      }

    } catch (error) {
      console.error('Failed to load data from backend:', error);
      // Keep localStorage data as fallback
      showToast({ message: 'Using offline data' })
    } finally {
      setLoading(false);
    }
  }

  // BACKEND INTEGRATION: Load initial data when token is available
  useEffect(() => {
    if (token && user) {
      loadInitialData();
    }
  }, [token, user]);

  const updateUser = async (updates) => {
    try {
      setLoading(true);

      const response = await authAPI.update(updates);

      if (response.success) {
        // Update user state globally
        setUser(prev => ({
          ...prev,
          ...response.user
        }));

        showToast({
          message: response.message || 'Profile updated successfully',
          status: 'success'
        });

        return true;
      } else {
        showToast({
          message: response.message || 'Failed to update profile',
          status: 'error'
        });
        return false;
      }

    } catch (error) {
      console.error('Error updating user:', error);
      showToast({
        message: error.message || 'Failed to update profile',
        status: 'error'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfilePic = async (updates) => {
    try {
      setLoading(true);

      const response = await authAPI.updateProfilePic(updates);

      if (response.success) {
        // Update user state globally
        setUser(prev => ({
          ...prev,
          ...response.user
        }));

        showToast({
          message: response.message || 'Profile Pic updated successfully',
          status: 'success'
        });

        return true;
      } else {
        showToast({
          message: response.message || 'Failed to update profile',
          status: 'error'
        });
        return false;
      }

    } catch (error) {
      console.error('Error updating user:', error);
      showToast({
        message: error.message || 'Failed to update profile',
        status: 'error'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };


  // Add Goal - Backend Integration
  const addGoal = async (goal) => {
    const trimmedTitle = (goal.title ?? '').trim();
    if (!trimmedTitle) {
      showToast({ message: 'Goal title is required', status: 'error' });
      return null;
    }

    if (isDuplicateGoalTitle(trimmedTitle, goalsRef.current)) {
      showToast({ message: DUPLICATE_GOAL_MESSAGE, status: 'error' });
      return null;
    }

    try {
      const response = await goalAPI.create({ ...goal, title: trimmedTitle });
      if (response.success) {
        const newGoal = {
          ...response.goal,
          id: response.goal._id
        };
        const updatedGoals = [...goalsRef.current, newGoal];
        goalsRef.current = updatedGoals;
        setGoals(updatedGoals);
        showToast({ message: response.message || 'Goal created successfully', status: 'success' })
        return newGoal;
      } else {
        showToast({ message: response.message || 'Failed to create goal', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      showToast({ message: error.message || 'Failed to create goal. Error!', status: 'error' })
      return null;
    }
  };

  // Add Project - Backend Integration
  const addProject = async (project) => {
    try {
      const response = await projectAPI.create(project);
      if (response.success) {
        const newProject = {
          ...response.project,
          id: response.project._id
        };
        setProjects([...projects, newProject]);
        showToast({ message: response.message || 'Project created successfully', status: 'success' })
        return newProject;
      } else {
        showToast({ message: response.message || 'Failed to create project', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating project:', error);
      showToast({ message: error.message || 'Failed to create project', status: 'error' })
      return null;
    }
  };

  // Add Task - Backend Integration
  const addTask = async (task) => {
    try {
      const response = await taskAPI.create(task);
      if (response.success) {
        const newTask = {
          ...response.task,
          id: response.task._id
        };
        setTasks([...tasks, newTask]);
        showToast({ message: response.message || 'Task created successfully', status: 'success' })
        return newTask;
      } else {
        showToast({ message: response.message || 'Failed to create task', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showToast({ message: error.message || 'Failed to create task', status: 'error' })
      return null;
    }
  };

  // Add Habit - Backend Integration
  const addHabit = async (habit) => {
    try {
      const response = await habitAPI.create(habit);
      if (response.success) {
        const newHabit = {
          ...response.habit,
          id: response.habit._id
        };
        setHabits([...habits, newHabit]);
        showToast({ message: response.message || 'Habit created successfully', status: 'success' })
        return newHabit;
      } else {
        showToast({ message: response.message || 'Failed to create habit', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      showToast({ message: error.message || 'Failed to create habit', status: 'error' })
      return null;
    }
  };

  // Toggle Task Completion - Backend Integration with Global Sync
  const toggleTaskCompletion = async (taskId) => {
    try {
      // Check if task exists in dailyPlan
      const isInDailyPlan = dailyPlan.plannedTasks.some(pt => pt.taskId === taskId);

      if (isInDailyPlan) {
        // If in daily plan, use dailyPlanAPI.toggle (backend syncs both)
        const plannedTask = dailyPlan.plannedTasks.find(pt => pt.taskId === taskId);
        if (plannedTask) {
          const response = await dailyPlanAPI.toggle(plannedTask.id);
          if (response.success) {
            // Update dailyPlan from response
            const updatedPlan = {
              ...response.dailyPlan,
              plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
                ...pt,
                id: pt._id,
                completedAt: pt.completedAt || null
              }))
            };
            setDailyPlan(updatedPlan);

            // Update tasks array (find completed status from dailyPlan response)
            const updatedPlannedTask = response.dailyPlan.plannedTasks.find(pt => pt._id === plannedTask.id);
            if (updatedPlannedTask) {
              setTasks(tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: updatedPlannedTask.completed }
                  : task
              ));
            }
          }
        }
      } else {
        // Not in daily plan, use taskAPI.toggle
        const response = await taskAPI.toggle(taskId);
        if (response.success) {
          const updatedTask = {
            ...response.task,
            id: response.task._id
          };
          setTasks(tasks.map(task =>
            // task.id === taskId ? { ...task, completed: !task.completed } : task
            task.id === taskId ? updatedTask : task
          ));
        } else {
          showToast({ message: response.message || 'Failed to update task', status: 'error' })
        }
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      showToast({ message: error.message || 'Failed to update task', status: 'error' })
    }
  };

  // Update Task - Backend Integration
  const updateTask = async (taskId, updates) => {
    try {
      const response = await taskAPI.update({ taskId, ...updates });
      if (response.success) {
        const updatedTask = {
          ...response.task,
          id: response.task._id
        };
        setTasks(tasks.map(task =>
          // task.id === taskId ? { ...task, ...updates } : task
          task.id === taskId ? updatedTask : task
        ));
        showToast({ message: response.message || 'Task updated successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update task', status: 'error' })
      }
    } catch (error) {
      console.error('Error updating task:', error);
      showToast({ message: error.message || 'Failed to update task', status: 'error' })
    }
  };

  // Delete Task - Backend Integration
  const deleteTask = async (taskId) => {
    try {
      const response = await taskAPI.delete(taskId);
      if (response.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
        showToast({ message: response.message || 'Task deleted successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to delete task', status: 'error' })
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast({ message: error.message || 'Failed to delete task', status: 'error' })
    }
  };

  // Update Goal - Backend Integration
  const updateGoal = async (goalId, updates) => {
    try {
      const response = await goalAPI.update({ goalId, ...updates });
      if (response.success) {
        const updatedGoal = {
          ...response.goal,
          id: response.goal._id
        };
        setGoals(goals.map(goal =>
          // goal.id === goalId ? { ...goal, ...updates } : goal
          goal.id === goalId ? updatedGoal : goal
        ));
        showToast({ message: response.message || 'Goal updated successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update goal', status: 'error' })
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      showToast({ message: error.message || 'Failed to update goal', status: 'error' })
    }
  };

  // Delete Goal - Backend Integration
  const deleteGoal = async (goalId) => {
    try {
      const response = await goalAPI.delete(goalId);
      if (response.success) {
        setGoals(goals.filter(goal => goal.id !== goalId));
        showToast({ message: response.message || 'Goal deleted successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to delete goal', status: 'error' })
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      showToast({ message: error.message || 'Failed to delete goal', status: 'error' })
    }
  };

  // Update Project - Backend Integration
  const updateProject = async (projectId, updates) => {
    try {
      const response = await projectAPI.update({ projectId, ...updates });
      if (response.success) {
        const updatedProject = {
          ...response.project,
          id: response.project._id
        };
        setProjects(projects.map(project =>
          // project.id === projectId ? { ...project, ...updates } : project
          project.id === projectId ? updatedProject : project
        ));
        showToast({ message: response.message || 'Project Updated successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update project', status: 'error' })
      }
    } catch (error) {
      console.error('Error updating project:', error);
      showToast({ message: error.message || 'Failed to update project', status: 'error' })
    }
  };

  // Delete Project - Backend Integration
  const deleteProject = async (projectId) => {
    try {
      const response = await projectAPI.delete(projectId);
      if (response.success) {
        setProjects(projects.filter(project => project.id !== projectId));
        showToast({ message: response.message || 'Project deleted successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to delete project', status: 'error' })
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast({ message: error.message || 'Failed to delete project', status: 'error' })
    }
  };

  // Update Habit - Backend Integration
  const updateHabit = async (habitId, updates) => {
    try {
      const response = await habitAPI.update({ habitId, ...updates });
      if (response.success) {
        const updatedHabit = {
          ...response.habit,
          id: response.habit._id
        };
        setHabits(habits.map(habit =>
          // habit.id === habitId ? { ...habit, ...updates } : habit
          habit.id === habitId ? updatedHabit : habit
        ));
        showToast({ message: response.message || 'Habit updated successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update habit', status: 'error' })
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      showToast({ message: error.message || 'Failed to update habit', status: 'error' })
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const response = await habitAPI.complete(habitId);

      if (response.success) {
        const updatedHabit = {
          ...response.habit,
          id: response.habit._id
        };

        setHabits(habits.map(h =>
          h.id === habitId ? updatedHabit : h
        ));

        // ✅ REFETCH DAILY PLAN
        const dailyPlanRes = await dailyPlanAPI.getToday();

        if (dailyPlanRes.success) {
          const updatedPlan = {
            ...dailyPlanRes.dailyPlan,
            plannedTasks: dailyPlanRes.dailyPlan.plannedTasks.map(pt => ({
              ...pt,
              id: pt._id,
              completedAt: pt.completedAt || null
            }))
          };

          setDailyPlan(updatedPlan);
        }

        showToast({ message: response.message || 'Habit completed successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update habit', status: 'error' })
      }
    } catch (error) {
      console.error('Error completing habit:', error);
      showToast({ message: error.message || 'Failed to complete habit', status: 'error' })
    }
  };

  // Delete Habit - Backend Integration
  const deleteHabit = async (habitId) => {
    try {
      const response = await habitAPI.delete(habitId);
      if (response.success) {
        setHabits(habits.filter(habit => habit.id !== habitId));
        showToast({ message: response.message || 'Habit deleted successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to delete habit', status: 'error' })
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      showToast({ message: error.message || 'Failed to delete habit', status: 'error' })
    }
  };


  const createNotebook = async (name) => {
    const res = await notebookAPI.create({ name });
    if (res.success) {
      setNotebooks(prev => [...prev, { ...res.notebook, id: res.notebook._id }]);
    }
  };

  const updateNotebook = async (notebookId, name) => {
    const res = await notebookAPI.update(notebookId, name);
    if (res.success) {
      setNotebooks(prev =>
        prev.map(n =>
          n.id === notebookId ? { ...n, name } : n
        )
      );
    }
  };

  const deleteNotebook = async (notebookId) => {
    const res = await notebookAPI.delete(notebookId);
    if (res.success) {
      if (res.notebooks) {
        setNotebooks(res.notebooks.map(n => ({
          ...n,
          id: n._id
        })));
      } else {
        setNotebooks(prev => prev.filter(n => n.id !== notebookId));
      }
    }
  };

  const loadPages = async (notebookId) => {
    const res = await pageAPI.getPagesByNotebook(notebookId);
    if (res.success) {
      const data = res.pages.map(p => ({
        ...p,
        id: p._id
      }));
      setPages(data);
    }
  };

  const createPage = async (notebookId) => {
    const res = await pageAPI.create({ notebookId });
    if (res.success) {
      await loadPages(notebookId);
    }
  };

  const updateTimeout = useRef(null);
  const updatePage = (pageId, content) => {
    setPages(prev =>
      prev.map(p => p.id === pageId ? { ...p, content } : p)
    );

    if (updateTimeout.current) clearTimeout(updateTimeout.current);

    updateTimeout.current = setTimeout(async () => {
      await pageAPI.update({ pageId, content });
    }, 500);
  };

  const deletePage = async (pageId, notebookId) => {
    const res = await pageAPI.delete(pageId, notebookId);
    if (res.success) {
      const data = (res.pages ?? []).map(p => ({
        ...p,
        id: p._id
      }));
      setPages(data);
    }
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

  const calculateProductivityScore = useCallback(() => {
    const todayTasks = dailyPlan?.plannedTasks || [];

    if (todayTasks.length === 0) return 0;
    const completed = todayTasks.filter(task => task.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  }, [dailyPlan]);

  const calculateDisciplineScore = useCallback(() => {
    const tasks = dailyPlan?.plannedTasks || [];

    if (tasks.length === 0) return 0;

    let onTimeCompleted = 0;

    tasks.forEach(task => {
      if (task.completed && task.completedAt) {
        const completedTime = new Date(task.completedAt);

        const completedMinutes =
          completedTime.getHours() * 60 + completedTime.getMinutes();

        const [eh, em] = (task.endTime || "00:00").split(':').map(Number);
        const endMinutes = eh * 60 + em;

        if (completedMinutes <= endMinutes) {
          onTimeCompleted++;
        }
      }
    });

    return Math.round((onTimeCompleted / tasks.length) * 100);
  }, [dailyPlan]);

  // Add task to daily plan - Backend Integration
  const addToDailyPlan = async (item) => {
    try {
      const response = await dailyPlanAPI.add(item);
      if (response.success) {
        const updatedPlan = {
          ...response.dailyPlan,
          plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id,
            completedAt: pt.completedAt || null
          }))
        };
        setDailyPlan(updatedPlan);
        showToast({ message: response.message || 'Added to daily plan', status: 'success' })
        return updatedPlan.plannedTasks[updatedPlan.plannedTasks.length - 1];
      } else {
        showToast({ message: response.message || 'Failed to add to daily plan', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error adding to daily plan:', error);
      showToast({ message: error.message || 'Failed to add to daily plan', status: 'error' })
      return null;
    }
  };

  const removeFromDailyPlan = async (id) => {
    try {
      const response = await dailyPlanAPI.remove(id);
      if (response.success) {
        const updatedPlan = {
          ...response.dailyPlan,
          plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id,
            completedAt: pt.completedAt || null
          }))
        };
        setDailyPlan(updatedPlan);
        showToast({ message: response.message || 'Removed from daily plan', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to remove from daily plan', status: 'error' })
      }
    } catch (error) {
      showToast({ message: error.message || 'Failed to remove from daily plan', status: 'error' })
    }
  };

  const createManualDailyTask = async (taskData) => {
    try {
      const manualTaskData = {
        source: 'manual',
        // taskId: null,
        // habitId: null,
        title: taskData.title,
        startTime: taskData.startTime || '09:00',
        endTime: taskData.endTime || '10:00',
        // completed: false,
        isImportant: taskData.isImportant || false
      };

      // return newTask;
      const response = await dailyPlanAPI.add(manualTaskData);
      if (response.success) {
        const updatedPlan = {
          ...response.dailyPlan,
          plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id,
            completedAt: pt.completedAt || null
          }))
        };
        setDailyPlan(updatedPlan);
        showToast({ message: response.message || 'Manual task added to daily plan', status: 'success' })
        return updatedPlan.plannedTasks[updatedPlan.plannedTasks.length - 1];
      } else {
        showToast({ message: response.message || 'Failed to create manual task', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating manual task:', error);
      showToast({ message: error.message || 'Failed to create manual task', status: 'error' })
      return null;
    }
  };

  // CRITICAL: Toggle Daily Plan Task - Backend handles ALL sync (tasks, habits, streaks)
  const toggleDailyPlanTaskCompletion = async (id) => {
    try {
      const response = await dailyPlanAPI.toggle(id);
      if (response.success) {
        // Update dailyPlan from backend response
        const updatedPlan = {
          ...response.dailyPlan,
          plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id,
            completedAt: pt.completedAt || null
          }))
        };
        setDailyPlan(updatedPlan);

        // Find the toggled item to sync with source
        const toggledItem = response.dailyPlan.plannedTasks.find(pt => pt._id === id);
        if (!toggledItem) return;

        if (toggledItem.source === 'task' && toggledItem.taskId) {
          // Refetch tasks to get updated completion status
          const tasksRes = await taskAPI.getAll();
          if (tasksRes.success) {
            const tasksData = tasksRes.tasks.map(t => ({
              ...t,
              id: t._id
            }));
            setTasks(tasksData);
          }
        } else if (toggledItem.source === 'habit' && toggledItem.habitId) {
          // Refetch habits to get updated streak and lastCompleted
          const habitsRes = await habitAPI.getAll();
          if (habitsRes.success) {
            const habitsData = habitsRes.habits.map(h => ({
              ...h,
              id: h._id
            }));
            setHabits(habitsData);
          }
        }
        // Manual tasks: only exist in dailyPlan (already updated above)

      } else {
        showToast({ message: response.message || 'Failed to toggle task', status: 'error' })
      }
    } catch (error) {
      console.error('Error toggling daily plan task:', error);
      showToast({ message: error.message || 'Failed to toggle task', status: 'error' })
    }
  };

  // Update daily plan task - Backend Integration
  const updateDailyPlanTask = async (id, updates) => {
    try {
      // For now, update locally (backend doesn't have update endpoint for individual planned tasks)
      // This is typically used for time adjustments, which are plan-specific
      setDailyPlan(prev => ({
        ...prev,
        plannedTasks: prev.plannedTasks.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      }));
    } catch (error) {
      console.error('Error updating daily plan task:', error);
      showToast({ message: error.message || 'Failed to update task', status: 'error' })
    }
  };

  // Clear daily plan - Backend Integration
  const clearDailyPlan = async () => {
    try {
      const response = await dailyPlanAPI.clear();
      if (response.success) {
        const today = new Date().toISOString().split('T')[0];
        setDailyPlan({ date: today, plannedTasks: [] });
        showToast({ message: response.message || 'Daily plan cleared', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to clear daily plan', status: 'error' })
      }
    } catch (error) {
      console.error('Error clearing daily plan:', error);
      showToast({ message: error.message || 'Failed to clear daily plan', status: 'error' })
    }
  };

  // ========== END DAILY PLAN FUNCTIONS ==========

  const clearAllData = () => {
    setGoals([]);
    setProjects([]);
    setTasks([]);
    setHabits([]);
    setDailyPlan({ date: new Date().toISOString().split('T')[0], plannedTasks: [] });
    setScores({ productivity: 0, discipline: 0 });
    setUser(null);
  };

  // AUTO SAVE DAILY STATS (debounced to prevent duplicate docs under concurrent writes)
  const saveStatsTimer = useRef(null);

  useEffect(() => {
    if (!token || !user || !dailyPlan) return;

    if (saveStatsTimer.current) {
      clearTimeout(saveStatsTimer.current);
    }

    saveStatsTimer.current = setTimeout(async () => {
      try {
        const productivity = calculateProductivityScore();
        const discipline = calculateDisciplineScore();

        await statsAPI.save({
          productivity,
          discipline
        });

      } catch (error) {
        console.log("Stats save failed:", error);
      }
    }, 2000);

    return () => {
      if (saveStatsTimer.current) {
        clearTimeout(saveStatsTimer.current);
      }
    };

  }, [token, user, dailyPlan, calculateProductivityScore, calculateDisciplineScore]);

  const value = {
    token,
    user,
    setUser,
    setToken,
    navigate,
    backendURL,
    loading,
    goals,
    projects,
    tasks,
    habits,
    dailyPlan,
    scores,
    updateUser,
    updateUserProfilePic,
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
    handleCompleteHabit,
    deleteHabit,
    notebooks,
    pages,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    loadPages,
    createPage,
    updatePage,
    deletePage,
    updateScores,
    addToDailyPlan,
    removeFromDailyPlan,
    createManualDailyTask,
    toggleDailyPlanTaskCompletion,
    updateDailyPlanTask,
    clearDailyPlan,
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
