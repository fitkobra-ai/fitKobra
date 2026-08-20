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
    { id: 'weight_loss', title: 'Weight Loss', icon: 'fire' as const, color: colors.orange, subtitle: 'Burn fat & lean out' },
    { id: 'build_muscle', title: 'Build Muscle', icon: 'arm-flex' as const, color: colors.purple, subtitle: 'Gain strength' },
    { id: 'improve_endurance', title: 'Endurance', icon: 'run-fast' as const, color: colors.blue, subtitle: 'Train harder' },
    { id: 'general_health', title: 'Overall Health', icon: 'heart-pulse' as const, color: colors.green, subtitle: 'Stay active' },
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

  const currentGoalColor = GOALS.find(g => g.id === selectedGoal)?.color || colors.blue;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Generate Master Plan ✨</Text>
          <Text style={styles.subtitle}>Select your primary fitness goal below to reveal your customized blueprint.</Text>

          <ScrollView style={styles.planScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.planContent}>
            
            {/* Goal Selector Grid */}
            <View style={styles.gridContainer}>
              {GOALS.map(goal => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalBtn, 
                      isSelected && { borderColor: goal.color, backgroundColor: goal.color + '15' },
                      isSelected && Shadow.glow(goal.color)
                    ]}
                    onPress={() => setSelectedGoal(goal.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconWrapper, { backgroundColor: isSelected ? goal.color : colors.surfaceHighlight }]}>
                      <MaterialCommunityIcons name={goal.icon} size={32} color={isSelected ? '#fff' : colors.textSecondary} />
                    </View>
                    <Text style={[styles.goalText, isSelected && { color: goal.color }]}>{goal.title}</Text>
                    <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
                    
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: goal.color }]}>
                        <Feather name="check" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {/* The Blueprint */}
            <View style={[styles.card, Shadow.card, { borderColor: currentGoalColor + '40', marginTop: Spacing.md }]}>
              <View style={styles.cardHeader}>
                <Feather name="target" size={20} color={currentGoalColor} />
                <Text style={styles.cardTitle}>Your Daily Targets</Text>
              </View>
              
              <View style={styles.calorieRow}>
                <View style={styles.calBox}>
                  <Text style={styles.calLabel}>Maintenance</Text>
                  <Text style={styles.calValueSm}>{tdee} <Text style={styles.calUnitSm}>kcal</Text></Text>
                </View>
                <Feather name="chevrons-right" size={24} color={currentGoalColor} style={{ opacity: 0.6 }} />
                <View style={styles.calBoxMain}>
                  <Text style={[styles.calLabelMain, { color: currentGoalColor }]}>Target Intake</Text>
                  <Text style={styles.calValueMain}>{targetCalories} <Text style={styles.calUnit}>kcal</Text></Text>
                </View>
              </View>

              <View style={styles.macroSplit}>
                <MacroBox label="Protein" value={`${macros.p}g`} color={colors.blue} />
                <MacroBox label="Carbs" value={`${macros.c}g`} color={colors.orange} />
                <MacroBox label="Fats" value={`${macros.f}g`} color={colors.red} />
              </View>
            </View>

            {/* Activity Targets */}
            <View style={[styles.card, Shadow.card, { marginTop: Spacing.md }]}>
              <View style={styles.cardHeader}>
                <Feather name="activity" size={20} color={colors.red} />
                <Text style={styles.cardTitle}>Activity Targets</Text>
              </View>
              <View style={styles.macroSplit}>
                <MacroBox label="Steps" value={(selectedGoal === 'weight_loss' ? 12000 : (selectedGoal === 'build_muscle' ? 8000 : (selectedGoal === 'improve_endurance' ? 15000 : 10000))).toLocaleString()} color={colors.red} />
                <MacroBox label="Burn" value={`${selectedGoal === 'weight_loss' ? 500 : 300} kcal`} color={colors.orange} />
                <MacroBox label="Active" value="30 min" color={colors.green} />
              </View>
            </View>

            {/* Strategy */}
            <View style={[styles.card, Shadow.card]}>
              <View style={styles.strategyRow}>
                <View style={[styles.strategyIcon, { backgroundColor: colors.green + '20' }]}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={22} color={colors.green} />
                </View>
                <View style={styles.strategyTextCol}>
                  <Text style={styles.strategyTitle}>Nutrition Strategy</Text>
                  <Text style={styles.strategyDesc}>{strategy.diet}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.strategyRow}>
                <View style={[styles.strategyIcon, { backgroundColor: colors.purple + '20' }]}>
                  <MaterialCommunityIcons name="weight-lifter" size={22} color={colors.purple} />
                </View>
                <View style={styles.strategyTextCol}>
                  <Text style={styles.strategyTitle}>Training Strategy</Text>
                  <Text style={styles.strategyDesc}>{strategy.training}</Text>
                </View>
              </View>
            </View>

          </ScrollView>

          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: currentGoalColor, shadowColor: currentGoalColor }]} 
            activeOpacity={0.9} 
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Set As My Goal</Text>
            <Feather name="arrow-right" size={20} color="#fff" />
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
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.75)' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    height: '92%',
    gap: Spacing.md,
  },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: 'center', marginBottom: Spacing.xs },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: Spacing.sm, lineHeight: 22 },
  
  planScroll: { flex: 1 },
  planContent: { gap: Spacing.lg, paddingBottom: Spacing.xxl },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  goalBtn: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: colors.border,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    position: 'relative',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  goalText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  goalSubtitle: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: -4 },
  checkBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calBox: { alignItems: 'center' },
  calLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4, fontWeight: '700', textTransform: 'uppercase' },
  calValueSm: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  calUnitSm: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  
  calBoxMain: { alignItems: 'center' },
  calLabelMain: { fontSize: 14, fontWeight: '800', marginBottom: 2, textTransform: 'uppercase' },
  calValueMain: { fontSize: 36, fontWeight: '900', color: '#fff' },
  calUnit: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },

  macroSplit: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  macroBox: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  macroVal: { fontSize: 18, fontWeight: '800' },
  macroLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: '700', marginTop: 4 },

  strategyRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  strategyIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  strategyTextCol: { flex: 1, gap: 4 },
  strategyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  strategyDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: Spacing.sm },

  saveBtn: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginTop: Spacing.md,
  },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
});
