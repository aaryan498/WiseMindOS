import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

const NotificationSettings = () => {
  const { 
    preferences, 
    loading, 
    permissionGranted, 
    requestPermission, 
    updatePreferences 
  } = useNotification();

  const [localPrefs, setLocalPrefs] = useState(null);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleToggle = async (section, field, value) => {
    if (!localPrefs) return;

    const updated = { ...localPrefs };
    if (section === 'main') {
      updated.enabled = value;
    } else if (section === 'taskDeadlines') {
      updated.taskDeadlines = { ...updated.taskDeadlines, enabled: value };
    } else if (section === 'dailyPlanner') {
      updated.dailyPlanner = { ...updated.dailyPlanner, enabled: value };
    } else if (section === 'habitStreaks') {
      updated.habitStreaks = { ...updated.habitStreaks, enabled: value };
    } else if (section === 'quietHours') {
      updated.quietHours = { ...updated.quietHours, enabled: value };
    }

    setLocalPrefs(updated);
    await updatePreferences(updated);
  };

  const handleTimeChange = async (section, field, value) => {
    if (!localPrefs) return;

    const updated = { ...localPrefs };
    if (section === 'dailyPlanner') {
      updated.dailyPlanner = { ...updated.dailyPlanner, [field]: value };
    } else if (section === 'quietHours') {
      updated.quietHours = { ...updated.quietHours, [field]: value };
    }

    setLocalPrefs(updated);
    await updatePreferences(updated);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🔔 Notification Settings</h2>

      {/* Permission Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Browser Permission</h3>
            <p className="text-sm text-gray-600">
              {permissionGranted 
                ? '✅ Notifications are enabled' 
                : '❌ Notifications are blocked or not granted'}
            </p>
          </div>
          {!permissionGranted && (
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Enable Notifications
            </button>
          )}
        </div>
      </div>

      {/* Master Enable/Disable */}
      <div className="mb-6 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-800">🔔 All Notifications</h3>
          <p className="text-sm text-gray-600">Master switch for all notifications</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={localPrefs?.enabled || false}
            onChange={(e) => handleToggle('main', null, e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      </div>

      {/* Task Deadlines */}
      <div className="mb-6 flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-800">⏰ Task Deadlines</h3>
          <p className="text-sm text-gray-600">Get alerts for due soon and overdue tasks</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={localPrefs?.taskDeadlines?.enabled || false}
            onChange={(e) => handleToggle('taskDeadlines', null, e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      </div>

      {/* Daily Planner */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800">📅 Daily Planner</h3>
            <p className="text-sm text-gray-600">Morning and evening reminders</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={localPrefs?.dailyPlanner?.enabled || false}
              onChange={(e) => handleToggle('dailyPlanner', null, e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>
        {localPrefs?.dailyPlanner?.enabled && (
          <div className="grid grid-cols-2 gap-4 ml-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Morning Time</label>
              <input
                type="time"
                value={localPrefs.dailyPlanner.morningTime || '09:00'}
                onChange={(e) => handleTimeChange('dailyPlanner', 'morningTime', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Evening Time</label>
              <input
                type="time"
                value={localPrefs.dailyPlanner.eveningTime || '20:00'}
                onChange={(e) => handleTimeChange('dailyPlanner', 'eveningTime', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Habit Streaks */}
      <div className="mb-6 flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-800">💪 Habit Streaks</h3>
          <p className="text-sm text-gray-600">Reminders to complete daily habits</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={localPrefs?.habitStreaks?.enabled || false}
            onChange={(e) => handleToggle('habitStreaks', null, e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      </div>

      {/* Quiet Hours */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800">🌙 Quiet Hours</h3>
            <p className="text-sm text-gray-600">Don't disturb during these hours</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={localPrefs?.quietHours?.enabled || false}
              onChange={(e) => handleToggle('quietHours', null, e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>
        {localPrefs?.quietHours?.enabled && (
          <div className="grid grid-cols-2 gap-4 ml-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Start Time</label>
              <input
                type="time"
                value={localPrefs.quietHours.start || '22:00'}
                onChange={(e) => handleTimeChange('quietHours', 'start', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">End Time</label>
              <input
                type="time"
                value={localPrefs.quietHours.end || '08:00'}
                onChange={(e) => handleTimeChange('quietHours', 'end', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;