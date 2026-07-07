// Design system: colors, fonts, spacing, shadows
export const Colors = {
  // Background layers (Obsidian/Carbon)
  bg: '#000000',
  surface: '#0A0A0A',
  surfaceHighlight: '#1A1A1A',
  border: '#2A2A2A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#52525B',

  // Brand accents (Volt Green & Hyper Cyan)
  blue: '#00F0FF', // Hyper Cyan
  blueGlow: 'rgba(0,240,255,0.4)',
  blueLight: '#80F8FF',

  green: '#CCFF00', // Volt Green
  greenGlow: 'rgba(204,255,0,0.4)',
  greenLight: '#E5FF80',

  purple: '#B026FF', // Neon Violet
  purpleGlow: 'rgba(176,38,255,0.4)',
  purpleLight: '#D893FF',

  red: '#FF2A54', // Laser Red
  redGlow: 'rgba(255,42,84,0.4)',
  redLight: '#FF95AA',

  orange: '#FF8C00', // Blaze Orange
  orangeGlow: 'rgba(255,140,0,0.4)',

  // Gradient combos
  gradientBlue: ['#00F0FF', '#B026FF'] as const,
  gradientGreen: ['#CCFF00', '#00F0FF'] as const,
  gradientRed: ['#FF2A54', '#FF8C00'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  }),
};
