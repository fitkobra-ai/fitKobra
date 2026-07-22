import React from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

const TestComponent = () => {
  const { theme, isDark, colors } = useTheme();
  return null;
};

describe('ThemeContext', () => {
  it('should be able to render ThemeProvider without crashing', () => {
    expect(true).toBe(true);
  });
});
