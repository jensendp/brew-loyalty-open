/**
 * Tiers / Membership Screen
 * Shows all available tiers, their perks, and the member's current tier.
 * TODO Phase 3: load real tier data via useServices().programs.getTiers()
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { theme } from '../../src/config/theme'

// Placeholder data matching our Ironwood demo seed
const DEMO_TIERS = [
  {
    id: '1',
    name: 'Regular',
    icon: '🍺',
    color: '#888888',
    tierType: 'free' as const,
    description: 'Everyone starts here.',
    perks: ['1x points on every purchase'],
    current: true,
  },
  {
    id: '2',
    name: 'Hop Club',
    icon: '🌾',
    color: '#C8873A',
    tierType: 'paid_subscription' as const,
    monthlyCost: 9.99,
    description: 'Monthly membership with faster points and a free pint.',
    perks: ['1.5x points on every purchase', 'One free pint per month'],
    current: false,
  },
  {
    id: '3',
    name: 'Brew Master',
    icon: '🏆',
    color: '#4A7C9E',
    tierType: 'paid_subscription' as const,
    monthlyCost: 19.99,
    description: 'Double points, monthly growler, event priority.',
    perks: ['2x points on every purchase', 'Monthly pint + growler fill', 'Priority event access'],
    current: false,
  },
  {
    id: '4',
    name: 'Legend',
    icon: '⭐',
    color: '#C0A020',
    tierType: 'threshold' as const,
    pointThreshold: 2000,
    description: 'Earned status for our most loyal regulars.',
    perks: ['2.5x points on every purchase', 'Free birthday flight', 'VIP event access'],
    current: false,
  },
]

export default function TiersScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Level up your membership to unlock more perks and earn points faster.
      </Text>

      {DEMO_TIERS.map((tier) => (
        <View
          key={tier.id}
          style={[styles.tierCard, tier.current && styles.tierCardCurrent]}
        >
          {tier.current && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Your tier</Text>
            </View>
          )}
          <View style={styles.tierHeader}>
            <Text style={styles.tierIcon}>{tier.icon}</Text>
            <View style={styles.tierMeta}>
              <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
              {tier.tierType === 'paid_subscription' && (
                <Text style={styles.tierCost}>${tier.monthlyCost}/mo</Text>
              )}
              {tier.tierType === 'threshold' && (
                <Text style={styles.tierCost}>{tier.pointThreshold} pts to unlock</Text>
              )}
              {tier.tierType === 'free' && (
                <Text style={styles.tierCost}>Free</Text>
              )}
            </View>
          </View>

          <Text style={styles.tierDescription}>{tier.description}</Text>

          <View style={styles.perksContainer}>
            {tier.perks.map((perk, i) => (
              <View key={i} style={styles.perkRow}>
                <Text style={styles.perkBullet}>✓</Text>
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.footnote}>
        Tier data will be loaded from your enrolled program in Phase 3.
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
  intro: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  tierCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tierCardCurrent: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  currentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xs,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 3,
    marginBottom: theme.spacing.sm,
  },
  currentBadgeText: {
    color: theme.colors.primaryForeground,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  tierIcon: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  tierMeta: {
    flex: 1,
  },
  tierName: {
    fontSize: 20,
    fontWeight: '700',
  },
  tierCost: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  tierDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  perksContainer: {
    gap: 6,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  perkBullet: {
    fontSize: 13,
    color: theme.colors.accent,
    fontWeight: '700',
    marginTop: 1,
  },
  perkText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  footnote: {
    fontSize: 12,
    color: theme.colors.textFaint,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
})
