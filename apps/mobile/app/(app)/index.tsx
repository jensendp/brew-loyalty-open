/**
 * Home Screen
 * Shows: points balance, current tier, quick links.
 * TODO Phase 1: wire up real enrollment data via useServices()
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSession } from '../../src/hooks/useSession'
import { useAuth } from '../../src/lib/providers'

export default function HomeScreen() {
  const { session } = useSession()
  const auth = useAuth()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back 👋</Text>
        <Text style={styles.email}>{session?.email}</Text>
      </View>

      {/* Points Card */}
      <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>Your Points</Text>
        <Text style={styles.pointsValue}>—</Text>
        <Text style={styles.pointsHint}>Check in to start earning</Text>
      </View>

      {/* Current Tier */}
      <View style={styles.tierRow}>
        <Text style={styles.tierLabel}>Current Tier</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>🍺 Regular</Text>
        </View>
      </View>

      {/* Placeholder: recent activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.placeholder}>
          Your points history will appear here once you check in.
        </Text>
      </View>

      {/* Sign out (dev convenience) */}
      <TouchableOpacity style={styles.signOutButton} onPress={() => auth.signOut()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf8',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  email: {
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
    backgroundColor: '#f0f0ee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tierBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
  signOutButton: {
    marginTop: 'auto',
    padding: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#aaa',
    fontSize: 14,
  },
})
