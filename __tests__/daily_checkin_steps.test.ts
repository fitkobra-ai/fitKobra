import { todayKey, dateKey } from '../utils/dates';
import { stepsToCalories, stepsToDistanceKm } from '../utils/calculations';

// Mock Firebase firestore
jest.mock('../services/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn((db, ...path) => path.join('/')),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  setDoc: jest.fn(),
}));

import { registerDailyStreak } from '../services/firestore';
import { getDoc, updateDoc } from 'firebase/firestore';

describe('Daily Check-In & Steps Tracking Logic', () => {
  const mockUid = 'user_streak_test_123';
  const today = todayKey();
  const yesterday = dateKey(-1);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('todayKey returns valid YYYY-MM-DD local date format', () => {
    const key = todayKey();
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('registerDailyStreak awards points & increments streak when checking in for a new day', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        profile: {
          points: 1000,
          currentStreak: 4,
          lastStreakDate: yesterday,
        },
      }),
    });

    const result = await registerDailyStreak(mockUid, 5000);

    expect(result.alreadyCheckedIn).toBeFalsy();
    expect(result.currentStreak).toBe(5);
    expect(result.pointsEarned).toBeGreaterThan(0);
    expect(updateDoc).toHaveBeenCalledWith(
      `users/${mockUid}`,
      expect.objectContaining({
        'profile.lastStreakDate': today,
        'profile.currentStreak': 5,
      })
    );
  });

  test('registerDailyStreak prevents double claiming when already checked in for today', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        profile: {
          points: 1500,
          currentStreak: 5,
          lastStreakDate: today, // Checked in today
        },
      }),
    });

    const result = await registerDailyStreak(mockUid, 7500);

    expect(result.alreadyCheckedIn).toBe(true);
    expect(result.pointsEarned).toBe(0);
    expect(result.currentStreak).toBe(5);
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test('Pedometer step conversions compute calories and distance accurately', () => {
    const steps = 6000;
    const cals = stepsToCalories(steps, 75, 175);
    const dist = stepsToDistanceKm(steps, 175);

    expect(cals).toBeGreaterThan(150);
    expect(dist).toBeGreaterThan(4.0);
    expect(dist).toBeLessThan(5.5);
  });
});
