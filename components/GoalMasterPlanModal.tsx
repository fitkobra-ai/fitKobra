import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Radius, Spacing, Shadow } from '../constants/Theme';
import { UserProfile } from '../services/firestore';

interface GoalMasterPlanModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSaveGoal: (goal: string) => void;
}

export function GoalMasterPlanModal({ visible, onClose, profile, onSaveGoal }: GoalMasterPlanModalProps) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [selectedGoal, setSelectedGoal] = useState<string>(profile?.goal || 'weight_loss');

  const GOALS = [
    { id: 'weight_loss', title: 'Weight Loss', icon: 'fire' as const, color: colors.orange },
    { id: 'build_muscle', title: 'Build Muscle', icon: 'arm-flex' as const, color: colors.purple },
    { id: 'improve_endurance', title: 'Endurance', icon: 'run' as const, color: colors.blue },
    { id: 'general_health', title: 'General Health', icon: 'heart-pulse' as const, color: colors.green },
  ];

  const { tdee, targetCalories, macros, strategy } = useMemo(() => {
    // 1. Calculate Age
    let age = 30; // default
    if (profile?.dateOfBirth) {
      const [y, m, d] = profile.dateOfBirth.split('-');
      if (y && m && d) {
        const dob = new Date(Number(y), Number(m) - 1, Number(d));
        const diff = Date.now() - dob.getTime();
        age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      }
    }

    const weight = profile?.weightKg || 75;
    const height = profile?.heightCm || 175;

    // 2. Mifflin-St Jeor Equation (Simplified Average between Male/Female)
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 78;
    
    // 3. TDEE assuming moderate activity
    const calculatedTdee = Math.round(bmr * 1.55);

    let calculatedTarget = calculatedTdee;
    let strategyData = {
      diet: 'Balanced whole foods with moderate macros.',
      training: '3x full body workouts and daily walking.',
    };
    
    let pSplit = 0.3; // 30% protein
    let cSplit = 0.4; // 40% carbs
    let fSplit = 0.3; // 30% fats

    if (selectedGoal === 'weight_loss') {
      calculatedTarget = calculatedTdee - 500;
      pSplit = 0.35; // higher protein to preserve muscle
      cSplit = 0.35;
      fSplit = 0.30;
      strategyData = {
        diet: 'Caloric deficit of ~500 kcals. Focus on high-volume, low-calorie dense foods.',
        training: 'Prioritize resistance training to preserve muscle. Add 20-30m of LISS cardio 3x/week.',
      };
    } else if (selectedGoal === 'build_muscle') {
      calculatedTarget = calculatedTdee + 300;
      pSplit = 0.30;
      cSplit = 0.45; // higher carbs for energy
      fSplit = 0.25;
      strategyData = {
        diet: 'Caloric surplus of ~300 kcals. Eat protein rich meals every 3-4 hours.',
        training: 'Progressive overload on compound movements. 4-5x/week split (e.g., Push/Pull/Legs).',
      };
    } else if (selectedGoal === 'improve_endurance') {
      pSplit = 0.20;
      cSplit = 0.55; // high carbs for fuel
      fSplit = 0.25;
      strategyData = {
        diet: 'High carbohydrate intake to fuel long sessions. Maintain maintenance calories.',
        training: 'Zone 2 cardio focused. Long steady-state runs/cycles with 1x interval session/week.',
      };
    }

    const pGrams = Math.round((calculatedTarget * pSplit) / 4);
    const cGrams = Math.round((calculatedTarget * cSplit) / 4);
    const fGrams = Math.round((calculatedTarget * fSplit) / 9);

    return {
      tdee: calculatedTdee,
      targetCalories: calculatedTarget,
      macros: { p: pGrams, c: cGrams, f: fGrams },
      strategy: strategyData
    };
  }, [profile, selectedGoal]);

  const handleSave = () => {
    onSaveGoal(selectedGoal);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Goal Master Plan 🎯</Text>
          <Text style={styles.subtitle}>Select a goal to generate your custom blueprint.</Text>

          {/* Goal Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll} contentContainerStyle={styles.selectorContent}>
            {GOALS.map(goal => {
              const isSelected = selectedGoal === goal.id;
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalBtn, isSelected && { borderColor: goal.color, backgroundColor: goal.color + '20' }]}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name={goal.icon} size={28} color={isSelected ? goal.color : colors.textSecondary} />
                  <Text style={[styles.goalText, isSelected && { color: goal.color }]}>{goal.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView style={styles.planScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.planContent}>
            
            {/* The Blueprint */}
            <View style={[styles.card, Shadow.card]}>
              <Text style={styles.cardTitle}>Daily Targets ⚡</Text>
              
              <View style={styles.calorieRow}>
                <View style={styles.calBox}>
                  <Text style={styles.calLabel}>Maintenance</Text>
                  <Text style={styles.calValueSm}>{tdee} kcal</Text>
                </View>
                <Feather name="arrow-right" size={20} color={colors.textSecondary} />
                <View style={styles.calBoxMain}>
                  <Text style={styles.calLabelMain}>Target Intake</Text>
                  <Text style={styles.calValueMain}>{targetCalories} <Text style={styles.calUnit}>kcal</Text></Text>
                </View>
              </View>

              <View style={styles.macroSplit}>
                <MacroBox label="Protein" value={`${macros.p}g`} color={colors.blue} />
                <MacroBox label="Carbs" value={`${macros.c}g`} color={colors.orange} />
                <MacroBox label="Fats" value={`${macros.f}g`} color={colors.red} />
              </View>
            </View>

            {/* Strategy */}
            <View style={[styles.card, Shadow.card]}>
              <View style={styles.strategyRow}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={colors.green} />
                <View style={styles.strategyTextCol}>
                  <Text style={styles.strategyTitle}>Nutrition Strategy</Text>
                  <Text style={styles.strategyDesc}>{strategy.diet}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.strategyRow}>
                <MaterialCommunityIcons name="weight-lifter" size={24} color={colors.purple} />
                <View style={styles.strategyTextCol}>
                  <Text style={styles.strategyTitle}>Training Strategy</Text>
                  <Text style={styles.strategyDesc}>{strategy.training}</Text>
                </View>
              </View>
            </View>

          </ScrollView>

          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Set As My Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function MacroBox({ label, value, color }: { label: string; value: string; color: string }) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={[styles.macroBox, { backgroundColor: color + '15', borderColor: color + '40' }]}>
      <Text style={[styles.macroVal, { color }]}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    height: '85%',
    gap: Spacing.md,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: Spacing.xs },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: Spacing.sm },
  
  selectorScroll: { flexGrow: 0, minHeight: 110, maxHeight: 110 },
  selectorContent: { gap: Spacing.md, paddingRight: Spacing.xl },
  goalBtn: {
    width: 100,
    height: 90,
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  goalText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textAlign: 'center' },

  planScroll: { flex: 1 },
  planContent: { gap: Spacing.lg, paddingBottom: Spacing.xxl },
  
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.md,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceHighlight,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  calBox: { alignItems: 'center' },
  calLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  calValueSm: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  
  calBoxMain: { alignItems: 'center' },
  calLabelMain: { fontSize: 13, color: colors.green, fontWeight: '700', marginBottom: 2 },
  calValueMain: { fontSize: 26, fontWeight: '800', color: '#fff' },
  calUnit: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },

  macroSplit: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  macroBox: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  macroVal: { fontSize: 16, fontWeight: '800' },
  macroLabel: { fontSize: 12, color: colors.textPrimary, fontWeight: '600', marginTop: 2 },

  strategyRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  strategyTextCol: { flex: 1, gap: 4 },
  strategyTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  strategyDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: Spacing.sm },

  saveBtn: {
    backgroundColor: colors.purple,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.full,
    alignItems: 'center',
    shadowColor: colors.purple,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginTop: 'auto',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
