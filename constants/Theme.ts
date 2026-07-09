// Design system: colors, fonts, spacing, shadows
export const DarkColors = {
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
  gradientBlue: ['#00F0FF', '#B026FF'],
  gradientGreen: ['#CCFF00', '#00F0FF'],
  gradientRed: ['#FF2A54', '#FF8C00'],
};

export const LightColors = {
  bg: '#FFFFFF',
  surface: '#F4F4F5',
  surfaceHighlight: '#E4E4E7',
  border: '#D4D4D8',

  textPrimary: '#000000',
  textSecondary: '#52525B',
  textMuted: '#A1A1AA',

  blue: '#0070F3',
  blueGlow: 'rgba(0,112,243,0.2)',
  blueLight: '#3291FF',

  green: '#50C878',
  greenGlow: 'rgba(80,200,120,0.2)',
  greenLight: '#6EE7B7',

  purple: '#7928CA',
  purpleGlow: 'rgba(121,40,202,0.2)',
  purpleLight: '#8A2BE2',

  red: '#E00000',
  redGlow: 'rgba(224,0,0,0.2)',
  redLight: '#FF4D4D',

  orange: '#F5A623',
  orangeGlow: 'rgba(245,166,35,0.2)',

  gradientBlue: ['#0070F3', '#7928CA'],
  gradientGreen: ['#50C878', '#0070F3'],
  gradientRed: ['#E00000', '#F5A623'],
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
