const express = require('express');
const router = express.Router();
const NotificationPreference = require('../models/NotificationPreference');
const auth = require('../middleware/auth');

// Get user's notification preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    let preferences = await NotificationPreference.findOne({ user: req.user.id });
    
    if (!preferences) {
      // Create default preferences if none exist
      preferences = new NotificationPreference({ user: req.user.id });
      await preferences.save();
    }
    
    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    let preferences = await NotificationPreference.findOne({ user: req.user.id });
    
    if (!preferences) {
      preferences = new NotificationPreference({ user: req.user.id });
    }
    
    // Update fields
    const { enabled, taskDeadlines, dailyPlanner, habitStreaks, quietHours } = req.body;
    
    if (enabled !== undefined) preferences.enabled = enabled;
    if (taskDeadlines) preferences.taskDeadlines = taskDeadlines;
    if (dailyPlanner) preferences.dailyPlanner = dailyPlanner;
    if (habitStreaks) preferences.habitStreaks = habitStreaks;
    if (quietHours) preferences.quietHours = quietHours;
    
    await preferences.save();
    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks due soon for notifications
router.get('/due-tasks', auth, async (req, res) => {
  try {
    const Task = require('../models/Task');
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const dueTasks = await Task.find({
      user: req.user.id,
      dueDate: { $gte: now, $lte: twoHoursLater },
      completed: false
    });
    
    res.json(dueTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;