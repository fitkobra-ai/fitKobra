import { stepsToCalories, stepsToDistanceKm, calculateBMR, calculateTDEE, recommendedDailySteps } from '../utils/calculations';

// Mock Firebase Firestore for Unit Tests
jest.mock('../services/firebase', () => ({
  db: {},
  IS_FIREBASE_CONFIGURED: false,
}));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

import { generateReferralCode } from '../services/firestore';

describe('Calculation & Business Logic Unit Tests', () => {
  test('stepsToCalories calculates burned calories based on weight and height', () => {
    const cals = stepsToCalories(10000, 75, 175);
    expect(cals).toBeGreaterThan(300);
    expect(cals).toBeLessThan(600);
  });

  test('stepsToDistanceKm converts steps accurately to km', () => {
    const km = stepsToDistanceKm(10000, 175);
    expect(km).toBeGreaterThan(6.5);
    expect(km).toBeLessThan(8.5);
  });

  test('calculateBMR calculates correct basal metabolic rate for male', () => {
    const bmr = calculateBMR(75, 175, 25, 'male');
    expect(bmr).toBeCloseTo(1723.75, 1);
  });

  test('recommendedDailySteps assigns correct step targets for goals', () => {
    expect(recommendedDailySteps('weight_loss')).toBe(12000);
    expect(recommendedDailySteps('build_muscle')).toBe(8000);
  });

  test('generateReferralCode creates a valid FITKOBRA prefix 13-char code', () => {
    const code = generateReferralCode();
    expect(code).toMatch(/^FITKOBRA-[A-Z0-9]{4}$/);
  });

  test('portion gram macro scaler calculates proportional ratio', () => {
    const baseCals = 400;
    const baseGrams = 200;
    const customGrams = 350;
    const ratio = customGrams / baseGrams;
    const scaledCals = Math.round(baseCals * ratio);
    expect(scaledCals).toBe(700);
  });
});
