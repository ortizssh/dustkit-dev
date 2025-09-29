import { createClient } from './supabase-server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

/**
 * Server-side authentication utilities for Next.js App Router
 */

export interface AuthUser extends User {}

export interface AuthResult {
  user: AuthUser | null
  error: string | null
}

/**
 * Get the current authenticated user on the server side
 * Returns null if no user is authenticated
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Auth error:', error.message)
      return { user: null, error: error.message }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Failed to get current user:', error)
    return { user: null, error: 'Failed to authenticate' }
  }
}

/**
 * Require authentication for a page/route
 * Redirects to signin if user is not authenticated
 * Returns the authenticated user
 */
export async function requireAuth(redirectTo?: string): Promise<AuthUser> {
  const { user, error } = await getCurrentUser()

  if (!user || error) {
    const searchParams = new URLSearchParams()
    if (redirectTo) {
      searchParams.set('redirectTo', redirectTo)
    }
    if (error === 'session_expired') {
      searchParams.set('error', 'session_expired')
    }
    
    const redirectUrl = `/auth/signin${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    redirect(redirectUrl)
  }

  return user
}

/**
 * Require no authentication (for auth pages)
 * Redirects authenticated users to dashboard
 */
export async function requireNoAuth(redirectTo: string = '/dashboard'): Promise<void> {
  const { user } = await getCurrentUser()

  if (user) {
    redirect(redirectTo)
  }
}

/**
 * Check if user is authenticated without redirecting
 * Useful for conditional rendering
 */
export async function isAuthenticated(): Promise<boolean> {
  const { user } = await getCurrentUser()
  return !!user
}

/**
 * Get user session with error handling
 * Returns session info or null if not authenticated
 */
export async function getSession() {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Session error:', error.message)
      return null
    }

    return session
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
}

/**
 * Refresh the current session
 * Useful for long-running operations
 */
export async function refreshSession() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      console.error('Failed to refresh session:', error.message)
      return { session: null, error: error.message }
    }

    return { session: data.session, error: null }
  } catch (error) {
    console.error('Failed to refresh session:', error)
    return { session: null, error: 'Failed to refresh session' }
  }
}

/**
 * Get user profile data
 * Assumes a 'profiles' table exists with user profile information
 */
export async function getUserProfile(userId?: string) {
  try {
    const supabase = await createClient()
    
    // If no userId provided, get current user's profile
    if (!userId) {
      const { user } = await getCurrentUser()
      if (!user) return null
      userId = user.id
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Failed to get user profile:', error.message)
      return null
    }

    return profile
  } catch (error) {
    console.error('Failed to get user profile:', error)
    return null
  }
}

/**
 * Sign out the current user
 * Should be called from a Server Action or Route Handler
 */
export async function signOut() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out error:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Failed to sign out:', error)
    return { success: false, error: 'Failed to sign out' }
  }
}

/**
 * Check if user has specific permissions/roles
 * This is a basic implementation - extend based on your role system
 */
export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const { user } = await getCurrentUser()
    if (!user) return false

    // Basic implementation - extend this based on your role/permission system
    // You might have a user_roles table or roles stored in user metadata
    const userMetadata = user.user_metadata || {}
    const roles = userMetadata.roles || []
    
    // Example permission checks
    switch (permission) {
      case 'admin':
        return roles.includes('admin')
      case 'user':
        return roles.includes('user') || roles.includes('admin')
      default:
        return false
    }
  } catch (error) {
    console.error('Failed to check permissions:', error)
    return false
  }
}

/**
 * Require specific permission for a page/route
 * Redirects to unauthorized page if user doesn't have permission
 */
export async function requirePermission(permission: string, unauthorizedRedirect: string = '/unauthorized') {
  const user = await requireAuth()
  const hasRequiredPermission = await hasPermission(permission)

  if (!hasRequiredPermission) {
    redirect(unauthorizedRedirect)
  }

  return user
}