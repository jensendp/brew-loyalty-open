/**
 * Onboarding Step 2: Enroll
 * Member enters an enrollment code to join a loyalty program.
 * e.g. "IRONWOOD" → looks up Ironwood Rewards and creates a member_enrollment row.
 */
import { useRouter } from 'expo-router'
import { useState } from 'react'
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

export default function EnrollScreen() {
  const router = useRouter()
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
    // The profile id equals the auth user id
    const enrollment = await joinByCode(code, session.userId)
    if (enrollment) {
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
            placeholderTextColor="#bbb"
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
    backgroundColor: '#fafaf8',
  },
  inner: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    lineHeight: 22,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#1a1a1a',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  errorText: {
    fontSize: 13,
    color: '#e53e3e',
    marginTop: 6,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
  },
})
