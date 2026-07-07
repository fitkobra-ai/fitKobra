import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadow } from '../../constants/Theme';
import { useApp } from '../../contexts/AppContext';

// Mocked monthly data for visual presentation
const monthlyData = [
  { week: 'W1', steps: 42000 },
  { week: 'W2', steps: 51000 },
  { week: 'W3', steps: 48500 },
  { week: 'W4', steps: 62000 },
];

const ALL_ACHIEVEMENTS: { id: string, title: string, desc: string, iconName: React.ComponentProps<typeof Feather>['name'] }[] = [
  { id: 'first_workout', title: 'First Steps', desc: 'Complete your first workout', iconName: 'target' },
  { id: 'streak_3', title: 'On Fire', desc: 'Hit your goals 3 days in a row', iconName: 'zap' },
  { id: 'streak_7', title: 'Unstoppable', desc: 'Hit your goals 7 days in a row', iconName: 'star' },
  { id: 'steps_10k', title: '10k Club', desc: 'Walk 10,000 steps in one day', iconName: 'activity' },
];

export default function ProgressScreen() {
  const { todayStats, goals, unlockedAchievements } = useApp();
  const maxVal = Math.max(...monthlyData.map((d) => d.steps));

  const stepsGoal = goals?.dailySteps || 10000;
  const calGoal = goals?.dailyCaloriesBurn || 500;
  const activeGoal = goals?.dailyActiveMinutes || 30;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Progress 📊</Text>

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
                        backgroundColor: i === monthlyData.length - 1 ? Colors.purple : Colors.blue,
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
            <PRRow iconName="map" label="Longest Run" value="21.1 km" date="Jun 15" color={Colors.green} />
            <PRRow iconName="zap" label="Most Calories" value="892 kcal" date="Jun 22" color={Colors.orange} />
            <PRRow iconName="activity" label="Most Steps" value="18,420" date="May 30" color={Colors.red} />
            <PRRow iconName="heart" label="Longest Workout" value="95 min" date="Jul 1" color={Colors.blue} />
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
              color={Colors.red}
            />
            <GoalRow
              label="Calories Burned"
              current={todayStats.caloriesBurned}
              goal={calGoal}
              unit="kcal"
              color={Colors.orange}
            />
            <GoalRow
              label="Active Minutes"
              current={todayStats.activeMinutes}
              goal={activeGoal}
              unit="min"
              color={Colors.green}
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
                    color={unlocked ? Colors.purple : Colors.textMuted} 
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
      </ScrollView>
    </SafeAreaView>
  );
}

function PRRow({
  iconName, label, value, date, color,
}: { iconName: React.ComponentProps<typeof Feather>['name']; label: string; value: string; date: string; color: string }) {
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
  const pct = Math.min(current / goal, 1);
  return (
    <View style={styles.goalRow}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalLabel}>{label}</Text>
        <Text style={styles.goalValue}>
          <Text style={{ color }}>{current.toLocaleString()}</Text>
          <Text style={{ color: Colors.textSecondary }}> / {goal.toLocaleString()} {unit}</Text>
        </Text>
      </View>
      <View style={styles.goalTrack}>
        <View style={[styles.goalFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
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
    color: Colors.textMuted,
    fontWeight: '500',
  },
  // PRs
  prList: { gap: Spacing.sm },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  prIcon: { width: 32, textAlign: 'center' },
  prLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  prDate: { fontSize: 12, color: Colors.textSecondary },
  prValue: { fontSize: 16, fontWeight: '700' },
  // Goals
  goalList: { gap: Spacing.md },
  goalRow: { gap: 8 },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  goalValue: { fontSize: 13 },
  goalTrack: {
    height: 6,
    backgroundColor: Colors.surfaceHighlight,
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
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    alignItems: 'center',
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  badgeTextLocked: { color: Colors.textMuted },
});
