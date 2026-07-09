import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AppProvider, useApp } from '../contexts/AppContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

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
