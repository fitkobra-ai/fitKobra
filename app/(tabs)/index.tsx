import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import ActivityRing from '../../components/ActivityRing';
import StatCard from '../../components/StatCard';
import WeeklyBarChart from '../../components/WeeklyBarChart';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { getRecentDailyStats, updateUserProfile, saveUserGoals } from '../../services/firestore';
import { lastSevenDayKeys, dayLabel } from '../../utils/dates';
import { recommendedDailySteps } from '../../utils/calculations';
import { RegisterStreakModal } from '../../components/RegisterStreakModal';
import { GoalMasterPlanModal } from '../../components/GoalMasterPlanModal';
import { scheduleStreakReminder, registerForPushNotificationsAsync } from '../../services/notifications';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { profile, todayStats, goals, unlockedAchievements, refreshProfile } = useApp();
  const { user } = useAuth();
  const router = useRouter();
  
  const [weeklyData, setWeeklyData] = useState<{ day: string; steps: number; calories: number }[]>([]);
  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);

  const handleSaveGoal = async (newGoal: string) => {
    if (user) {
      await updateUserProfile(user.uid, { goal: newGoal });
      const burnGoal = newGoal === 'weight_loss' ? 500 : 300;
      await saveUserGoals(user.uid, {
        dailySteps: recommendedDailySteps(newGoal),
        dailyCaloriesBurn: burnGoal,
        dailyActiveMinutes: 30,
      });
      // Refresh the context so UI updates immediately
      if (refreshProfile) {
        await refreshProfile();
      }
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((granted) => {
      if (granted) scheduleStreakReminder();
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      getRecentDailyStats(user.uid, 7).then(stats => {
        const keys = lastSevenDayKeys();
        const mapped = keys.map(k => {
          const found = stats.find(s => s.date === k);
          return {
            day: dayLabel(k),
            steps: found ? found.steps : (k === todayStats.date ? todayStats.steps : 0),
            calories: found ? found.caloriesBurned : (k === todayStats.date ? todayStats.caloriesBurned : 0),
          };
        });
        setWeeklyData(mapped);
      }).catch(err => {
        console.warn('[DashboardScreen] getRecentDailyStats error:', err);
      });
    }
  }, [user, todayStats.steps]);

  // Fallbacks if goals aren't loaded
  const stepsGoal = goals?.dailySteps || 10000;
  const calGoal = goals?.dailyCaloriesBurn || 500;
  const activeGoal = goals?.dailyActiveMinutes || 30;

  const stepsProgress = Math.min(todayStats.steps / stepsGoal, 1);
  const calProgress = Math.min(todayStats.caloriesBurned / calGoal, 1);
  const activeProgress = Math.min(todayStats.activeMinutes / activeGoal, 1);

  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  
  const initials = profile?.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  const hasStreak = unlockedAchievements.includes('streak_7');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.dateText}>
              {dayOfWeek}, {dateStr}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* Premium Leaderboard Banner */}
        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={() => router.push('/(modals)/leaderboard')}
          style={[Shadow.glow(colors.blue), { borderRadius: Radius.xl, overflow: 'hidden' }]}
        >
          <LinearGradient
            colors={[colors.blue, colors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}
          >
            <View style={{
              width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)'
            }}>
              <Feather name="award" size={26} color="#FFD700" />
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>Global Leaderboard</Text>
                <View style={{ backgroundColor: 'rgba(255,215,0,0.25)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full }}>
                  <Text style={{ color: '#FFD700', fontSize: 10, fontWeight: '900' }}>VIEW RANK</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
                Compete with athletes worldwide & earn streak points! 🏆
              </Text>
            </View>

            <Feather name="arrow-right" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Embedded Master Plan Configurator Card */}
        <View style={[Shadow.card, {
          backgroundColor: colors.surface, borderRadius: Radius.xl, padding: Spacing.lg,
          borderWidth: 1, borderColor: colors.blue + '50', overflow: 'hidden'
        }]}>
          <LinearGradient
            colors={[colors.blue + '15', colors.purple + '10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill as any}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Feather name="sliders" size={20} color={colors.blue} />
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary }}>Master Plan Targets</Text>
            </View>
            <TouchableOpacity 
              style={{ backgroundColor: colors.blue + '20', paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full }}
              onPress={() => setGoalModalVisible(true)}
            >
              <Text style={{ color: colors.blue, fontWeight: '800', fontSize: 12 }}>Edit Goals</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: Spacing.md }}>
            Tailored AI daily targets based on your <Text style={{ color: colors.blue, fontWeight: 'bold' }}>{profile?.goal?.replace('_', ' ').toUpperCase() || 'GENERAL HEALTH'}</Text> profile:
          </Text>

          {/* Metric Pill Grid */}
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <View style={{ flex: 1, backgroundColor: colors.bg, padding: Spacing.sm, borderRadius: Radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: colors.red }}>{stepsGoal.toLocaleString()}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '600', marginTop: 2 }}>🦶 Steps</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.bg, padding: Spacing.sm, borderRadius: Radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: colors.orange }}>{calGoal}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '600', marginTop: 2 }}>🔥 kcal</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.bg, padding: Spacing.sm, borderRadius: Radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: colors.green }}>{activeGoal}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '600', marginTop: 2 }}>⏱️ min</Text>
            </View>
          </View>
        </View>

        {/* Streak Banner */}
        {hasStreak && (
          <View style={[styles.streakBanner, Shadow.glow(colors.orange)]}>
            <Feather name="zap" size={24} color={colors.orange} />
            <Text style={styles.streakText}>You're on a {profile?.currentStreak || 7}-day streak!</Text>
            <Text style={styles.streakSub}>Keep it up!</Text>
          </View>
        )}

        {/* Daily Quote */}
        <View style={[styles.quoteCard, Shadow.card]}>
          <Feather name="message-square" size={18} color={colors.blue} style={{ marginBottom: 4 }} />
          <Text style={styles.quoteText}>"The only bad workout is the one that didn't happen."</Text>
        </View>

        {/* Activity Rings Section */}
        <View style={[styles.ringsCard, Shadow.card]}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          <View style={styles.ringsRow}>
            <TouchableOpacity 
              style={styles.ringItem} 
              activeOpacity={0.7} 
              onPress={() => setIsStreakModalVisible(true)}
            >
              <ActivityRing
                radius={52}
                strokeWidth={13}
                progress={stepsProgress * 100}
                color={colors.red}
              />
              <Text style={[styles.ringLabel, { color: colors.red }]}>Steps (Tap!)</Text>
            </TouchableOpacity>
            <View style={styles.ringItem}>
              <ActivityRing
                radius={52}
                strokeWidth={13}
                progress={activeProgress * 100}
                color={colors.green}
              />
              <Text style={[styles.ringLabel, { color: colors.green }]}>Exercise</Text>
            </View>
            <View style={styles.ringItem}>
              <ActivityRing
                radius={52}
                strokeWidth={13}
                progress={calProgress * 100}
                color={colors.blue}
              />
              <Text style={[styles.ringLabel, { color: colors.blue }]}>Calories</Text>
            </View>
          </View>
          <View style={styles.ringLegend}>
            <LegendItem color={colors.red} label={`${todayStats.steps.toLocaleString()} / ${stepsGoal.toLocaleString()} steps`} />
            <LegendItem color={colors.green} label={`${todayStats.activeMinutes} / ${activeGoal} min active`} />
            <LegendItem color={colors.blue} label={`${todayStats.caloriesBurned} / ${calGoal} kcal burned`} />
          </View>
        </View>

        {/* Metric Cards Grid */}
        <View style={styles.cardsGrid}>
          <TouchableOpacity style={styles.cardHalf} activeOpacity={0.7} onPress={() => setIsStreakModalVisible(true)}>
            <StatCard
              label="Steps"
              value={todayStats.steps.toLocaleString()}
              iconName="activity"
              color={colors.red}
              progress={stepsProgress}
            />
          </TouchableOpacity>
          <View style={styles.cardHalf}>
            <StatCard
              label="Calories"
              value={todayStats.caloriesBurned}
              unit="kcal"
              iconName="zap"
              color={colors.orange}
              progress={calProgress}
            />
          </View>
          <View style={styles.cardHalf}>
            <StatCard
              label="Distance"
              value={todayStats.distanceKm}
              unit="km"
              iconName="map-pin"
              color={colors.blue}
            />
          </View>
          <View style={styles.cardHalf}>
            <StatCard
              label="Active Min"
              value={todayStats.activeMinutes}
              unit="min"
              iconName="clock"
              color={colors.green}
            />
          </View>
        </View>

        {/* Weekly Overview */}
        <View style={[styles.weeklyCard, Shadow.card]}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.sectionTitle}>Weekly Steps</Text>
            <Text style={styles.weeklyTotal}>
              {weeklyData.reduce((s, d) => s + d.steps, 0).toLocaleString()} total
            </Text>
          </View>
          {weeklyData.length > 0 && <WeeklyBarChart data={weeklyData} highlightIndex={6} />}
        </View>
      </ScrollView>
      
      <RegisterStreakModal 
        visible={isStreakModalVisible} 
        onClose={() => setIsStreakModalVisible(false)} 
        steps={todayStats.steps} 
      />
      
      <GoalMasterPlanModal
        visible={isGoalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        onSaveGoal={handleSaveGoal}
        profile={profile}
      />
    </SafeAreaView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.purpleGlow,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  leaderboardBanner: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.blue + '60',
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  leaderboardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  leaderboardSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  streakBanner: {
    backgroundColor: 'rgba(249,115,22,0.15)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.3)',
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.orange,
    flex: 1,
  },
  streakSub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  quoteCard: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '500',
    color: colors.textPrimary,
  },
  ringsCard: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ringItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ringLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  ringLegend: {
    gap: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  cardHalf: {
    flex: 1,
    minWidth: '45%',
  },
  weeklyCard: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  weeklyTotal: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
