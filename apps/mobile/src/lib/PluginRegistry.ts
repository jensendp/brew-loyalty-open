import type {
  BrewLoyaltyPlugin,
  IPluginRegistry,
  PluginContext,
  PluginTab,
} from '@brew-loyalty/types'

/**
 * Registry for all installed plugins.
 *
 * Usage:
 *   1. Call pluginRegistry.register(myPlugin) for each plugin.
 *   2. Call pluginRegistry.initializeAll(context) once at app startup.
 *   3. Call pluginRegistry.getTabs() to get navigation tabs.
 *
 * See apps/mobile/src/lib/plugins.ts to register plugins.
 */
export class PluginRegistry implements IPluginRegistry {
  private plugins: BrewLoyaltyPlugin[] = []

  register(plugin: BrewLoyaltyPlugin): void {
    if (this.plugins.find((p) => p.id === plugin.id)) {
      console.warn(`[PluginRegistry] Plugin "${plugin.id}" is already registered. Skipping.`)
      return
    }
    this.plugins.push(plugin)
    console.log(`[PluginRegistry] Registered plugin: ${plugin.name} v${plugin.version}`)
  }

  getAll(): BrewLoyaltyPlugin[] {
    return [...this.plugins]
  }

  getTabs(): PluginTab[] {
    return this.plugins.flatMap((plugin) => plugin.tabs ?? [])
  }

  async initializeAll(context: PluginContext): Promise<void> {
    for (const plugin of this.plugins) {
      if (!plugin.initialize) continue
      try {
        await plugin.initialize(context)
        console.log(`[PluginRegistry] Initialized: ${plugin.name}`)
      } catch (err) {
        console.error(`[PluginRegistry] Failed to initialize plugin "${plugin.id}":`, err)
      }
    }
  }
}

/** Singleton plugin registry. */
export const pluginRegistry = new PluginRegistry()
