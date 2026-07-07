import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadow } from '../../constants/Theme';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../services/auth';
import { updateUserProfile, UserProfile } from '../../services/firestore';
import { GoalMasterPlanModal } from '../../components/GoalMasterPlanModal';
import { EditProfileModal } from '../../components/EditProfileModal';
import { NotificationsModal } from '../../components/NotificationsModal';

export default function ProfileScreen() {
  const { profile, workouts, refreshProfile } = useApp();
  const { user } = useAuth();
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);

  const handleSaveGoal = async (newGoal: string) => {
    if (user?.uid) {
      await updateUserProfile(user.uid, { goal: newGoal });
      await refreshProfile();
    }
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    if (user?.uid) {
      await updateUserProfile(user.uid, updates);
      await refreshProfile();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const initials = profile?.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  
  let age = 0;
  if (profile?.dateOfBirth) {
    const [y, m, d] = profile.dateOfBirth.split('-');
    if (y && m && d) {
      const dob = new Date(Number(y), Number(m) - 1, Number(d));
      const diff = Date.now() - dob.getTime();
      age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
  }

  const level = Math.floor(workouts.length / 5) + 1;
  const totalCals = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalDist = workouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyWorkouts = workouts.filter(w => new Date(w.startedAt) >= oneWeekAgo);
  const weeklyAvgCals = Math.round(weeklyWorkouts.reduce((s, w) => s + w.caloriesBurned, 0) / 7);
  const weeklyAvgMins = Math.round(weeklyWorkouts.reduce((s, w) => s + w.durationSeconds, 0) / 60 / 7);

  const goalDescriptions: Record<string, string> = {
    weight_loss: 'Burn fat and get leaner',
    build_muscle: 'Gain strength and size',
    improve_endurance: 'Run further, train harder',
    general_health: 'Stay active and healthy',
  };

  const goalDesc = profile?.goal ? goalDescriptions[profile.goal] : 'Stay active';
  const goalLabel = profile?.goal ? profile.goal.replace('_', ' ').toUpperCase() : 'GENERAL HEALTH';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero */}
        <View style={[styles.heroCard, Shadow.card]}>
          <View style={styles.avatarRing}>
            {profile?.photoURL ? (
              <Image source={{ uri: profile.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>{profile?.name || 'User'}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>⭐ Level {level}</Text>
          </View>
          <View style={styles.statsRow}>
            <ProfileStat label="Age" value={`${age}y`} />
            <View style={styles.divider} />
            <ProfileStat label="Weight" value={`${Number(profile?.weightKg || 75)} kg`} />
            <View style={styles.divider} />
            <ProfileStat label="Height" value={`${Number(profile?.heightCm || 175)} cm`} />
          </View>
        </View>

        {/* Goal */}
        <View style={[styles.card, Shadow.card]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Goal</Text>
            <MaterialCommunityIcons name="bullseye-arrow" size={22} color={Colors.purple} />
          </View>
          <View style={styles.goalRow}>
            <Feather name="target" size={28} color={Colors.purple} />
            <View>
              <Text style={styles.goalName}>{goalLabel}</Text>
              <Text style={styles.goalDesc}>{goalDesc}</Text>
            </View>
          </View>
        </View>

        {/* Weekly Averages */}
        <View style={[styles.card, Shadow.card]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Averages</Text>
            <MaterialCommunityIcons name="chart-bar" size={22} color={Colors.blue} />
          </View>
          <View style={styles.allTimeGrid}>
            <AllTimeStat iconName="zap" label="Avg Calories/Day" value={weeklyAvgCals.toString()} color={Colors.orange} />
            <AllTimeStat iconName="clock" label="Avg Minutes/Day" value={weeklyAvgMins.toString()} color={Colors.green} />
          </View>
        </View>

        {/* Stats overview */}
        <View style={[styles.card, Shadow.card]}>
          <Text style={styles.sectionTitle}>All-Time Stats</Text>
          <View style={styles.allTimeGrid}>
            <AllTimeStat iconName="activity" label="Total Workouts" value={workouts.length.toString()} color={Colors.red} />
            <AllTimeStat iconName="zap" label="Total Calories" value={totalCals.toLocaleString()} color={Colors.orange} />
            <AllTimeStat iconName="map-pin" label="Total Distance" value={`${totalDist.toFixed(1)} km`} color={Colors.blue} />
            <AllTimeStat iconName="clock" label="Total Min" value={Math.floor(workouts.reduce((s, w) => s + w.durationSeconds, 0)/60).toString()} color={Colors.green} />
          </View>
        </View>

        {/* Settings */}
        <View style={[styles.card, Shadow.card]}>
          <Text style={styles.sectionTitle}>Settings ⚙️</Text>
          <View style={styles.settingsList}>
            <SettingRow iconName="target" label="Edit Goals" onPress={() => setGoalModalVisible(true)} />
            <SettingRow iconName="bell" label="Notifications" onPress={() => setNotificationsVisible(true)} />
            <SettingRow iconName="user" label="Edit Profile" onPress={() => setEditProfileVisible(true)} />
            <TouchableOpacity style={styles.settingRow} onPress={handleLogout} activeOpacity={0.7}>
              <Feather name="log-out" size={20} color={Colors.red} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: Colors.red }]}>Sign Out</Text>
              <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Version */}
        <Text style={styles.version}>TrueFit v1.0.0 · Made with ❤️</Text>
      </ScrollView>

      <GoalMasterPlanModal
        visible={isGoalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        profile={profile}
        onSaveGoal={handleSaveGoal}
      />

      <EditProfileModal
        visible={isEditProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <NotificationsModal
        visible={isNotificationsVisible}
        onClose={() => setNotificationsVisible(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </SafeAreaView>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileStat}>
      <Text style={styles.profileStatValue}>{value}</Text>
      <Text style={styles.profileStatLabel}>{label}</Text>
    </View>
  );
}

function AllTimeStat({ iconName, label, value, color }: { iconName: React.ComponentProps<typeof Feather>['name']; label: string; value: string; color: string }) {
  return (
    <View style={styles.allTimeStat}>
      <Feather name={iconName} size={22} color={color} style={styles.allTimeIcon} />
      <Text style={[styles.allTimeValue, { color }]}>{value}</Text>
      <Text style={styles.allTimeLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({ iconName, label, onPress }: { iconName: React.ComponentProps<typeof Feather>['name']; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={onPress}>
      <Feather name={iconName} size={20} color={Colors.textPrimary} style={styles.settingIcon} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Feather name="chevron-right" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + Spacing.lg,
    gap: Spacing.md,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.purple,
    marginBottom: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  levelBadge: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.4)',
  },
  levelText: { fontSize: 13, color: Colors.purple, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  profileStat: { alignItems: 'center', gap: 2 },
  profileStatValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  profileStatLabel: { fontSize: 12, color: Colors.textSecondary },
  divider: { width: 1, height: 36, backgroundColor: Colors.border },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceHighlight,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  goalName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  goalDesc: { fontSize: 13, color: Colors.textSecondary },
  allTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  allTimeStat: {
    width: '47%',
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allTimeIcon: { marginBottom: 2 },
  allTimeValue: { fontSize: 18, fontWeight: '700' },
  allTimeLabel: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  settingsList: { gap: 2 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  settingIcon: { width: 28, textAlign: 'center' },
  settingLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
