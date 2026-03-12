/**
 * Home Screen
 * Shows member's points balance, current tier, and recent activity.
 * Data is loaded via useHomeData — all live from Supabase.
 */
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../src/lib/providers'
import { useHomeData } from '../../src/hooks/useHomeData'
import { theme } from '../../src/config/theme'

export default function HomeScreen() {
  const auth = useAuth()
  const { loading, profile, enrollment, balance, recentTransactions } = useHomeData()

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  const tierName = enrollment?.currentTier?.name ?? 'Member'
  const tierColor = enrollment?.currentTier?.color ?? theme.colors.textMuted
  const displayName = profile?.displayName ?? 'Member'

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey, {displayName} 👋</Text>
        <Text style={styles.orgName}>
          {enrollment ? 'Ironwood Rewards' : 'No program joined'}
        </Text>
      </View>

      {/* Points Card */}
      <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>Your Points</Text>
        <Text style={styles.pointsValue}>{balance.toLocaleString()}</Text>
        <Text style={styles.pointsHint}>
          {balance === 0 ? 'Check in to start earning' : 'Keep it up!'}
        </Text>
      </View>

      {/* Current Tier */}
      <View style={styles.tierRow}>
        <Text style={styles.tierLabel}>Current Tier</Text>
        <View style={[styles.tierBadge, { backgroundColor: tierColor + '22' }]}>
          <Text style={[styles.tierBadgeText, { color: tierColor }]}>
            {tierName}
          </Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentTransactions.length === 0 ? (
          <Text style={styles.placeholder}>
            Your check-in history will appear here.
          </Text>
        ) : (
          recentTransactions.map((txn) => (
            <View key={txn.id} style={styles.activityRow}>
              <View>
                <Text style={styles.activityLabel}>
                  {txn.locationNote ?? 'Check-in'}
                </Text>
                <Text style={styles.activityDate}>
                  {new Date(txn.checkedInAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.activityPoints}>+{txn.pointsEarned} pts</Text>
            </View>
          ))
        )}
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOutButton} onPress={() => auth.signOut()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  orgName: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  pointsCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  pointsLabel: {
    color: theme.colors.textFaint,
    fontSize: 14,
    marginBottom: 4,
  },
  pointsValue: {
    color: theme.colors.primaryForeground,
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 64,
  },
  pointsHint: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tierLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  tierBadge: {
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  tierBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  activityDate: {
    fontSize: 12,
    color: theme.colors.textFaint,
    marginTop: 2,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  placeholder: {
    fontSize: 14,
    color: theme.colors.textFaint,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    lineHeight: 20,
  },
  signOutButton: {
    marginTop: 32,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  signOutText: {
    color: theme.colors.textFaint,
    fontSize: 14,
  },
})
