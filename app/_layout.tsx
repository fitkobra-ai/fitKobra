import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AppProvider, useApp } from '../contexts/AppContext';
import { Colors } from '../constants/Theme';

function AuthRouter() {
  const { user, loading: authLoading, isConfigured } = useAuth();
  const { profile, loadingProfile } = useApp();
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
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <AuthRouter />
      </AppProvider>
    </AuthProvider>
  );
}
