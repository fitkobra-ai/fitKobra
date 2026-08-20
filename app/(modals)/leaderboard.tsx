import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Radius, Spacing, Shadow } from '../../constants/Theme';
import { getLeaderboard, UserProfile } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

type LeaderboardEntry = UserProfile & { id: string };

export default function LeaderboardScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await getLeaderboard();
        let finalData = [...data];
        let userRank = null;

        if (user) {
          const rankIndex = finalData.findIndex(u => u.id === user.uid);
          if (rankIndex !== -1) {
            userRank = rankIndex + 1;
          } else {
            // User not in top 100 or missing points field, append them manually
            const mySnap = await getDoc(doc(db, 'users', user.uid));
            if (mySnap.exists()) {
              const myProfile = mySnap.data().profile || {};
              finalData.push({ id: user.uid, ...myProfile });
              userRank = finalData.length; // Place at the bottom
            }
          }
        }
        
        // Sort one last time just in case (optional, but good practice)
        finalData.sort((a, b) => (b.points || 0) - (a.points || 0));
        
        // Re-evaluate rank after sort
        if (user) {
          const newRankIndex = finalData.findIndex(u => u.id === user.uid);
          if (newRankIndex !== -1) userRank = newRankIndex + 1;
        }

        setUsers(finalData);
        setCurrentUserRank(userRank);
      } catch (err) {
        console.error(err);
        setErrorMsg('Could not load leaderboard data. Please check your connection or permissions.');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [user]);

  const renderMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Feather name="award" size={24} color="#FFD700" />; // Gold
      case 2:
        return <Feather name="award" size={24} color="#C0C0C0" />; // Silver
      case 3:
        return <Feather name="award" size={24} color="#CD7F32" />; // Bronze
      default:
        return <Text style={styles.rankNumber}>#{rank}</Text>;
    }
  };

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const rank = index + 1;
    const isCurrentUser = item.id === user?.uid;
    const isTop3 = rank <= 3;
    
    let highlightColor = colors.surfaceHighlight;
    if (rank === 1) highlightColor = 'rgba(255, 215, 0, 0.1)';
    else if (rank === 2) highlightColor = 'rgba(192, 192, 192, 0.1)';
    else if (rank === 3) highlightColor = 'rgba(205, 127, 50, 0.1)';

    return (
      <View style={[
        styles.userCard, 
        isCurrentUser && styles.currentUserCard,
        isTop3 && { backgroundColor: highlightColor }
      ]}>
        <View style={styles.rankCol}>
          {renderMedal(rank)}
        </View>
        
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name ? item.name.substring(0, 2).toUpperCase() : 'U'}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
            {item.name || 'Anonymous User'} {isCurrentUser && '(You)'}
          </Text>
          <Text style={styles.streakText}>🔥 {item.currentStreak || 0} Day Streak</Text>
        </View>

        <View style={styles.pointsCol}>
          <Text style={styles.pointsNumber}>{item.points?.toLocaleString() || 0}</Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Community Rank</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : errorMsg ? (
        <View style={styles.center}>
          <Feather name="alert-triangle" size={48} color={colors.orange} style={{ marginBottom: Spacing.md }} />
          <Text style={{ color: colors.textPrimary, fontSize: 16, textAlign: 'center', marginHorizontal: Spacing.xl }}>{errorMsg}</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.center}>
          <Feather name="users" size={48} color={colors.textMuted} style={{ marginBottom: Spacing.md }} />
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>No users found.</Text>
        </View>
      ) : (
        <>
          {currentUserRank !== null && (
            <View style={[styles.stickyBanner, Shadow.card]}>
              <Text style={styles.stickyText}>
                You are currently ranked <Text style={{ color: colors.blue, fontWeight: '900' }}>#{currentUserRank}</Text>
              </Text>
            </View>
          )}

          <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const useStyles = (colors: any) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: colors.surfaceHighlight,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyBanner: {
    backgroundColor: colors.surface,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.blue + '50',
    alignItems: 'center',
  },
  stickyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl * 2,
    gap: Spacing.sm,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentUserCard: {
    borderColor: colors.blue,
    backgroundColor: colors.blue + '10',
  },
  rankCol: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.sm,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  currentUserName: {
    color: colors.blue,
  },
  streakText: {
    fontSize: 13,
    color: colors.orange,
    fontWeight: '600',
  },
  pointsCol: {
    alignItems: 'flex-end',
  },
  pointsNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  pointsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
