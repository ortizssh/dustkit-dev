module.exports = {
  root: true,
  extends: ['@dustkit/eslint-config/typescript'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  overrides: [
    // Expo/React Native specific configurations
    {
      files: ['app/**/*.tsx', 'src/**/*.tsx'],
      rules: {
        // Allow default exports for Expo Router pages
        'import/no-default-export': 'off',
        // React Native specific rules
        'react-native/no-unused-styles': 'error',
        'react-native/split-platform-components': 'error',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-color-literals': 'warn',
        'react-native/no-raw-text': 'off', // Allow for flexibility with Expo
      },
    },
    // JavaScript configuration files
    {
      files: [
        'babel.config.js',
        'metro.config.js',
        'index.js',
        '.eslintrc.js',
      ],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      },
      rules: {
        'import/no-default-export': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    // TypeScript configuration files
    {
      files: ['app.config.ts'],
      rules: {
        'import/no-default-export': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    // Type definitions
    {
      files: ['expo-env.d.ts', '*.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    // Test files specific to React Native
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        'react-native/react-native': true,
      },
    },
  ],
  ignorePatterns: [
    '.expo',
    'node_modules',
    'dist',
    'build',
    '*.tsbuildinfo',
    'android',
    'ios',
  ],
}