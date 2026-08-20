import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Spacing, Radius } from '../../constants/Theme';
import { signUpWithEmail, signInWithGoogle } from '../../services/auth';
import { logConsent } from '../../services/firestore';

export default function SignupScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [referralCode, setReferralCode] = useState('');

  const getFriendlyErrorMessage = (err: any) => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Your password is too weak. Please use a stronger password.';
      default:
        return err?.message || err?.toString() || 'An error occurred during signup. Please try again.';
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
      const user = await signUpWithEmail(email, password, name);
      await logConsent(user.uid);
      
      if (referralCode.trim()) {
        try {
          const { redeemReferralCode } = require('../../services/firestore');
          await redeemReferralCode(user.uid, referralCode.trim());
        } catch (_) {}
      }

      Alert.alert(
        'Account Created! ✉️',
        `We've sent a verification email to ${email}. Please check your inbox to verify your email address.`
      );
      // RootLayout handles the redirect automatically to Onboarding since profile won't exist yet
    } catch (err: any) {
      setAuthError(getFriendlyErrorMessage(err));
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
      const user = await signInWithGoogle();
      await logConsent(user.uid);
      // RootLayout automatically redirects to Onboarding
    } catch (err: any) {
      const msg = err?.message || err?.toString() || 'Google Sign-in failed.';
      setAuthError(msg);
      Alert.alert('Google Sign-In Status', msg);
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
            <Text style={styles.title}>Join FitKobra</Text>
            <Text style={styles.subtitle}>Unlock Your AI Personal Trainer & Master Plan</Text>
          </View>

          {/* FitKobra AI Trainer Hero Showcase Card */}
          <View style={styles.modelHeroCard}>
            <Image source={require('../../assets/images/fitkobra-model.jpg')} style={styles.modelAvatar} resizeMode="cover" />
            <View style={styles.modelHeroContent}>
              <Text style={styles.modelHeroTitle}>FitKobra AI Personal Trainer</Text>
              <Text style={styles.modelHeroDesc}>
                🤖 Real-time Kinematics • 🥗 Instant Recipe Scan • 💪 Target Master Plan
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
            <Input
              label="Referral Code (Optional)"
              placeholder="e.g. FITKOBRA-7A2F"
              value={referralCode}
              onChangeText={setReferralCode}
              autoCapitalize="characters"
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
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity 
                hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }} 
                activeOpacity={0.7}
                style={{ paddingVertical: 4, paddingHorizontal: 6 }}
              >
                <Text style={styles.link}>Log In</Text>
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
  
  consentContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 2, gap: Spacing.xs },
  checkbox: {
    width: 20, height: 20,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  consentTextContainer: { flex: 1 },
  consentText: { fontSize: 11, color: colors.textSecondary, lineHeight: 15 },
  legalLink: { color: colors.blue, textDecorationLine: 'underline' },

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
