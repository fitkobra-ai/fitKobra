import { generateWorkoutAdvice } from '../services/ai';

jest.mock('../services/firebase', () => ({ app: {} }));
jest.mock('firebase/ai', () => ({
  getAI: jest.fn(),
  getGenerativeModel: jest.fn(),
  GoogleAIBackend: jest.fn(),
}));

describe('AI Service Cache', () => {
  it('should return a cached response instantly for suggested prompts without hitting the API', async () => {
    const context = 'User context';
    const prompt = '🔥 Plan a 20-min HIIT workout';
    const start = Date.now();
    const result = await generateWorkoutAdvice(context, prompt);
    const end = Date.now();

    expect(result).toContain('20-Minute Fat-Burning HIIT Routine');
    expect(end - start).toBeLessThan(50); // Should be instant
  });

  it('should return a cached response for sleep advice', async () => {
    const context = 'User context';
    const prompt = '😴 How can I improve my sleep?';
    const result = await generateWorkoutAdvice(context, prompt);

    expect(result).toContain('Top Tips for Better Sleep');
  });
});
