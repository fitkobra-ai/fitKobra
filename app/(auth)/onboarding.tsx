import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Spacing, Radius } from '../../constants/Theme';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { saveUserProfile, saveUserGoals } from '../../services/firestore';
import { calculateBMR, calculateTDEE, recommendedDailySteps } from '../../utils/calculations';
import { todayKey } from '../../utils/dates';
import { GoalMasterPlanModal } from '../../components/GoalMasterPlanModal';
import { Calendar } from 'react-native-calendars';
import { Modal } from 'react-native';

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
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      
      const { generateReferralCode } = require('../../services/firestore');
      const profileData = {
        name: user.displayName || 'User',
        dateOfBirth: dob,
        weightKg,
        heightCm,
        gender,
        goal,
        activityLevel: activity,
        unit: 'metric' as const,
        referralCode: generateReferralCode(),
        aiCredits: 10,
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

      // Send Welcome Email
      if (user.email) {
        try {
          const { sendWelcomeEmail } = require('../../services/email');
          await sendWelcomeEmail({
            userName: user.displayName || 'Fitness Enthusiast',
            userEmail: user.email,
            referralCode: profileData.referralCode || 'KINEX-7A2F',
          });
        } catch (e) {
          console.log('Welcome email suppressed or non-fatal error:', e);
        }
      }

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
          <Image source={require('../../assets/images/truefit-logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome to FitKobra</Text>
          <Text style={styles.subtitle}>Let's customize your AI Master Plan targets.</Text>
        </View>

        {/* FitKobra AI Trainer Hero Showcase Card */}
        <View style={styles.modelHeroCard}>
          <Image source={require('../../assets/images/fitkobra-model.jpg')} style={styles.modelAvatar} resizeMode="cover" />
          <View style={styles.modelHeroContent}>
            <Text style={styles.modelHeroTitle}>FitKobra AI Trainer</Text>
            <Text style={styles.modelHeroDesc}>
              Answer 3 quick questions to calculate your exact caloric & macro needs!
            </Text>
          </View>
        </View>

        <View style={styles.stepsIndicator}>
          {[1, 2, 3].map(i => (
            <View key={i} style={[styles.stepDot, step >= i && styles.stepDotActive]} />
          ))}
        </View>

        {step === 1 && (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Body Metrics</Text>
            
            <View style={{ marginBottom: Spacing.sm }}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.datePickerBtn}
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerValue}>{dob}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
                <TouchableOpacity style={styles.calendarOverlay} activeOpacity={1} onPress={() => setShowDatePicker(false)}>
                  <TouchableOpacity style={styles.calendarContainer} activeOpacity={1}>
                    <Text style={styles.calendarTitle}>Select Date of Birth</Text>
                    <Calendar
                      current={dob}
                      maxDate={new Date().toISOString().split('T')[0]}
                      onDayPress={(day: any) => {
                        setDob(day.dateString);
                        setShowDatePicker(false);
                      }}
                      theme={{
                        backgroundColor: colors.surface,
                        calendarBackground: colors.surface,
                        textSectionTitleColor: colors.textSecondary,
                        selectedDayBackgroundColor: colors.blue,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: colors.blue,
                        dayTextColor: colors.textPrimary,
                        textDisabledColor: colors.border,
                        monthTextColor: colors.textPrimary,
                        arrowColor: colors.blue,
                      }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>
            )}
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
          <View style={[styles.form, { justifyContent: 'center' }]}>
            <View style={{ alignItems: 'center', marginBottom: Spacing.xl }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg }}>
                <MaterialCommunityIcons name="magic-staff" size={40} color={colors.blue} />
              </View>
              <Text style={[styles.sectionTitle, { textAlign: 'center', fontSize: 24, marginBottom: Spacing.sm }]}>Your Custom Blueprint</Text>
              <Text style={[styles.label, { textAlign: 'center', fontSize: 15, lineHeight: 22, paddingHorizontal: Spacing.md }]}>
                We'll use your metrics to calculate your optimal macros and strategy for your goal.
              </Text>
            </View>
            
            <View style={{ gap: Spacing.lg, paddingHorizontal: Spacing.md, marginBottom: Spacing.xxl }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <MaterialCommunityIcons name="bullseye-arrow" size={24} color={colors.green} />
                <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}>Precision Target Setting</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <MaterialCommunityIcons name="food-apple" size={24} color={colors.orange} />
                <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}>Optimal Macro Ratios</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color={colors.blue} />
                <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '600' }}>Daily Energy Estimates</Text>
              </View>
            </View>

            <Button 
              label="Generate Master Plan ✨"
              onPress={() => setShowMasterPlan(true)}
              style={{ marginTop: 'auto' }}
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

        {step !== 2 && (
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
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: Spacing.xl, paddingTop: 60, paddingBottom: 130 },
  header: { marginBottom: Spacing.sm, alignItems: 'center' },
  logo: { width: 110, height: 110, marginBottom: 2 },
  title: { fontSize: 30, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  subtitle: { fontSize: 13, color: '#CBD5E1', textAlign: 'center', marginTop: 2 },
  modelHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2a',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 230, 153, 0.4)',
  },
  modelAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#00e699',
  },
  modelHeroContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 230, 153, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00e699',
    marginRight: 5,
  },
  activeBadgeText: {
    fontSize: 9,
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
  },
  stepsIndicator: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs, marginBottom: Spacing.md },
  stepDot: { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2 },
  stepDotActive: { backgroundColor: colors.green },
  form: { gap: Spacing.md },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: Spacing.xs },
  row: { flexDirection: 'row', gap: Spacing.md },
  flex: { flex: 1 },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 4, fontWeight: '600' },
  radioBtn: { flex: 1, padding: 12, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  radioBtnActive: { borderColor: colors.blue, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  radioText: { color: colors.textSecondary, fontWeight: '600' },
  radioTextActive: { color: colors.blue },
  datePickerBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.md,
    padding: 16,
    height: 52,
    justifyContent: 'center',
  },
  datePickerValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  calendarContainer: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  cardOption: { padding: Spacing.lg, borderRadius: Radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardOptionActive: { borderColor: colors.blue, backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { color: colors.textSecondary, fontSize: 14 },
  footer: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xxl, paddingBottom: Spacing.xl },
});
