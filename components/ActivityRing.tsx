import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ActivityRingProps {
  radius?: number;
  strokeWidth?: number;
  progress: number; // 0–100
  color: string;
  trackColor?: string;
}

export default function ActivityRing({
  radius = 54,
  strokeWidth = 14,
  progress,
  color,
}: ActivityRingProps) {
  const { isDark, colors } = useTheme();
  const trackColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const size = radius * 2;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (animatedProgress.value / 100) * circumference;
    return { strokeDashoffset };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Use SVG transform string for cross-platform (web + native) compatibility */}
        <G transform={`rotate(-90 ${radius} ${radius})`}>
          {/* Track ring */}
          <Circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated progress ring */}
          <AnimatedCircle
            cx={radius}
            cy={radius}
            r={innerRadius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
}
