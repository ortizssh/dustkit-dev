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
    // Core library should use named exports
    'import/no-default-export': 'error',
    
    // Allow React hooks since this provides state management hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Zustand store patterns
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
  },
  overrides: [
    // Store files can have different patterns
    {
      files: ['src/store/**/*.ts'],
      rules: {
        // Allow state mutations in Zustand stores
        '@typescript-eslint/no-explicit-any': 'off',
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