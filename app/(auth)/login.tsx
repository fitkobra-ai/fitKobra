import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
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

  const getFriendlyErrorMessage = (errCode: string) => {
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
        return 'An error occurred during login. Please try again.';
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
      setAuthError(getFriendlyErrorMessage(err.code));
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
      setAuthError(err.message || 'Google Sign-in failed. Please ensure Native configuration is complete.');
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS === 'ios'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={require('../../assets/images/truefit-logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome to KinexFit</Text>
          <Text style={styles.subtitle}>Log in to continue your fitness journey.</Text>
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
            <Text onPress={handleForgot} style={styles.forgot}>
              Forgot password?
            </Text>
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
            
            {/* Hidden for now: Apple and Microsoft */}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <Text style={styles.link}>Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: Spacing.xl, justifyContent: 'center', paddingBottom: 80 },
  header: { marginBottom: Spacing.xxl, alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: Spacing.md, borderRadius: Radius.xl },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: Spacing.xs },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center' },
  form: { gap: Spacing.lg },
  errorBanner: {
    backgroundColor: 'rgba(255,42,84,0.15)',
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,42,84,0.4)',
  },
  errorBannerText: { color: colors.red, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  btn: { marginTop: Spacing.md },
  forgot: { color: colors.blue, textAlign: 'right', marginTop: Spacing.sm, fontWeight: '600', fontSize: 14 },
  
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textSecondary, paddingHorizontal: Spacing.md, fontSize: 13 },
  
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xxl },
  footerText: { color: colors.textSecondary, fontSize: 15 },
  link: { color: colors.blue, fontWeight: '700', fontSize: 15 },
});
