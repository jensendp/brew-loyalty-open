import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { ServicesProvider } from '../src/lib/providers'
import { useOnboardingStatus } from '../src/hooks/useOnboardingStatus'

function RootLayoutNav() {
  const { status } = useOnboardingStatus()
  const segments = useSegments()
  const router = useRouter()

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

  return <Slot />
}

export default function RootLayout() {
  return (
    <ServicesProvider>
      <RootLayoutNav />
    </ServicesProvider>
  )
}
