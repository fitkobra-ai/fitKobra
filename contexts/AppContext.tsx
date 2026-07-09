import React, {
  createContext, useContext, useEffect, useRef, useState,
  useCallback, type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProfile, getUserGoals, getDailyStats, getRecentWorkouts,
  getUnlockedAchievements, saveDailyStats, unlockAchievement,
  listenWorkouts, type UserProfile, type UserGoals,
  type DailyStats, type WorkoutRecord,
} from '../services/firestore';
import { getTodayStepCount, watchStepCount } from '../services/pedometer';
import { stepsToCalories, stepsToDistanceKm, recommendedDailySteps } from '../utils/calculations';
import { todayKey } from '../utils/dates';
import { ACHIEVEMENTS, type AchievementStats } from '../constants/Achievements';
import { IS_FIREBASE_CONFIGURED } from '../services/firebase';

// ─── Types ────────────────────────────────────────────────────

interface AppContextValue {
  profile: UserProfile | null;
  goals: UserGoals | null;
  todayStats: DailyStats;
  workouts: WorkoutRecord[];
  unlockedAchievements: string[];
  loadingProfile: boolean;
  refreshProfile: () => Promise<void>;
  setProfile: (p: UserProfile) => void;
  setGoals: (g: UserGoals) => void;
  addWorkout: (w: WorkoutRecord) => void;
}

const DEFAULT_STATS: DailyStats = {
  date: todayKey(),
  steps: 0,
  caloriesBurned: 0,
  distanceKm: 0,
  activeMinutes: 0,
};

const AppContext = createContext<AppContextValue>({
  profile: null,
  goals: null,
  todayStats: DEFAULT_STATS,
  workouts: [],
  unlockedAchievements: [],
  loadingProfile: true,
  refreshProfile: async () => {},
  setProfile: () => {},
  setGoals: () => {},
  addWorkout: () => {},
});

// ─── Provider ─────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [goals, setGoalsState] = useState<UserGoals | null>(null);
  const [todayStats, setTodayStats] = useState<DailyStats>(DEFAULT_STATS);
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Track the step watcher cleanup reference
  const stepWatcherCleanup = useRef<(() => void) | null>(null);
  // How many steps saved since last Firestore write
  const pendingSteps = useRef(0);

  // ─── Load user data when uid changes ────────────────────────

  const loadUserData = useCallback(async () => {
    if (!uid || !IS_FIREBASE_CONFIGURED) {
      setLoadingProfile(false);
      return;
    }

    try {
      const [prof, userGoals, todayStat, recentWorkouts, achievementIds] = await Promise.all([
        getUserProfile(uid),
        getUserGoals(uid),
        getDailyStats(uid, todayKey()),
        getRecentWorkouts(uid, 20),
        getUnlockedAchievements(uid),
      ]);

      setProfileState(prof);
      setGoalsState(userGoals);
      setTodayStats(todayStat ?? { ...DEFAULT_STATS, date: todayKey() });
      setWorkouts(recentWorkouts);
      setUnlockedAchievements(achievementIds);
    } catch (err) {
      console.error('[AppContext] Failed to load user data:', err);
    } finally {
      setLoadingProfile(false);
    }
  }, [uid]);

  useEffect(() => {
    setLoadingProfile(true);
    loadUserData();
  }, [loadUserData]);

  // ─── Real-time workout listener ─────────────────────────────

  useEffect(() => {
    if (!uid || !IS_FIREBASE_CONFIGURED) return;
    const unsub = listenWorkouts(uid, setWorkouts);
    return unsub;
  }, [uid]);

  // ─── Pedometer: step counting ────────────────────────────────

  const midnightSteps = useRef(0);
  const lastSavedSteps = useRef(0);

  useEffect(() => {
    if (!uid) return;

    // Get today's count to initialise
    getTodayStepCount().then(steps => {
      midnightSteps.current = steps;
      lastSavedSteps.current = steps;
      if (steps > 0 && profile) {
        const cals = stepsToCalories(steps, profile.weightKg, profile.heightCm);
        const dist = stepsToDistanceKm(steps, profile.heightCm);
        setTodayStats(prev => ({
          ...prev,
          steps,
          caloriesBurned: cals,
          distanceKm: dist,
        }));
      }
    });

    // Subscribe to live updates. 
    // Expo watchStepCount returns the total steps taken since the subscription started.
    stepWatcherCleanup.current = watchStepCount(watchSteps => {
      setTodayStats(prev => {
        const newSteps = midnightSteps.current + watchSteps;
        const cals = profile
          ? stepsToCalories(newSteps, profile.weightKg, profile.heightCm)
          : 0;
        const dist = profile
          ? stepsToDistanceKm(newSteps, profile.heightCm)
          : 0;

        // Batch write every 50 steps to minimise Firestore writes
        if (newSteps - lastSavedSteps.current >= 50) {
          lastSavedSteps.current = newSteps;
          saveDailyStats(uid, todayKey(), {
            steps: newSteps,
            caloriesBurned: cals,
            distanceKm: dist,
          }).catch(console.error);
        }

        return { ...prev, steps: newSteps, caloriesBurned: cals, distanceKm: dist };
      });
    });

    return () => {
      stepWatcherCleanup.current?.();
    };
  }, [uid, profile]);

  // ─── Achievement checker ─────────────────────────────────────

  useEffect(() => {
    if (!uid || workouts.length === 0) return;
    const stats: AchievementStats = {
      totalWorkouts: workouts.length,
      totalSteps: todayStats.steps,
      totalCalories: workouts.reduce((s, w) => s + w.caloriesBurned, 0),
      longestWorkoutMin: workouts.reduce((m, w) => Math.max(m, w.durationSeconds / 60), 0),
      streakDays: 0, // simplified — full streak calc in getAggregateStats
      totalDistanceKm: workouts.reduce((s, w) => s + (w.distanceKm ?? 0), 0),
    };

    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.check(stats)) {
        unlockAchievement(uid, achievement.id).then(() => {
          setUnlockedAchievements(prev => [...prev, achievement.id]);
        }).catch(console.error);
      }
    });
  }, [workouts, todayStats.steps]);

  // ─── Setters ─────────────────────────────────────────────────

  const setProfile = useCallback((p: UserProfile) => setProfileState(p), []);
  const setGoals = useCallback((g: UserGoals) => setGoalsState(g), []);
  const addWorkout = useCallback((w: WorkoutRecord) => {
    setWorkouts(prev => [w, ...prev]);
    // Also update today's active minutes and calories
    setTodayStats(prev => {
      const updated = {
        ...prev,
        activeMinutes: prev.activeMinutes + Math.max(1, Math.floor(w.durationSeconds / 60)),
        caloriesBurned: prev.caloriesBurned + w.caloriesBurned,
      };
      if (uid) {
        saveDailyStats(uid, todayKey(), {
          steps: updated.steps,
          caloriesBurned: updated.caloriesBurned,
          distanceKm: updated.distanceKm,
          activeMinutes: updated.activeMinutes,
        }).catch(console.error);
      }
      return updated;
    });
  }, [uid]);

  const value = React.useMemo(() => ({
    profile,
    goals,
    todayStats,
    workouts,
    unlockedAchievements,
    loadingProfile,
    refreshProfile: loadUserData,
    setProfile,
    setGoals,
    addWorkout,
  }), [profile, goals, todayStats, workouts, unlockedAchievements, loadingProfile, loadUserData, setProfile, setGoals, addWorkout]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  return useContext(AppContext);
}
