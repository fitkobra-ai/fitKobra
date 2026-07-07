export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  totalWorkouts: number;
  totalSteps: number;
  totalCalories: number;
  longestWorkoutMin: number;
  streakDays: number;
  totalDistanceKm: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_workout',
    title: 'First Step',
    description: 'Complete your first workout',
    emoji: '🌱',
    check: s => s.totalWorkouts >= 1,
  },
  {
    id: 'steps_1000',
    title: 'Getting Moving',
    description: 'Walk 1,000 steps in a day',
    emoji: '👟',
    check: s => s.totalSteps >= 1000,
  },
  {
    id: 'steps_10000',
    title: '10K Club',
    description: 'Reach 10,000 steps in a day',
    emoji: '🏅',
    check: s => s.totalSteps >= 10000,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: '7-day workout streak',
    emoji: '🔥',
    check: s => s.streakDays >= 7,
  },
  {
    id: 'streak_30',
    title: 'Iron Habit',
    description: '30-day workout streak',
    emoji: '💎',
    check: s => s.streakDays >= 30,
  },
  {
    id: 'workouts_10',
    title: 'Committed',
    description: 'Complete 10 workouts',
    emoji: '💪',
    check: s => s.totalWorkouts >= 10,
  },
  {
    id: 'workouts_50',
    title: 'Iron Will',
    description: 'Complete 50 workouts',
    emoji: '🏆',
    check: s => s.totalWorkouts >= 50,
  },
  {
    id: 'distance_42',
    title: 'Marathon Ready',
    description: 'Cover 42 km total distance',
    emoji: '🗺️',
    check: s => s.totalDistanceKm >= 42,
  },
  {
    id: 'calories_5000',
    title: 'Calorie Crusher',
    description: 'Burn 5,000 calories total',
    emoji: '⚡',
    check: s => s.totalCalories >= 5000,
  },
  {
    id: 'long_workout',
    title: 'Endurance King',
    description: 'Complete a 60+ minute workout',
    emoji: '👑',
    check: s => s.longestWorkoutMin >= 60,
  },
];
