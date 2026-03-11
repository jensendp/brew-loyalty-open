const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Watch all files within the monorepo so Metro picks up
// changes to packages/types without restarting.
config.watchFolders = [monorepoRoot]

// Let Metro resolve packages from the monorepo root first,
// then fall back to the app's own node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

module.exports = config
