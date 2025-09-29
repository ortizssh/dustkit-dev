import type { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Dustkit Mobile',
  slug: 'dustkit-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.dustkit.mobile',
    infoPlist: {
      CFBundleURLTypes: [
        {
          CFBundleURLName: 'dustkit',
          CFBundleURLSchemes: ['dustkit']
        }
      ]
    }
  },
  android: {
    package: 'com.dustkit.mobile',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'dustkit'
          }
        ],
        category: ['BROWSABLE', 'DEFAULT']
      }
    ]
  },
  web: {
    bundler: 'metro'
  },
  plugins: [
    'expo-router',
    [
      'expo-secure-store',
      {
        faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID for secure authentication.'
      }
    ]
  ],
  scheme: 'dustkit',
  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID
    },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    environment: process.env.NODE_ENV || 'development'
  },
  experiments: {
    typedRoutes: true
  }
})