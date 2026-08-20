import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { ReadableStream, TransformStream, WritableStream } from 'web-streams-polyfill';
declare var global: any;
(global as any).ReadableStream = ReadableStream;
(global as any).TransformStream = TransformStream;
(global as any).WritableStream = WritableStream;
(globalThis as any).ReadableStream = ReadableStream;
(globalThis as any).TransformStream = TransformStream;
(globalThis as any).WritableStream = WritableStream;
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, Text, ActivityIndicator, Alert, LogBox } from 'react-native';

LogBox.ignoreAllLogs();
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AppProvider, useApp } from '../contexts/AppContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding before auth state & profile are ready
SplashScreen.preventAutoHideAsync().catch(() => {});

if ((globalThis as any).ErrorUtils) {
  (globalThis as any).ErrorUtils.setGlobalHandler((error: any, isFatal: boolean) => {
    console.error('[KinexFit] Uncaught Global JS Exception:', error);
    try {
      Alert.alert("JS Error Caught!", `${error?.name || 'Error'}: ${error?.message || error}`);
    } catch {}
  });
}

// Suppress specific harmless console.error messages (like Metro HMR timeouts on web)
const originalConsoleError = console.error;
console.error = (...args) => {
  const firstArg = args[0];
  const isTimeoutString = typeof firstArg === 'string' && firstArg.includes('12000ms timeout exceeded');
  const isTimeoutError = firstArg instanceof Error && firstArg.message.includes('12000ms timeout exceeded');
  
  if (isTimeoutString || isTimeoutError) {
    return;
  }
  originalConsoleError(...args);
};

function AuthRouter() {
  const { user, loading: authLoading, isConfigured } = useAuth();
  const { profile, loadingProfile } = useApp();
  const { colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  const isReady = !authLoading && !loadingProfile;

  useEffect(() => {
    if (!isReady) return;

    // Hide splash screen smoothly once initialization is complete
    SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[1] === 'onboarding';

    if (!isConfigured) {
      if (inAuthGroup) router.replace('/(tabs)');
      return;
    }

    if (!user && !inAuthGroup) {
      // Not logged in -> Login
      router.replace('/(auth)/login');
    } else if (user) {
      // Logged in
      const hasCompletedProfile = !!profile?.heightCm;
      
      if (!hasCompletedProfile && !inOnboarding) {
        // No complete profile -> Onboarding
        router.replace('/(auth)/onboarding');
      } else if (hasCompletedProfile && inAuthGroup) {
        // Has profile and in auth -> Main app
        router.replace('/(tabs)');
      }
    }
  }, [isReady, user, profile, segments, isConfigured, router]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(modals)/leaderboard" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#0d1117', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: '#ff7b72', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ color: '#8b949e', fontSize: 14, textAlign: 'center' }}>
            {this.state.error?.toString() || 'An unexpected error occurred.'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <AuthRouter />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
