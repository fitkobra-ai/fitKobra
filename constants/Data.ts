// Sample data for demo purposes
export const todayStats = {
  steps: 8432,
  stepsGoal: 10000,
  calories: 487,
  caloriesGoal: 650,
  activeMinutes: 38,
  activeMinutesGoal: 60,
  distance: 6.2,
  distanceGoal: 8,
  heartRate: 72,
  standHours: 9,
  standHoursGoal: 12,
  streak: 14,
};

export const weeklyData = [
  { day: 'M', steps: 7200, calories: 420 },
  { day: 'T', steps: 9800, calories: 580 },
  { day: 'W', steps: 4300, calories: 290 },
  { day: 'T', steps: 11200, calories: 670 },
  { day: 'F', steps: 6500, calories: 390 },
  { day: 'S', steps: 13100, calories: 780 },
  { day: 'S', steps: 8432, calories: 487 },
];

export const recentWorkouts = [
  {
    id: '1',
    type: 'Running',
    emoji: '🏃',
    duration: '45 min',
    calories: 487,
    distance: '6.2 km',
    date: 'Today',
    color: '#10b981',
  },
  {
    id: '2',
    type: 'Weight Training',
    emoji: '🏋️',
    duration: '62 min',
    calories: 342,
    distance: null,
    date: 'Yesterday',
    color: '#ef4444',
  },
  {
    id: '3',
    type: 'Cycling',
    emoji: '🚴',
    duration: '30 min',
    calories: 298,
    distance: '12.4 km',
    date: 'Mon',
    color: '#3b82f6',
  },
  {
    id: '4',
    type: 'Yoga',
    emoji: '🧘',
    duration: '45 min',
    calories: 168,
    distance: null,
    date: 'Sun',
    color: '#8b5cf6',
  },
  {
    id: '5',
    type: 'HIIT',
    emoji: '⚡',
    duration: '25 min',
    calories: 410,
    distance: null,
    date: 'Sat',
    color: '#f97316',
  },
];

export const workoutTypes = [
  { id: 'run', label: 'Running', emoji: '🏃', color: '#10b981' },
  { id: 'cycle', label: 'Cycling', emoji: '🚴', color: '#3b82f6' },
  { id: 'lift', label: 'Weights', emoji: '🏋️', color: '#ef4444' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘', color: '#8b5cf6' },
  { id: 'swim', label: 'Swimming', emoji: '🏊', color: '#06b6d4' },
  { id: 'hiit', label: 'HIIT', emoji: '⚡', color: '#f97316' },
  { id: 'walk', label: 'Walking', emoji: '🚶', color: '#a3e635' },
  { id: 'other', label: 'Other', emoji: '🎯', color: '#ec4899' },
];

export const achievements = [
  { id: '1', title: '7-Day Streak', emoji: '🔥', unlocked: true, desc: 'Worked out 7 days in a row' },
  { id: '2', title: 'Marathon Ready', emoji: '🏅', unlocked: true, desc: 'Ran 42km total' },
  { id: '3', title: 'Early Bird', emoji: '🌅', unlocked: true, desc: '5 workouts before 7am' },
  { id: '4', title: '10K Steps Club', emoji: '👟', unlocked: false, desc: 'Hit 10K steps 10 days' },
  { id: '5', title: 'Iron Will', emoji: '💪', unlocked: false, desc: 'Complete 50 workouts' },
  { id: '6', title: 'Calorie Crusher', emoji: '⚡', unlocked: false, desc: 'Burn 5000 kcal in a week' },
];

export const monthlyData = [
  { week: 'W1', steps: 52000, calories: 2800 },
  { week: 'W2', steps: 68000, calories: 3600 },
  { week: 'W3', steps: 45000, calories: 2400 },
  { week: 'W4', steps: 71000, calories: 3900 },
];

export const userProfile = {
  name: 'Alex Johnson',
  initials: 'AJ',
  age: 28,
  weight: 75,
  height: 178,
  goal: 'Weight Loss',
  level: 'Intermediate',
};
