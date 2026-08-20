import { stepsToDistanceKm, stepsToCalories } from '../utils/calculations';

interface StepCheckpoint {
  date: string;
  lastHardwareReading: number;
  accumulatedTodaySteps: number;
}

function processStepDelta(
  cp: StepCheckpoint | null,
  watchSteps: number,
  currentDay: string,
  existingSteps: number
): { cp: StepCheckpoint; totalSteps: number } {
  let updatedCp: StepCheckpoint;

  if (!cp || cp.date !== currentDay) {
    updatedCp = {
      date: currentDay,
      lastHardwareReading: watchSteps,
      accumulatedTodaySteps: existingSteps,
    };
  } else {
    if (watchSteps < cp.lastHardwareReading) {
      updatedCp = { ...cp, lastHardwareReading: watchSteps };
    } else {
      const delta = watchSteps - cp.lastHardwareReading;
      updatedCp = {
        ...cp,
        lastHardwareReading: watchSteps,
        accumulatedTodaySteps: cp.accumulatedTodaySteps + delta,
      };
    }
  }

  const totalSteps = Math.max(existingSteps, updatedCp.accumulatedTodaySteps);
  return { cp: updatedCp, totalSteps };
}

describe('Background and Pocket Step Count Checkpoints', () => {
  it('correctly tracks steps walked while app was closed / phone was in pocket', () => {
    const today = '2026-08-19';

    // 1. User walks 500 steps with app open at 9 AM (hardware sensor = 100,000)
    let state = processStepDelta(null, 100000, today, 0);
    expect(state.totalSteps).toBe(0);

    state = processStepDelta(state.cp, 100500, today, 500);
    expect(state.totalSteps).toBe(500);
    expect(state.cp.accumulatedTodaySteps).toBe(500);

    // 2. User closes app & puts phone in pocket. Walks 2,500 steps!
    // Hardware sensor on phone OS advances to 103,000!

    // 3. User opens app at 2 PM (watchSteps = 103,000)
    state = processStepDelta(state.cp, 103000, today, 500);
    expect(state.totalSteps).toBe(3000); // 500 + 2,500 = 3,000 steps!
    expect(state.cp.accumulatedTodaySteps).toBe(3000);

    // Verify distance for 3,000 steps (175 cm height)
    const dist = stepsToDistanceKm(state.totalSteps, 175);
    expect(dist).toBe(2.17); // 2.17 km

    const cals = stepsToCalories(state.totalSteps, 70, 175);
    expect(cals).toBe(111); // 111 calories burned
  });

  it('resets step tracking gracefully on phone reboot', () => {
    const today = '2026-08-19';

    let state = processStepDelta(null, 100000, today, 1000);
    state = processStepDelta(state.cp, 100500, today, 1500);
    expect(state.totalSteps).toBe(1500);

    // Phone reboots! Raw hardware sensor count resets from 100,500 to 50
    state = processStepDelta(state.cp, 50, today, 1500);
    expect(state.totalSteps).toBe(1500); // Total steps preserved!
    expect(state.cp.lastHardwareReading).toBe(50);

    // User walks 10 steps after reboot
    state = processStepDelta(state.cp, 60, today, 1500);
    expect(state.totalSteps).toBe(1510);
  });

  it('resets steps cleanly at midnight for a new day', () => {
    const day1 = '2026-08-19';
    const day2 = '2026-08-20';

    let state = processStepDelta(null, 100000, day1, 5000);
    expect(state.totalSteps).toBe(5000);

    // Next day arrives!
    state = processStepDelta(state.cp, 101000, day2, 0);
    expect(state.totalSteps).toBe(0);
    expect(state.cp.date).toBe(day2);
  });
});
