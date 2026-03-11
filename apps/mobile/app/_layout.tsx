import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { ServicesProvider } from '../src/lib/providers'
import { useSession } from '../src/hooks/useSession'

function RootLayoutNav() {
  const { session, loading } = useSession()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      // Not signed in — send to sign-in screen
      router.replace('/(auth)/sign-in')
    } else if (session && inAuthGroup) {
      // Signed in — send to app
      router.replace('/(app)')
    }
  }, [session, loading, segments])

  return <Slot />
}

export default function RootLayout() {
  return (
    <ServicesProvider>
      <RootLayoutNav />
    </ServicesProvider>
  )
}
