#!/usr/bin/env bash

set -euo pipefail

echo "🧹 Cleaning local Expo caches..."
rm -rf .expo .metro node_modules/.cache 2>/dev/null || true

echo "📱 Starting Expo using the workspace @expo/cli..."

# Explicitly invoke the CLI that lives inside the project to avoid falling
# back to a globally installed version that Metro cannot watch.
exec node ./node_modules/@expo/cli/build/bin/cli start --clear "$@"