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
  rules: {
    // UI library should use named exports
    'import/no-default-export': 'error',
    
    // React component rules
    'react/display-name': 'error',
    'react/jsx-no-useless-fragment': 'error',
    
    // Cross-platform compatibility
    'react-native/no-raw-text': 'off', // Allow text in UI components
    
    // Component prop validation
    '@typescript-eslint/no-explicit-any': 'error', // Strict typing for UI props
  },
  overrides: [
    // Component files
    {
      files: ['src/**/*.tsx'],
      rules: {
        // Ensure all components are properly typed
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react/jsx-props-no-spreading': 'off', // Allow prop spreading for flexibility
      },
    },
    // Platform-specific files
    {
      files: ['**/*.native.tsx', '**/*.web.tsx'],
      rules: {
        // Platform-specific components can have different patterns
        'import/no-default-export': 'off',
      },
    },
    // Configuration files
    {
      files: ['.eslintrc.js'],
      parserOptions: {
        project: null,
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.tsbuildinfo',
  ],
}