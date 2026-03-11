/**
 * Member Card Screen
 * Shows the member's QR code for staff to scan at point-of-sale.
 * TODO Phase 2: generate real QR code using member enrollment ID
 */
import { StyleSheet, Text, View } from 'react-native'
import { useSession } from '../../src/hooks/useSession'

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
    backgroundColor: '#fafaf8',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
    textAlign: 'center',
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  qrEmoji: {
    fontSize: 96,
    color: '#1a1a1a',
  },
  qrNote: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 8,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  infoValueMono: {
    fontSize: 13,
    color: '#555',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
})

import { Platform } from 'react-native'
