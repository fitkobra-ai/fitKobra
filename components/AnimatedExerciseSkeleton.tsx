import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path, G, Rect } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { Radius, Spacing } from '../constants/Theme';

const AnimatedSvgLine = Animated.createAnimatedComponent(Line);
const AnimatedSvgCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

interface ExerciseSkeletonProps {
  exerciseName: string;
  color?: string;
  size?: number;
}

export default function AnimatedExerciseSkeleton({ exerciseName, color, size = 200 }: ExerciseSkeletonProps) {
  const { colors } = useTheme();
  const primaryColor = color || '#00e699'; // High-contrast fitkobra emerald green
  const accentColor = colors.purple || '#8b5cf6';
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animValue]);

  // Exercise Category & Equipment Detection
  const norm = exerciseName.toLowerCase();
  const isDumbbell = /dumbbell|db\b/i.test(norm);
  const isBarbell = /barbell|bb\b|rod/i.test(norm);

  const isBenchPress = /bench\spress|chest\spress/i.test(norm);
  const isPushup = /push-up|pushup/i.test(norm);
  const isPress = (isBenchPress || isPushup || /press|push|dip/i.test(norm)) && !/leg|calf|shoulder|overhead/i.test(norm);
  const isOverheadPress = /overhead\spress|military\spress|shoulder\spress|arnold\spress/i.test(norm);
  const isCurl = /curl/i.test(norm);
  const isPullup = /pull-up|pullup|chin-up/i.test(norm);
  const isRow = /row|pulldown|lat\spulldown|t-bar/i.test(norm);
  const isLateralRaise = /lateral\sraise|side\sraise|front\sraise/i.test(norm);
  const isFacePull = /face\spull|reverse\sfly/i.test(norm);
  const isSquat = /squat|leg\spress|lunge/i.test(norm);
  const isDeadlift = /deadlift|rdl|hyperextension/i.test(norm);
  const isCalfRaise = /calf/i.test(norm);
  const isShrug = /shrug/i.test(norm);
  const isCrunch = /crunch|situp|ab/i.test(norm);

  // 1. SQUAT / LEG PRESS (Biomechanical Depth Flexion)
  const squatBodyY = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, 32] });
  const squatKneeLeftX = animValue.interpolate({ inputRange: [0, 1], outputRange: [80, 52] });
  const squatKneeRightX = animValue.interpolate({ inputRange: [0, 1], outputRange: [120, 148] });
  const squatKneeY = animValue.interpolate({ inputRange: [0, 1], outputRange: [135, 150] });

  // 2. BICEP CURL (Arc Radius Motion)
  const curlHandY = animValue.interpolate({ inputRange: [0, 1], outputRange: [145, 75] });
  const curlHandX = animValue.interpolate({ inputRange: [0, 1], outputRange: [65, 85] });

  // 3. BENCH PRESS (Vertical Barbell Extension)
  const benchBarY = animValue.interpolate({ inputRange: [0, 1], outputRange: [105, 55] });

  // 4. OVERHEAD PRESS (Full Arm Extension Overhead)
  const pressBarY = animValue.interpolate({ inputRange: [0, 1], outputRange: [75, 25] });

  // 5. ROW / PULLDOWN (Elbow Retraction)
  const rowElbowX = animValue.interpolate({ inputRange: [0, 1], outputRange: [135, 80] });
  const rowElbowY = animValue.interpolate({ inputRange: [0, 1], outputRange: [95, 75] });

  // 6. LATERAL RAISES (Arm Abduction)
  const latHandY = animValue.interpolate({ inputRange: [0, 1], outputRange: [140, 75] });

  // 7. CALF RAISES (Ankle Elevation)
  const calfElevateY = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });

  // Movement Title Badge
  let movementLabel = 'Kinematic Motion';
  if (isSquat) movementLabel = 'Biomechanical Squat Depth';
  else if (isBenchPress) movementLabel = isDumbbell ? 'Dumbbell Chest Press' : 'Chest Press Drive';
  else if (isOverheadPress) movementLabel = isDumbbell || !isBarbell ? 'Dumbbell Shoulder Press' : 'Vertical Deltoid Drive';
  else if (isCurl) movementLabel = 'Bicep Isolation Arc';
  else if (isRow || isPullup) movementLabel = 'Lat Retraction Drive';
  else if (isDeadlift) movementLabel = 'Posterior Hip Hinge';
  else if (isLateralRaise) movementLabel = 'Side Delt Abduction';
  else if (isCalfRaise) movementLabel = 'Calf Plantar Flexion';
  else if (isShrug) movementLabel = 'Trapezius Scapular Elevation';
  else if (isCrunch) movementLabel = 'Core Abdominal Flexion';

  return (
    <View style={{ width: size, height: size + 24, alignItems: 'center', justifyContent: 'center' }}>
      {/* 1. SQUAT KINEMATICS */}
      {isSquat && (
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="88" fill="#121824" stroke="rgba(0,230,153,0.2)" strokeWidth="2" />
          
          {/* Moving Upper Body & Barbell */}
          <AnimatedG style={{ transform: [{ translateY: squatBodyY }] }}>
            {/* Barbell & Heavy Plates */}
            <Line x1="30" y1="52" x2="170" y2="52" stroke="#FF9500" strokeWidth="6" strokeLinecap="round" />
            <Rect x="25" y="32" width="12" height="40" rx="3" fill="#FF9500" />
            <Rect x="163" y="32" width="12" height="40" rx="3" fill="#FF9500" />

            {/* Head & Spine */}
            <Circle cx="100" cy="30" r="14" stroke={primaryColor} strokeWidth="3.5" fill="#1e293b" />
            <Line x1="100" y1="44" x2="100" y2="105" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />

            {/* Arms holding Barbell */}
            <Line x1="75" y1="52" x2="40" y2="52" stroke={primaryColor} strokeWidth="4.5" strokeLinecap="round" />
            <Line x1="125" y1="52" x2="160" y2="52" stroke={primaryColor} strokeWidth="4.5" strokeLinecap="round" />
          </AnimatedG>

          {/* Dynamic Hips to Knees */}
          <AnimatedSvgLine x1="100" y1={animValue.interpolate({ inputRange: [0, 1], outputRange: [105, 137] })} x2={squatKneeLeftX} y2={squatKneeY} stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
          <AnimatedSvgLine x1="100" y1={animValue.interpolate({ inputRange: [0, 1], outputRange: [105, 137] })} x2={squatKneeRightX} y2={squatKneeY} stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />

          {/* Knees to Feet */}
          <AnimatedSvgLine x1={squatKneeLeftX} y1={squatKneeY} x2="65" y2="180" stroke={primaryColor} strokeWidth="5.5" strokeLinecap="round" />
          <AnimatedSvgLine x1={squatKneeRightX} y1={squatKneeY} x2="135" y2="180" stroke={primaryColor} strokeWidth="5.5" strokeLinecap="round" />

          {/* Feet Pads */}
          <Line x1="50" y1="180" x2="72" y2="180" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="128" y1="180" x2="150" y2="180" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />

          {/* Quad Tension Dots */}
          <AnimatedSvgCircle cx={squatKneeLeftX} cy={squatKneeY} r="7" fill="#00e699" />
          <AnimatedSvgCircle cx={squatKneeRightX} cy={squatKneeY} r="7" fill="#00e699" />
        </Svg>
      )}

      {/* 2. BENCH PRESS KINEMATICS */}
      {(isBenchPress || isPress) && !isSquat && !isOverheadPress && (
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="88" fill="#121824" stroke="rgba(0,230,153,0.2)" strokeWidth="2" />
          {/* Gym Bench Structure */}
          <Rect x="25" y="120" width="150" height="14" rx="4" fill="#334155" />
          <Rect x="40" y="134" width="12" height="42" fill="#334155" />
          <Rect x="148" y="134" width="12" height="42" fill="#334155" />

          {/* Horizontal Torso & Head */}
          <Circle cx="45" cy="108" r="13" stroke={primaryColor} strokeWidth="3.5" fill="#1e293b" />
          <Line x1="58" y1="108" x2="145" y2="108" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />

          {isDumbbell ? (
            /* Dumbbell Bench Press (Two Independent Dumbbells) */
            <G>
              <AnimatedSvgLine x1="75" y1="108" x2="75" y2={benchBarY} stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
              <AnimatedSvgLine x1="125" y1="108" x2="125" y2={benchBarY} stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
              {/* Left Dumbbell */}
              <AnimatedG style={{ transform: [{ translateX: 75 }, { translateY: benchBarY }] }}>
                <Line x1="0" y1="-12" x2="0" y2="12" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                <Rect x="-8" y="-18" width="16" height="7" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
                <Rect x="-8" y="11" width="16" height="7" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
                <Circle cx="0" cy="0" r="4" fill={primaryColor} />
              </AnimatedG>
              {/* Right Dumbbell */}
              <AnimatedG style={{ transform: [{ translateX: 125 }, { translateY: benchBarY }] }}>
                <Line x1="0" y1="-12" x2="0" y2="12" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                <Rect x="-8" y="-18" width="16" height="7" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
                <Rect x="-8" y="11" width="16" height="7" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
                <Circle cx="0" cy="0" r="4" fill={primaryColor} />
              </AnimatedG>
            </G>
          ) : (
            /* Barbell Bench Press */
            <G>
              <AnimatedSvgLine x1="75" y1="108" x2="75" y2={benchBarY} stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
              <AnimatedSvgLine x1="125" y1="108" x2="125" y2={benchBarY} stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
              <AnimatedG style={{ transform: [{ translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) }] }}>
                <Line x1="35" y1="105" x2="165" y2="105" stroke="#FF9500" strokeWidth="6" strokeLinecap="round" />
                <Rect x="28" y="85" width="12" height="40" rx="3" fill="#FF9500" />
                <Rect x="160" y="85" width="12" height="40" rx="3" fill="#FF9500" />
              </AnimatedG>
            </G>
          )}
        </Svg>
      )}

      {/* 3. BICEP CURL KINEMATICS */}
      {isCurl && (
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="88" fill="#121824" stroke="rgba(0,230,153,0.2)" strokeWidth="2" />
          <Circle cx="100" cy="32" r="14" stroke={primaryColor} strokeWidth="3.5" fill="#1e293b" />
          <Line x1="100" y1="46" x2="100" y2="110" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />
          <Line x1="82" y1="110" x2="82" y2="180" stroke={primaryColor} strokeWidth="5" />
          <Line x1="118" y1="110" x2="118" y2="180" stroke={primaryColor} strokeWidth="5" />

          {/* Fixed Upper Arm & Elbow */}
          <Line x1="75" y1="62" x2="68" y2="105" stroke={primaryColor} strokeWidth="5.5" strokeLinecap="round" />
          <Circle cx="68" cy="105" r="5" fill={accentColor} />

          {/* Dynamic Forearm & Dumbbell Arc */}
          <AnimatedSvgLine x1="68" y1="105" x2={curlHandX} y2={curlHandY} stroke={primaryColor} strokeWidth="5.5" strokeLinecap="round" />
          
          {/* Hex Dumbbell in Hand */}
          <AnimatedG style={{ transform: [{ translateX: curlHandX }, { translateY: curlHandY }] }}>
            <Line x1="-10" y1="0" x2="10" y2="0" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
            <Rect x="-16" y="-7" width="7" height="14" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
            <Rect x="9" y="-7" width="7" height="14" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
            <Circle cx="0" cy="0" r="4" fill={primaryColor} />
          </AnimatedG>
        </Svg>
      )}

      {/* 4. OVERHEAD PRESS KINEMATICS */}
      {isOverheadPress && (
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="88" fill="#121824" stroke="rgba(0,230,153,0.2)" strokeWidth="2" />
          <Circle cx="100" cy="42" r="14" stroke={primaryColor} strokeWidth="3.5" fill="#1e293b" />
          <Line x1="100" y1="56" x2="100" y2="120" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />
          <Line x1="72" y1="62" x2="128" y2="62" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="82" y1="120" x2="82" y2="180" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="118" y1="120" x2="118" y2="180" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
          <Line x1="72" y1="180" x2="90" y2="180" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
          <Line x1="110" y1="180" x2="128" y2="180" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />

          <Circle cx="72" cy="62" r="5" fill={accentColor} />
          <Circle cx="128" cy="62" r="5" fill={accentColor} />

          {isBarbell ? (
            /* Barbell Overhead Extension (Single Long Rod with Dynamic Arm Lines) */
            <G>
              {/* Left Arm: Shoulder (72,62) -> Left Elbow -> Left Hand */}
              <AnimatedSvgLine
                x1="72"
                y1="62"
                x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [52, 68] })}
                y2={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 55] })}
                stroke={primaryColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <AnimatedSvgLine
                x1={animValue.interpolate({ inputRange: [0, 1], outputRange: [52, 68] })}
                y1={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 55] })}
                x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [55, 68] })}
                y2={pressBarY}
                stroke={primaryColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <AnimatedSvgCircle
                cx={animValue.interpolate({ inputRange: [0, 1], outputRange: [52, 68] })}
                cy={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 55] })}
                r="4.5"
                fill="#00e699"
              />

              {/* Right Arm: Shoulder (128,62) -> Right Elbow -> Right Hand */}
              <AnimatedSvgLine
                x1="128"
                y1="62"
                x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [148, 132] })}
                y2={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 55] })}
                stroke={primaryColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <AnimatedSvgLine
                x1={animValue.interpolate({ inputRange: [0, 1], outputRange: [148, 132] })}
                y1={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 55] })}
                x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [145, 132] })}
                y2={pressBarY}
                stroke={primaryColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <AnimatedSvgCircle
                cx={animValue.interpolate({ inputRange: [0, 1], outputRange: [148, 132] })}
                cy={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 55] })}
                r="4.5"
                fill="#00e699"
              />

              {/* Barbell Rod & Plates */}
              <AnimatedSvgLine x1="25" y1={pressBarY} x2="175" y2={pressBarY} stroke="#FF9500" strokeWidth="6" strokeLinecap="round" />
              <AnimatedSvgCircle cx="25" cy={pressBarY} r="11" fill="#FF9500" />
              <AnimatedSvgCircle cx="175" cy={pressBarY} r="11" fill="#FF9500" />
            </G>
          ) : (
            /* DUMBBELL SHOULDER PRESS KINEMATICS (Two Separate Dumbbells) */
            <G>
              {/* Left Arm: Shoulder (72,62) -> Left Elbow -> Left Hand */}
              <AnimatedSvgLine
                x1="72"
                y1="62"
                x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [46, 68] })}
                y2={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 60] })}
                stroke={primaryColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <AnimatedSvgLine
                x1={animValue.interpolate({ inputRange: [0, 1], outputRange: [46, 68] })}
                y1={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 60] })}
                x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [42, 68] })}
                y2={pressBarY}
                stroke={primaryColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <AnimatedSvgCircle
                cx={animValue.interpolate({ inputRange: [0, 1], outputRange: [46, 68] })}
                cy={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 60] })}
                r="4.5"
                fill="#00e699"
              />

              {/* Right Arm: Shoulder (128,62) -> Right Elbow -> Right Hand */}
              <AnimatedSvgLine
                x1="128"
                y1="62"
                x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [154, 132] })}
                y2={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 60] })}
                stroke={primaryColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <AnimatedSvgLine
                x1={animValue.interpolate({ inputRange: [0, 1], outputRange: [154, 132] })}
                y1={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 60] })}
                x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [158, 132] })}
                y2={pressBarY}
                stroke={primaryColor}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <AnimatedSvgCircle
                cx={animValue.interpolate({ inputRange: [0, 1], outputRange: [154, 132] })}
                cy={animValue.interpolate({ inputRange: [0, 1], outputRange: [92, 60] })}
                r="4.5"
                fill="#00e699"
              />

              {/* LEFT DUMBBELL (NO CONNECTING ROD!) */}
              <AnimatedG style={{
                transform: [
                  { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [42, 68] }) },
                  { translateY: pressBarY }
                ]
              }}>
                <Line x1="-12" y1="0" x2="12" y2="0" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                <Rect x="-19" y="-7" width="7" height="14" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
                <Rect x="12" y="-7" width="7" height="14" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
                <Circle cx="0" cy="0" r="4.5" fill={primaryColor} />
              </AnimatedG>

              {/* RIGHT DUMBBELL (NO CONNECTING ROD!) */}
              <AnimatedG style={{
                transform: [
                  { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [158, 132] }) },
                  { translateY: pressBarY }
                ]
              }}>
                <Line x1="-12" y1="0" x2="12" y2="0" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                <Rect x="-19" y="-7" width="7" height="14" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
                <Rect x="12" y="-7" width="7" height="14" rx="2" fill="#FF9500" stroke="#CC7700" strokeWidth="1" />
                <Circle cx="0" cy="0" r="4.5" fill={primaryColor} />
              </AnimatedG>
            </G>
          )}
        </Svg>
      )}

      {/* 5. LATERAL RAISES KINEMATICS */}
      {isLateralRaise && (
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="88" fill="#121824" stroke="rgba(0,230,153,0.2)" strokeWidth="2" />
          <Circle cx="100" cy="32" r="14" stroke={primaryColor} strokeWidth="3.5" fill="#1e293b" />
          <Line x1="100" y1="46" x2="100" y2="110" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />
          <Line x1="82" y1="110" x2="82" y2="180" stroke={primaryColor} strokeWidth="5" />
          <Line x1="118" y1="110" x2="118" y2="180" stroke={primaryColor} strokeWidth="5" />

          {/* Abducting Arms Outward to 90 Degrees */}
          <AnimatedSvgLine x1="75" y1="62" x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [70, 25] })} y2={latHandY} stroke={primaryColor} strokeWidth="5.5" strokeLinecap="round" />
          <AnimatedSvgLine x1="125" y1="62" x2={animValue.interpolate({ inputRange: [0, 1], outputRange: [130, 175] })} y2={latHandY} stroke={primaryColor} strokeWidth="5.5" strokeLinecap="round" />
          <AnimatedSvgCircle cx={animValue.interpolate({ inputRange: [0, 1], outputRange: [70, 25] })} cy={latHandY} r="9" fill="#FF9500" />
          <AnimatedSvgCircle cx={animValue.interpolate({ inputRange: [0, 1], outputRange: [130, 175] })} cy={latHandY} r="9" fill="#FF9500" />
        </Svg>
      )}

      {/* 6. DEADLIFT / RDL KINEMATICS */}
      {isDeadlift && (
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="88" fill="#121824" stroke="rgba(0,230,153,0.2)" strokeWidth="2" />
          <Circle cx="100" cy="32" r="14" stroke={primaryColor} strokeWidth="3.5" fill="#1e293b" />
          <Line x1="100" y1="46" x2="100" y2="110" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />
          <Line x1="82" y1="110" x2="82" y2="180" stroke={primaryColor} strokeWidth="5" />
          <Line x1="118" y1="110" x2="118" y2="180" stroke={primaryColor} strokeWidth="5" />
          {/* Sliding Barbell on Shins */}
          <AnimatedSvgLine x1="30" y1={animValue.interpolate({ inputRange: [0, 1], outputRange: [105, 160] })} x2="170" y2={animValue.interpolate({ inputRange: [0, 1], outputRange: [105, 160] })} stroke="#FF9500" strokeWidth="6" strokeLinecap="round" />
          <AnimatedSvgCircle cx="30" cy={animValue.interpolate({ inputRange: [0, 1], outputRange: [105, 160] })} r="11" fill="#FF9500" />
          <AnimatedSvgCircle cx="170" cy={animValue.interpolate({ inputRange: [0, 1], outputRange: [105, 160] })} r="11" fill="#FF9500" />
        </Svg>
      )}

      {/* 7. ROW / PULLDOWN KINEMATICS */}
      {(isRow || isPullup || isFacePull) && !isSquat && !isBenchPress && (
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="88" fill="#121824" stroke="rgba(0,230,153,0.2)" strokeWidth="2" />
          <Circle cx="100" cy="32" r="14" stroke={primaryColor} strokeWidth="3.5" fill="#1e293b" />
          <Line x1="100" y1="46" x2="100" y2="110" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />
          <Line x1="82" y1="110" x2="82" y2="180" stroke={primaryColor} strokeWidth="5" />
          <Line x1="118" y1="110" x2="118" y2="180" stroke={primaryColor} strokeWidth="5" />

          {/* Elbow Retraction */}
          <AnimatedSvgLine x1="80" y1="62" x2={rowElbowX} y2={rowElbowY} stroke={primaryColor} strokeWidth="5.5" strokeLinecap="round" />
          <AnimatedSvgLine x1={rowElbowX} y1={rowElbowY} x2="135" y2="95" stroke={primaryColor} strokeWidth="5.5" strokeLinecap="round" />
          <AnimatedSvgCircle cx="135" cy="95" r="9" fill="#FF9500" />
        </Svg>
      )}

      {/* FALLBACK / CALF RAISE KINEMATICS */}
      {!isSquat && !isBenchPress && !isPress && !isCurl && !isOverheadPress && !isLateralRaise && !isDeadlift && !isRow && !isPullup && !isFacePull && (
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="88" fill="#121824" stroke="rgba(0,230,153,0.2)" strokeWidth="2" />
          <AnimatedG style={{ transform: [{ translateY: calfElevateY }] }}>
            <Circle cx="100" cy="32" r="14" stroke={primaryColor} strokeWidth="3.5" fill="#1e293b" />
            <Line x1="100" y1="46" x2="100" y2="110" stroke={primaryColor} strokeWidth="7" strokeLinecap="round" />
            <Line x1="75" y1="62" x2="125" y2="62" stroke={primaryColor} strokeWidth="5" />
            <Line x1="82" y1="110" x2="82" y2="175" stroke={primaryColor} strokeWidth="5" />
            <Line x1="118" y1="110" x2="118" y2="180" stroke={primaryColor} strokeWidth="5" />
          </AnimatedG>
        </Svg>
      )}

      {/* High-Contrast Dynamic Motion Badge */}
      <View style={{
        position: 'absolute',
        bottom: -10,
        backgroundColor: '#0d1117',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#00e699',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        shadowColor: '#00e699',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
      }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#00e699' }} />
        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.3 }}>
          {movementLabel}
        </Text>
      </View>
    </View>
  );
}
