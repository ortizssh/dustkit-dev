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
    // Integration library should use named exports
    'import/no-default-export': 'error',
    
    // Allow console for debugging database operations
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    
    // Database integration specific rules
    '@typescript-eslint/no-explicit-any': 'warn', // Database types can be complex
    '@typescript-eslint/no-unsafe-assignment': 'off', // Supabase client config can have complex types
    'security/detect-object-injection': 'off', // Database queries may trigger false positives
  },
  overrides: [
    // Platform-specific adapters
    {
      files: ['**/*.expo.ts', '**/*.native.ts'],
      rules: {
        // Platform adapters may need different export patterns
        'import/no-default-export': 'off',
        // These adapters deal with dynamic imports and any types
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/require-await': 'off',
      },
    },
    // Type definition files
    {
      files: ['**/*.types.ts'],
      rules: {
        // Generated database types may have any
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-redundant-type-constituents': 'off',
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
    // Configuration files
    {
      files: [".eslintrc.js"],
      parserOptions: {
        project: null,
      },
    },
  ],
  overrides: [
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.tsbuildinfo',
  ],
}