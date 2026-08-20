// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  initializeAuth: jest.fn(),
  onAuthStateChanged: jest.fn(cb => { cb(null); return () => {}; }),
  signOut: jest.fn().mockResolvedValue(true),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isConfigured: false,
  }),
  AuthProvider: ({ children }: any) => children,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));
jest.mock('react-native-markdown-display', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ children }: any) => <Text>{children}</Text>;
});
jest.mock('../services/ai', () => ({
  generateWorkoutAdvice: jest.fn().mockResolvedValue('Mocked AI response'),
}));

import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AiCoachScreen from '../app/(tabs)/ai-coach';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AppProvider } from '../contexts/AppContext';

const TestWrapper = ({ children }: any) => (
  <AppProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </AppProvider>
);

describe('AiCoachScreen', () => {
  it('renders AiCoachScreen component successfully', () => {
    const res = render(
      <TestWrapper>
        <AiCoachScreen />
      </TestWrapper>
    );
    expect(res).toBeTruthy();
  });
});
