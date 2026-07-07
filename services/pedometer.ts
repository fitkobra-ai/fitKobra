import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export type StepCallback = (steps: number) => void;

/** Check if the device has a hardware step counter. */
export async function isStepCountingAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    return await Pedometer.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Get cumulative step count from midnight today to now.
 * Returns 0 if unavailable (web / no hardware).
 */
export async function getTodayStepCount(): Promise<number> {
  const available = await isStepCountingAvailable();
  if (!available) return 0;

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();

  try {
    const result = await Pedometer.getStepCountAsync(start, end);
    return result.steps;
  } catch {
    return 0;
  }
}

/**
 * Subscribe to live step count increments.
 * Returns an unsubscribe function.
 * The callback receives the delta steps since the subscription started.
 */
export function watchStepCount(callback: StepCallback): () => void {
  if (Platform.OS === 'web') {
    return () => {}; // no-op on web
  }

  let subscription: ReturnType<typeof Pedometer.watchStepCount> | null = null;

  Pedometer.isAvailableAsync().then(available => {
    if (available) {
      subscription = Pedometer.watchStepCount(result => {
        callback(result.steps);
      });
    }
  });

  return () => {
    subscription?.remove();
  };
}
