module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      // Enable module resolution for monorepo packages
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.native.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.native.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@dustkit/ui': '../../packages/ui/src',
            '@dustkit/core': '../../packages/core/src',
            '@dustkit/api-client': '../../packages/api-client/src',
            '@dustkit/supabase': '../../packages/integrations/supabase/src',
          },
        },
      ],
    ],
  };
};