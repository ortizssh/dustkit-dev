module.exports = {
  root: true,
  // This configuration serves as the base for the entire monorepo
  extends: ['@dustkit/eslint-config/typescript'],
  parserOptions: {
    project: [
      './tsconfig.json',
      './apps/*/tsconfig.json',
      './packages/*/tsconfig.json',
      './packages/integrations/*/tsconfig.json',
      './tooling/*/tsconfig.json',
    ],
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: [
          './tsconfig.json',
          './apps/*/tsconfig.json',
          './packages/*/tsconfig.json',
          './packages/integrations/*/tsconfig.json',
          './tooling/*/tsconfig.json',
        ],
      },
    },
  },
  rules: {
    // Monorepo-specific rules
    'import/no-relative-packages': 'error',
    'import/no-relative-parent-imports': 'off', // Allow for monorepo structure
    
    // Workspace dependency rules
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          '**/*.config.{js,ts,mjs}',
          '**/.eslintrc.js',
          '**/jest.setup.{js,ts}',
        ],
        packageDir: [
          __dirname,
          './apps/web',
          './apps/mobile',
          './packages/api-client',
          './packages/core',
          './packages/ui',
          './packages/integrations/supabase',
          './tooling/eslint-config',
          './tooling/tsconfig',
        ],
      },
    ],
  },
  overrides: [
    // Root configuration files
    {
      files: [
        'turbo.json',
        'pnpm-workspace.yaml',
        '.changeset/**/*.md',
      ],
      rules: {
        // Disable all rules for these files
        'import/no-unresolved': 'off',
      },
    },
    // Husky and git hooks
    {
      files: ['.husky/**/*'],
      rules: {
        'import/no-unresolved': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    // Supabase files
    {
      files: ['supabase/**/*'],
      rules: {
        'import/no-unresolved': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
  ignorePatterns: [
    // Build outputs
    '**/dist',
    '**/build',
    '**/.next',
    '**/.expo',
    '**/android',
    '**/ios',
    
    // Dependencies
    '**/node_modules',
    
    // Cache and temporary files
    '**/*.tsbuildinfo',
    '**/.turbo',
    '**/coverage',
    
    // Environment and config
    '**/.env*',
    
    // Generated files
    '**/database.types.ts',
    
    // Platform specific
    '**/Pods/**',
    '**/*.pbxproj',
    
    // IDE
    '**/.vscode',
    '**/.idea',
    
    // OS
    '**/.DS_Store',
    '**/Thumbs.db',
  ],
}