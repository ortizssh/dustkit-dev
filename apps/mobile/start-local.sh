#!/bin/bash

# Reliable Expo start script that avoids global pnpm issues
# This script uses explicit paths to ensure local dependencies are used

echo "🧹 Cleaning caches..."
rm -rf .expo .metro node_modules/.cache 2>/dev/null || true

echo "📱 Starting Expo with local CLI (avoiding global pnpm issues)..."

# Use explicit Node.js path and local @expo/cli
# This completely bypasses any global pnpm installations
exec ~/.nvm/versions/node/v22.16.0/bin/node ./node_modules/@expo/cli/build/bin/cli start --clear --port 8098 "$@"