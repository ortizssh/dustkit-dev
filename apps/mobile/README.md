# Dustkit Mobile App

React Native mobile application built with Expo SDK 54.

## Development

### Starting the development server

Use these commands to start the development server:

```bash
# RECOMMENDED: Use the local script (bypasses all global pnpm issues)
pnpm run start:local

# Alternative options:
pnpm run dev        # Start Expo development server
pnpm run start      # Same as dev
pnpm run start:clear # Start with cleared cache

# Direct execution (if other methods fail):
npx expo start
~/.nvm/versions/node/v22.16.0/bin/node ./node_modules/@expo/cli/build/bin/cli start --clear
```

**Important**: 
- **Use `pnpm run start:local`** for the most reliable startup (avoids all global pnpm conflicts)
- Avoid using `pnpm exec expo start` as it causes Metro bundler SHA-1 errors with global pnpm installations
- The `start:local` script uses explicit paths to bypass global pnpm entirely

### Platform-specific commands

```bash
pnpm run ios        # Run on iOS simulator
pnpm run android    # Run on Android emulator
pnpm run web        # Run in web browser
```

### Code quality

```bash
pnpm run lint       # Run ESLint
pnpm run type-check # Run TypeScript checker
pnpm run format     # Format code with Prettier
```

### Building

```bash
pnpm run build      # Create production build
pnpm run prebuild   # Generate native code
```

## Troubleshooting

### Metro bundler errors

If you encounter Metro bundler errors related to SHA-1 or global pnpm paths:

1. Use `pnpm run start:local` (recommended - uses selective watchFolders solution)
2. Alternative: Use `npx expo start` instead of `pnpm exec expo start`
3. Clear all caches: `pnpm run clean && npx expo start --clear`
4. If issues persist, check the Metro configuration in `metro.config.js`

### Expected warnings (safe to ignore)

The following warnings are expected and don't affect functionality:

- **LoadingView.js warnings**: React Native 0.81.4 has package.json export issues. Metro falls back to file-based resolution automatically.
- **"Route missing default export" warnings**: These appear during development when Expo Router analyzes files before TypeScript compilation. The routes work correctly.
- **"New Architecture always enabled in Expo Go"**: When using Expo Go, the new architecture is always enabled regardless of config settings.

### Module resolution issues

The Metro configuration is optimized for the monorepo structure and includes:
- **Selective watchFolders**: Critical packages like `expo-router` and `@expo/metro-runtime` are dynamically discovered and added to watchFolders to enable SHA-1 calculation
- **Intelligent blockList**: Single function-based blockList that allows critical packages while blocking problematic global pnpm paths
- Package exports enabled for compatibility with modern packages
- Aliases for `@dustkit/*` packages
- Custom resolver that rejects global pnpm resolutions

### pnpm Symlink Handling

The Metro configuration intelligently handles pnpm symlinks by:
- Automatically discovering critical package paths using `require.resolve()`
- Adding only necessary pnpm directories to `watchFolders`
- Using selective blocking that allows critical packages but blocks problematic paths
- Maintaining performance by not watching the entire `.pnpm` directory structure

## Architecture

This app is part of the Dustkit monorepo and shares packages:
- `@dustkit/ui` - Shared UI components
- `@dustkit/core` - Core utilities and types
- `@dustkit/api-client` - API client
- `@dustkit/supabase` - Supabase integration