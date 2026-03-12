/**
 * Rewards Screen
 * Shows the reward catalog and lets members redeem points.
 * TODO Phase 4: load real rewards via useServices().programs.getRewardCatalog()
 */
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { theme } from '../../src/config/theme'

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
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  balanceBanner: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  balanceLabel: {
    color: theme.colors.textFaint,
    fontSize: 13,
    marginBottom: 4,
  },
  balanceValue: {
    color: theme.colors.primaryForeground,
    fontSize: 48,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  rewardCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
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
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  rewardCost: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  redeemButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 14,
    paddingVertical: theme.spacing.xs,
  },
  redeemButtonDisabled: {
    backgroundColor: theme.colors.surfaceDisabled,
  },
  redeemButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: 13,
    fontWeight: '600',
  },
  redeemButtonTextDisabled: {
    color: theme.colors.textFaint,
  },
  footnote: {
    fontSize: 12,
    color: theme.colors.textFaint,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
})
