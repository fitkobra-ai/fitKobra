import {
  collection, doc, setDoc, getDoc, updateDoc,
  getDocs, addDoc, query, orderBy, limit, where,
  Timestamp, onSnapshot, type Unsubscribe, increment, deleteDoc
} from 'firebase/firestore';
import { todayKey } from '../utils/dates';
import { db, IS_FIREBASE_CONFIGURED } from './firebase';

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
  points?: number;
  currentStreak?: number;
  lastStreakDate?: string;
  referralCode?: string;
  usedReferralCode?: boolean;
  hasRedeemedReferral?: boolean;
  totalReferrals?: number;
  aiCredits?: number;
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

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FITKOBRA-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
  if (!profile.referralCode) {
    profile.referralCode = generateReferralCode();
  }
  if (profile.aiCredits === undefined) {
    profile.aiCredits = 10; // Start with 10 free AI credits
  }
  if (profile.points === undefined) {
    profile.points = 0;
  }
  await setDoc(doc(db, 'users', uid), { profile }, { merge: true });
}

export async function redeemReferralCode(uid: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a valid referral code.' };
    }

    const input = code.trim().toUpperCase();
    let raw = input.replace(/[^A-Z0-9]/g, '');
    if (raw.startsWith('FITKOBRA')) {
      raw = raw.replace(/^FITKOBRA/, '');
    } else if (raw.startsWith('KINEX')) {
      raw = raw.replace(/^KINEX/, '');
    }

    const cleanCode = raw ? `FITKOBRA-${raw}` : input;
    const legacyCode = raw ? `KINEX-${raw}` : input;

    // Master Promo Codes
    const PROMO_CODES = [
      'FITKOBRA-7A2F', 'FITKOBRA10', 'WELCOME10', 'BONUS10', 
      'FREE10', '7A2F', 'KINEX-7A2F', 'KINEX-FITKOBRA10'
    ];

    const isPromoMatch = PROMO_CODES.includes(cleanCode) || PROMO_CODES.includes(legacyCode) || PROMO_CODES.includes(input) || PROMO_CODES.includes(raw);

    // 1. Query Firestore for another user with this referral code
    let referrerDoc: any = null;
    let ownCodeMatch = false;

    if (uid && uid !== 'guest') {
      try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (userSnap && userSnap.exists()) {
          const userProfile = userSnap.data()?.profile;
          if (userProfile?.usedReferralCode) {
            return { success: false, message: 'You have already redeemed a referral code.' };
          }
          if (userProfile?.referralCode) {
            const userOwnCode = userProfile.referralCode.toUpperCase();
            if (userOwnCode === cleanCode || userOwnCode === input || userOwnCode === legacyCode) {
              ownCodeMatch = true;
            }
          }
        }
      } catch (e) {
        console.warn('[Referral] User doc check error:', e);
      }
    }

    if (ownCodeMatch) {
      return { success: false, message: 'You cannot use your own referral code.' };
    }

    if (!isPromoMatch) {
      try {
        const q = query(collection(db, 'users'), where('profile.referralCode', 'in', [cleanCode, legacyCode, input]));
        const snap = await getDocs(q);
        if (snap && !snap.empty) {
          const docMatch = snap.docs[0];
          if (docMatch.id === uid) {
            return { success: false, message: 'You cannot use your own referral code.' };
          }
          referrerDoc = docMatch;
        }
      } catch (e) {
        console.warn('Firestore query error during referral check:', e);
      }
    }

    // Valid referral code must be a promo match, a referrer doc match, or match standard FITKOBRA-XXXX format (4 alphanumeric chars)
    const isStandardFormat = /^FITKOBRA-[A-Z0-9]{4}$/.test(cleanCode) || /^KINEX-[A-Z0-9]{4}$/.test(legacyCode);
    const isValidFormat = isPromoMatch || referrerDoc || isStandardFormat;
    if (!isValidFormat) {
      return { success: false, message: 'Invalid referral code. Please check the code and try again.' };
    }

    // Award referrer if found
    if (referrerDoc) {
      try {
        await setDoc(referrerDoc.ref, { 
          profile: { 
            points: increment(50), 
            aiCredits: increment(10) 
          } 
        }, { merge: true });
      } catch (e) {
        console.warn('Referrer reward update error:', e);
      }
    }

    // Award current user
    if (uid && uid !== 'guest') {
      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, { 
          profile: { 
            usedReferralCode: true,
            points: increment(25),
            aiCredits: increment(10)
          } 
        }, { merge: true });
      } catch (e) {
        console.warn('Referee reward update error:', e);
      }
    }

    return { 
      success: true, 
      message: 'Referral code redeemed! +10 AI Credits & +25 Points unlocked 🎉' 
    };
  } catch (err: any) {
    console.error('redeemReferralCode error:', err);
    return { success: false, message: err?.message || 'Could not redeem referral code.' };
  }
}

export async function deleteUserData(uid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    
    // 1. Delete meals
    try {
      const mealsSnap = await getDocs(collection(userRef, 'meals'));
      for (const m of mealsSnap.docs) {
        await deleteDoc(m.ref).catch(() => {});
      }
    } catch (e) {
      console.warn('Notice: meals subcollection delete error:', e);
    }
    
    // 2. Delete workouts
    try {
      const workoutsSnap = await getDocs(collection(userRef, 'workouts'));
      for (const w of workoutsSnap.docs) {
        await deleteDoc(w.ref).catch(() => {});
      }
    } catch (e) {
      console.warn('Notice: workouts subcollection delete error:', e);
    }

    // 3. Delete goals if any
    try {
      const goalsSnap = await getDocs(collection(userRef, 'goals'));
      for (const g of goalsSnap.docs) {
        await deleteDoc(g.ref).catch(() => {});
      }
    } catch (e) {}

    // 4. Delete the main user doc
    await deleteDoc(userRef).catch((err) => {
      console.warn('Notice: main user doc delete error:', err);
    });
  } catch (err) {
    console.error('deleteUserData error:', err);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const profile = snap.data().profile as UserProfile;
  if (profile && !profile.referralCode) {
    profile.referralCode = generateReferralCode();
    await setDoc(doc(db, 'users', uid), { profile: { referralCode: profile.referralCode } }, { merge: true });
  }
  return profile;
}

export async function updateUserProfile(uid: string, partial: Partial<UserProfile>): Promise<void> {
  const ref = doc(db, 'users', uid);
  const updates: Record<string, any> = {};
  Object.entries(partial).forEach(([k, v]) => { updates[`profile.${k}`] = v; });
  await updateDoc(ref, updates);
}

export async function getLeaderboard(): Promise<(UserProfile & { id: string })[]> {
  try {
    const q = query(collection(db, 'users'));
    const snap = await getDocs(q);
    const users = snap.docs.map(d => {
      const profile = d.data().profile || {};
      return { id: d.id, ...profile } as (UserProfile & { id: string });
    });
    return users.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 100);
  } catch (err) {
    console.warn("Global leaderboard read failed (likely security rules). Returning fallback data.");
    return [
      { id: 'mock1', name: 'Sarah Connor', points: 12500, currentStreak: 45, dateOfBirth: '1990-01-01', weightKg: 65, heightCm: 170, gender: 'female', goal: 'weight_loss', activityLevel: 'very_active', unit: 'metric', createdAt: new Date().toISOString() },
      { id: 'mock2', name: 'John Doe', points: 9800, currentStreak: 32, dateOfBirth: '1985-01-01', weightKg: 80, heightCm: 180, gender: 'male', goal: 'build_muscle', activityLevel: 'moderately_active', unit: 'metric', createdAt: new Date().toISOString() },
      { id: 'mock3', name: 'Alex Smith', points: 8500, currentStreak: 21, dateOfBirth: '1992-01-01', weightKg: 70, heightCm: 175, gender: 'other', goal: 'general_health', activityLevel: 'lightly_active', unit: 'metric', createdAt: new Date().toISOString() },
      { id: 'mock4', name: 'Emily Chen', points: 7200, currentStreak: 15, dateOfBirth: '1995-01-01', weightKg: 60, heightCm: 165, gender: 'female', goal: 'improve_endurance', activityLevel: 'moderately_active', unit: 'metric', createdAt: new Date().toISOString() },
      { id: 'mock5', name: 'Michael Brown', points: 6100, currentStreak: 10, dateOfBirth: '1988-01-01', weightKg: 85, heightCm: 185, gender: 'male', goal: 'build_muscle', activityLevel: 'very_active', unit: 'metric', createdAt: new Date().toISOString() },
    ];
  }
}

export async function registerDailyStreak(uid: string, steps: number): Promise<{ pointsEarned: number, currentStreak: number, alreadyCheckedIn?: boolean }> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return { pointsEarned: 0, currentStreak: 0 };
  
  const profile = snap.data().profile as UserProfile;
  const today = todayKey(); // Consistent local date key (YYYY-MM-DD)
  
  if (profile.lastStreakDate === today) {
    return { pointsEarned: 0, currentStreak: profile.currentStreak || 1, alreadyCheckedIn: true };
  }
  
  let newStreak = (profile.currentStreak || 0) + 1;
  
  if (profile.lastStreakDate) {
    const [ly, lm, ld] = profile.lastStreakDate.split('-').map(Number);
    const lastDate = new Date(ly, lm - 1, ld);
    const [cy, cm, cd] = today.split('-').map(Number);
    const currDate = new Date(cy, cm - 1, cd);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const basePoints = Math.floor(steps / 10);
  const bonus = newStreak > 1 ? 500 : 0;
  const totalEarned = Math.max(25, basePoints + bonus);
  const newTotalPoints = (profile.points || 0) + totalEarned;
  
  await updateUserProfile(uid, {
    points: newTotalPoints,
    currentStreak: newStreak,
    lastStreakDate: today
  });
  
  return { pointsEarned: totalEarned, currentStreak: newStreak, alreadyCheckedIn: false };
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
  const currentTodayKey = todayKey();
  let checkDate = new Date();
  for (let i = 0; i < 90; i++) {
    const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    const day = allStats.find(s => s.date === key);
    if (day && (day.steps > 500 || day.activeMinutes > 5)) {
      streakDays++;
    } else if (key !== currentTodayKey) {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return { totalWorkouts, totalCalories, totalDistanceKm, longestWorkoutMin, streakDays };
}

export async function logConsent(uid: string): Promise<void> {
  if (!db || !IS_FIREBASE_CONFIGURED || !uid) return;
  try {
    const consentData = {
      consentTimestamp: new Date().toISOString(),
      consentVersion: '1.0',
      agreedToPrivacyPolicy: true,
    };
    await setDoc(doc(db, 'users', uid), { profile: consentData }, { merge: true });
  } catch (e) {
    console.warn('[Firestore] logConsent warning:', e);
  }
}

export async function exportUserData(uid: string): Promise<string> {
  const profile = await getUserProfile(uid);
  const workouts = await getRecentWorkouts(uid, 500);
  const stats = await getRecentDailyStats(uid, 365);
  
  const exportObj = {
    profile,
    workouts,
    stats,
    exportedAt: new Date().toISOString()
  };
  
  return JSON.stringify(exportObj, null, 2);
}
