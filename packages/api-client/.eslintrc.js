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
    // Allow React hooks in this package since it provides React Query hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Ensure proper exports for library
    'import/no-default-export': 'error',
    
    // Allow console in development utilities
    'no-console': 'off',
    
    // API client specific rules
    '@typescript-eslint/no-explicit-any': 'warn', // API responses can be complex
    '@typescript-eslint/no-unsafe-argument': 'off', // API data is often dynamic
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
        allowStandaloneDeclarations: true,
      },
    ],
    // Note: prefer-readonly and prefer-nullish-coalescing are in typescript.js config
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
  overrides: [
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