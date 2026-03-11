import { PluginRegistry } from '../PluginRegistry'
import type { BrewLoyaltyPlugin, PluginContext } from '@brew-loyalty/types'
import { EventBus } from '../EventBus'
import { createMockServices } from '../testing/mockServices'

function makeContext(): PluginContext {
  const { auth, loyalty, events } = createMockServices()
  return { auth, services: loyalty, events }
}

function makePlugin(overrides: Partial<BrewLoyaltyPlugin> = {}): BrewLoyaltyPlugin {
  return {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    ...overrides,
  }
}

describe('PluginRegistry', () => {
  let registry: PluginRegistry

  beforeEach(() => {
    registry = new PluginRegistry()
  })

  it('registers a plugin', () => {
    registry.register(makePlugin())
    expect(registry.getAll()).toHaveLength(1)
  })

  it('does not register the same plugin ID twice', () => {
    registry.register(makePlugin({ id: 'dupe' }))
    registry.register(makePlugin({ id: 'dupe' }))
    expect(registry.getAll()).toHaveLength(1)
  })

  it('returns tabs from all registered plugins', () => {
    registry.register(makePlugin({
      id: 'plugin-a',
      tabs: [{ key: 'events', title: 'Events', icon: '📅', component: () => null }],
    }))
    registry.register(makePlugin({
      id: 'plugin-b',
      tabs: [{ key: 'news', title: 'News', icon: '📰', component: () => null }],
    }))
    expect(registry.getTabs()).toHaveLength(2)
    expect(registry.getTabs().map((t) => t.key)).toEqual(['events', 'news'])
  })

  it('returns empty tabs when no plugins have tabs', () => {
    registry.register(makePlugin())
    expect(registry.getTabs()).toHaveLength(0)
  })

  it('calls initialize() on all plugins', async () => {
    const init1 = jest.fn().mockResolvedValue(undefined)
    const init2 = jest.fn().mockResolvedValue(undefined)
    registry.register(makePlugin({ id: 'p1', initialize: init1 }))
    registry.register(makePlugin({ id: 'p2', initialize: init2 }))
    await registry.initializeAll(makeContext())
    expect(init1).toHaveBeenCalledTimes(1)
    expect(init2).toHaveBeenCalledTimes(1)
  })

  it('continues initializing if one plugin throws', async () => {
    const bad = jest.fn().mockRejectedValue(new Error('init failed'))
    const good = jest.fn().mockResolvedValue(undefined)
    registry.register(makePlugin({ id: 'bad', initialize: bad }))
    registry.register(makePlugin({ id: 'good', initialize: good }))
    await expect(registry.initializeAll(makeContext())).resolves.not.toThrow()
    expect(good).toHaveBeenCalledTimes(1)
  })

  it('skips initialize() for plugins without it', async () => {
    registry.register(makePlugin({ initialize: undefined }))
    await expect(registry.initializeAll(makeContext())).resolves.not.toThrow()
  })
})
