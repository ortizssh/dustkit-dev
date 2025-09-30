const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Ensure Metro can resolve packages from the app and workspace while
// preventing it from crawling the user's global pnpm store. Metro only needs
// to watch the project and workspace roots; the pnpm virtual store lives under
// the workspace node_modules folder, so including the workspace root keeps
// everything reachable without touching user-specific global paths.
config.watchFolders = [monorepoRoot]

config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ],
  disableHierarchicalLookup: true,
  unstable_enablePackageExports: true,
}

module.exports = config
