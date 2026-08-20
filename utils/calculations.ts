// ============================================================
//  Scientific Calculations — BMR, Calories, Distance, Stride
// ============================================================

/**
 * Mifflin-St Jeor BMR equation (more accurate than Harris-Benedict).
 * Returns kcal/day at complete rest.
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female' | 'other'
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === 'female' ? base - 161 : base + 5;
}

/**
 * Total Daily Energy Expenditure — BMR × activity multiplier.
 */
export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,           // Desk job, little or no exercise
  lightly_active: 1.375,    // Light exercise 1–3 days/week
  moderately_active: 1.55,  // Moderate exercise 3–5 days/week
  very_active: 1.725,       // Hard exercise 6–7 days/week
  extremely_active: 1.9,    // Athlete, physical job
};

export function calculateTDEE(bmr: number, activityLevel: string): number {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.55));
}

/**
 * Estimated stride length from height (De Vito formula).
 * Returns stride length in METERS. Default height 175cm (~0.725m stride).
 */
export function estimateStrideLengthM(heightCm?: number): number {
  const validHeight = (heightCm && heightCm >= 100 && heightCm <= 250) ? heightCm : 175;
  return validHeight * 0.00414;
}

/**
 * Steps → distance in km.
 */
export function stepsToDistanceKm(steps: number, heightCm?: number): number {
  if (!steps || steps <= 0) return 0;
  const stride = estimateStrideLengthM(heightCm);
  const distanceKm = (steps * stride) / 1000;
  return parseFloat(distanceKm.toFixed(2));
}

/**
 * Steps → calories burned (walking MET = 3.5, assumed 4.8 km/h pace).
 */
export function stepsToCalories(steps: number, weightKg?: number, heightCm?: number): number {
  if (!steps || steps <= 0) return 0;
  const validWeight = (weightKg && weightKg >= 30 && weightKg <= 300) ? weightKg : 70;
  const distanceKm = stepsToDistanceKm(steps, heightCm);
  const MET = 3.5;
  const speedKmH = 4.8;
  const durationHours = distanceKm / speedKmH;
  return Math.round(MET * validWeight * durationHours);
}

/**
 * MET values per workout type (ACSM Guidelines).
 */
export const MET_VALUES: Record<string, number> = {
  run: 9.8,
  cycle: 7.5,
  lift: 5.0,
  yoga: 2.5,
  swim: 8.0,
  hiit: 10.3,
  walk: 3.5,
  other: 5.0,
};

/**
 * Workout calories using MET formula: kcal = MET × weight(kg) × time(hours).
 */
export function workoutCalories(
  type: string,
  weightKg: number,
  durationSeconds: number
): number {
  const met = MET_VALUES[type] ?? 5.0;
  const durationHours = durationSeconds / 3600;
  return Math.round(met * weightKg * durationHours);
}

/**
 * Calculate age in years from an ISO date string (YYYY-MM-DD).
 */
export function ageFromDOB(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/**
 * Recommended daily steps based on goal.
 */
export function recommendedDailySteps(goal: string): number {
  const goals: Record<string, number> = {
    weight_loss: 12000,
    build_muscle: 8000,
    improve_endurance: 15000,
    general_health: 10000,
  };
  return goals[goal] ?? 10000;
}

/**
 * Format seconds as mm:ss or hh:mm:ss.
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
