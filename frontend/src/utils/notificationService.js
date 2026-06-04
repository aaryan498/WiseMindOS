// Notification Service for WiseMindOS

class NotificationService {
  constructor() {
    this.permission = null;
    this.preferences = null;
  }

  // Request permission from user
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  // Send a notification
  sendNotification(title, options = {}) {
    if (this.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/logo192.png',
        badge: '/favicon.ico',
        ...options
      });

      // Handle click on notification
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        if (options.onClick) {
          options.onClick();
        }
        notification.close();
      };

      return notification;
    } else {
      // Fallback to console
      console.log(`[Notification] ${title}:`, options.body);
      return null;
    }
  }

  // Task deadline notification
  notifyTaskDue(task) {
    const hoursLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60));
    
    if (hoursLeft <= 2 && hoursLeft > 0) {
      this.sendNotification('⏰ Task Due Soon!', {
        body: `"${task.title}" is due in ${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}!`,
        tag: `task-${task._id}`,
        requireInteraction: true,
        onClick: () => {
          window.location.href = '/tasks';
        }
      });
    }
  }

  // Overdue task notification
  notifyTaskOverdue(task) {
    this.sendNotification('⚠️ Task Overdue!', {
      body: `"${task.title}" is overdue. Please complete it soon.`,
      tag: `task-overdue-${task._id}`,
      requireInteraction: true,
      onClick: () => {
        window.location.href = '/tasks';
      }
    });
  }

  // Habit streak warning
  notifyHabitReminder(habit) {
    this.sendNotification('💪 Habit Reminder!', {
      body: `Don't forget to complete your habit: "${habit.name}" today!`,
      tag: `habit-${habit._id}`,
      onClick: () => {
        window.location.href = '/habits';
      }
    });
  }

  // Morning planner reminder
  notifyMorningPlan(tasksCount) {
    this.sendNotification('🌅 Good Morning! Plan Your Day', {
      body: `You have ${tasksCount} task${tasksCount !== 1 ? 's' : ''} planned for today. Let's make it productive!`,
      tag: 'morning-plan',
      onClick: () => {
        window.location.href = '/daily-plan';
      }
    });
  }

  // Evening summary
  notifyEveningSummary(completed, pending) {
    this.sendNotification('📊 Day Summary', {
      body: `Today: ${completed} completed, ${pending} pending. Great work! 🎉`,
      tag: 'evening-summary',
      onClick: () => {
        window.location.href = '/dashboard';
      }
    });
  }

  // Streak milestone
  notifyStreakMilestone(habitName, streakDays) {
    this.sendNotification('🎉 Streak Milestone!', {
      body: `Amazing! You've maintained "${habitName}" for ${streakDays} days in a row!`,
      tag: `streak-${habitName}`,
      onClick: () => {
        window.location.href = '/habits';
      }
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Auto-request permission on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    notificationService.requestPermission();
  });
} else {
  notificationService.requestPermission();
}

export default notificationService;