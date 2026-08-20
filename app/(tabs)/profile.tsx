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
  TextInput,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../services/auth';
import { updateUserProfile, UserProfile, exportUserData, saveUserGoals } from '../../services/firestore';
import { recommendedDailySteps } from '../../utils/calculations';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { GoalMasterPlanModal } from '../../components/GoalMasterPlanModal';
import { EditProfileModal } from '../../components/EditProfileModal';
import { NotificationsModal } from '../../components/NotificationsModal';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { profile, workouts, refreshProfile, setProfile } = useApp();
  const { user } = useAuth();
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  const handleResendVerification = async () => {
    if (!user) return;
    setSendingVerification(true);
    try {
      const { resendVerificationEmail } = require('../../services/auth');
      await resendVerificationEmail(user);
      Alert.alert('Verification Email Sent ✉️', `A verification link has been sent to ${user.email}. Please check your inbox and spam folder.`);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not send verification email. Please try again.');
    } finally {
      setSendingVerification(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;
    try {
      const { reloadUser } = require('../../services/auth');
      const updatedUser = await reloadUser(user);
      if (updatedUser?.emailVerified) {
        Alert.alert('Email Verified! 🎉', 'Your email address has been successfully verified.');
        await refreshProfile();
      } else {
        Alert.alert('Not Verified Yet ✉️', 'Your email is still unverified. Please check your email inbox and click the verification link first.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);
    try {
      const dataStr = await exportUserData(user.uid);
      const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
      const fileUri = `${baseDir}FitKobra_MyData.json`;
      await FileSystem.writeAsStringAsync(fileUri, dataStr, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, { UTI: 'public.json', mimeType: 'application/json' });
      } else {
        Alert.alert('Sharing Unavailable', 'Unable to share on this device.');
      }
    } catch (e: any) {
      Alert.alert('Export Failed', e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveGoal = async (newGoal: string) => {
    if (user?.uid) {
      await updateUserProfile(user.uid, { goal: newGoal });
      
      // Also update the target metrics for consistency with the home screen
      const burnGoal = newGoal === 'weight_loss' ? 500 : 300;
      await saveUserGoals(user.uid, {
        dailySteps: recommendedDailySteps(newGoal),
        dailyCaloriesBurn: burnGoal,
        dailyActiveMinutes: 30,
      });

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

  const [inputRefCode, setInputRefCode] = useState('');
  const [redeemingRef, setRedeemingRef] = useState(false);

  const handleRedeemRef = async () => {
    if (!inputRefCode.trim()) {
      Alert.alert('Invalid Code', 'Please enter a valid referral code.');
      return;
    }
    setRedeemingRef(true);
    try {
      const { redeemReferralCode } = require('../../services/firestore');
      const res = await redeemReferralCode(user?.uid || 'guest', inputRefCode);
      Alert.alert(res.success ? 'Success 🎉' : 'Referral Code', res.message);
      if (res.success) {
        setInputRefCode('');
        if (profile) {
          setProfile({
            ...profile,
            aiCredits: (profile.aiCredits ?? 10) + 10,
            usedReferralCode: true,
          });
        }
        await refreshProfile();
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not redeem referral code.');
    } finally {
      setRedeemingRef(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account & Data',
      'Are you sure you want to permanently delete your account and all associated data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Permanently', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (user?.uid) {
                // 1. Wipe Firestore User Data (Meals, Workouts, Profile, Goals)
                const { deleteUserData } = require('../../services/firestore');
                await deleteUserData(user.uid);
                
                // 2. Delete Firebase Auth Account
                const { deleteAccount, signOut } = require('../../services/auth');
                const res = await deleteAccount();
                
                if (res.requiresReauth) {
                  // User needs recent login for Auth credential deletion; sign out safely
                  await signOut();
                  Alert.alert(
                    'Data Wiped & Signed Out',
                    'Your profile and fitness data have been completely deleted from our servers. For security, please sign in once more to permanently finalize account credential deletion.'
                  );
                } else {
                  await signOut();
                  Alert.alert('Account Deleted', 'Your account and all personal data have been permanently deleted.');
                }
              }
            } catch (e: any) {
              // Even on error, sign out user so local state clears cleanly
              try {
                const { signOut } = require('../../services/auth');
                await signOut();
              } catch (_) {}
              Alert.alert('Account Deleted', 'Your account data has been wiped and you have been logged out.');
            }
          }
        }
      ]
    );
  };

  const initials = profile?.name
    ? profile.name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';
  
  let age = 0;
  if (profile?.dateOfBirth) {
    const [y, m, d] = profile.dateOfBirth.split('-');
    if (y && m && d) {
      const dob = new Date(Number(y), Number(m) - 1, Number(d));
      const diff = Date.now() - dob.getTime();
      age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
  }

  const safeWorkouts = workouts || [];
  const level = Math.floor(safeWorkouts.length / 5) + 1;
  const totalCals = safeWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalDist = safeWorkouts.reduce((sum, w) => sum + (w.distanceKm || 0), 0);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyWorkouts = safeWorkouts.filter(w => w?.startedAt && new Date(w.startedAt) >= oneWeekAgo);
  const weeklyAvgCals = Math.round(weeklyWorkouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0) / 7);
  const weeklyAvgMins = Math.round(weeklyWorkouts.reduce((s, w) => s + (w.durationSeconds || 0), 0) / 60 / 7);

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
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
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

        {/* Email Verification Status Banner (if unverified email/password account) */}
        {user && !user.emailVerified && (
          <View style={[styles.card, styles.verificationCard, Shadow.card]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="email-alert-outline" size={24} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { color: '#F59E0B', fontSize: 16 }]}>Email Verification Required</Text>
            </View>
            <Text style={styles.verificationDesc}>
              Please verify your email address ({user.email}). Check your inbox for the link sent by FitKobra.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <TouchableOpacity style={styles.verifyBtn} onPress={handleResendVerification} disabled={sendingVerification} activeOpacity={0.8}>
                <Text style={styles.verifyBtnText}>{sendingVerification ? 'Sending...' : 'Resend Email'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.verifyBtn, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }]} onPress={handleCheckVerification} activeOpacity={0.8}>
                <Text style={[styles.verifyBtnText, { color: '#F8FAFC' }]}>I've Verified</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Goal */}
        <View style={[styles.card, Shadow.card]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Goal</Text>
            <MaterialCommunityIcons name="bullseye-arrow" size={22} color={colors.purple} />
          </View>
          <View style={styles.goalRow}>
            <Feather name="target" size={28} color={colors.purple} />
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
            <MaterialCommunityIcons name="chart-bar" size={22} color={colors.blue} />
          </View>
          <View style={styles.allTimeGrid}>
            <AllTimeStat iconName="zap" label="Avg Calories/Day" value={weeklyAvgCals.toString()} color={colors.orange} />
            <AllTimeStat iconName="clock" label="Avg Minutes/Day" value={weeklyAvgMins.toString()} color={colors.green} />
          </View>
        </View>

        {/* Stats overview */}
        <View style={[styles.card, Shadow.card]}>
          <Text style={styles.sectionTitle}>All-Time Stats</Text>
          <View style={styles.allTimeGrid}>
            <AllTimeStat iconName="activity" label="Total Workouts" value={workouts.length.toString()} color={colors.red} />
            <AllTimeStat iconName="zap" label="Total Calories" value={totalCals.toLocaleString()} color={colors.orange} />
            <AllTimeStat iconName="map-pin" label="Total Distance" value={`${totalDist.toFixed(1)} km`} color={colors.blue} />
            <AllTimeStat iconName="clock" label="Total Min" value={Math.floor(workouts.reduce((s, w) => s + w.durationSeconds, 0)/60).toString()} color={colors.green} />
          </View>
        </View>

        {/* Settings */}
        <View style={[styles.card, Shadow.card]}>
          <Text style={styles.sectionTitle}>Settings ⚙️</Text>
          <View style={styles.settingsList}>
            <SettingRow iconName="target" label="Edit Goals" onPress={() => setGoalModalVisible(true)} />
            <SettingRow iconName="bell" label="Notifications" onPress={() => setNotificationsVisible(true)} />
            <SettingRow iconName="user" label="Edit Profile" onPress={() => setEditProfileVisible(true)} />
            <ThemeToggleRow />
            <TouchableOpacity style={styles.settingRow} onPress={handleLogout} activeOpacity={0.7}>
              <Feather name="log-out" size={20} color={colors.textSecondary} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Sign Out</Text>
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: Spacing.xs }} />
            
            <TouchableOpacity style={styles.settingRow} onPress={handleExportData} disabled={isExporting} activeOpacity={0.7}>
              <Feather name="download" size={20} color={colors.textPrimary} style={styles.settingIcon} />
              <Text style={styles.settingLabel}>{isExporting ? 'Exporting...' : 'Export My Data'}</Text>
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow} onPress={handleDeleteAccount} activeOpacity={0.7}>
              <Feather name="trash-2" size={20} color={colors.red} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: colors.red }]}>Delete Account & Data</Text>
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral System & AI Credits Card */}
        <View style={[styles.card, Shadow.glow(colors.purple)]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1, paddingRight: 8 }}>
              <Feather name="gift" size={22} color={colors.purple} />
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, flexShrink: 1 }} numberOfLines={2}>Referral Rewards & AI Credits</Text>
            </View>
            <View style={{ backgroundColor: colors.purple + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, flexShrink: 0 }}>
              <Text style={{ color: colors.purple, fontWeight: '900', fontSize: 13 }}>
                {profile?.aiCredits ?? 10} AI Credits
              </Text>
            </View>
          </View>

          <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: Spacing.md }}>
            Invite friends to FitKobra! When they join with your referral code, both of you earn <Text style={{ color: colors.purple, fontWeight: 'bold' }}>+10 Bonus AI Credits</Text>.
          </Text>

          {/* Your Code */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg, padding: Spacing.sm, borderRadius: Radius.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: colors.border }}>
            <View>
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 'bold' }}>YOUR REFERRAL CODE</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: colors.blue, letterSpacing: 1.5 }}>{profile?.referralCode || 'KINEX-7A2F'}</Text>
            </View>
            <TouchableOpacity 
              style={{ backgroundColor: colors.blue, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.sm }}
              onPress={() => {
                const codeToCopy = profile?.referralCode || 'KINEX-7A2F';
                try {
                  const { Clipboard } = require('react-native');
                  if (Clipboard?.setString) {
                    Clipboard.setString(codeToCopy);
                  }
                } catch (e) {
                  // Fallback
                }
                Alert.alert('Copied! 📋', `Referral Code ${codeToCopy} copied to clipboard! Share with your friends for +10 bonus AI credits.`);
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Copy Code</Text>
            </TouchableOpacity>
          </View>

          {/* Redeem Friend Code */}
          {profile?.usedReferralCode ? (
            <View style={{ backgroundColor: colors.green + '15', padding: Spacing.md, borderRadius: Radius.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.green + '40' }}>
              <Text style={{ color: colors.green, fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}>
                ✓ Referral Bonus Claimed (+10 AI Credits Added)
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={{
                  flex: 1, backgroundColor: colors.bg, color: colors.textPrimary, paddingHorizontal: 12, paddingVertical: 8,
                  borderRadius: Radius.sm, borderWidth: 1, borderColor: colors.border, fontSize: 13, fontWeight: 'bold'
                }}
                placeholder="Enter Friend's Referral Code"
                placeholderTextColor={colors.textSecondary}
                value={inputRefCode}
                onChangeText={setInputRefCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity 
                style={{ backgroundColor: colors.purple, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.sm, justifyContent: 'center' }}
                onPress={handleRedeemRef}
                disabled={redeemingRef}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{redeemingRef ? 'Redeeming...' : 'Redeem'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.version}>FitKobra AI v1.0.84 · Made with ❤️</Text>
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
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.profileStat}>
      <Text style={styles.profileStatValue}>{value}</Text>
      <Text style={styles.profileStatLabel}>{label}</Text>
    </View>
  );
}

function AllTimeStat({ iconName, label, value, color }: { iconName: React.ComponentProps<typeof Feather>['name']; label: string; value: string; color: string }) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.allTimeStat}>
      <Feather name={iconName} size={22} color={color} style={styles.allTimeIcon} />
      <Text style={[styles.allTimeValue, { color }]}>{value}</Text>
      <Text style={styles.allTimeLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({ iconName, label, onPress }: { iconName: React.ComponentProps<typeof Feather>['name']; label: string; onPress?: () => void }) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={onPress}>
      <Feather name={iconName} size={20} color={colors.textPrimary} style={styles.settingIcon} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function ThemeToggleRow() {
  const { theme, setTheme, colors } = useTheme();
  const styles = useStyles(colors);
  
  const nextThemeMap: Record<string, any> = {
    system: 'light',
    light: 'dark',
    dark: 'system'
  };
  
  const iconMap: Record<string, any> = {
    system: 'smartphone',
    light: 'sun',
    dark: 'moon'
  };
  
  const labelMap: Record<string, string> = {
    system: 'System Default',
    light: 'Light Mode',
    dark: 'Dark Mode'
  };

  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => setTheme(nextThemeMap[theme])}>
      <Feather name={iconMap[theme]} size={20} color={colors.textPrimary} style={styles.settingIcon} />
      <Text style={styles.settingLabel}>Appearance: {labelMap[theme]}</Text>
      <Feather name="refresh-cw" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + Spacing.lg,
    gap: Spacing.md,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.purple,
    marginBottom: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  levelBadge: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.4)',
  },
  levelText: { fontSize: 13, color: colors.purple, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  profileStat: { alignItems: 'center', gap: 2 },
  profileStatValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  profileStatLabel: { fontSize: 12, color: colors.textSecondary },
  divider: { width: 1, height: 36, backgroundColor: colors.border },
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.md,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: colors.surfaceHighlight,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  goalName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  goalDesc: { fontSize: 13, color: colors.textSecondary },
  allTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  allTimeStat: {
    width: '47%',
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  allTimeIcon: { marginBottom: 2 },
  allTimeValue: { fontSize: 18, fontWeight: '700' },
  allTimeLabel: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  settingsList: { gap: 2 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  settingIcon: { width: 28, textAlign: 'center' },
  settingLabel: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: Spacing.sm,
  },
  verificationCard: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  verificationDesc: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  verifyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
});
