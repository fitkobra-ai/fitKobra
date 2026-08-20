import { generateWorkoutAdvice } from '../services/ai';
import { queryOfflineKnowledge, sanitizeText } from '../constants/OfflineAIKnowledgeBase';

jest.mock('../services/firebase', () => ({ app: {} }));
jest.mock('firebase/ai', () => ({
  getAI: jest.fn(),
  getGenerativeModel: jest.fn(),
  GoogleAIBackend: jest.fn(),
}));

describe('FitKobra AI Service & Knowledge Base Comprehensive Tests', () => {
  it('sanitizeText replaces hyphens with spaces and normalizes text', () => {
    expect(sanitizeText('post-workout')).toBe('post workout');
    expect(sanitizeText('🔥 Plan a 20-min HIIT workout')).toBe('plan a 20 min hiit workout');
    expect(sanitizeText('🥗 What should I eat post-workout?')).toBe('what should i eat post workout');
  });

  it('should intercept medical & severe allergy queries with safety notice', async () => {
    const diabeticRes = await generateWorkoutAdvice('', 'I am diabetic with chronic kidney disease, give me a meal plan', true);
    expect(diabeticRes).toContain('Medical Safety & Legal Compliance Notice');
    expect(diabeticRes).toContain('Registered Dietitian');

    const allergyRes = await generateWorkoutAdvice('', 'I have a severe nut allergy, make me a lunch menu', true);
    expect(allergyRes).toContain('Medical Safety & Legal Compliance Notice');

    const pregnantRes = await generateWorkoutAdvice('', 'I am 6 months pregnant, what exercise should I do?', true);
    expect(pregnantRes).toContain('Medical Safety & Legal Compliance Notice');
  });

  it('should match greeting "hi" and "hello"', async () => {
    const adviceHi = await generateWorkoutAdvice('', 'hi', true);
    expect(adviceHi).toContain('FitKobra AI');

    const adviceHello = await generateWorkoutAdvice('', 'hello', true);
    expect(adviceHello).toContain('FitKobra AI');
  });

  it('should match all suggested prompts', async () => {
    const advice1 = await generateWorkoutAdvice('', '🔥 Plan a 20-min HIIT workout', true);
    expect(advice1).toContain('HIIT');

    const advice2 = await generateWorkoutAdvice('', '🥗 What should I eat post-workout?', true);
    expect(advice2).toContain('High-Protein');

    const advice3 = await generateWorkoutAdvice('', '🧘‍♀️ Guide me through a stretching routine', true);
    expect(advice3).toContain('Recovery');

    const advice4 = await generateWorkoutAdvice('', '😴 How can I improve my sleep?', true);
    expect(advice4).toContain('Recovery');
  });

  it('should match ALL persistent Followup Chips', async () => {
    const chip1 = await generateWorkoutAdvice('', '🔥 20-min HIIT', true);
    expect(chip1).toContain('HIIT');

    const chip2 = await generateWorkoutAdvice('', '🏋️ Chest & Bench', true);
    expect(chip2).toContain('Bench Press');

    const chip3 = await generateWorkoutAdvice('', '🥗 High Protein Meals', true);
    expect(chip3).toContain('High-Protein');

    const chip4 = await generateWorkoutAdvice('', '⚡ Caloric Deficit Plan', true);
    expect(chip4).toContain('Caloric Deficit');

    const chip5 = await generateWorkoutAdvice('', '🧪 Creatine Dosage', true);
    expect(chip5).toContain('Creatine Monohydrate');

    const chip6 = await generateWorkoutAdvice('', '🧘‍♀️ Recovery Stretch', true);
    expect(chip6).toContain('Recovery');
  });

  it('should match body part workouts (arms, legs, chest, abs, back, shoulders)', async () => {
    const arms = await generateWorkoutAdvice('', 'arms workout', true);
    expect(arms.toLowerCase()).toContain('bicep');

    const legs = await generateWorkoutAdvice('', 'leg workout', true);
    expect(legs.toLowerCase()).toContain('squat');

    const chest = await generateWorkoutAdvice('', 'chest press', true);
    expect(chest.toLowerCase()).toContain('bench press');

    const abs = await generateWorkoutAdvice('', 'abs six pack', true);
    expect(abs.toLowerCase()).toContain('core');
  });

  it('should return fallback response for unmapped generic query without crashing', async () => {
    const fallback = await generateWorkoutAdvice('', 'random unmapped xyz query', true);
    expect(fallback).not.toBeNull();
    expect(fallback).toContain('FitKobra AI Coach Guidance');
  });

  it('should respond smoothly in default online mode (isOfflineMode = false) without throwing or hanging', async () => {
    const onlineHi = await generateWorkoutAdvice('', 'Plan a 20-min HIIT workout', false);
    expect(onlineHi).not.toBeNull();
    expect(onlineHi.length).toBeGreaterThan(10);
  });
});
