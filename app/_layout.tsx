import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { ReadableStream, TransformStream, WritableStream } from 'web-streams-polyfill';
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream as any;
  global.TransformStream = TransformStream as any;
  global.WritableStream = WritableStream as any;
}
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, Alert, LogBox } from 'react-native';

LogBox.ignoreAllLogs();
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AppProvider, useApp } from '../contexts/AppContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

const defaultErrorHandler = (global as any).ErrorUtils?.getGlobalHandler?.();
if ((global as any).ErrorUtils) {
  (global as any).ErrorUtils.setGlobalHandler((error: any, isFatal: boolean) => {
    Alert.alert("JS Crash Caught!", `${error.name}: ${error.message}\n\n${error.stack}`);
    // Not calling default handler so it doesn't crash to home screen immediately
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

  useEffect(() => {
    if (authLoading || loadingProfile) return;

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
      if (!profile && !inOnboarding) {
        // No profile -> Onboarding
        router.replace('/(auth)/onboarding');
      } else if (profile && inAuthGroup) {
        // Has profile and in auth -> Main app
        router.replace('/(tabs)');
      }
    }
  }, [user, authLoading, profile, loadingProfile, segments, isConfigured, router]);

  if (authLoading || loadingProfile) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AuthRouter />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
