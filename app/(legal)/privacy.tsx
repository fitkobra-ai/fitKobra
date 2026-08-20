import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Spacing, Radius } from '../../constants/Theme';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: August 2026</Text>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>Medical Disclaimer</Text>
          <Text style={[styles.paragraph, { color: colors.textPrimary, marginBottom: 0 }]}>
            FitKobra and its AI Coach provide educational fitness suggestions and estimations, NOT medical advice. Always consult a physician or healthcare provider before starting any rigorous exercise program or making significant dietary changes.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Welcome to FitKobra. We are committed to protecting your personal data and respecting your privacy. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application ("FitKobra AI").
        </Text>

        <Text style={styles.sectionTitle}>1. Data Controller</Text>
        <Text style={styles.paragraph}>
          The data controller responsible for your personal information is FitKobra. For any privacy-related concerns, you can contact our Data Protection Officer at admin@fitkobra.app.
        </Text>

        <Text style={styles.sectionTitle}>2. Data We Collect</Text>
        <Text style={styles.paragraph}>
          We collect personal and health data that you voluntarily provide to us, including your name, email address, date of birth, gender, weight, height, and fitness goals. We also collect activity data such as workouts and daily steps.
        </Text>

        <Text style={styles.sectionTitle}>3. AI Features & Permissions</Text>
        <Text style={styles.paragraph}>
          FitKobra utilizes artificial intelligence (Google Gemini) to power features like Snap-to-Recipe, AI Coach, and Voice Logging. 
        </Text>
        <Text style={styles.paragraph}>
          • **Camera Access:** When using the Snap-to-Recipe feature, photos are securely processed by the AI to identify ingredients and estimate nutrition. These photos are NEVER stored permanently on our servers or used for model training.
        </Text>
        <Text style={styles.paragraph}>
          • **Microphone Access:** When using Voice Logging, your audio is securely transcribed to text to automatically log your workouts. The audio recordings are not stored.
        </Text>

        <Text style={styles.sectionTitle}>4. How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          Your data is exclusively used to provide, maintain, and improve the FitKobra services. Specifically, health metrics are used to calculate personalized calorie and macro goals. We do not sell your personal data to third parties. We use Google Firebase as our data processor.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights (DPDPA & GDPR)</Text>
        <Text style={styles.paragraph}>
          You have the right to:
          {'\n'}• **Access:** Request a copy of your personal data using the "Export My Data" button in your Profile.
          {'\n'}• **Rectification:** Correct inaccurate data via the Edit Profile screen.
          {'\n'}• **Erasure (Right to be Forgotten):** You can delete your account and all associated data directly from the Profile settings.
          {'\n'}• **Portability:** Export your data in a machine-readable JSON format.
          {'\n'}• **Withdraw Consent:** Withdraw your consent for data processing at any time by deleting your account.
        </Text>

        <Text style={styles.sectionTitle}>6. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to protect your data. Your data is stored securely using Google Firebase cloud infrastructure in encrypted databases.
        </Text>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginLeft: Spacing.sm },
  scroll: { padding: Spacing.xl },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: Spacing.xs },
  lastUpdated: { fontSize: 14, color: colors.textSecondary, marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.blue, marginTop: Spacing.xl, marginBottom: Spacing.sm },
  paragraph: { fontSize: 15, color: colors.textPrimary, lineHeight: 24, marginBottom: Spacing.md },
  disclaimerBox: {
    backgroundColor: colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange,
    marginVertical: Spacing.md,
  },
  disclaimerText: {
    color: colors.orange,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
});
