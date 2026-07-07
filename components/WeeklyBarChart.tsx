import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/Theme';

interface BarChartProps {
  data: { day: string; steps: number; calories: number }[];
  highlightIndex?: number;
}

export default function WeeklyBarChart({ data, highlightIndex = 6 }: BarChartProps) {
  const maxSteps = Math.max(...data.map((d) => d.steps));

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {data.map((item, index) => {
          const heightPercent = (item.steps / maxSteps) * 100;
          const isHighlight = index === highlightIndex;
          return (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor: isHighlight ? Colors.purple : Colors.surfaceHighlight,
                    },
                    isHighlight && {
                      shadowColor: Colors.purple,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 6,
                      elevation: 6,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, isHighlight && { color: Colors.textPrimary }]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 6,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
