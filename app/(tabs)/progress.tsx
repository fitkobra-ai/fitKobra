import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRecentDailyStats, getRecentWorkouts, type DailyStats, type WorkoutRecord } from '../../services/firestore';
import { format } from 'date-fns';

const ALL_ACHIEVEMENTS: { id: string, title: string, desc: string, iconName: React.ComponentProps<typeof Feather>['name'] }[] = [
  { id: 'first_workout', title: 'First Steps', desc: 'Complete your first workout', iconName: 'target' },
  { id: 'streak_3', title: 'On Fire', desc: 'Hit your goals 3 days in a row', iconName: 'zap' },
  { id: 'streak_7', title: 'Unstoppable', desc: 'Hit your goals 7 days in a row', iconName: 'star' },
  { id: 'steps_10k', title: '10k Club', desc: 'Walk 10,000 steps in one day', iconName: 'activity' },
];

export default function ProgressScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { todayStats, goals, unlockedAchievements } = useApp();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{week: string, steps: number}[]>([]);
  const [prs, setPrs] = useState({
    longestRun: { val: '0 km', date: '-' },
    mostCalories: { val: '0 kcal', date: '-' },
    mostSteps: { val: '0', date: '-' },
    longestWorkout: { val: '0 min', date: '-' }
  });

  useEffect(() => {
    if (!user) return;
    async function loadStats() {
      try {
        const [dailyStats, recentWorkouts] = await Promise.all([
          getRecentDailyStats(user!.uid, 28), // Last 4 weeks
          getRecentWorkouts(user!.uid, 100)
        ]);

        // Calculate Weekly Breakdown
        const weeks = [
          { week: 'W1', steps: 0 },
          { week: 'W2', steps: 0 },
          { week: 'W3', steps: 0 },
          { week: 'W4', steps: 0 }
        ];
        const now = new Date();
        dailyStats.forEach(stat => {
          const statDate = new Date(stat.date);
          const diffDays = Math.floor((now.getTime() - statDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays < 7) weeks[3].steps += stat.steps;
          else if (diffDays < 14) weeks[2].steps += stat.steps;
          else if (diffDays < 21) weeks[1].steps += stat.steps;
          else if (diffDays < 28) weeks[0].steps += stat.steps;
        });
        setMonthlyData(weeks);

        // Calculate PRs
        let lRun = { val: 0, date: '-' };
        let mCals = { val: 0, date: '-' };
        let lWorkout = { val: 0, date: '-' };
        recentWorkouts.forEach(w => {
          if (w.type === 'run' && w.distanceKm && w.distanceKm > lRun.val) {
            lRun = { val: w.distanceKm, date: format(new Date(w.startedAt), 'MMM d') };
          }
          if (w.caloriesBurned > mCals.val) {
            mCals = { val: w.caloriesBurned, date: format(new Date(w.startedAt), 'MMM d') };
          }
          if (w.durationSeconds > lWorkout.val) {
            lWorkout = { val: w.durationSeconds, date: format(new Date(w.startedAt), 'MMM d') };
          }
        });

        let mSteps = { val: 0, date: '-' };
        dailyStats.forEach(s => {
          if (s.steps > mSteps.val) {
            mSteps = { val: s.steps, date: format(new Date(s.date), 'MMM d') };
          }
        });

        setPrs({
          longestRun: { val: `${lRun.val.toFixed(1)} km`, date: lRun.date },
          mostCalories: { val: `${Math.round(mCals.val)} kcal`, date: mCals.date },
          mostSteps: { val: mSteps.val.toLocaleString(), date: mSteps.date },
          longestWorkout: { val: `${Math.round(lWorkout.val / 60)} min`, date: lWorkout.date }
        });
      } catch (err) {
        console.error('Error loading progress stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user, todayStats.steps]); // re-run if steps change (i.e. today)

  const maxVal = Math.max(1, ...monthlyData.map((d) => d.steps));

  const stepsGoal = goals?.dailySteps || 10000;
  const calGoal = goals?.dailyCaloriesBurn || 500;
  const activeGoal = goals?.dailyActiveMinutes || 30;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Progress 📊</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.blue} style={{ marginTop: Spacing.xl }} />
        ) : (
          <>

        {/* Monthly Overview */}
        <View style={[styles.card, Shadow.card]}>
          <Text style={styles.sectionTitle}>Monthly Steps</Text>
          <View style={styles.monthlyChart}>
            {monthlyData.map((item, i) => (
              <View key={i} style={styles.monthBarGroup}>
                <Text style={styles.monthValue}>{(item.steps / 1000).toFixed(0)}k</Text>
                <View style={styles.monthBarTrack}>
                  <View
                    style={[
                      styles.monthBar,
                      {
                        height: `${(item.steps / maxVal) * 100}%`,
                        backgroundColor: i === monthlyData.length - 1 ? colors.purple : colors.blue,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.monthLabel}>{item.week}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Personal Records */}
        <View style={[styles.card, Shadow.card]}>
          <Text style={styles.sectionTitle}>Personal Records 🏆</Text>
          <View style={styles.prList}>
            <PRRow iconName="map" label="Longest Run" value={prs.longestRun.val} date={prs.longestRun.date} color={colors.green} />
            <PRRow iconName="zap" label="Most Calories" value={prs.mostCalories.val} date={prs.mostCalories.date} color={colors.orange} />
            <PRRow iconName="activity" label="Most Steps" value={prs.mostSteps.val} date={prs.mostSteps.date} color={colors.red} />
            <PRRow iconName="heart" label="Longest Workout" value={prs.longestWorkout.val} date={prs.longestWorkout.date} color={colors.blue} />
          </View>
        </View>

        {/* Goal Progress */}
        <View style={[styles.card, Shadow.card]}>
          <Text style={styles.sectionTitle}>Goal Progress</Text>
          <View style={styles.goalList}>
            <GoalRow
              label="Daily Steps"
              current={todayStats.steps}
              goal={stepsGoal}
              unit="steps"
              color={colors.red}
            />
            <GoalRow
              label="Calories Burned"
              current={todayStats.caloriesBurned}
              goal={calGoal}
              unit="kcal"
              color={colors.orange}
            />
            <GoalRow
              label="Active Minutes"
              current={todayStats.activeMinutes}
              goal={activeGoal}
              unit="min"
              color={colors.green}
            />
          </View>
        </View>

        {/* Achievements */}
        <View style={[styles.card, Shadow.card]}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementGrid}>
            {ALL_ACHIEVEMENTS.map((a) => {
              const unlocked = unlockedAchievements.includes(a.id);
              return (
                <View
                  key={a.id}
                  style={[
                    styles.badge,
                    !unlocked && styles.badgeLocked,
                  ]}
                >
                  <Feather 
                    name={a.iconName} 
                    size={28} 
                    color={unlocked ? colors.purple : colors.textMuted} 
                    style={{ opacity: unlocked ? 1 : 0.5 }}
                  />
                  <Text style={[styles.badgeTitle, !unlocked && styles.badgeTextLocked]}>
                    {a.title}
                  </Text>
                  <Text style={[styles.badgeDesc, !unlocked && styles.badgeTextLocked]}>
                    {a.desc}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PRRow({
  iconName, label, value, date, color,
}: { iconName: React.ComponentProps<typeof Feather>['name']; label: string; value: string; date: string; color: string }) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.prRow}>
      <Feather name={iconName} size={22} color={color} style={styles.prIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.prLabel}>{label}</Text>
        <Text style={styles.prDate}>{date}</Text>
      </View>
      <Text style={[styles.prValue, { color }]}>{value}</Text>
    </View>
  );
}

function GoalRow({
  label, current, goal, unit, color,
}: { label: string; current: number; goal: number; unit: string; color: string }) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const pct = Math.min(current / goal, 1);
  return (
    <View style={styles.goalRow}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalLabel}>{label}</Text>
        <Text style={styles.goalValue}>
          <Text style={{ color }}>{current.toLocaleString()}</Text>
          <Text style={{ color: colors.textSecondary }}> / {goal.toLocaleString()} {unit}</Text>
        </Text>
      </View>
      <View style={styles.goalTrack}>
        <View style={[styles.goalFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  card: {
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
  // Monthly chart
  monthlyChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    gap: Spacing.md,
  },
  monthBarGroup: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    gap: 6,
    justifyContent: 'flex-end',
  },
  monthValue: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  monthBarTrack: {
    flex: 1,
    width: '80%',
    justifyContent: 'flex-end',
  },
  monthBar: {
    width: '100%',
    borderRadius: 8,
    minHeight: 8,
  },
  monthLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  // PRs
  prList: { gap: Spacing.sm },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  prIcon: { width: 32, textAlign: 'center' },
  prLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  prDate: { fontSize: 12, color: colors.textSecondary },
  prValue: { fontSize: 16, fontWeight: '700' },
  // Goals
  goalList: { gap: Spacing.md },
  goalRow: { gap: 8 },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  goalValue: { fontSize: 13 },
  goalTrack: {
    height: 6,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  // Achievements
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    width: '47%',
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    alignItems: 'center',
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  badgeTextLocked: { color: colors.textMuted },
});
