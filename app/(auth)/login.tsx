import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Spacing, Radius } from '../../constants/Theme';
import { signInWithEmail, resetPassword, signInWithGoogle } from '../../services/auth';

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const getFriendlyErrorMessage = (err: any) => {
    const errCode = err?.code || '';
    switch (errCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Incorrect email or password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return err?.message || 'An error occurred during login. Please try again.';
    }
  };

  const handleLogin = async () => {
    setAuthError('');
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // RootLayout will automatically redirect to /(tabs)
    } catch (err: any) {
      setAuthError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      Alert.alert('Forgot Password', 'Please enter your email address first.');
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert('Check Email', 'Password reset instructions sent.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      // RootLayout automatically redirects to /(tabs)
    } catch (err: any) {
      const msg = err.message || 'Google Sign-in failed.';
      setAuthError(msg);
      Alert.alert('Google Sign-In Status', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      return handleGoogleLogin();
    }
    Alert.alert(
      'Native Setup Required',
      `OAuth for ${provider} requires Native API keys and Firebase Console configuration which must be set up manually before it can work in production.`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* World-Class Header & Brand Logo */}
          <View style={styles.header}>
            <Image source={require('../../assets/images/truefit-logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Welcome to FitKobra</Text>
            <Text style={styles.subtitle}>Log in to unleash your AI Fitness Transformation.</Text>
          </View>

          {/* FitKobra AI Trainer Hero Showcase Card */}
          <View style={styles.modelHeroCard}>
            <Image source={require('../../assets/images/fitkobra-model.jpg')} style={styles.modelAvatar} resizeMode="cover" />
            <View style={styles.modelHeroContent}>
              <Text style={styles.modelHeroTitle}>FitKobra AI Personal Trainer</Text>
              <Text style={styles.modelHeroDesc}>
                Welcome to FitKobra! Log in to access your custom workouts, nutrition plans & AI Personal Trainer.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            {!!authError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{authError}</Text>
              </View>
            )}
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View>
              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity 
                onPress={handleForgot} 
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ alignSelf: 'flex-end', marginTop: 4 }}
              >
                <Text style={styles.forgot}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <Button 
              label="Log In" 
              onPress={handleLogin} 
              loading={loading} 
              style={styles.btn} 
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('Google')} activeOpacity={0.7}>
                <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity 
                hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }} 
                activeOpacity={0.7}
                style={{ paddingVertical: 4, paddingHorizontal: 6 }}
              >
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, justifyContent: 'space-between' },
  header: { marginBottom: 12, alignItems: 'center' },
  logo: { width: 90, height: 90, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#CBD5E1', textAlign: 'center', marginTop: 4, fontWeight: '500' },
  
  modelHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2a',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 153, 0.4)',
    shadowColor: '#00e699',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  modelAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00e699',
  },
  modelHeroContent: {
    flex: 1,
    marginLeft: 12,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 230, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 3,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00e699',
    marginRight: 5,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00e699',
    letterSpacing: 0.8,
  },
  modelHeroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modelHeroDesc: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
    lineHeight: 15,
    fontWeight: '500',
  },

  form: { gap: 10 },
  errorBanner: {
    backgroundColor: 'rgba(255,42,84,0.15)',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,42,84,0.4)',
  },
  errorBannerText: { color: colors.red, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  btn: { marginTop: 4 },
  forgot: { color: colors.blue, fontWeight: '600', fontSize: 12 },
  
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textSecondary, paddingHorizontal: Spacing.sm, fontSize: 11 },
  
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 28 },
  footerText: { color: colors.textSecondary, fontSize: 14 },
  link: { color: colors.blue, fontWeight: '700', fontSize: 14 },
});
