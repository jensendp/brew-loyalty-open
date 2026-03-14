/**
 * Onboarding Step 2: Enroll
 * Member enters an enrollment code to join a loyalty program.
 * e.g. "IRONWOOD" → looks up Ironwood Rewards and creates a member_enrollment row.
 */
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useOnboardingRefresh } from '../_layout'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useEnrollment } from '../../src/hooks/useEnrollment'
import { useSession } from '../../src/hooks/useSession'
import { theme } from '../../src/config/theme'

export default function EnrollScreen() {
  const router = useRouter()
  const refresh = useOnboardingRefresh()
  const { session } = useSession()
  const { loading, error, joinByCode } = useEnrollment()

  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  function validate(): boolean {
    if (!code.trim()) {
      setCodeError('Please enter an enrollment code.')
      return false
    }
    setCodeError('')
    return true
  }

  async function handleJoin() {
    if (!validate() || !session) return
    const enrollment = await joinByCode(code, session.userId)
    if (enrollment) {
      refresh()
      router.replace('/(app)')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.emoji}>🎫</Text>
        <Text style={styles.title}>Join a Loyalty Program</Text>
        <Text style={styles.subtitle}>
          Enter the enrollment code from your favorite brewery, winery, or coffee shop.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enrollment code</Text>
          <TextInput
            style={[styles.input, codeError ? styles.inputError : null]}
            placeholder="e.g. IRONWOOD"
            placeholderTextColor={theme.colors.textPlaceholder}
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            value={code}
            onChangeText={(v) => { setCode(v); setCodeError('') }}
          />
          {!!codeError && <Text style={styles.errorText}>{codeError}</Text>}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleJoin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Joining…' : 'Join Program →'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Don't have a code? Ask your venue for their enrollment code or scan their QR.
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  inner: {
    flex: 1,
    padding: theme.spacing.xxl,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 40,
    lineHeight: 22,
  },
  fieldGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.borderInput,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    textAlign: 'center',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.error,
    marginTop: 6,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: theme.colors.primaryForeground,
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    color: theme.colors.textFaint,
    textAlign: 'center',
    lineHeight: 20,
  },
})
