import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Colors, Radius, Spacing, Shadow } from '../constants/Theme';
import { workoutCalories, formatDuration } from '../utils/calculations';
import { type WorkoutType } from '../constants/WorkoutTypes';

interface WorkoutTimerProps {
  workoutType: WorkoutType;
  userWeightKg: number;
  onStop: (result: { durationSeconds: number; caloriesBurned: number }) => void;
  onCancel: () => void;
}

export default function WorkoutTimer({
  workoutType,
  userWeightKg,
  onStop,
  onCancel,
}: WorkoutTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calories = workoutCalories(workoutType.id, userWeightKg, elapsedSeconds);

  // Keep screen awake during workout
  useEffect(() => {
    if (Platform.OS !== 'web') {
      activateKeepAwakeAsync('workout-timer');
    }
    return () => {
      if (Platform.OS !== 'web') {
        deactivateKeepAwake('workout-timer');
      }
    };
  }, []);

  // Timer tick
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onStop({ durationSeconds: elapsedSeconds, caloriesBurned: calories });
  };

  return (
    <View style={[styles.container, Shadow.card]}>
      {/* Workout Type Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>{workoutType.emoji}</Text>
        <Text style={[styles.type, { color: workoutType.color }]}>{workoutType.label}</Text>
        <View style={[styles.liveBadge, isPaused && styles.pausedBadge]}>
          <Text style={styles.liveText}>{isPaused ? 'PAUSED' : '● LIVE'}</Text>
        </View>
      </View>

      {/* Timer Display */}
      <Text style={styles.timer}>{formatDuration(elapsedSeconds)}</Text>

      {/* Live Metrics */}
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: workoutType.color }]}>
            {calories}
          </Text>
          <Text style={styles.metricLabel}>kcal burned</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: Colors.blue }]}>
            {Math.floor(elapsedSeconds / 60)}
          </Text>
          <Text style={styles.metricLabel}>minutes</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, styles.cancelBtn]}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>✕ Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, styles.pauseBtn]}
          onPress={() => setIsPaused(p => !p)}
          activeOpacity={0.7}
        >
          <Text style={styles.pauseText}>{isPaused ? '▶ Resume' : '⏸ Pause'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, styles.stopBtn]}
          onPress={handleStop}
          activeOpacity={0.7}
        >
          <Text style={styles.stopText}>⏹ Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.lg,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emoji: { fontSize: 28 },
  type: { fontSize: 20, fontWeight: '700', flex: 1 },
  liveBadge: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
  },
  pausedBadge: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderColor: 'rgba(139,92,246,0.4)',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.red,
    letterSpacing: 0.5,
  },
  timer: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'center',
  },
  metric: { alignItems: 'center', gap: 4 },
  metricValue: { fontSize: 28, fontWeight: '700' },
  metricLabel: { fontSize: 12, color: Colors.textSecondary },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  controlBtn: {
    flex: 1,
    padding: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: Colors.surfaceHighlight,
  },
  pauseBtn: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.4)',
  },
  stopBtn: {
    backgroundColor: Colors.blue,
  },
  cancelText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 13 },
  pauseText: { color: Colors.purple, fontWeight: '600', fontSize: 13 },
  stopText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
