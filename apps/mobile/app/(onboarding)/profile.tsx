/**
 * Onboarding Step 1: Profile
 * Collects the member's display name and optional birthday.
 * Created once — profile id matches the Supabase auth user id.
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
import { useProfile } from '../../src/hooks/useProfile'
import { theme } from '../../src/config/theme'

export default function ProfileScreen() {
  const router = useRouter()
  const { loading, error, createProfile } = useProfile()

  const [displayName, setDisplayName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [nameError, setNameError] = useState('')

  function validate(): boolean {
    if (!displayName.trim()) {
      setNameError('Please enter your name.')
      return false
    }
    setNameError('')
    return true
  }

  async function handleContinue() {
    if (!validate()) return
    const profile = await createProfile({
      displayName: displayName.trim(),
      birthday: birthday.trim() || undefined,
    })
    if (profile) {
      router.replace('/(onboarding)/enroll')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.emoji}>🍺</Text>
        <Text style={styles.title}>Welcome to Brew Loyalty</Text>
        <Text style={styles.subtitle}>Let's set up your member profile.</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Your name</Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            placeholder="e.g. Alex Brewer"
            placeholderTextColor={theme.colors.textPlaceholder}
            autoCapitalize="words"
            autoFocus
            value={displayName}
            onChangeText={(v) => { setDisplayName(v); setNameError('') }}
          />
          {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Birthday (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textPlaceholder}
            keyboardType="numbers-and-punctuation"
            value={birthday}
            onChangeText={setBirthday}
          />
          <Text style={styles.hint}>Used for birthday perks 🎂</Text>
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving…' : 'Continue →'}
          </Text>
        </TouchableOpacity>
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
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textFaint,
    marginTop: 6,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.error,
    marginTop: 6,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: theme.colors.primaryForeground,
    fontSize: 16,
    fontWeight: '700',
  },
})
