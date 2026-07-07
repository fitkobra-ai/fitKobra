import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ActivityRing from '../../components/ActivityRing';
import StatCard from '../../components/StatCard';
import WeeklyBarChart from '../../components/WeeklyBarChart';
import { Colors, Radius, Spacing, Shadow } from '../../constants/Theme';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRecentDailyStats } from '../../services/firestore';
import { lastSevenDayKeys, dayLabel } from '../../utils/dates';

export default function DashboardScreen() {
  const { profile, todayStats, goals, unlockedAchievements } = useApp();
  const { user } = useAuth();
  
  const [weeklyData, setWeeklyData] = useState<{ day: string; steps: number }[]>([]);

  useEffect(() => {
    if (user) {
      getRecentDailyStats(user.uid, 7).then(stats => {
        const keys = lastSevenDayKeys();
        const mapped = keys.map(k => {
          const found = stats.find(s => s.date === k);
          return {
            day: dayLabel(k),
            steps: found ? found.steps : (k === todayStats.date ? todayStats.steps : 0),
          };
        });
        setWeeklyData(mapped);
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
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
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
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* Streak Banner */}
        {hasStreak && (
          <View style={[styles.streakBanner, Shadow.glow(Colors.orange)]}>
            <Feather name="zap" size={24} color={Colors.orange} />
            <Text style={styles.streakText}>You're on a streak!</Text>
            <Text style={styles.streakSub}>Keep it up!</Text>
          </View>
        )}

        {/* Daily Quote */}
        <View style={[styles.quoteCard, Shadow.card]}>
          <Feather name="message-square" size={18} color={Colors.blue} style={{ marginBottom: 4 }} />
          <Text style={styles.quoteText}>"The only bad workout is the one that didn't happen."</Text>
        </View>

        {/* Activity Rings Section */}
        <View style={[styles.ringsCard, Shadow.card]}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          <View style={styles.ringsRow}>
            <View style={styles.ringItem}>
              <ActivityRing
                radius={52}
                strokeWidth={13}
                progress={stepsProgress * 100}
                color={Colors.red}
              />
              <Text style={[styles.ringLabel, { color: Colors.red }]}>Steps</Text>
            </View>
            <View style={styles.ringItem}>
              <ActivityRing
                radius={52}
                strokeWidth={13}
                progress={activeProgress * 100}
                color={Colors.green}
              />
              <Text style={[styles.ringLabel, { color: Colors.green }]}>Exercise</Text>
            </View>
            <View style={styles.ringItem}>
              <ActivityRing
                radius={52}
                strokeWidth={13}
                progress={calProgress * 100}
                color={Colors.blue}
              />
              <Text style={[styles.ringLabel, { color: Colors.blue }]}>Calories</Text>
            </View>
          </View>
          <View style={styles.ringLegend}>
            <LegendItem color={Colors.red} label={`${todayStats.steps.toLocaleString()} / ${stepsGoal.toLocaleString()} steps`} />
            <LegendItem color={Colors.green} label={`${todayStats.activeMinutes} / ${activeGoal} min active`} />
            <LegendItem color={Colors.blue} label={`${todayStats.caloriesBurned} / ${calGoal} kcal burned`} />
          </View>
        </View>

        {/* Metric Cards Grid */}
        <View style={styles.cardsGrid}>
          <View style={styles.cardHalf}>
            <StatCard
              label="Steps"
              value={todayStats.steps.toLocaleString()}
              iconName="activity"
              color={Colors.red}
              progress={stepsProgress}
            />
          </View>
          <View style={styles.cardHalf}>
            <StatCard
              label="Calories"
              value={todayStats.caloriesBurned}
              unit="kcal"
              iconName="zap"
              color={Colors.orange}
              progress={calProgress}
            />
          </View>
          <View style={styles.cardHalf}>
            <StatCard
              label="Distance"
              value={todayStats.distanceKm}
              unit="km"
              iconName="map-pin"
              color={Colors.blue}
            />
          </View>
          <View style={styles.cardHalf}>
            <StatCard
              label="Active Min"
              value={todayStats.activeMinutes}
              unit="min"
              iconName="clock"
              color={Colors.green}
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
    </SafeAreaView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
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
    color: Colors.textPrimary,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.purpleGlow,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
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
    color: Colors.orange,
    flex: 1,
  },
  streakSub: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  quoteCard: {
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  ringsCard: {
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
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  weeklyTotal: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
