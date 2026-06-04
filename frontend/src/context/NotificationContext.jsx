import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import notificationService from '../utils/notificationService';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  // Fetch user preferences
  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/notifications/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/api/notifications/preferences`, newPreferences, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreferences(response.data);
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  };

  // Request notification permission
  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermissionGranted(granted);
    return granted;
  };

  // Check due tasks
  const checkDueTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !preferences?.enabled) return;

      const response = await axios.get(`${API_URL}/api/notifications/due-tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      response.data.forEach(task => {
        notificationService.notifyTaskDue(task);
      });
    } catch (error) {
      console.error('Error checking due tasks:', error);
    }
  };

  // Send habit reminder
  const sendHabitReminder = (habit) => {
    if (preferences?.habitStreaks?.enabled) {
      notificationService.notifyHabitReminder(habit);
    }
  };

  // Send streak milestone
  const sendStreakMilestone = (habitName, streakDays) => {
    if (preferences?.habitStreaks?.enabled) {
      notificationService.notifyStreakMilestone(habitName, streakDays);
    }
  };

  // Check if quiet hours are active
  const isQuietHours = () => {
    if (!preferences?.quietHours?.enabled) return false;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const start = preferences.quietHours.start;
    const end = preferences.quietHours.end;
    
    if (start < end) {
      return currentTime >= start && currentTime < end;
    } else {
      // Overnight quiet hours
      return currentTime >= start || currentTime < end;
    }
  };

  useEffect(() => {
    fetchPreferences();
    
    // Check permission status
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  // Check due tasks every 5 minutes
  useEffect(() => {
    if (preferences?.enabled && permissionGranted) {
      checkDueTasks();
      const interval = setInterval(checkDueTasks, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [preferences, permissionGranted]);

  const value = {
    preferences,
    loading,
    permissionGranted,
    requestPermission,
    updatePreferences,
    sendHabitReminder,
    sendStreakMilestone,
    isQuietHours
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};