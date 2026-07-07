import {
  collection, doc, setDoc, getDoc, updateDoc,
  getDocs, addDoc, query, orderBy, limit, where,
  Timestamp, onSnapshot, type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ───────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  dateOfBirth: string;       // YYYY-MM-DD
  weightKg: number;
  heightCm: number;
  gender: 'male' | 'female' | 'other';
  goal: string;              // weight_loss | build_muscle | improve_endurance | general_health
  activityLevel: string;     // sedentary | lightly_active | moderately_active | very_active
  unit: 'metric' | 'imperial';
  photoURL?: string;
  notifications?: {
    workoutReminders: boolean;
    mealReminders: boolean;
    goalProgress: boolean;
    appUpdates: boolean;
  };
  createdAt: string;
}

export interface UserGoals {
  dailySteps: number;
  dailyCaloriesBurn: number;
  dailyActiveMinutes: number;
}

export interface DailyStats {
  date: string;              // YYYY-MM-DD
  steps: number;
  caloriesBurned: number;
  distanceKm: number;
  activeMinutes: number;
}

export interface WorkoutRecord {
  id?: string;
  type: string;              // run | cycle | lift | yoga | swim | hiit | walk | other
  startedAt: string;         // ISO timestamp
  durationSeconds: number;
  caloriesBurned: number;
  distanceKm?: number;
  notes?: string;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

// ─── User Profile ─────────────────────────────────────────────

export async function saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
  await setDoc(doc(db, 'users', uid), { profile }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data().profile as UserProfile) : null;
}

export async function updateUserProfile(uid: string, partial: Partial<UserProfile>): Promise<void> {
  const ref = doc(db, 'users', uid);
  const updates: Record<string, any> = {};
  Object.entries(partial).forEach(([k, v]) => { updates[`profile.${k}`] = v; });
  await updateDoc(ref, updates);
}

// ─── User Goals ───────────────────────────────────────────────

export async function saveUserGoals(uid: string, goals: UserGoals): Promise<void> {
  await setDoc(doc(db, 'users', uid), { goals }, { merge: true });
}

export async function getUserGoals(uid: string): Promise<UserGoals | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data().goals as UserGoals) : null;
}

// ─── Daily Stats (Steps, Calories, Distance) ──────────────────

/** date format: YYYY-MM-DD */
export async function saveDailyStats(uid: string, dateKey: string, stats: Partial<DailyStats>): Promise<void> {
  const ref = doc(db, 'users', uid, 'dailyStats', dateKey);
  await setDoc(ref, { ...stats, date: dateKey }, { merge: true });
}

export async function getDailyStats(uid: string, dateKey: string): Promise<DailyStats | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'dailyStats', dateKey));
  return snap.exists() ? (snap.data() as DailyStats) : null;
}

/** Get stats for the last N days (sorted by date ascending). */
export async function getRecentDailyStats(uid: string, days: number = 7): Promise<DailyStats[]> {
  const q = query(
    collection(db, 'users', uid, 'dailyStats'),
    orderBy('date', 'asc'),
    limit(days)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as DailyStats);
}

// ─── Workouts ─────────────────────────────────────────────────

export async function saveWorkout(uid: string, workout: WorkoutRecord): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'workouts'), {
    ...workout,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function getRecentWorkouts(uid: string, count: number = 20): Promise<WorkoutRecord[]> {
  const q = query(
    collection(db, 'users', uid, 'workouts'),
    orderBy('startedAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkoutRecord));
}

/** Real-time listener for workouts. */
export function listenWorkouts(
  uid: string,
  onChange: (workouts: WorkoutRecord[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'users', uid, 'workouts'),
    orderBy('startedAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, snap => {
    onChange(snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkoutRecord)));
  });
}

// ─── Achievements ─────────────────────────────────────────────

export async function unlockAchievement(uid: string, achievementId: string): Promise<void> {
  await setDoc(
    doc(db, 'users', uid, 'achievements', achievementId),
    { unlockedAt: new Date().toISOString() },
    { merge: true }
  );
}

export async function getUnlockedAchievements(uid: string): Promise<string[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'achievements'));
  return snap.docs.map(d => d.id);
}

// ─── Aggregate Stats (for achievements) ───────────────────────

export async function getAggregateStats(uid: string) {
  const workouts = await getRecentWorkouts(uid, 200);
  const totalWorkouts = workouts.length;
  const totalCalories = workouts.reduce((s, w) => s + (w.caloriesBurned ?? 0), 0);
  const totalDistanceKm = workouts.reduce((s, w) => s + (w.distanceKm ?? 0), 0);
  const longestWorkoutMin = workouts.reduce((m, w) => Math.max(m, (w.durationSeconds ?? 0) / 60), 0);

  // Calculate streak
  const allStats = await getRecentDailyStats(uid, 90);
  let streakDays = 0;
  const todayKey = new Date().toISOString().slice(0, 10);
  let checkDate = new Date();
  for (let i = 0; i < 90; i++) {
    const key = checkDate.toISOString().slice(0, 10);
    const day = allStats.find(s => s.date === key);
    if (day && (day.steps > 500 || day.activeMinutes > 5)) {
      streakDays++;
    } else if (key !== todayKey) {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return { totalWorkouts, totalCalories, totalDistanceKm, longestWorkoutMin, streakDays };
}
