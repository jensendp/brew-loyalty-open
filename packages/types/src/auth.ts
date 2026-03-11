/**
 * @brew-loyalty/types — auth.ts
 *
 * Auth provider interface. Implement this to plug in any auth backend
 * (Supabase, Firebase, Auth0, custom JWT, etc.).
 */

export interface Session {
  userId: string
  email: string | null
}

/** Call the returned function to unsubscribe from auth state changes. */
export type Unsubscribe = () => void

export interface IAuthProvider {
  /**
   * Send a magic link to the given email.
   * User clicks the link to complete sign-in.
   */
  signInWithMagicLink(email: string): Promise<void>

  /** Sign the current user out and clear the session. */
  signOut(): Promise<void>

  /** Returns the active session, or null if not signed in. */
  getSession(): Promise<Session | null>

  /**
   * Subscribe to auth state changes.
   * Callback fires immediately with the current session,
   * then again on every sign-in / sign-out event.
   * Returns an unsubscribe function.
   */
  onAuthStateChange(callback: (session: Session | null) => void): Unsubscribe
}
