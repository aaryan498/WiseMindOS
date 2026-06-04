const cron = require('node-cron');
const mongoose = require('mongoose');
const NotificationPreference = require('../models/NotificationPreference');

// Helper function to check if within quiet hours
function isWithinQuietHours(preferences, currentTime) {
  if (!preferences?.quietHours?.enabled) return false;
  
  const now = currentTime || new Date();
  const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const start = preferences.quietHours.start;
  const end = preferences.quietHours.end;
  
  if (start < end) {
    return currentTimeStr >= start && currentTimeStr < end;
  } else {
    return currentTimeStr >= start || currentTimeStr < end;
  }
}

// Check for due tasks and send notifications
async function checkDueTasks() {
  try {
    const Task = mongoose.model('Task');
    const User = mongoose.model('User');
    
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    // Find tasks due in next 2 hours
    const dueTasks = await Task.find({
      dueDate: { $gte: now, $lte: twoHoursLater },
      completed: false,
      notified: { $ne: true } // Only notify once
    }).populate('user');
    
    for (const task of dueTasks) {
      const preferences = await NotificationPreference.findOne({ user: task.user._id });
      
      if (preferences?.enabled && preferences?.taskDeadlines?.enabled) {
        if (!isWithinQuietHours(preferences)) {
          // Mark as notified
          task.notified = true;
          await task.save();
          
          console.log(`[NOTIFICATION] Task due soon: "${task.title}" for user ${task.user.email}`);
          // Here you can implement email or WebSocket notification
        }
      }
    }
  } catch (error) {
    console.error('Error checking due tasks:', error);
  }
}

// Send morning planner reminders
async function sendMorningReminders() {
  try {
    const User = mongoose.model('User');
    const users = await User.find();
    
    for (const user of users) {
      const preferences = await NotificationPreference.findOne({ user: user._id });
      
      if (preferences?.enabled && preferences?.dailyPlanner?.enabled) {
        const currentTime = new Date();
        const currentTimeStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
        const morningTime = preferences.dailyPlanner.morningTime || '09:00';
        
        if (currentTimeStr === morningTime && !isWithinQuietHours(preferences)) {
          console.log(`[NOTIFICATION] Morning reminder for user ${user.email}`);
          // Implement email/WebSocket notification here
        }
      }
    }
  } catch (error) {
    console.error('Error sending morning reminders:', error);
  }
}

// Send evening summary reminders
async function sendEveningReminders() {
  try {
    const User = mongoose.model('User');
    const users = await User.find();
    
    for (const user of users) {
      const preferences = await NotificationPreference.findOne({ user: user._id });
      
      if (preferences?.enabled && preferences?.dailyPlanner?.enabled) {
        const currentTime = new Date();
        const currentTimeStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
        const eveningTime = preferences.dailyPlanner.eveningTime || '20:00';
        
        if (currentTimeStr === eveningTime && !isWithinQuietHours(preferences)) {
          console.log(`[NOTIFICATION] Evening summary for user ${user.email}`);
          // Implement email/WebSocket notification here
        }
      }
    }
  } catch (error) {
    console.error('Error sending evening reminders:', error);
  }
}

// Initialize all cron jobs
function initNotificationScheduler() {
  // Check for due tasks every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    console.log('Running due tasks check...');
    checkDueTasks();
  });
  
  // Check for morning reminders every minute (will match exact time)
  cron.schedule('* * * * *', () => {
    sendMorningReminders();
  });
  
  // Check for evening reminders every minute
  cron.schedule('* * * * *', () => {
    sendEveningReminders();
  });
  
  console.log('✅ Notification scheduler initialized');
}

module.exports = { initNotificationScheduler };