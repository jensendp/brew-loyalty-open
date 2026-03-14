import type { IAuthProvider, Session, Unsubscribe } from '@brew-loyalty/types'
import * as Linking from 'expo-linking'
import { supabase } from './client'

export class SupabaseAuthProvider implements IAuthProvider {
  async signInWithMagicLink(email: string): Promise<void> {
    // createURL('/') returns the correct deep link for the current environment:
    // - Expo Go dev: exp://127.0.0.1:8081/
    // - Dev/prod build: brewloyalty://
    const redirectTo = Linking.createURL('/')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    })
    if (error) throw error
  }

  async handleDeepLink(url: string): Promise<void> {
    // Implicit flow: Supabase puts tokens in the URL hash fragment.
    // e.g. brewloyalty://#access_token=xxx&refresh_token=xxx&type=magiclink
    // We parse them out and call setSession, which stores them in
    // AsyncStorage and fires onAuthStateChange to update routing state.
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      const params = new URLSearchParams(url.slice(hashIndex + 1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (error) throw error
        return
      }
    }
    // Fallback: try PKCE exchange if no hash tokens found
    const { error } = await supabase.auth.exchangeCodeForSession(url)
    if (error) throw error
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    if (!data.session) return null
    return {
      userId: data.session.user.id,
      email: data.session.user.email ?? null,
    }
  }

  onAuthStateChange(callback: (session: Session | null) => void): Unsubscribe {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        callback(null)
        return
      }
      callback({
        userId: session.user.id,
        email: session.user.email ?? null,
      })
    })
    return () => data.subscription.unsubscribe()
  }
}
