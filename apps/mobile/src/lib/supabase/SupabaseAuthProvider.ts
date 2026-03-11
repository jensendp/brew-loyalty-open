import type { IAuthProvider, Session, Unsubscribe } from '@brew-loyalty/types'
import { supabase } from './client'

export class SupabaseAuthProvider implements IAuthProvider {
  async signInWithMagicLink(email: string): Promise<void> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })
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
