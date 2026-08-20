import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { WORKOUT_TYPES, getWorkoutType } from '../../constants/WorkoutTypes';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { saveWorkout, type WorkoutRecord } from '../../services/firestore';
import { formatTime, relativeDate } from '../../utils/dates';
import WorkoutTimer from '../../components/WorkoutTimer';
import AnimatedExerciseSkeleton from '../../components/AnimatedExerciseSkeleton';
import { ExerciseVideoPlayer } from '../../components/ExerciseVideoPlayer';
import { MUSCLE_EXERCISES_DATA, ExerciseGuide } from '../../constants/MuscleGuideData';
import { Platform } from 'react-native';

export default function WorkoutsScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { workouts, profile, addWorkout } = useApp();
  const { user } = useAuth();
  
  const MUSCLE_GROUPS = [
    { id: 'shoulders', name: 'Shoulders', icon: 'human-handsup', color: colors.orange, desc: 'Deltoids & Traps' },
    { id: 'chest', name: 'Chest', icon: 'human-male', color: colors.blue, desc: 'Pectorals' },
    { id: 'back', name: 'Back', icon: 'dumbbell', color: colors.purple, desc: 'Lats & Rhomboids' },
    { id: 'arms', name: 'Arms', icon: 'arm-flex', color: colors.red, desc: 'Biceps & Triceps' },
    { id: 'core', name: 'Core', icon: 'run', color: colors.green, desc: 'Abs & Obliques' },
    { id: 'legs', name: 'Legs', icon: 'shoe-sneaker', color: colors.blue, desc: 'Quads, Hamstrings & Calves' },
  ];
  
  const [activeTab, setActiveTab] = useState<'tracker' | 'guide'>('tracker');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);

  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [popupExercise, setPopupExercise] = useState<ExerciseGuide | null>(null);

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (popupExercise) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 5000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [popupExercise]);

  // Weekly Summary logic
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklyWorkouts = workouts.filter(w => new Date(w.startedAt) >= oneWeekAgo);
  const weeklyTotalTime = weeklyWorkouts.reduce((acc, w) => acc + w.durationSeconds, 0);
  const weeklyTotalCals = weeklyWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);

  const handleStopWorkout = async (result: { durationSeconds: number; caloriesBurned: number }) => {
    if (!user || !activeWorkout) return;
    
    const record: WorkoutRecord = {
      type: activeWorkout,
      startedAt: new Date().toISOString(),
      durationSeconds: result.durationSeconds,
      caloriesBurned: result.caloriesBurned,
    };
    
    addWorkout(record);
    setActiveWorkout(null);
    saveWorkout(user.uid, record).catch(console.error);
  };

  const getIntensityTag = (met: number) => {
    if (met < 4) return { label: 'Low Intensity 🧘', color: colors.green };
    if (met < 8) return { label: 'Medium Intensity 🏋️', color: colors.blue };
    return { label: 'High Intensity 🔥', color: colors.orange };
  };

  const renderTracker = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts 💪</Text>
        <TouchableOpacity
          style={[styles.startBtn, Shadow.glow(colors.blue)]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.startBtnText}>+ Start</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.summaryCard, Shadow.card]}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.summaryRow}>
          <SummaryStat label="Workouts" value={weeklyWorkouts.length.toString()} color={colors.blue} />
          <View style={styles.divider} />
          <SummaryStat label="Total Time" value={formatTime(weeklyTotalTime * 1000)} color={colors.green} />
          <View style={styles.divider} />
          <SummaryStat label="Calories" value={weeklyTotalCals.toLocaleString()} color={colors.orange} />
        </View>
      </View>

      <View style={[styles.section, Shadow.card]}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.typeGrid}>
          {WORKOUT_TYPES.map((wt) => (
            <TouchableOpacity
              key={wt.id}
              style={[styles.typeChip, { borderColor: `${wt.color}40`, backgroundColor: `${wt.color}15` }]}
              activeOpacity={0.7}
              onPress={() => { setSelectedType(wt.id); setModalVisible(true); }}
            >
              <Feather name={wt.iconName as any} size={16} color={wt.color} />
              <Text style={[styles.typeLabel, { color: wt.color }]}>{wt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, Shadow.card]}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <View style={styles.workoutList}>
          {workouts.length === 0 ? (
            <Text style={styles.emptyText}>No workouts recorded yet. Start moving!</Text>
          ) : (
            workouts.map((workout, idx) => {
              const wt = getWorkoutType(workout.type);
              return (
                <TouchableOpacity key={workout.id || idx} style={styles.workoutItem} activeOpacity={0.7}>
                  <View style={[styles.workoutIcon, { backgroundColor: `${wt.color}20` }]}>
                    <Feather name={wt.iconName as any} size={22} color={wt.color} />
                  </View>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutType}>{wt.label}</Text>
                    <Text style={styles.workoutMeta}>
                      {relativeDate(workout.startedAt)} · {Math.floor(workout.durationSeconds / 60)}m
                      {workout.distanceKm ? ` · ${workout.distanceKm}km` : ''}
                    </Text>
                  </View>
                  <View style={styles.workoutCalories}>
                    <Text style={[styles.calValue, { color: wt.color }]}>{workout.caloriesBurned}</Text>
                    <Text style={styles.calUnit}>kcal</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );

  const renderGuide = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Muscle Guide 🧠</Text>
      </View>
      
      <View style={[styles.anatomyContainer, Shadow.glow(colors.purple)]}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop' }} 
          style={styles.anatomyImage} 
        />
        <View style={styles.anatomyOverlay}>
          <Text style={styles.anatomyTitle}>Select a Muscle Group</Text>
          <Text style={styles.anatomySubtitle}>to see targeted exercises</Text>
        </View>
      </View>

      <View style={styles.muscleGrid}>
        {MUSCLE_GROUPS.map((mg) => (
          <TouchableOpacity 
            key={mg.id} 
            style={[styles.muscleCard, Shadow.card, { borderColor: `${mg.color}40` }]}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedMuscle(mg.id);
              setGuideModalVisible(true);
            }}
          >
            <View style={[styles.muscleIconBox, { backgroundColor: `${mg.color}20` }]}>
              <MaterialCommunityIcons name={mg.icon as any} size={24} color={mg.color} />
            </View>
            <Text style={styles.muscleName}>{mg.name}</Text>
            <Text style={styles.muscleDesc}>{mg.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      
      {activeWorkout ? (
        <View style={styles.timerContainer}>
          <WorkoutTimer 
            workoutType={getWorkoutType(activeWorkout)}
            userWeightKg={profile?.weightKg || 75}
            onStop={handleStopWorkout}
            onCancel={() => setActiveWorkout(null)}
          />
        </View>
      ) : (
        <>
          <View style={styles.topTabs}>
            <TouchableOpacity 
              style={[styles.topTabBtn, activeTab === 'tracker' && styles.topTabBtnActive]} 
              onPress={() => setActiveTab('tracker')}
            >
              <Text style={[styles.topTabText, activeTab === 'tracker' && styles.topTabTextActive]}>Tracker</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.topTabBtn, activeTab === 'guide' && styles.topTabBtnActive]} 
              onPress={() => setActiveTab('guide')}
            >
              <Text style={[styles.topTabText, activeTab === 'guide' && styles.topTabTextActive]}>Muscle Guide</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'tracker' ? renderTracker() : renderGuide()}
        </>
      )}

      {/* Start Workout Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            
            {/* High-Contrast Header Navigation Bar with Back Button */}
            <View style={styles.modalHeaderRow}>
              <TouchableOpacity 
                style={styles.modalBackBtn} 
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={22} color={colors.textPrimary} />
                <Text style={styles.modalBackBtnText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Choose Workout Type</Text>

              <TouchableOpacity 
                style={styles.modalCloseIconBtn} 
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Feather name="x" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.typeGridModal}>
              {WORKOUT_TYPES.map((wt) => {
                const intensity = getIntensityTag(wt.met);
                return (
                  <TouchableOpacity
                    key={wt.id}
                    style={[
                      styles.typeCard,
                      selectedType === wt.id && { borderColor: wt.color, backgroundColor: `${wt.color}15` },
                    ]}
                    onPress={() => setSelectedType(wt.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.typeIconBox, { backgroundColor: `${wt.color}20` }]}>
                      <Feather name={wt.iconName as any} size={20} color={wt.color} />
                    </View>
                    <View style={styles.typeCardInfo}>
                      <Text style={[styles.typeCardLabel, { color: colors.textPrimary }]}>{wt.label}</Text>
                      <Text style={[styles.intensityTag, { color: intensity.color }]}>{intensity.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Row with Back & Begin Workout buttons */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.beginBtn, { flex: 2, marginTop: 0 }, !selectedType && styles.beginBtnDisabled]}
                onPress={() => {
                  if (selectedType) {
                    setActiveWorkout(selectedType);
                    setModalVisible(false);
                    setSelectedType(null);
                  }
                }}
                activeOpacity={0.8}
                disabled={!selectedType}
              >
                <Text style={styles.beginBtnText}>🏁 Begin Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Muscle Guide Modal */}
      <Modal visible={guideModalVisible} animationType="fade" transparent onRequestClose={() => setGuideModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setGuideModalVisible(false)} />
          <View style={[styles.guideModalSheet, Shadow.glow(colors.purple)]}>
            <TouchableOpacity style={styles.guideCloseBtn} onPress={() => setGuideModalVisible(false)}>
              <Feather name="x" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {selectedMuscle && (
              <>
                <Text style={styles.guideTitle}>
                  {MUSCLE_GROUPS.find(m => m.id === selectedMuscle)?.name} Exercises
                </Text>
                <ScrollView style={styles.guideList} showsVerticalScrollIndicator={false}>
                  {(MUSCLE_EXERCISES_DATA[selectedMuscle] || []).map((ex) => (
                    <TouchableOpacity 
                      key={ex.id} 
                      style={styles.guideExerciseCard}
                      activeOpacity={0.8}
                      onPress={() => setPopupExercise(ex)}
                    >
                      <Image source={ex.thumb || ex.gif} style={styles.guideExerciseImage} resizeMode="cover" />
                      <View style={styles.guideExerciseContent}>
                        <View style={styles.guideExerciseHeader}>
                          <Feather name="play-circle" size={18} color={colors.purple} />
                          <Text style={styles.guideExerciseName}>{ex.name}</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: colors.purple, fontWeight: 'bold', marginBottom: 2 }}>{ex.subCategory}</Text>
                        <Text style={styles.guideExerciseTips} numberOfLines={2}>{ex.tips}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* HD Video & AI Skeleton Popup Modal */}
      <Modal 
        visible={!!popupExercise} 
        animationType="fade" 
        transparent 
        onRequestClose={() => setPopupExercise(null)}
      >
        <View style={styles.modalOverlayCenter}>
          <Pressable style={styles.modalBackdrop} onPress={() => setPopupExercise(null)} />
          {popupExercise && (
            <View style={[styles.popupSheet, Shadow.glow(colors.purple), { maxWidth: 500, width: '92%' }]}>
              <View style={styles.popupHeader}>
                <View>
                  <Text style={styles.popupTitle}>{popupExercise.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.purple, fontWeight: 'bold' }}>{popupExercise.subCategory}</Text>
                </View>
                <TouchableOpacity onPress={() => setPopupExercise(null)} style={styles.popupCloseBtn}>
                  <Feather name="x" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ gap: Spacing.md, paddingBottom: Spacing.sm }} showsVerticalScrollIndicator={false}>
                {/* Ultra High-Definition Native Video Player */}
                <View style={{ width: '100%', height: 220, borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: colors.border }}>
                  <ExerciseVideoPlayer
                    videoSource={popupExercise.video}
                    fallbackImage={popupExercise.gif || popupExercise.thumb}
                  />
                </View>

                {/* Primary & Secondary Target Muscle Badges */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {popupExercise.primaryMuscles.map((m, idx) => (
                    <View key={idx} style={{ backgroundColor: colors.purple + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: colors.purple + '40' }}>
                      <Text style={{ color: colors.purple, fontSize: 11, fontWeight: 'bold' }}>🎯 {m}</Text>
                    </View>
                  ))}
                  {popupExercise.secondaryMuscles.map((m, idx) => (
                    <View key={idx} style={{ backgroundColor: colors.surfaceHighlight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: colors.border }}>
                      <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: 'bold' }}>• {m}</Text>
                    </View>
                  ))}
                </View>

                {/* Form & Technique Tips */}
                <View style={[styles.popupFooter, { backgroundColor: colors.bg, padding: Spacing.md, borderRadius: Radius.md }]}>
                  <Feather name="info" size={18} color={colors.blue} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.textPrimary, fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>Pro Form Tip</Text>
                    <Text style={styles.popupTips}>{popupExercise.tips}</Text>
                  </View>
                </View>

                {/* Live AI Skeleton Motion Analysis */}
                <View style={{ alignItems: 'center', marginTop: Spacing.xs }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>AI SKELETON KINEMATICS</Text>
                  <AnimatedExerciseSkeleton exerciseName={popupExercise.name} color={colors.purple} size={140} />
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>

    </SafeAreaView>
  );
}

function SummaryStat({ label, value, color }: { label: string; value: string; color: string }) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.summaryStat}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  timerContainer: { flex: 1, padding: Spacing.md, justifyContent: 'center' },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl + Spacing.lg, gap: Spacing.md },
  
  topTabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  topTabBtnActive: { backgroundColor: colors.surface },
  topTabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  topTabTextActive: { color: colors.textPrimary },

  emptyText: { textAlign: 'center', color: colors.textSecondary, fontStyle: 'italic', paddingVertical: Spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  startBtn: { backgroundColor: colors.blue, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  
  summaryCard: { backgroundColor: colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: colors.border, gap: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  summaryStat: { alignItems: 'center', gap: 2 },
  summaryValue: { fontSize: 22, fontWeight: '700' },
  summaryLabel: { fontSize: 12, color: colors.textSecondary },
  divider: { width: 1, height: 40, backgroundColor: colors.border },
  
  section: { backgroundColor: colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: colors.border, gap: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1 },
  typeLabel: { fontSize: 13, fontWeight: '600' },
  
  workoutList: { gap: Spacing.sm },
  workoutItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: colors.surfaceHighlight, borderRadius: Radius.md, gap: Spacing.md },
  workoutIcon: { width: 48, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  workoutInfo: { flex: 1, gap: 2 },
  workoutType: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  workoutMeta: { fontSize: 12, color: colors.textSecondary },
  workoutCalories: { alignItems: 'flex-end' },
  calValue: { fontSize: 16, fontWeight: '700' },
  calUnit: { fontSize: 11, color: colors.textSecondary },

  anatomyContainer: {
    width: '100%',
    height: 220,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.sm,
  },
  anatomyImage: { width: '100%', height: '100%' },
  anatomyOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  anatomyTitle: { fontSize: 24, fontWeight: '800', color: '#fff', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  anatomySubtitle: { fontSize: 14, color: '#e0e0e0', fontWeight: '500' },
  
  muscleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'space-between' },
  muscleCard: { width: '47%', backgroundColor: colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, alignItems: 'center', gap: Spacing.sm },
  muscleIconBox: { width: 48, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  muscleName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  muscleDesc: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.7)' },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, paddingBottom: 40, borderWidth: 1, borderBottomWidth: 0, borderColor: colors.border, gap: Spacing.md },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.surfaceHighlight, alignSelf: 'center', marginBottom: Spacing.xs },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  modalBackBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingRight: 8 },
  modalBackBtnText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  modalCloseIconBtn: { padding: 4 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  
  typeGridModal: { gap: Spacing.sm },
  typeCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceHighlight },
  typeIconBox: { width: 40, height: 40, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  typeCardInfo: { flex: 1, gap: 4 },
  typeCardLabel: { fontSize: 16, fontWeight: '600' },
  intensityTag: { fontSize: 12, fontWeight: '500' },
  
  modalActionRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  modalCancelBtn: { flex: 1, backgroundColor: colors.surfaceHighlight, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  modalCancelBtnText: { color: colors.textPrimary, fontWeight: '700', fontSize: 15 },
  beginBtn: { backgroundColor: colors.blue, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm },
  beginBtnDisabled: { backgroundColor: colors.surfaceHighlight, opacity: 0.6 },
  beginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  guideModalSheet: {
    backgroundColor: colors.surface,
    margin: Spacing.lg,
    marginTop: 100,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '70%',
  },
  guideCloseBtn: { position: 'absolute', top: Spacing.md, right: Spacing.md, zIndex: 10, padding: 4 },
  guideTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: Spacing.lg },
  guideList: { gap: Spacing.md },
  guideExerciseCard: { backgroundColor: colors.surfaceHighlight, borderRadius: Radius.lg, overflow: 'hidden', marginBottom: Spacing.md, borderWidth: 1, borderColor: colors.border },
  guideExerciseImage: { width: '100%', height: 160 },
  guideExerciseContent: { padding: Spacing.md },
  guideExerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  guideExerciseName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  guideExerciseTips: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  
  modalOverlayCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' },
  popupSheet: { width: '90%', backgroundColor: colors.surface, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  popupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  popupTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  popupCloseBtn: { padding: 4 },
  popupAnimationContainer: { width: '100%', height: 300, backgroundColor: '#000', overflow: 'hidden' },
  popupAnimationImage: { width: '100%', height: '100%', opacity: 0.8 },
  popupFooter: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, padding: Spacing.lg, backgroundColor: colors.surfaceHighlight, borderTopWidth: 1, borderTopColor: colors.border },
  popupTips: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
});
