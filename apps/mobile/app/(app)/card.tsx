/**
 * Member Card Screen
 * Shows the member's QR code for staff to scan at point-of-sale.
 * TODO Phase 2: generate real QR code using member enrollment ID
 */
import { Platform, StyleSheet, Text, View } from 'react-native'
import { useSession } from '../../src/hooks/useSession'
import { theme } from '../../src/config/theme'

export default function CardScreen() {
  const { session } = useSession()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Member Card</Text>
      <Text style={styles.subtitle}>Show this to staff when you make a purchase.</Text>

      {/* QR Code placeholder — Phase 2 */}
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrEmoji}>▦</Text>
        <Text style={styles.qrNote}>QR code coming in Phase 2</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Member</Text>
        <Text style={styles.infoValue}>{session?.email ?? '—'}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Member ID</Text>
        <Text style={styles.infoValueMono} numberOfLines={1} ellipsizeMode="middle">
          {session?.userId ?? '—'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  qrEmoji: {
    fontSize: 96,
    color: theme.colors.textPrimary,
  },
  qrNote: {
    fontSize: 12,
    color: theme.colors.textFaint,
    marginTop: theme.spacing.xs,
  },
  infoCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 11,
    color: theme.colors.textPlaceholder,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  infoValueMono: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
})
