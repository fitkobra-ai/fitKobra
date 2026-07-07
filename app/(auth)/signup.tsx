import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Colors, Spacing, Radius } from '../../constants/Theme';
import { signUpWithEmail, signInWithGoogle } from '../../services/auth';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const getFriendlyErrorMessage = (errCode: string) => {
    switch (errCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Your password is too weak. Please use a stronger password.';
      default:
        return 'An error occurred during signup. Please try again.';
    }
  };

  const handleSignup = async () => {
    setAuthError('');
    if (!name || !email || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }
    if (!agreed) {
      setAuthError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      // RootLayout handles the redirect automatically to Onboarding since profile won't exist yet
    } catch (err: any) {
      setAuthError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setAuthError('');
    if (!agreed) {
      setAuthError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }
    setLoading(true);
    try {
      await signInWithGoogle();
      // RootLayout automatically redirects to Onboarding
    } catch (err: any) {
      setAuthError(err.message || 'Google Sign-in failed. Please ensure Native configuration is complete.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    if (provider === 'Google') {
      return handleGoogleSignup();
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
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/truefit-logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Join KinexFit</Text>
          <Text style={styles.subtitle}>Create an account to track your progress and hit your goals.</Text>
        </View>

        <View style={styles.form}>
          {!!authError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}
          <Input
            label="Full Name"
            placeholder="Alex Johnson"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.consentContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, agreed && styles.checkboxActive]} 
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              {agreed && <MaterialCommunityIcons name="check" size={16} color="#000" />}
            </TouchableOpacity>
            <View style={styles.consentTextContainer}>
              <Text style={styles.consentText}>
                I agree to the <Link href="/(legal)/terms" style={styles.legalLink}>Terms of Service</Link> and <Link href="/(legal)/privacy" style={styles.legalLink}>Privacy Policy</Link>, and consent to the processing of my health data.
              </Text>
            </View>
          </View>

          <Button 
            label="Create Account"  
            onPress={handleSignup} 
            loading={loading} 
            style={styles.btn} 
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialSignup('Google')} activeOpacity={0.7}>
              <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            {/* Hidden for now: Apple and Microsoft */}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.link}>Log In</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, padding: Spacing.xl, justifyContent: 'center' },
  header: { marginBottom: Spacing.xxl, alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: Spacing.md, borderRadius: Radius.xl },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: Spacing.xs },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
  form: { gap: Spacing.lg },
  errorBanner: {
    backgroundColor: 'rgba(255,42,84,0.15)',
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,42,84,0.4)',
  },
  errorBannerText: { color: Colors.red, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  btn: { marginTop: Spacing.md },
  
  consentContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: Spacing.xs, gap: Spacing.sm },
  checkbox: {
    width: 24, height: 24,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  consentTextContainer: { flex: 1 },
  consentText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  legalLink: { color: Colors.blue, textDecorationLine: 'underline' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textSecondary, paddingHorizontal: Spacing.md, fontSize: 13 },
  
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xxl },
  footerText: { color: Colors.textSecondary, fontSize: 15 },
  link: { color: Colors.blue, fontWeight: '700', fontSize: 15 },
});
