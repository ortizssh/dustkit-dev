'use client'

import { useState, useEffect } from 'react'
import { createClient } from './supabase-browser'
import type { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

/**
 * Client-side hook for authentication state
 * Use this in client components that need auth state
 */
export function useAuth(): AuthState & {
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
} {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        setError('Failed to get session')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            router.refresh()
            break
          case 'SIGNED_OUT':
            router.refresh()
            break
          case 'TOKEN_REFRESHED':
            // Session was refreshed
            break
          case 'USER_UPDATED':
            // User data was updated
            break
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        setError(error.message)
      } else {
        setSession(data.session)
        setUser(data.session?.user ?? null)
      }
    } catch (err) {
      setError('Failed to refresh session')
    }
  }

  return {
    user,
    session,
    loading,
    error,
    signOut,
    refreshSession,
  }
}

/**
 * Simple hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user, loading } = useAuth()
  
  if (loading) return false
  return !!user
}

/**
 * Hook that redirects to sign in if not authenticated
 * Use this in client components that require authentication
 */
export function useRequireAuth(redirectTo?: string) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      const searchParams = new URLSearchParams()
      if (redirectTo) {
        searchParams.set('redirectTo', redirectTo)
      }
      router.push(`/auth/signin?${searchParams.toString()}`)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}