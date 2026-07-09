import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Spacing, Radius } from '../../constants/Theme';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { saveUserProfile, saveUserGoals } from '../../services/firestore';
import { calculateBMR, calculateTDEE, recommendedDailySteps } from '../../utils/calculations';
import { todayKey } from '../../utils/dates';
import { GoalMasterPlanModal } from '../../components/GoalMasterPlanModal';

const GOALS = [
  { id: 'weight_loss', label: 'Weight Loss', desc: 'Burn fat and get leaner' },
  { id: 'build_muscle', label: 'Build Muscle', desc: 'Gain strength and size' },
  { id: 'improve_endurance', label: 'Endurance', desc: 'Run further, train harder' },
  { id: 'general_health', label: 'General Health', desc: 'Stay active and healthy' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise' },
  { id: 'lightly_active', label: 'Lightly Active', desc: 'Exercise 1-3 days/week' },
  { id: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
  { id: 'very_active', label: 'Very Active', desc: 'Exercise 6-7 days/week' },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const router = useRouter();
  const { user } = useAuth();
  const { refreshProfile } = useApp();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showMasterPlan, setShowMasterPlan] = useState(false);

  // Form State
  const [dob, setDob] = useState('1990-01-01');
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('175');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [goal, setGoal] = useState('general_health');
  const [activity, setActivity] = useState('moderately_active');

  const handleNext = () => {
    if (step === 1 && (!weight || !height)) {
      Alert.alert('Error', 'Please enter weight and height');
      return;
    }
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const weightKg = parseFloat(weight) || 75;
      const heightCm = parseFloat(height) || 175;
      
      const profileData = {
        name: user.displayName || 'User',
        dateOfBirth: dob,
        weightKg,
        heightCm,
        gender,
        goal,
        activityLevel: activity,
        unit: 'metric' as const,
        createdAt: new Date().toISOString(),
      };

      await saveUserProfile(user.uid, profileData);

      // Setup initial goals
      const age = new Date().getFullYear() - parseInt(dob.split('-')[0]);
      const bmr = calculateBMR(weightKg, heightCm, age, gender);
      const tdee = calculateTDEE(bmr, activity);
      // Daily burn goal: assume we want to burn 500 cals extra via exercise if losing weight
      const burnGoal = goal === 'weight_loss' ? 500 : 300;
      
      await saveUserGoals(user.uid, {
        dailySteps: recommendedDailySteps(goal),
        dailyCaloriesBurn: burnGoal,
        dailyActiveMinutes: 30,
      });

      // Reload global app context state
      await refreshProfile();
      // Router will automatically kick us out of onboarding into (tabs) 
      // via RootLayout because profile is now loaded!
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled={Platform.OS === 'ios'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to KinexFit</Text>
          <Text style={styles.subtitle}>Let's personalize your experience.</Text>
        </View>

        <View style={styles.stepsIndicator}>
          {[1, 2, 3].map(i => (
            <View key={i} style={[styles.stepDot, step >= i && styles.stepDotActive]} />
          ))}
        </View>

        {step === 1 && (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Body Metrics</Text>
            <Input
              label="Date of Birth (YYYY-MM-DD)"
              value={dob}
              onChangeText={setDob}
              keyboardType="number-pad"
            />
            <View style={styles.row}>
              <View style={styles.flex}>
                <Input
                  label="Weight (kg)"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.flex}>
                <Input
                  label="Height (cm)"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View>
              <Text style={styles.label}>Gender (for BMR calc)</Text>
              <View style={styles.row}>
                {['male', 'female', 'other'].map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.radioBtn, gender === g && styles.radioBtnActive]}
                    onPress={() => setGender(g as any)}
                  >
                    <Text style={[styles.radioText, gender === g && styles.radioTextActive]}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Your Custom Blueprint</Text>
            <Text style={styles.label}>We'll use your metrics to calculate your optimal macros and strategy for any goal.</Text>
            
            <Button 
              label="Generate Master Plan ✨"
              onPress={() => setShowMasterPlan(true)}
              style={{ marginTop: Spacing.xl }}
            />

            <GoalMasterPlanModal 
              visible={showMasterPlan}
              onClose={() => setShowMasterPlan(false)}
              profile={{
                dateOfBirth: dob,
                weightKg: parseFloat(weight) || 75,
                heightCm: parseFloat(height) || 175,
                gender: gender as any,
                goal: goal,
                name: user?.displayName || 'User',
                activityLevel: activity as any,
                unit: 'metric',
                createdAt: new Date().toISOString()
              }}
              onSaveGoal={(selectedGoal) => {
                setGoal(selectedGoal);
                setShowMasterPlan(false);
                setStep(3);
              }}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>How active are you?</Text>
            {ACTIVITY_LEVELS.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[styles.cardOption, activity === a.id && styles.cardOptionActive]}
                onPress={() => setActivity(a.id)}
              >
                <Text style={styles.cardTitle}>{a.label}</Text>
                <Text style={styles.cardDesc}>{a.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          {step > 1 && (
            <Button 
              label="Back" 
              variant="secondary" 
              onPress={() => setStep(s => s - 1)} 
              style={{ flex: 1 }} 
            />
          )}
          <Button 
            label={step === 3 ? "Complete Setup" : "Next"} 
            onPress={handleNext} 
            loading={loading}
            style={{ flex: 2 }} 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: Spacing.xl, paddingTop: 60, paddingBottom: 80 },
  header: { marginBottom: Spacing.xl },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  stepsIndicator: { flexDirection: 'row', gap: 8, marginBottom: Spacing.xl },
  stepDot: { height: 4, flex: 1, backgroundColor: colors.surfaceHighlight, borderRadius: 2 },
  stepDotActive: { backgroundColor: colors.blue },
  form: { gap: Spacing.lg, flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.md },
  flex: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  radioBtn: { flex: 1, padding: 12, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  radioBtnActive: { borderColor: colors.blue, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  radioText: { color: colors.textSecondary, fontWeight: '600' },
  radioTextActive: { color: colors.blue },
  cardOption: { padding: Spacing.lg, borderRadius: Radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardOptionActive: { borderColor: colors.blue, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  cardDesc: { color: colors.textSecondary, fontSize: 14 },
  footer: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xxl, paddingBottom: Spacing.xl },
});
