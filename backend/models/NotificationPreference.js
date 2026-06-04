const mongoose = require('mongoose');

const NotificationPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  taskDeadlines: {
    enabled: { type: Boolean, default: true },
    hoursBefore: { type: Number, default: 2 },
    overdueRepeat: { type: Boolean, default: true }
  },
  dailyPlanner: {
    enabled: { type: Boolean, default: true },
    morningTime: { type: String, default: '09:00' },
    eveningTime: { type: String, default: '20:00' }
  },
  habitStreaks: {
    enabled: { type: Boolean, default: true },
    warningTime: { type: String, default: '20:00' }
  },
  quietHours: {
    enabled: { type: Boolean, default: false },
    start: { type: String, default: '22:00' },
    end: { type: String, default: '08:00' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NotificationPreference', NotificationPreferenceSchema);