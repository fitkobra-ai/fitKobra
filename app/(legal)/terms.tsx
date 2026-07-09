import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Spacing, Radius } from '../../constants/Theme';

export default function TermsScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last Updated: July 2026</Text>

        <Text style={styles.paragraph}>
          Please read these Terms of Service completely before using KinexFit.
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By registering for, accessing, or using KinexFit, you agree to be bound by these Terms. If you do not agree, you may not use the App.
        </Text>

        <Text style={styles.sectionTitle}>2. Medical Disclaimer</Text>
        <Text style={styles.paragraph}>
          KinexFit provides fitness and nutritional tracking features for informational purposes only. The app does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before beginning any new diet or exercise program.
        </Text>

        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use of your account.
        </Text>

        <Text style={styles.sectionTitle}>4. User Content</Text>
        <Text style={styles.paragraph}>
          You retain all rights to the health data you submit. By submitting data, you grant us the right to process this data to provide our services, in accordance with our Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>5. Termination</Text>
        <Text style={styles.paragraph}>
          We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the app, us, or third parties, or for any other reason.
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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.green, marginTop: Spacing.xl, marginBottom: Spacing.sm },
  paragraph: { fontSize: 15, color: colors.textPrimary, lineHeight: 24, marginBottom: Spacing.md },
});
