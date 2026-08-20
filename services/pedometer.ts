import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export type StepCallback = (steps: number) => void;

/** Check if the device has a hardware step counter and permission is granted. */
export async function isStepCountingAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const available = await Pedometer.isAvailableAsync();
    if (!available) return false;
    let { status } = await Pedometer.getPermissionsAsync();
    if (status !== 'granted') {
      const res = await Pedometer.requestPermissionsAsync();
      status = res.status;
    }
    return status === 'granted';
  } catch (err) {
    console.warn('[Pedometer] isStepCountingAvailable check failed:', err);
    return false;
  }
}

/**
 * Get cumulative step count from midnight today to now.
 * Returns 0 if unavailable (web / no hardware).
 */
export async function getTodayStepCount(): Promise<number> {
  try {
    const available = await isStepCountingAvailable();
    if (!available) return 0;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();

    const result = await Pedometer.getStepCountAsync(start, end);
    return result?.steps ?? 0;
  } catch (err) {
    console.warn('[Pedometer] getTodayStepCount failed:', err);
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

  let subscription: any = null;

  isStepCountingAvailable().then(available => {
    if (available) {
      try {
        subscription = Pedometer.watchStepCount(result => {
          if (result && typeof result.steps === 'number') {
            callback(result.steps);
          }
        });
      } catch (err) {
        console.warn('[Pedometer] watchStepCount subscription error:', err);
      }
    }
  }).catch(err => {
    console.warn('[Pedometer] watchStepCount availability error:', err);
  });

  return () => {
    try {
      subscription?.remove();
    } catch {}
  };
}
