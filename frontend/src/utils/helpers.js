export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const calculateStreak = (completedDays) => {
  // Simple streak calculation - can be enhanced
  return completedDays || 0;
};

export const getProductivityScore = (data) => {
  // Calculate average productivity from data
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, item) => acc + item.productivity, 0);
  return Math.round(sum / data.length);
};

export const getConsistencyScore = (habits) => {
  if (!habits || habits.length === 0) return 0;
  const completedCount = habits.filter(h => h.completed).length;
  return Math.round((completedCount / habits.length) * 100);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};