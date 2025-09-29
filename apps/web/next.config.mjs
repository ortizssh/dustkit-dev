/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Transpile all @dustkit packages for monorepo compatibility
  transpilePackages: [
    "@dustkit/ui", 
    "@dustkit/core", 
    "@dustkit/api-client", 
    "@dustkit/supabase",
    "@dustkit/integrations"
  ],
  
  experimental: {
    typedRoutes: true,
    // Enable Server Components logging for better debugging
    serverComponentsExternalPackages: [],
  },
  
  // Image optimization for Supabase storage and other external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
    // Enable optimization for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Output configuration for better performance
  output: 'standalone',
  
  // Webpack configuration for monorepo
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // The transpilePackages option above handles monorepo packages automatically
    // No additional webpack aliases needed for @dustkit packages
    
    return config
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig