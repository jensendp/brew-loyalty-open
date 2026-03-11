/**
 * Rewards Screen
 * Shows the reward catalog and lets members redeem points.
 * TODO Phase 4: load real rewards via useServices().programs.getRewardCatalog()
 */
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Placeholder data matching our Ironwood demo seed
const DEMO_REWARDS = [
  { id: '1', name: 'Free Pint', description: 'Any 16oz draft pour.', pointCost: 150, icon: '🍺' },
  { id: '2', name: 'Tasting Flight', description: 'Choose any 5 beers from the tap list.', pointCost: 250, icon: '🍻' },
  { id: '3', name: 'Ironwood Pint Glass', description: 'Take home a branded pint glass.', pointCost: 300, icon: '🥃' },
  { id: '4', name: 'Growler Fill', description: '64oz fill — any house beer on tap.', pointCost: 400, icon: '🪣' },
  { id: '5', name: '$10 Tab Credit', description: '$10 off your next tab.', pointCost: 500, icon: '💳' },
]

const MEMBER_BALANCE = 0  // TODO: replace with real balance from useServices()

export default function RewardsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Balance banner */}
      <View style={styles.balanceBanner}>
        <Text style={styles.balanceLabel}>Available Points</Text>
        <Text style={styles.balanceValue}>{MEMBER_BALANCE}</Text>
      </View>

      <Text style={styles.sectionTitle}>Redeem Your Points</Text>

      {DEMO_REWARDS.map((reward) => {
        const canRedeem = MEMBER_BALANCE >= reward.pointCost
        return (
          <View key={reward.id} style={styles.rewardCard}>
            <Text style={styles.rewardIcon}>{reward.icon}</Text>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>{reward.name}</Text>
              <Text style={styles.rewardDescription}>{reward.description}</Text>
              <Text style={styles.rewardCost}>{reward.pointCost} pts</Text>
            </View>
            <TouchableOpacity
              style={[styles.redeemButton, !canRedeem && styles.redeemButtonDisabled]}
              disabled={!canRedeem}
            >
              <Text style={[styles.redeemButtonText, !canRedeem && styles.redeemButtonTextDisabled]}>
                {canRedeem ? 'Redeem' : 'Need more'}
              </Text>
            </TouchableOpacity>
          </View>
        )
      })}

      <Text style={styles.footnote}>
        Earn points by checking in at the venue. Full redemption flow coming in Phase 4.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceBanner: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rewardIcon: {
    fontSize: 32,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  rewardCost: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
  },
  redeemButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: '#f0f0ee',
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  redeemButtonTextDisabled: {
    color: '#bbb',
  },
  footnote: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 12,
  },
})
