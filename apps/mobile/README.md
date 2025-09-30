# Dustkit Mobile App

React Native mobile application built with Expo SDK 54.

## Development

### Starting the development server

From the repository root the Expo server can be started with Turbo:

```bash
pnpm --filter @dustkit/mobile dev
```

When you are already inside `apps/mobile` you can use the package scripts directly:

```bash
pnpm run dev        # Start Expo development server
pnpm run start      # Alias of dev
pnpm run start:clear # Clear caches before starting
```

There is also a `start-local.sh` helper that pins the execution to the workspace copy of `@expo/cli` and clears local caches before booting Metro:

```bash
./start-local.sh
```

**Important**:

- Always rely on the workspace-managed CLI (`pnpm run dev` or `./start-local.sh`).
- Avoid running `pnpm exec expo start` or any command that resolves to a globally installed Expo CLI — Metro will try to read files from the global pnpm store which is outside the configured watch folders and triggers SHA-1 errors.
- If you previously installed `expo` globally via pnpm, prefer uninstalling it or ensure your shell resolves the local binary first.

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

If Metro prints `Failed to get the SHA-1 for: .../pnpm/global/.../require.js`, it is loading code from a globally installed Expo CLI that lives in pnpm's global store. Those directories are not watched by Metro, so hashing fails. The fix is to ensure the local CLI is used:

1. Start the server with `pnpm --filter @dustkit/mobile dev` or `./start-local.sh`.
2. Remove any globally installed `expo` binary (e.g. `pnpm remove -g expo`).
3. Clear caches if the error persists: `pnpm run clean && pnpm run start:clear`.
4. Verify the `metro.config.js` file is unchanged and committed.

### Expected warnings (safe to ignore)

The following warnings are expected and don't affect functionality:

- **LoadingView.js warnings**: React Native 0.81.4 has package.json export issues. Metro falls back to file-based resolution automatically.
- **"Route missing default export" warnings**: These appear during development when Expo Router analyzes files before TypeScript compilation. The routes work correctly.
- **"New Architecture always enabled in Expo Go"**: When using Expo Go, the new architecture is always enabled regardless of config settings.

### Metro configuration

`apps/mobile/metro.config.js` extends Expo's default settings and simply adds the workspace root to `watchFolders` plus explicit `nodeModulesPaths`. This keeps Metro focused on the monorepo while avoiding user-specific global directories that previously caused SHA-1 failures.

## Architecture

This app is part of the Dustkit monorepo and shares packages:
- `@dustkit/ui` - Shared UI components
- `@dustkit/core` - Core utilities and types
- `@dustkit/api-client` - API client
- `@dustkit/supabase` - Supabase integration
