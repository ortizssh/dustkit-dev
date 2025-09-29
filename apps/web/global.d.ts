/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Global type declarations for the web application

// Environment variables for Next.js
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly NEXT_PUBLIC_SUPABASE_URL: string
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    readonly SUPABASE_SERVICE_ROLE_KEY?: string
    readonly NEXT_PUBLIC_SITE_URL?: string
    readonly NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string
    readonly NEXT_PUBLIC_VERCEL_URL?: string
    readonly DATABASE_URL?: string
  }
}

// Extend Window interface for any global variables
declare interface Window {
  // Add any global window properties here
}

// Module declarations for static assets
declare module '*.svg' {
  import React from 'react'
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>
  export default SVG
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.ico' {
  const content: string
  export default content
}

// CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// JSON files
declare module '*.json' {
  const value: any
  export default value
}

// Supabase types
declare module '@dustkit/supabase' {
  export * from '../../../packages/integrations/supabase/src'
}

// Package path declarations
declare module '@dustkit/core' {
  export * from '../../packages/core/src'
}

declare module '@dustkit/ui' {
  export * from '../../packages/ui/src'
}

declare module '@dustkit/api-client' {
  export * from '../../packages/api-client/src'
}