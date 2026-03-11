import type {
  AppEventMap,
  AppEventType,
  EventHandler,
  IEventBus,
  Unsubscribe,
} from '@brew-loyalty/types'

/**
 * Simple in-process pub/sub event bus.
 * Typed against AppEventMap — unknown events are a compile error.
 */
export class EventBus implements IEventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handlers = new Map<AppEventType, Set<EventHandler<any>>>()

  emit<T extends AppEventType>(event: T, payload: AppEventMap[T]): void {
    const set = this.handlers.get(event)
    if (!set) return
    set.forEach((handler) => {
      try {
        handler(payload)
      } catch (err) {
        console.error(`[EventBus] Error in handler for "${event}":`, err)
      }
    })
  }

  on<T extends AppEventType>(event: T, handler: EventHandler<T>): Unsubscribe {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)
    return () => this.handlers.get(event)?.delete(handler)
  }

  once<T extends AppEventType>(event: T, handler: EventHandler<T>): Unsubscribe {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe()
      handler(payload)
    })
    return unsubscribe
  }
}

/** Singleton event bus shared across the app and all plugins. */
export const eventBus = new EventBus()
