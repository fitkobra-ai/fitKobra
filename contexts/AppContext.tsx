import React, {
  createContext, useContext, useEffect, useRef, useState,
  useCallback, type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '../constants/FoodDatabase';
import { IS_FIREBASE_CONFIGURED } from '../services/firebase';

const PEDOMETER_CHECKPOINT_KEY = '@fitkobra_pedometer_checkpoint';

interface StepCheckpoint {
  date: string;
  lastHardwareReading: number;
  accumulatedTodaySteps: number;
}

// ─── Types ────────────────────────────────────────────────────

export type MealTime = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

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
  meals: Record<MealTime, FoodItem[]>;
  addFoodToMeal: (mealTime: MealTime, food: FoodItem) => void;
  removeFoodFromMeal: (mealTime: MealTime, foodId: string) => void;
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
  meals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
  addFoodToMeal: () => {},
  removeFoodFromMeal: () => {},
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
  const [meals, setMeals] = useState<Record<MealTime, FoodItem[]>>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  });

  // Track the step watcher cleanup reference
  const stepWatcherCleanup = useRef<(() => void) | null>(null);
  // How many steps saved since last Firestore write
  const pendingSteps = useRef(0);

  // ─── Load user data when uid changes ────────────────────────

  const loadUserData = useCallback(async () => {
    if (!uid || !IS_FIREBASE_CONFIGURED) {
      setProfileState(null);
      setGoalsState(null);
      setTodayStats({ ...DEFAULT_STATS, date: todayKey() });
      setWorkouts([]);
      setUnlockedAchievements([]);
      setMeals({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [] });
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



  // ─── Pedometer: background & pocket step counting ────────────────

  const checkpointRef = useRef<StepCheckpoint | null>(null);
  const lastSavedSteps = useRef<number>(0);

  const calculateAccurateMetrics = useCallback((steps: number) => {
    const height = profile?.heightCm ?? 175;
    const weight = profile?.weightKg ?? 70;
    const dist = stepsToDistanceKm(steps, height);
    const cals = stepsToCalories(steps, weight, height);
    return { dist, cals };
  }, [profile?.heightCm, profile?.weightKg]);

  // Load persistent checkpoint on mount
  useEffect(() => {
    AsyncStorage.getItem(PEDOMETER_CHECKPOINT_KEY).then(json => {
      if (json) {
        try {
          const parsed = JSON.parse(json) as StepCheckpoint;
          const currentDay = todayKey();
          if (parsed.date === currentDay) {
            checkpointRef.current = parsed;
            setTodayStats(prev => {
              const bestSteps = Math.max(prev.steps, parsed.accumulatedTodaySteps);
              const { dist, cals } = calculateAccurateMetrics(bestSteps);
              return { ...prev, steps: bestSteps, caloriesBurned: cals, distanceKm: dist };
            });
          }
        } catch (e) {
          console.warn('[AppContext] failed to parse pedometer checkpoint:', e);
        }
      }
    }).catch(console.error);
  }, [calculateAccurateMetrics]);

  const processHardwareSteps = useCallback((watchSteps: number) => {
    const currentDay = todayKey();
    let cp = checkpointRef.current;

    if (!cp || cp.date !== currentDay) {
      cp = {
        date: currentDay,
        lastHardwareReading: watchSteps,
        accumulatedTodaySteps: todayStats.steps,
      };
    } else {
      if (watchSteps < cp.lastHardwareReading) {
        // Device rebooted, raw hardware sensor count reset
        cp.lastHardwareReading = watchSteps;
      } else {
        const delta = watchSteps - cp.lastHardwareReading;
        if (delta > 0) {
          cp.accumulatedTodaySteps += delta;
          cp.lastHardwareReading = watchSteps;
        }
      }
    }

    checkpointRef.current = cp;
    AsyncStorage.setItem(PEDOMETER_CHECKPOINT_KEY, JSON.stringify(cp)).catch(console.error);

    const newSteps = Math.max(todayStats.steps, cp.accumulatedTodaySteps);
    const { dist, cals } = calculateAccurateMetrics(newSteps);

    setTodayStats(prev => {
      if (prev.steps === newSteps && prev.distanceKm === dist && prev.caloriesBurned === cals) {
        return prev;
      }
      return { ...prev, steps: newSteps, caloriesBurned: cals, distanceKm: dist };
    });

    if (uid && newSteps - lastSavedSteps.current >= 10) {
      lastSavedSteps.current = newSteps;
      saveDailyStats(uid, currentDay, {
        steps: newSteps,
        caloriesBurned: cals,
        distanceKm: dist,
      }).catch(console.error);
    }
  }, [todayStats.steps, calculateAccurateMetrics, uid]);

  const syncPedometerSteps = useCallback(() => {
    if (!uid) return;
    getTodayStepCount().then(hwSteps => {
      if (hwSteps <= 0) return;
      setTodayStats(prev => {
        const bestSteps = Math.max(prev.steps, hwSteps);
        const { dist, cals } = calculateAccurateMetrics(bestSteps);
        
        if (checkpointRef.current) {
          checkpointRef.current.accumulatedTodaySteps = bestSteps;
          AsyncStorage.setItem(PEDOMETER_CHECKPOINT_KEY, JSON.stringify(checkpointRef.current)).catch(console.error);
        }
        
        return {
          ...prev,
          steps: bestSteps,
          caloriesBurned: cals,
          distanceKm: dist,
        };
      });
    }).catch(err => {
      console.warn('[AppContext] getTodayStepCount error:', err);
    });
  }, [uid, calculateAccurateMetrics]);

  useEffect(() => {
    if (!uid) return;

    // Initial sync
    syncPedometerSteps();

    // Subscribe to live step ticks from hardware
    stepWatcherCleanup.current = watchStepCount(watchSteps => {
      processHardwareSteps(watchSteps);
    });

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        syncPedometerSteps();
      }
    };
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      stepWatcherCleanup.current?.();
      appStateSubscription.remove();
    };
  }, [uid, syncPedometerSteps, processHardwareSteps]);

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

  const addFoodToMeal = useCallback((mealTime: MealTime, food: FoodItem) => {
    setMeals(prev => ({
      ...prev,
      [mealTime]: [...prev[mealTime], food]
    }));
  }, []);

  const removeFoodFromMeal = useCallback((mealTime: MealTime, foodId: string) => {
    setMeals(prev => {
      const newMeals = [...prev[mealTime]];
      const index = newMeals.findIndex(f => f.id === foodId);
      if (index > -1) newMeals.splice(index, 1);
      return { ...prev, [mealTime]: newMeals };
    });
  }, []);

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
    meals,
    addFoodToMeal,
    removeFoodFromMeal,
  }), [profile, goals, todayStats, workouts, unlockedAchievements, loadingProfile, loadUserData, setProfile, setGoals, addWorkout, meals, addFoodToMeal, removeFoodFromMeal]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  return useContext(AppContext);
}
