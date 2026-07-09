import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { DarkColors, LightColors } from '../constants/Theme';

export type ThemeType = 'light' | 'dark' | 'system';
export type ThemeColors = typeof DarkColors;

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');

  const isDark = theme === 'system' ? systemColorScheme !== 'light' : theme === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  const value = React.useMemo(() => ({ theme, setTheme, colors, isDark }), [theme, colors, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
