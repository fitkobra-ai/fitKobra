import { Feather } from '@expo/vector-icons';

export interface WorkoutType {
  id: string;
  label: string;
  iconName: keyof typeof Feather.glyphMap;
  color: string;
  met: number;
}

export const WORKOUT_TYPES: WorkoutType[] = [
  { id: 'run',   label: 'Running',     iconName: 'wind',      color: '#10b981', met: 9.8  },
  { id: 'cycle', label: 'Cycling',     iconName: 'aperture',  color: '#3b82f6', met: 7.5  },
  { id: 'lift',  label: 'Weights',     iconName: 'anchor',    color: '#ef4444', met: 5.0  },
  { id: 'yoga',  label: 'Yoga',        iconName: 'feather',   color: '#8b5cf6', met: 2.5  },
  { id: 'swim',  label: 'Swimming',    iconName: 'droplet',   color: '#06b6d4', met: 8.0  },
  { id: 'hiit',  label: 'HIIT',        iconName: 'zap',       color: '#f97316', met: 10.3 },
  { id: 'walk',  label: 'Walking',     iconName: 'navigation',color: '#a3e635', met: 3.5  },
  { id: 'other', label: 'Other',       iconName: 'target',    color: '#ec4899', met: 5.0  },
];

export function getWorkoutType(id: string): WorkoutType {
  return WORKOUT_TYPES.find(w => w.id === id) ?? WORKOUT_TYPES[WORKOUT_TYPES.length - 1];
}
