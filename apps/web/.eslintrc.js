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
    // Next.js App Router specific configurations
    {
      files: ['app/**/*.tsx'],
      rules: {
        // Allow default exports for Next.js page components
        'import/no-default-export': 'off',
        // Next.js app directory conventions
        '@next/next/no-html-link-for-pages': ['error', './app'],
      },
    },
    // Middleware file
    {
      files: ['middleware.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    // Configuration files
    {
      files: ['next.config.mjs', 'tailwind.config.ts', 'postcss.config.js'],
      rules: {
        'import/no-default-export': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    // Global type definitions
    {
      files: ['global.d.ts', 'next-env.d.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  ignorePatterns: [
    '.next',
    'node_modules',
    'dist',
    'build',
    '*.tsbuildinfo',
  ],
}