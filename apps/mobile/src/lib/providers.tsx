/**
 * providers.tsx
 *
 * THIS IS THE ONLY FILE THAT IMPORTS SUPABASE DIRECTLY.
 *
 * Wires up the concrete backend implementations and provides them
 * to the entire app via React context. To swap backends, replace
 * the implementations here — nothing else in the app changes.
 *
 * Also initializes the EventBus and PluginRegistry at startup.
 */

import type { IAuthProvider, IBrewLoyaltyServices, IEventBus } from '@brew-loyalty/types'
import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { eventBus } from './EventBus'
import { pluginRegistry } from './plugins'
import { SupabaseAuthProvider } from './supabase/SupabaseAuthProvider'
import {
  SupabaseEnrollmentRepository,
  SupabaseLoyaltyProgramRepository,
  SupabaseMemberRepository,
  SupabaseOrganizationRepository,
  SupabasePointsRepository,
  SupabaseRedemptionRepository,
} from './supabase/SupabaseLoyaltyRepository'

// ─────────────────────────────────────────────────────────────
// CONTEXT TYPES
// ─────────────────────────────────────────────────────────────

interface AppServices {
  auth: IAuthProvider
  loyalty: IBrewLoyaltyServices
  events: IEventBus
}

// Exported so test utilities can inject mock services directly
export const ServicesContext = createContext<AppServices | null>(null)

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const services = useMemo<AppServices>(
    () => ({
      auth: new SupabaseAuthProvider(),
      loyalty: {
        organizations: new SupabaseOrganizationRepository(),
        programs: new SupabaseLoyaltyProgramRepository(),
        members: new SupabaseMemberRepository(),
        enrollments: new SupabaseEnrollmentRepository(),
        points: new SupabasePointsRepository(),
        redemptions: new SupabaseRedemptionRepository(),
      },
      events: eventBus,
    }),
    []
  )

  // Initialize all registered plugins once services are ready
  useEffect(() => {
    pluginRegistry.initializeAll({
      services: services.loyalty,
      auth: services.auth,
      events: services.events,
    })
  }, [services])

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>
}

// ─────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────

export function useAuth(): IAuthProvider {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useAuth must be used within ServicesProvider')
  return ctx.auth
}

export function useServices(): IBrewLoyaltyServices {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useServices must be used within ServicesProvider')
  return ctx.loyalty
}

export function useEventBus(): IEventBus {
  const ctx = useContext(ServicesContext)
  if (!ctx) throw new Error('useEventBus must be used within ServicesProvider')
  return ctx.events
}
