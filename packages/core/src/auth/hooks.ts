import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAuthStore } from '../store/auth'
import type { 
  User, 
  Profile, 
  SignUpData, 
  SignInData, 
  ResetPasswordData, 
  UpdatePasswordData, 
  UpdateProfileData,
  AuthError,
  AuthHookReturn,
  ProfileHookReturn,
  SessionHookReturn
} from './types'
import { formatAuthError, isNetworkError } from './utils'

/**
 * Main authentication hook that works with both web and mobile
 * Requires a Supabase client to be passed in
 */
export function useAuth(supabaseClient: any): AuthHookReturn {
  const {
    user,
    profile,
    session,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setProfile,
    setSession,
    setLoading,
    setError,
    signOut: storeSignOut
  } = useAuthStore()

  // Initialize auth state
  useEffect(() => {
    if (!supabaseClient) return

    let mounted = true

    const initializeAuth = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get initial session
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession()
        
        if (sessionError) {
          console.error('Error getting session:', sessionError)
          setError(formatAuthError(sessionError).message)
          return
        }

        if (mounted) {
          setSession(session)
          
          if (session?.user) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name,
              avatar_url: session.user.user_metadata?.avatar_url,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at
            }
            setUser(userData)
            
            // Fetch profile data if user is authenticated
            try {
              const { data: profileData, error: profileError } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single()

              if (profileData && !profileError) {
                setProfile(profileData)
              }
            } catch (profileError) {
              console.warn('Could not fetch profile:', profileError)
              // Don't set error for profile fetch failure as it's not critical
            }
          } else {
            setUser(null)
            setProfile(null)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setError(formatAuthError(error).message)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Set up auth state listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.id)
        
        setSession(session)
        setError(null)
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at
          }
          setUser(userData)

          // Fetch profile data for authenticated user
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            try {
              const { data: profileData, error: profileError } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single()

              if (profileData && !profileError) {
                setProfile(profileData)
              }
            } catch (profileError) {
              console.warn('Could not fetch profile:', profileError)
            }
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabaseClient, setUser, setProfile, setSession, setLoading, setError])

  // Sign up function
  const signUp = useCallback(async (data: SignUpData) => {
    try {
      setLoading(true)
      setError(null)

      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.displayName || data.firstName,
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      })

      if (authError) {
        const formattedError = formatAuthError(authError)
        setError(formattedError.message)
        return { error: formattedError }
      }

      if (authData.user) {
        const userData: User = {
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name,
          avatar_url: authData.user.user_metadata?.avatar_url,
          created_at: authData.user.created_at,
          updated_at: authData.user.updated_at
        }

        // Create profile record if user is confirmed
        if (authData.user.email_confirmed_at) {
          try {
            const profileData = {
              user_id: authData.user.id,
              display_name: data.displayName,
              first_name: data.firstName,
              last_name: data.lastName,
            }

            const { data: newProfile, error: profileError } = await supabaseClient
              .from('profiles')
              .insert(profileData)
              .select()
              .single()

            if (newProfile && !profileError) {
              setProfile(newProfile)
            }
          } catch (profileError) {
            console.warn('Could not create profile:', profileError)
          }
        }

        return { user: userData }
      }

      return {}
    } catch (error) {
      const formattedError = formatAuthError(error)
      setError(formattedError.message)
      return { error: formattedError }
    } finally {
      setLoading(false)
    }
  }, [supabaseClient, setLoading, setError, setProfile])

  // Sign in function
  const signIn = useCallback(async (data: SignInData) => {
    try {
      setLoading(true)
      setError(null)

      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        const formattedError = formatAuthError(authError)
        setError(formattedError.message)
        return { error: formattedError }
      }

      if (authData.user) {
        const userData: User = {
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name,
          avatar_url: authData.user.user_metadata?.avatar_url,
          created_at: authData.user.created_at,
          updated_at: authData.user.updated_at
        }

        return { user: userData }
      }

      return {}
    } catch (error) {
      const formattedError = formatAuthError(error)
      setError(formattedError.message)
      return { error: formattedError }
    } finally {
      setLoading(false)
    }
  }, [supabaseClient, setLoading, setError])

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabaseClient.auth.signOut()
      
      if (error) {
        const formattedError = formatAuthError(error)
        setError(formattedError.message)
        return { error: formattedError }
      }

      // Clear local state
      storeSignOut()
      
      return {}
    } catch (error) {
      const formattedError = formatAuthError(error)
      setError(formattedError.message)
      return { error: formattedError }
    } finally {
      setLoading(false)
    }
  }, [supabaseClient, setLoading, setError, storeSignOut])

  // Reset password function
  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabaseClient.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window?.location?.origin}/auth/callback?type=recovery`,
      })

      if (error) {
        const formattedError = formatAuthError(error)
        setError(formattedError.message)
        return { error: formattedError }
      }

      return {}
    } catch (error) {
      const formattedError = formatAuthError(error)
      setError(formattedError.message)
      return { error: formattedError }
    } finally {
      setLoading(false)
    }
  }, [supabaseClient, setLoading, setError])

  // Update password function
  const updatePassword = useCallback(async (data: UpdatePasswordData) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabaseClient.auth.updateUser({
        password: data.newPassword
      })

      if (error) {
        const formattedError = formatAuthError(error)
        setError(formattedError.message)
        return { error: formattedError }
      }

      return {}
    } catch (error) {
      const formattedError = formatAuthError(error)
      setError(formattedError.message)
      return { error: formattedError }
    } finally {
      setLoading(false)
    }
  }, [supabaseClient, setLoading, setError])

  // Refresh session function
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabaseClient.auth.refreshSession()

      if (error) {
        const formattedError = formatAuthError(error)
        setError(formattedError.message)
        return { error: formattedError }
      }

      return { session: data.session }
    } catch (error) {
      const formattedError = formatAuthError(error)
      setError(formattedError.message)
      return { error: formattedError }
    } finally {
      setLoading(false)
    }
  }, [supabaseClient, setLoading, setError])

  return {
    user,
    profile,
    session,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  }
}

/**
 * Session management hook
 */
export function useSession(supabaseClient: any): SessionHookReturn {
  const { session, isLoading, error, setSession, setLoading, setError } = useAuthStore()

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabaseClient.auth.refreshSession()

      if (error) {
        const formattedError = formatAuthError(error)
        setError(formattedError.message)
        return { error: formattedError }
      }

      setSession(data.session)
      return { session: data.session }
    } catch (error) {
      const formattedError = formatAuthError(error)
      setError(formattedError.message)
      return { error: formattedError }
    } finally {
      setLoading(false)
    }
  }, [supabaseClient, setSession, setLoading, setError])

  return {
    session,
    isLoading,
    error,
    refreshSession,
  }
}

/**
 * Profile management hook
 */
export function useProfile(supabaseClient: any): ProfileHookReturn {
  const { user, profile, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile data
  const refetch = useCallback(async () => {
    if (!user?.id || !supabaseClient) return

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError) {
        console.error('Error fetching profile:', fetchError)
        setError(formatAuthError(fetchError).message)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError(formatAuthError(error).message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, supabaseClient, setProfile])

  // Update profile data
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!user?.id || !supabaseClient) {
      const error = { message: 'User not authenticated' }
      setError(error.message)
      return { error }
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data: updatedProfile, error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError) {
        const formattedError = formatAuthError(updateError)
        setError(formattedError.message)
        return { error: formattedError }
      }

      setProfile(updatedProfile)
      return { profile: updatedProfile }
    } catch (error) {
      const formattedError = formatAuthError(error)
      setError(formattedError.message)
      return { error: formattedError }
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, supabaseClient, setProfile])

  // Auto-fetch profile when user changes
  useEffect(() => {
    if (user?.id && !profile) {
      refetch()
    }
  }, [user?.id, profile, refetch])

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch,
  }
}

/**
 * Hook for handling auth form state
 */
export function useAuthForm<T extends Record<string, any>>(
  initialValues: T,
  validationFn?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }
  }, [errors])

  const setTouchedField = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const validate = useCallback(() => {
    if (!validationFn) return true

    const validationErrors = validationFn(values)
    setErrors(validationErrors)
    
    return Object.keys(validationErrors).length === 0
  }, [values, validationFn])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<any>
  ) => {
    const isValid = validate()
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {})
    setTouched(allTouched)

    if (!isValid) return

    try {
      setIsSubmitting(true)
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate])

  const isValid = useMemo(() => {
    if (!validationFn) return true
    const validationErrors = validationFn(values)
    return Object.keys(validationErrors).length === 0
  }, [values, validationFn])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setTouchedField,
    validate,
    reset,
    handleSubmit,
  }
}

/**
 * Hook for handling network connectivity and retrying failed requests
 */
export function useAuthRetry() {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const retry = useCallback(async (
    operation: () => Promise<any>,
    maxRetries = 3,
    delay = 1000
  ) => {
    setIsRetrying(true)
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const result = await operation()
        setRetryCount(0)
        setIsRetrying(false)
        return result
      } catch (error) {
        setRetryCount(i + 1)
        
        if (i === maxRetries || !isNetworkError(error)) {
          setIsRetrying(false)
          throw error
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }, [])

  return {
    retry,
    retryCount,
    isRetrying,
  }
}