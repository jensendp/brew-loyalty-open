/**
 * @brew-loyalty/types — plugins.ts
 *
 * The Brew Loyalty plugin contract.
 *
 * A plugin is a self-contained package that extends the app without
 * modifying core code. Plugins can:
 *   - Add tabs to the navigation
 *   - Subscribe to app lifecycle events
 *   - Provide their own services/data sources
 *   - Register notification handlers
 *
 * Example plugin (Events Calendar):
 * ─────────────────────────────────
 *   export const eventsPlugin: BrewLoyaltyPlugin = {
 *     id: 'brew-loyalty-events',
 *     name: 'Events Calendar',
 *     version: '1.0.0',
 *     tabs: [{
 *       key: 'events',
 *       title: 'Events',
 *       icon: '📅',
 *       component: EventsScreen,
 *     }],
 *     async initialize({ services, events }) {
 *       events.on('member.signed_in', ({ userId }) => {
 *         prefetchEvents(userId, services)
 *       })
 *     },
 *   }
 *
 * Registering plugins (in apps/mobile/src/lib/plugins.ts):
 * ──────────────────────────────────────────────────────────
 *   export const registeredPlugins: BrewLoyaltyPlugin[] = [
 *     eventsPlugin,
 *     // add more here
 *   ]
 */

import type React from 'react'
import type { IEventBus } from './events'
import type { IBrewLoyaltyServices } from './repositories'
import type { IAuthProvider } from './auth'

// ─────────────────────────────────────────────────────────────
// PLUGIN TAB
// ─────────────────────────────────────────────────────────────

export interface PluginTab {
  /** Unique key used as the route name. Must be URL-safe. */
  key: string

  /** Label shown in the tab bar. */
  title: string

  /**
   * Icon for the tab bar. Can be an emoji string or a React element.
   * Keep it simple — this is shown at small size.
   */
  icon: string | React.ReactElement

  /** The screen component rendered when this tab is active. */
  component: React.ComponentType

  /** Optional header title. Defaults to `title`. */
  headerTitle?: string
}

// ─────────────────────────────────────────────────────────────
// PLUGIN CONTEXT — injected into initialize()
// ─────────────────────────────────────────────────────────────

export interface PluginContext {
  /** Full access to all loyalty data services. */
  services: IBrewLoyaltyServices

  /** Auth provider — check session, subscribe to auth changes. */
  auth: IAuthProvider

  /** Subscribe to and emit app lifecycle events. */
  events: IEventBus
}

// ─────────────────────────────────────────────────────────────
// PLUGIN INTERFACE — the extension contract
// ─────────────────────────────────────────────────────────────

export interface BrewLoyaltyPlugin {
  /**
   * Globally unique plugin ID. Use reverse-domain notation.
   * Example: 'com.yourcompany.events-calendar'
   */
  id: string

  /** Human-readable plugin name. */
  name: string

  /** Semver version string. */
  version: string

  /** Tabs this plugin contributes to the app navigation. */
  tabs?: PluginTab[]

  /**
   * Called once at app startup after the service layer is ready.
   * Use this to: subscribe to events, prefetch data, register
   * notification handlers, etc.
   */
  initialize?: (context: PluginContext) => Promise<void>
}

// ─────────────────────────────────────────────────────────────
// PLUGIN REGISTRY INTERFACE
// ─────────────────────────────────────────────────────────────

export interface IPluginRegistry {
  /** Register a plugin. Call before app startup. */
  register(plugin: BrewLoyaltyPlugin): void

  /** Get all registered plugins. */
  getAll(): BrewLoyaltyPlugin[]

  /** Get all tabs contributed by all plugins, in registration order. */
  getTabs(): PluginTab[]

  /**
   * Initialize all registered plugins by calling their initialize()
   * methods with the provided context.
   */
  initializeAll(context: PluginContext): Promise<void>
}
