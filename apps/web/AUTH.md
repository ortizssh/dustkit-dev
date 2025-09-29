# Authentication System Documentation

This document explains the authentication system implemented for the Next.js application using Supabase Auth.

## Overview

The authentication system provides:
- Route protection with automatic redirects
- Server-side authentication utilities
- Client-side authentication hooks
- Session management and refresh
- Error handling with user-friendly messages

## Files Created/Modified

### Core Files
- `/middleware.ts` - Main middleware for route protection
- `/lib/auth-helpers.ts` - Server-side auth utilities
- `/lib/auth-hooks.ts` - Client-side auth hooks
- `/app/auth/auth-code-error/page.tsx` - Error page for auth failures
- `/app/auth/signout/route.ts` - Sign out route handler

### Updated Files
- `/app/dashboard/page.tsx` - Uses new auth helpers
- `/app/dashboard/dashboard-client.tsx` - Uses new auth hooks
- `/app/auth/callback/route.ts` - Enhanced error handling
- `/app/auth/signin/page.tsx` - Handles redirects and errors

## Usage Examples

### Server-Side Authentication

#### Protecting a Page (Server Component)
```tsx
// app/protected-page/page.tsx
import { requireAuth, getUserProfile } from '@/lib/auth-helpers'

export default async function ProtectedPage() {
  // This will redirect to /auth/signin if not authenticated
  const user = await requireAuth('/protected-page')
  
  // Get user profile data
  const profile = await getUserProfile(user.id)
  
  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  )
}
```

#### Checking Authentication Without Redirecting
```tsx
// app/conditional-page/page.tsx
import { getCurrentUser } from '@/lib/auth-helpers'

export default async function ConditionalPage() {
  const { user, error } = await getCurrentUser()
  
  return (
    <div>
      {user ? (
        <p>Welcome back, {user.email}!</p>
      ) : (
        <p>Please sign in to access all features.</p>
      )}
    </div>
  )
}
```

#### Requiring Specific Permissions
```tsx
// app/admin/page.tsx
import { requirePermission } from '@/lib/auth-helpers'

export default async function AdminPage() {
  // This will redirect if user doesn't have admin permission
  const user = await requirePermission('admin', '/unauthorized')
  
  return <div>Admin Dashboard</div>
}
```

### Client-Side Authentication

#### Using Auth State in Client Components
```tsx
// components/user-menu.tsx
'use client'
import { useAuth } from '@/lib/auth-hooks'

export default function UserMenu() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (!user) {
    return <a href="/auth/signin">Sign In</a>
  }
  
  return (
    <div>
      <span>Welcome, {user.email}</span>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

#### Requiring Authentication in Client Components
```tsx
// components/protected-component.tsx
'use client'
import { useRequireAuth } from '@/lib/auth-hooks'

export default function ProtectedComponent() {
  const { user, loading } = useRequireAuth('/protected-component')
  
  if (loading) return <div>Loading...</div>
  
  // This component will only render if user is authenticated
  // Otherwise, user is redirected to sign in
  return <div>Protected content for {user?.email}</div>
}
```

## Middleware Configuration

The middleware automatically:
- Protects routes listed in `protectedRoutes` array
- Redirects unauthenticated users to `/auth/signin`
- Redirects authenticated users away from auth pages
- Handles session refresh and validation
- Preserves the intended destination with `redirectTo` parameter

### Adding New Protected Routes
Edit `/middleware.ts` and add routes to the `protectedRoutes` array:

```typescript
const protectedRoutes = [
  '/dashboard', 
  '/profile', 
  '/settings',
  '/admin'  // Add new protected routes here
]
```

## Error Handling

### Authentication Errors
- Session expired: Redirects to signin with error message
- Invalid auth codes: Shows detailed error page
- Missing codes: Handles malformed auth links
- Unexpected errors: Graceful fallback with user guidance

### Error Page Types
The auth error page handles different error types:
- `session_expired` - Session has expired
- `missing_code` - Auth link missing code parameter
- `unexpected_error` - Server or network issues
- `default` - Generic auth failure

## Server Actions and Route Handlers

### Sign Out
Use the POST endpoint for programmatic sign out:

```typescript
// Server action or API route
const response = await fetch('/auth/signout', { method: 'POST' })
```

Or use the auth helpers:
```typescript
import { signOut } from '@/lib/auth-helpers'

const { success, error } = await signOut()
```

## Auth Flow

### Sign In Flow
1. User visits protected route
2. Middleware checks authentication
3. If not authenticated, redirects to `/auth/signin?redirectTo=/protected-route`
4. User signs in successfully
5. Redirected back to original route

### OAuth Flow (Google)
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. Google redirects to `/auth/callback?code=...&next=/dashboard`
4. Callback exchanges code for session
5. User redirected to dashboard or original destination

### Sign Out Flow
1. User clicks sign out
2. Session cleared from Supabase
3. Cookies cleared
4. Redirected to home page

## Security Features

- Automatic session refresh
- Secure cookie handling
- CSRF protection through Supabase
- Route protection at middleware level
- Error handling that doesn't leak sensitive info
- Proper redirect handling to prevent open redirects

## Environment Variables Required

Ensure these are set in your environment:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=your_site_url  # For auth redirects
```

## Testing

To test the authentication system:

1. **Route Protection**: Try accessing `/dashboard` without being signed in
2. **Redirects**: Sign in and verify you're redirected to the intended page
3. **Session Expiry**: Clear cookies and try accessing protected routes
4. **OAuth Flow**: Test Google sign in integration
5. **Error Handling**: Try invalid auth links and expired sessions

## Troubleshooting

### Common Issues

1. **Infinite redirect loops**: Check middleware matcher patterns
2. **Session not persisting**: Verify cookie settings and domain
3. **CORS issues**: Ensure Supabase URL/CORS settings are correct
4. **Middleware not running**: Check `config.matcher` patterns

### Debug Information

The auth system logs errors to the console. Check browser dev tools and server logs for authentication errors.