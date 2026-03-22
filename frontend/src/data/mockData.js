// Mock data for WiseMindOS

export const weeklyProductivityData = [
  { name: 'Mon', productivity: 75 },
  { name: 'Tue', productivity: 82 },
  { name: 'Wed', productivity: 68 },
  { name: 'Thu', productivity: 85 },
  { name: 'Fri', productivity: 78 },
  { name: 'Sat', productivity: 90 },
  { name: 'Sun', productivity: 72 },
];

export const habitCompletionData = [
  { name: 'Exercise', completion: 85 },
  { name: 'Reading', completion: 70 },
  { name: 'Meditation', completion: 90 },
  { name: 'Study', completion: 75 },
  { name: 'Water', completion: 95 },
];

export const timeDistributionData = [
  { name: 'Study', value: 30 },
  { name: 'Exercise', value: 15 },
  { name: 'Sleep', value: 35 },
  { name: 'Leisure', value: 20 },
];

export const monthlyProgressData = [
  { name: 'Week 1', progress: 65 },
  { name: 'Week 2', progress: 72 },
  { name: 'Week 3', progress: 78 },
  { name: 'Week 4', progress: 85 },
];

export const mockHabits = [
  { id: 1, name: 'Morning Exercise', completed: false, streak: 12 },
  { id: 2, name: 'Read 30 mins', completed: true, streak: 8 },
  { id: 3, name: 'Meditation', completed: true, streak: 15 },
  { id: 4, name: 'Drink 8 glasses water', completed: false, streak: 20 },
  { id: 5, name: 'Study 4 hours', completed: false, streak: 5 },
];

export const mockTasks = [
  { id: 1, title: 'Complete React assignment', status: 'pending', priority: 'high' },
  { id: 2, title: 'Review code PR', status: 'completed', priority: 'medium' },
  { id: 3, title: 'Update documentation', status: 'pending', priority: 'low' },
  { id: 4, title: 'Team meeting prep', status: 'pending', priority: 'high' },
];

export const mockGoals = [
  { 
    id: 1, 
    title: 'Master React Development', 
    progress: 65, 
    deadline: '2025-12-31',
    description: 'Learn advanced React patterns and best practices'
  },
  { 
    id: 2, 
    title: 'Improve Physical Fitness', 
    progress: 80, 
    deadline: '2025-09-30',
    description: 'Exercise 5 days a week, lose 10kg'
  },
  { 
    id: 3, 
    title: 'Learn Data Structures', 
    progress: 40, 
    deadline: '2025-10-15',
    description: 'Complete DSA course and solve 200 problems'
  },
];

export const mockProjects = [
  { id: 1, name: 'E-commerce App', progress: 75, tasksCompleted: 15, totalTasks: 20 },
  { id: 2, name: 'Portfolio Website', progress: 100, tasksCompleted: 10, totalTasks: 10 },
  { id: 3, name: 'Mobile App UI', progress: 45, tasksCompleted: 9, totalTasks: 20 },
];

export const mockDailyLog = {
  studyHours: 4,
  sleepHours: 7,
  tasksCompleted: 5,
  date: new Date().toISOString().split('T')[0]
};

export const futureTwinMockResponse = {
  query: '',
  feasibility: 'High',
  isGood: true,
  benefits: [
    'Significant improvement in skills and knowledge within 3 months',
    'Enhanced cognitive abilities and focus',
    'Better career opportunities and growth',
    'Increased confidence and self-discipline',
    'Long-term habit formation for continuous learning'
  ],
  consequences: [
    'Requires consistent daily commitment of 4+ hours',
    'May need to sacrifice some leisure activities initially',
    'Potential burnout if proper rest is not maintained',
    'Social life adjustments might be necessary',
    'Initial difficulty in maintaining the routine'
  ],
  insights: [
    'Maintaining 4 hours of focused study daily will significantly improve your skills within 3 months. The compound effect of daily practice is exponential.',
    'You\'ll need to ensure proper rest (7-8 hours sleep) to sustain this routine. Sleep is crucial for memory consolidation and learning.',
    'Consistency is more important than intensity - small daily progress compounds over time. Missing one day won\'t ruin progress, but consistency over weeks will.',
    'Consider the 80/20 rule: 20% of your study topics will give you 80% of results. Focus on high-impact learning.',
    'Build accountability systems: join study groups, share progress publicly, or find an accountability partner to increase success rate by 65%.'
  ]
};