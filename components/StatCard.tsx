import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Radius, Spacing, Shadow } from '../constants/Theme';
import { Feather } from '@expo/vector-icons';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  iconName: keyof typeof Feather.glyphMap;
  color: string;
  progress?: number; // 0–1
}

export default function StatCard({ label, value, unit, iconName, color, progress }: StatCardProps) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={[styles.card, Shadow.card]}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: `${color}25` }]}>
          <Feather name={iconName} size={18} color={color} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {progress !== undefined && (
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressBg: {
    height: 5,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
