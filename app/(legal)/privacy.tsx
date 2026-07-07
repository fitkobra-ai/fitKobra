import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '../../constants/Theme';

export default function PrivacyScreen() {
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
        <Text style={styles.lastUpdated}>Last Updated: July 2026</Text>

        <Text style={styles.paragraph}>
          Welcome to KinexFit. We are committed to protecting your personal data and respecting your privacy. 
          This policy complies with the Digital Personal Data Protection Act (DPDP) and the General Data Protection Regulation (GDPR).
        </Text>

        <Text style={styles.sectionTitle}>1. Data We Collect</Text>
        <Text style={styles.paragraph}>
          We collect personal and health data that you voluntarily provide to us, including your name, email address, date of birth, gender, weight, height, and fitness goals. We also collect activity data such as workouts and daily steps.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          Your data is exclusively used to provide, maintain, and improve the KinexFit services. Specifically, health metrics are used to calculate personalized calorie and macro goals. We do not sell your personal data to third parties.
        </Text>

        <Text style={styles.sectionTitle}>3. Your Rights (DPDP & GDPR)</Text>
        <Text style={styles.paragraph}>
          You have the right to:
          {'\n'}• Access your personal data.
          {'\n'}• Correct inaccurate data.
          {'\n'}• Request the erasure of your data (Right to be Forgotten).
          {'\n'}• Withdraw your consent at any time.
        </Text>
        <Text style={styles.paragraph}>
          To exercise your right to erasure, you can delete your account and all associated data directly from the "Edit Profile" section within the app.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to protect your data. Your data is stored securely using Google Firebase cloud infrastructure.
        </Text>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginLeft: Spacing.sm },
  scroll: { padding: Spacing.xl },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: Spacing.xs },
  lastUpdated: { fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.blue, marginTop: Spacing.xl, marginBottom: Spacing.sm },
  paragraph: { fontSize: 15, color: Colors.textPrimary, lineHeight: 24, marginBottom: Spacing.md },
});
