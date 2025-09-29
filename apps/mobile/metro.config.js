const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

// Get the default config for this directory
const config = getDefaultConfig(__dirname)

// Set explicit project root
const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

config.projectRoot = projectRoot

// Configure watch folders - include specific pnpm directories for critical packages
const fs = require('fs')

// Find critical pnpm packages that need to be watched
const findPackagePath = (packageName) => {
  try {
    const pkgPath = require.resolve(`${packageName}/package.json`, {
      paths: [projectRoot, monorepoRoot]
    })
    return path.dirname(pkgPath)
  } catch (e) {
    console.warn(`Could not find ${packageName} path:`, e.message)
    return null
  }
}

const expoRouterPath = findPackagePath('expo-router')
const metroRuntimePath = findPackagePath('@expo/metro-runtime')

// Add critical pnpm directories to watchFolders to enable SHA-1 calculation
const criticalPaths = [
  expoRouterPath,
  metroRuntimePath,
].filter(Boolean)

config.watchFolders = [
  projectRoot,
  monorepoRoot,
  // Add critical package paths specifically to allow SHA-1 calculation
  ...criticalPaths,
]

// Completely override the resolver to prevent ANY global pnpm access
config.resolver = {
  ...config.resolver,
  // Re-enable package exports but with strict controls
  unstable_enablePackageExports: true,
  
  // Force strict nodeModulesPaths - NO global paths
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ],
  
  // Add aliases for monorepo packages
  alias: {
    '@dustkit/ui': path.resolve(monorepoRoot, 'packages/ui/src'),
    '@dustkit/core': path.resolve(monorepoRoot, 'packages/core/src'),
    '@dustkit/api-client': path.resolve(monorepoRoot, 'packages/api-client/src'),
    '@dustkit/supabase': path.resolve(monorepoRoot, 'packages/integrations/supabase/src'),
  },
  
  // Custom resolve request that completely rejects global pnpm paths
  resolveRequest: (context, moduleName, platform) => {
    const request = context.resolveRequest(context, moduleName, platform)
    
    // If resolution resulted in a global pnpm path, reject it completely
    if (request && request.filePath && request.filePath.includes('/Library/pnpm/global/')) {
      console.warn(`🚫 Blocking global pnpm resolution: ${request.filePath}`)
      return { type: 'empty' }
    }
    
    return request
  },
  
  // Selective blockList using single function to handle all cases
  blockList: [
    (filePath) => {
      // Block ALL global pnpm paths
      if (filePath.includes('/Library/pnpm/global/')) {
        return true
      }
      
      // Block specific metro-require paths
      if (filePath.includes('metro-require')) {
        return true
      }
      
      // Block @expo/cli build artifacts
      if (filePath.includes('/@expo/cli/build/')) {
        return true
      }
      
      // Block LoadingView.js that doesn't exist
      if (filePath.endsWith('react-native/Libraries/Utilities/LoadingView.js')) {
        return true
      }
      
      // Check if this is a critical package path that we want to allow
      const isCriticalPath = criticalPaths.some(criticalPath => 
        criticalPath && filePath.startsWith(criticalPath)
      )
      
      // If it's a critical path, don't block it
      if (isCriticalPath) {
        return false
      }
      
      // Block other .pnpm paths
      if (filePath.includes('/.pnpm/')) {
        return true
      }
      
      // Don't block anything else
      return false
    },
  ],
}

// Add transformer configuration to avoid global paths
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    // Prevent minifier from accessing global paths
    mangle: {
      keep_fnames: true,
    },
  },
}

// Force Metro to use only local dependencies
config.resolver.hasteImplModulePath = undefined
config.resolver.providesModuleNodeModules = ['react-native', 'react-native-web']

module.exports = config