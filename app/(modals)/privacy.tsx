import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Spacing } from '../../constants/Theme';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: Spacing.s,
      marginRight: Spacing.s,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    content: {
      padding: Spacing.l,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: Spacing.l,
      marginBottom: Spacing.s,
    },
    paragraph: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 22,
      marginBottom: Spacing.m,
    },
    disclaimerBox: {
      backgroundColor: colors.card,
      padding: Spacing.m,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.orange,
      marginVertical: Spacing.m,
    },
    disclaimerText: {
      color: colors.orange,
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: Spacing.xs,
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy & Terms</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>Medical Disclaimer</Text>
          <Text style={[styles.paragraph, { color: colors.text, marginBottom: 0 }]}>
            KinexFit and its AI Coach provide educational fitness suggestions and estimations, NOT medical advice. Always consult a physician or healthcare provider before starting any rigorous exercise program or making significant dietary changes.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>1. Data Collection & Privacy</Text>
        <Text style={styles.paragraph}>
          We take your privacy seriously. KinexFit does not sell your personal data. Workout logs, goals, and statistics are stored securely to provide you with insights and track your progress over time.
        </Text>

        <Text style={styles.sectionTitle}>2. AI Features & Permissions</Text>
        <Text style={styles.paragraph}>
          KinexFit utilizes artificial intelligence (Google Gemini) to power features like Snap-to-Recipe, AI Coach, and Voice Logging. 
        </Text>
        <Text style={styles.paragraph}>
          • **Camera Access:** When using the Snap-to-Recipe feature, photos are securely processed by the AI to identify ingredients and estimate nutrition. These photos are NEVER stored permanently on our servers or used for model training without consent.
        </Text>
        <Text style={styles.paragraph}>
          • **Microphone Access:** When using Voice Logging, your audio is securely transcribed to text to automatically log your workouts. The audio recordings are not stored.
        </Text>

        <Text style={styles.sectionTitle}>3. Local Storage</Text>
        <Text style={styles.paragraph}>
          We use secure on-device storage to maintain your active session and preferences. Your data is encrypted and tied directly to your authenticated account.
        </Text>

        <Text style={styles.sectionTitle}>4. Contact</Text>
        <Text style={styles.paragraph}>
          For any questions regarding this privacy policy or data deletion requests, please contact the development team at support@kinexfit.com.
        </Text>

        <View style={{ height: Spacing.xl * 2 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
