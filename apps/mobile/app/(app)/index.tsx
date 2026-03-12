/**
 * Home Screen
 * Shows member's points balance, current tier, and recent activity.
 * Data is loaded via useHomeData — all live from Supabase.
 */
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../src/lib/providers'
import { useHomeData } from '../../src/hooks/useHomeData'

export default function HomeScreen() {
  const auth = useAuth()
  const { loading, profile, enrollment, balance, recentTransactions } = useHomeData()

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    )
  }

  const tierName = enrollment?.currentTier?.name ?? 'Member'
  const tierColor = enrollment?.currentTier?.color ?? '#888'
  const displayName = profile?.displayName ?? 'Member'

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey, {displayName} 👋</Text>
        <Text style={styles.orgName}>{enrollment ? 'Ironwood Rewards' : 'No program joined'}</Text>
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
    backgroundColor: '#fafaf8',
  },
  container: {
    flex: 1,
    backgroundColor: '#fafaf8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  orgName: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  pointsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  pointsLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  pointsValue: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 64,
  },
  pointsHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tierLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tierBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tierBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  activityDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d7d46',
  },
  placeholder: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
  signOutButton: {
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#aaa',
    fontSize: 14,
  },
})
