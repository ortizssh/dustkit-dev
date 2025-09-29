# Dustkit Web Application

A Next.js 14+ web application built with TypeScript, Tailwind CSS, and Supabase authentication, designed for the Dustkit monorepo.

## Features

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for authentication and backend
- **React Query** for data fetching and caching
- **Zustand** for client-side state management
- **Error Boundaries** for robust error handling
- **Monorepo support** with shared packages

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and other environment variables.

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error UI
│   ├── not-found.tsx      # 404 page
│   ├── page.tsx           # Home page
│   └── providers.tsx      # React providers
├── lib/                   # Utility libraries
│   ├── auth-helpers.ts    # Auth utility functions
│   ├── auth-hooks.ts      # Auth React hooks
│   ├── supabase-browser.ts # Supabase browser client
│   └── supabase-server.ts # Supabase server client
├── middleware.ts          # Next.js middleware
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Shared Packages

This web app uses the following shared packages from the monorepo:

- `@dustkit/ui` - Shared UI components
- `@dustkit/core` - Core utilities and hooks
- `@dustkit/api-client` - API client for data fetching
- `@dustkit/supabase` - Supabase integrations

## Authentication

Authentication is handled by Supabase with the following features:

- Email/password authentication
- Session management with SSR support
- Protected routes via middleware
- Automatic redirects for authenticated/unauthenticated users

### Auth Routes

- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/signout` - Sign out endpoint
- `/auth/callback` - OAuth callback handler

## Styling

The app uses Tailwind CSS with a custom configuration that includes:

- Custom color palette
- Extended spacing and typography
- Animation utilities
- Responsive design utilities
- Support for dark mode (ready for implementation)

## State Management

- **React Query** for server state management
- **Zustand** for client-side state
- **React Context** for auth state (via Supabase)

## Error Handling

Comprehensive error handling with:

- React Error Boundaries
- Custom error pages
- Loading states
- 404 handling
- Development-friendly error messages

## Performance Optimizations

- Image optimization with Next.js Image component
- Bundle optimization for monorepo packages
- React Query caching strategies
- Font optimization with `next/font`
- Static generation where possible

## Development

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Optional:

- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations
- `NEXTAUTH_SECRET` - For NextAuth.js (if used)
- `DATABASE_URL` - Direct database access

## Deployment

The app is configured for deployment with:

- Standalone output for containerization
- Proper environment variable handling
- Security headers
- Image optimization

### Recommended Platforms

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Docker** (using standalone output)

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure type safety with TypeScript
5. Test responsive design on multiple devices

## Troubleshooting

### Common Issues

1. **Build errors related to shared packages**
   - Ensure all `@dustkit/*` packages are properly transpiled in `next.config.mjs`

2. **Supabase authentication issues**
   - Check environment variables
   - Verify Supabase project configuration
   - Ensure middleware is properly configured

3. **Styling issues**
   - Check Tailwind configuration includes all package paths
   - Verify PostCSS configuration
   - Clear `.next` cache if needed

### Getting Help

- Check the monorepo documentation in the root README
- Review Supabase documentation for auth issues
- Check Next.js documentation for framework-specific questions