import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadow } from '../constants/Theme';
import { UserProfile } from '../services/firestore';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSave: (updates: Partial<UserProfile>) => void;
}

export function NotificationsModal({ visible, onClose, profile, onSave }: NotificationsModalProps) {
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(false);
  const [goalProgress, setGoalProgress] = useState(true);
  const [appUpdates, setAppUpdates] = useState(true);

  React.useEffect(() => {
    if (visible && profile?.notifications) {
      setWorkoutReminders(profile.notifications.workoutReminders ?? true);
      setMealReminders(profile.notifications.mealReminders ?? false);
      setGoalProgress(profile.notifications.goalProgress ?? true);
      setAppUpdates(profile.notifications.appUpdates ?? true);
    }
  }, [visible, profile]);

  const handleSave = () => {
    onSave({
      notifications: {
        workoutReminders,
        mealReminders,
        goalProgress,
        appUpdates,
      }
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Feather name="x" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={[styles.card, Shadow.card]}>
              <NotificationToggle 
                icon="dumbbell" 
                title="Workout Reminders" 
                desc="Get notified when it's time to train based on your schedule." 
                value={workoutReminders} 
                onValueChange={setWorkoutReminders} 
              />
              <View style={styles.divider} />
              <NotificationToggle 
                icon="silverware-fork-knife" 
                title="Meal Tracking Alerts" 
                desc="Reminders to log your meals and hit your macro targets." 
                value={mealReminders} 
                onValueChange={setMealReminders} 
              />
            </View>

            <View style={[styles.card, Shadow.card]}>
              <NotificationToggle 
                icon="bullseye-arrow" 
                title="Goal Progress Updates" 
                desc="Weekly summaries on your fitness journey and milestones." 
                value={goalProgress} 
                onValueChange={setGoalProgress} 
              />
              <View style={styles.divider} />
              <NotificationToggle 
                icon="bell-ring" 
                title="App Updates & Tips" 
                desc="New features, health tips, and app announcements." 
                value={appUpdates} 
                onValueChange={setAppUpdates} 
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function NotificationToggle({ icon, title, desc, value, onValueChange }: { icon: any, title: string, desc: string, value: boolean, onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={22} color={Colors.blue} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDesc}>{desc}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: Colors.border, true: Colors.blue }}
        thumbColor={Platform.OS === 'ios' ? '#fff' : value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    height: '75%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  scroll: { flex: 1 },
  content: { gap: Spacing.lg, paddingBottom: Spacing.xxl },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: { flex: 1, gap: 2 },
  toggleTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  toggleDesc: { fontSize: 13, color: Colors.textSecondary },
  saveBtn: {
    backgroundColor: Colors.purple,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.full,
    alignItems: 'center',
    shadowColor: Colors.purple,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginTop: Spacing.xl,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
