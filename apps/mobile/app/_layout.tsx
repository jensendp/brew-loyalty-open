import { Slot, useRouter, useSegments } from 'expo-router'
import * as Linking from 'expo-linking'
import { createContext, useContext, useEffect } from 'react'
import { ServicesProvider } from '../src/lib/providers'
import { useAuth } from '../src/lib/providers'
import { useOnboardingStatus } from '../src/hooks/useOnboardingStatus'

/** Lets onboarding screens trigger a re-check of the funnel state. */
export const OnboardingRefreshContext = createContext<() => void>(() => {})
export const useOnboardingRefresh = () => useContext(OnboardingRefreshContext)

function RootLayoutNav() {
  const { status, refresh } = useOnboardingStatus()
  const segments = useSegments()
  const router = useRouter()
  const auth = useAuth()

  // Handle magic link deep links — both cold start and foreground.
  // When Supabase redirects to brewloyalty://?code=..., we exchange
  // the PKCE code for a session, which fires onAuthStateChange and
  // updates routing state automatically.
  useEffect(() => {
    const handleUrl = (url: string) => {
      if (url.includes('code=') || url.includes('access_token=')) {
        auth.handleDeepLink(url).catch(console.error)
      }
    }

    // App launched by tapping the link (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url)
    })

    // App already open when link is tapped (foreground)
    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url))
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (status === 'loading') return

    const inAuth = segments[0] === '(auth)'
    const inOnboarding = segments[0] === '(onboarding)'
    const inApp = segments[0] === '(app)'

    switch (status) {
      case 'unauthenticated':
        if (!inAuth) router.replace('/(auth)/sign-in')
        break
      case 'needs-profile':
        if (!(inOnboarding && segments[1] === 'profile'))
          router.replace('/(onboarding)/profile')
        break
      case 'needs-enrollment':
        if (!(inOnboarding && segments[1] === 'enroll'))
          router.replace('/(onboarding)/enroll')
        break
      case 'ready':
        if (!inApp) router.replace('/(app)')
        break
    }
  }, [status, segments])

  return (
    <OnboardingRefreshContext.Provider value={refresh}>
      <Slot />
    </OnboardingRefreshContext.Provider>
  )
}

export default function RootLayout() {
  return (
    <ServicesProvider>
      <RootLayoutNav />
    </ServicesProvider>
  )
}
