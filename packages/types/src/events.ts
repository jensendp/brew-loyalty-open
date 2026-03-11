/**
 * @brew-loyalty/types — events.ts
 *
 * Typed application event bus.
 *
 * The EventBus is the decoupling layer between the core app and plugins.
 * Core features emit events; plugins (and other core features) subscribe
 * to them. Neither side needs to know about the other.
 *
 * Example:
 *   // Core emits after a check-in is recorded:
 *   eventBus.emit('points.earned', { enrollmentId, amount: 50 })
 *
 *   // An Events Calendar plugin subscribes:
 *   eventBus.on('member.signed_in', ({ userId }) => loadUpcomingEvents(userId))
 */

// ─────────────────────────────────────────────────────────────
// EVENT MAP — all typed events the app can emit
// ─────────────────────────────────────────────────────────────

export interface AppEventMap {
  /** Fired when a member successfully signs in. */
  'member.signed_in': { userId: string; email: string | null }

  /** Fired when a member signs out. */
  'member.signed_out': { userId: string }

  /** Fired when a member completes onboarding (profile created). */
  'member.onboarded': { userId: string }

  /** Fired after points are credited to an enrollment. */
  'points.earned': { enrollmentId: string; amount: number; reason: string }

  /** Fired after points are debited (redemption or expiry). */
  'points.spent': { enrollmentId: string; amount: number; rewardId?: string }

  /** Fired when a member's tier changes. */
  'tier.changed': {
    enrollmentId: string
    previousTierId: string | null
    newTierId: string
    newTierName: string
  }

  /** Fired when a member redeems a reward. */
  'reward.redeemed': { enrollmentId: string; rewardId: string; rewardName: string }

  /** Fired when a member enrolls in a loyalty program. */
  'member.enrolled': { memberId: string; programId: string; orgId: string }
}

export type AppEventType = keyof AppEventMap
export type AppEventPayload<T extends AppEventType> = AppEventMap[T]
export type EventHandler<T extends AppEventType> = (payload: AppEventPayload<T>) => void
export type Unsubscribe = () => void

// ─────────────────────────────────────────────────────────────
// EVENT BUS INTERFACE
// ─────────────────────────────────────────────────────────────

export interface IEventBus {
  /** Emit an event to all subscribers. */
  emit<T extends AppEventType>(event: T, payload: AppEventPayload<T>): void

  /** Subscribe to an event. Returns an unsubscribe function. */
  on<T extends AppEventType>(event: T, handler: EventHandler<T>): Unsubscribe

  /** Subscribe once — automatically unsubscribes after first firing. */
  once<T extends AppEventType>(event: T, handler: EventHandler<T>): Unsubscribe
}
