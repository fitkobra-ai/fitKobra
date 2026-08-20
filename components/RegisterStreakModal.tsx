import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Radius, Spacing, Shadow } from '../constants/Theme';
import { registerDailyStreak } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { todayKey } from '../utils/dates';

interface RegisterStreakModalProps {
  visible: boolean;
  onClose: () => void;
  steps: number;
}

export function RegisterStreakModal({ visible, onClose, steps }: RegisterStreakModalProps) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { user } = useAuth();
  const { profile, refreshProfile } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{points: number, streak: number} | null>(null);
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    if (visible) {
      setSuccess(null);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  const handleRegister = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await registerDailyStreak(user.uid, steps);
      setSuccess({ points: result.pointsEarned, streak: result.currentStreak });
      await refreshProfile(); // Immediately sync global context state
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyRegistered = profile?.lastStreakDate === todayKey();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
          {success ? (
            <View style={styles.content}>
              <View style={[styles.iconCircle, { backgroundColor: colors.green + '20' }]}>
                <Feather name="check-circle" size={44} color={colors.green} />
              </View>
              <Text style={styles.title}>
                {success.points > 0 ? 'Streak Registered!' : 'Already Checked In!'}
              </Text>
              
              {success.points > 0 ? (
                <>
                  <Text style={styles.subtitle}>You earned <Text style={{ color: colors.orange, fontWeight: 'bold' }}>+{success.points}</Text> points today!</Text>
                  <Text style={styles.streakText}>🔥 {success.streak} Day Streak 🔥</Text>
                </>
              ) : (
                <Text style={styles.subtitle}>You have already checked in and claimed your points for today!</Text>
              )}
              
              <TouchableOpacity style={styles.primaryBtn} onPress={onClose}>
                <Text style={styles.btnText}>Awesome!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.content}>
              <View style={[styles.iconCircle, { backgroundColor: isAlreadyRegistered ? colors.green + '20' : colors.blue + '20' }]}>
                <MaterialCommunityIcons 
                  name={isAlreadyRegistered ? "checkbox-marked-circle-outline" : "shoe-sneaker"} 
                  size={44} 
                  color={isAlreadyRegistered ? colors.green : colors.blue} 
                />
              </View>
              <Text style={styles.title}>Daily Check-In</Text>
              <Text style={styles.subtitle}>You've walked {steps.toLocaleString()} steps today.</Text>
              
              {isAlreadyRegistered ? (
                 <View style={[styles.pointsPreview, { borderColor: colors.green + '60', backgroundColor: colors.green + '15' }]}>
                   <Text style={[styles.previewText, { color: colors.green, fontWeight: '700', textAlign: 'center' }]}>
                     ✓ You have already checked in for today!
                   </Text>
                   <Text style={[styles.subtitle, { fontSize: 13, marginBottom: 0, marginTop: 4 }]}>
                     🔥 {profile?.currentStreak || 1} Day Streak Active
                   </Text>
                 </View>
              ) : (
                <View style={styles.pointsPreview}>
                  <Text style={styles.previewText}>Register now to claim your points and save your streak!</Text>
                </View>
              )}

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
                  <Text style={styles.secondaryBtnText}>Close</Text>
                </TouchableOpacity>
                {isAlreadyRegistered ? (
                  <TouchableOpacity 
                    style={[styles.primaryBtn, { flex: 1, marginLeft: Spacing.md, backgroundColor: colors.green + '30', borderWidth: 1, borderColor: colors.green }]}
                    onPress={onClose}
                  >
                    <Text style={[styles.btnText, { color: colors.green, fontWeight: '800' }]}>✓ Checked In</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[styles.primaryBtn, { flex: 1, marginLeft: Spacing.md }]} 
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    <Text style={styles.btnText}>{loading ? 'Saving...' : 'Claim Points'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadow.glow(colors.blue + '40'),
  },
  content: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  streakText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.orange,
    marginVertical: Spacing.md,
  },
  pointsPreview: {
    backgroundColor: colors.surfaceHighlight,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    width: '100%',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.blue + '40',
  },
  previewText: {
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: Spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.blue,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    alignItems: 'center',
    width: '100%',
  },
  secondaryBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
