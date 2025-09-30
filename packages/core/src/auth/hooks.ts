import { useCallback, useEffect, useMemo, useState } from 'react'

import { formatAuthError, isNetworkError } from './utils'
import { useAuthStore } from '../store/auth'

import type {
  AuthError,
  AuthHookReturn,
  Profile,
  ProfileHookReturn,
  ResetPasswordData,
  SessionHookReturn,
  SignInData,
  SignUpData,
  UpdatePasswordData,
  UpdateProfileData,
  User,
} from './types'
import type {
  SupabaseClient,
  Session,
  User as SupabaseUser,
} from '@supabase/supabase-js'

interface ProfilesTableDefinition {
  Row: Profile
  Insert: Omit<Profile, 'created_at' | 'updated_at'>
  Update: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>> & {
    updated_at?: string
  }
}

interface DatabaseSchema {
  public: {
    Tables: {
      profiles: ProfilesTableDefinition
    }
  }
}

export type SupabaseAuthClient = SupabaseClient<DatabaseSchema>

const mapUser = (supabaseUser: SupabaseUser | null | undefined): User | null => {
  if (!supabaseUser) {
    return null
  }

  const metadata = supabaseUser.user_metadata as
    | Record<string, unknown>
    | null
    | undefined

  const name = typeof metadata?.name === 'string' ? metadata.name : undefined
  const avatarUrl =
    typeof metadata?.avatar_url === 'string' ? metadata.avatar_url : undefined

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name,
    avatar_url: avatarUrl,
    created_at: supabaseUser.created_at,
    updated_at: supabaseUser.updated_at,
  }
}

const toNullableSession = (session: Session | null | undefined): Session | null =>
  session ?? null

const fetchProfile = async (
  client: SupabaseAuthClient,
  userId: string,
): Promise<Profile | null> => {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

const handleUnknownError = (error: unknown): AuthError => {
  const formatted = formatAuthError(error)
  return formatted
}

const resolveResetRedirect = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const { origin } = window.location
  return `${origin}/auth/callback?type=recovery`
}

const updateAuthStateFromSession = async (
  client: SupabaseAuthClient,
  session: Session | null,
  setUser: (user: User | null) => void,
  setProfile: (profile: Profile | null) => void,
): Promise<void> => {
  const mappedUser = mapUser(session?.user ?? null)
  setUser(mappedUser)

  if (mappedUser) {
    const profile = await fetchProfile(client, mappedUser.id)
    setProfile(profile)
  } else {
    setProfile(null)
  }
}

export const useAuth = (client: SupabaseAuthClient | null): AuthHookReturn => {
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
    signOut: storeSignOut,
  } = useAuthStore()

  useEffect(() => {
    if (!client) {
      return
    }

    let isMounted = true

    const initialize = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: sessionError } = await client.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (!isMounted) {
          return
        }

        const currentSession = data.session ?? null
        setSession(currentSession)
        await updateAuthStateFromSession(client, currentSession, setUser, setProfile)
      } catch (unknownError) {
        if (!isMounted) {
          return
        }

        const formatted = handleUnknownError(unknownError)
        setError(formatted.message)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void initialize()

    const { data: authListener } = client.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (!isMounted) {
          return
        }

        setSession(nextSession)

        try {
          await updateAuthStateFromSession(client, nextSession, setUser, setProfile)
          setError(null)
        } catch (unknownError) {
          const formatted = handleUnknownError(unknownError)
          setError(formatted.message)
        }
      },
    )

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [client, setError, setLoading, setProfile, setSession, setUser])

  const ensureClient = useCallback((): SupabaseAuthClient | null => {
    if (!client) {
      setError('Supabase client is not configured')
      return null
    }

    return client
  }, [client, setError])

  const signUp = useCallback(
    async (data: SignUpData) => {
      const activeClient = ensureClient()
      if (!activeClient) {
        return { error: { message: 'Supabase client is not configured' } }
      }

      setLoading(true)
      setError(null)

      try {
    const { data: authData, error: authError } = await activeClient.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
              first_name: data.firstName,
              last_name: data.lastName,
              display_name: data.displayName,
              name: data.displayName ?? `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
            },
          },
        })

        if (authError) {
          throw authError
        }

        const nextSession = toNullableSession(authData.session)
        setSession(nextSession)

        await updateAuthStateFromSession(activeClient, nextSession, setUser, setProfile)

        return { user: mapUser(authData.user) ?? undefined }
      } catch (unknownError) {
        const formatted = handleUnknownError(unknownError)
        setError(formatted.message)
        return { error: formatted }
      } finally {
        setLoading(false)
      }
    },
    [ensureClient, setError, setLoading, setProfile, setSession, setUser],
  )

  const signIn = useCallback(
    async (credentials: SignInData) => {
      const activeClient = ensureClient()
      if (!activeClient) {
        return { error: { message: 'Supabase client is not configured' } }
      }

      setLoading(true)
      setError(null)

      try {
        const { data: authData, error: authError } =
          await activeClient.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

        if (authError) {
          throw authError
        }

        const nextSession = toNullableSession(authData.session)
        setSession(nextSession)

        await updateAuthStateFromSession(activeClient, nextSession, setUser, setProfile)

        return { user: mapUser(authData.user) ?? undefined }
      } catch (unknownError) {
        const formatted = handleUnknownError(unknownError)
        setError(formatted.message)
        return { error: formatted }
      } finally {
        setLoading(false)
      }
    },
    [ensureClient, setError, setLoading, setProfile, setSession, setUser],
  )

  const signOut = useCallback(async () => {
    const activeClient = ensureClient()
    if (!activeClient) {
      return { error: { message: 'Supabase client is not configured' } }
    }

    setLoading(true)
    setError(null)

    try {
      const { error: signOutError } = await activeClient.auth.signOut()

      if (signOutError) {
        throw signOutError
      }

      storeSignOut()
      return {}
    } catch (unknownError) {
      const formatted = handleUnknownError(unknownError)
      setError(formatted.message)
      return { error: formatted }
    } finally {
      setLoading(false)
    }
  }, [ensureClient, setError, setLoading, storeSignOut])

  const resetPassword = useCallback(
    async (data: ResetPasswordData) => {
      const activeClient = ensureClient()
      if (!activeClient) {
        return { error: { message: 'Supabase client is not configured' } }
      }

      setLoading(true)
      setError(null)

      try {
        const { error: resetError } = await activeClient.auth.resetPasswordForEmail(
          data.email,
          {
            redirectTo: resolveResetRedirect(),
          },
        )

        if (resetError) {
          throw resetError
        }

        return {}
      } catch (unknownError) {
        const formatted = handleUnknownError(unknownError)
        setError(formatted.message)
        return { error: formatted }
      } finally {
        setLoading(false)
      }
    },
    [ensureClient, setError, setLoading],
  )

  const updatePassword = useCallback(
    async (payload: UpdatePasswordData) => {
      const activeClient = ensureClient()
      if (!activeClient) {
        return { error: { message: 'Supabase client is not configured' } }
      }

      setLoading(true)
      setError(null)

      try {
        const { error: updateError } = await activeClient.auth.updateUser({
          password: payload.newPassword,
        })

        if (updateError) {
          throw updateError
        }

        return {}
      } catch (unknownError) {
        const formatted = handleUnknownError(unknownError)
        setError(formatted.message)
        return { error: formatted }
      } finally {
        setLoading(false)
      }
    },
    [ensureClient, setError, setLoading],
  )

  const refreshSession = useCallback(async () => {
    const activeClient = ensureClient()
    if (!activeClient) {
      return { error: { message: 'Supabase client is not configured' } }
    }

    setLoading(true)
    setError(null)

    try {
      const { data: refreshed, error: refreshError } = await activeClient.auth.refreshSession()

      if (refreshError) {
        throw refreshError
      }

      const nextSession = toNullableSession(refreshed.session)
      setSession(nextSession)
      await updateAuthStateFromSession(activeClient, nextSession, setUser, setProfile)

      if (nextSession) {
        return { session: nextSession }
      }

      return {}
    } catch (unknownError) {
      const formatted = handleUnknownError(unknownError)
      setError(formatted.message)
      return { error: formatted }
    } finally {
      setLoading(false)
    }
  }, [ensureClient, setError, setLoading, setSession, setUser, setProfile])

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

export const useSession = (client: SupabaseAuthClient | null): SessionHookReturn => {
  const { session, isLoading, error, setSession, setLoading, setError, setUser, setProfile } =
    useAuthStore()

  const refreshSession = useCallback(async () => {
    if (!client) {
      const fallback: AuthError = { message: 'Supabase client is not configured' }
      setError(fallback.message)
      return { error: fallback }
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: refreshError } = await client.auth.refreshSession()

      if (refreshError) {
        throw refreshError
      }

    const nextSession = toNullableSession(data.session)
    setSession(nextSession)
    await updateAuthStateFromSession(client, nextSession, setUser, setProfile)

    if (nextSession) {
      return { session: nextSession }
    }

    return {}
    } catch (unknownError) {
      const formatted = handleUnknownError(unknownError)
      setError(formatted.message)
      return { error: formatted }
    } finally {
      setLoading(false)
    }
  }, [client, setError, setLoading, setProfile, setSession, setUser])

  return {
    session,
    isLoading,
    error,
    refreshSession,
  }
}

export const useProfile = (client: SupabaseAuthClient | null): ProfileHookReturn => {
  const { user, profile, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!client || !user?.id) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const nextProfile = await fetchProfile(client, user.id)
      setProfile(nextProfile)
    } catch (unknownError) {
      const formatted = handleUnknownError(unknownError)
      setError(formatted.message)
    } finally {
      setIsLoading(false)
    }
  }, [client, setProfile, user?.id])

  const updateProfile = useCallback(
    async (data: UpdateProfileData) => {
      if (!client || !user?.id) {
        const fallback: AuthError = { message: 'User not authenticated' }
        setError(fallback.message)
        return { error: fallback }
      }

      setIsLoading(true)
      setError(null)

      try {
        const { data: updatedProfile, error: updateError } = await client
          .from('profiles')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .select('*')
          .single()

        if (updateError) {
          throw updateError
        }

        setProfile(updatedProfile)
        return { profile: updatedProfile }
      } catch (unknownError) {
        const formatted = handleUnknownError(unknownError)
        setError(formatted.message)
        return { error: formatted }
      } finally {
        setIsLoading(false)
      }
    },
    [client, setProfile, user?.id],
  )

  useEffect(() => {
    if (user?.id && !profile) {
      void refetch()
    }
  }, [profile, refetch, user?.id])

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch,
  }
}

export const useAuthForm = <T extends Record<string, unknown>>(
  initialValues: T,
  validationFn?: (values: T) => Record<string, string>,
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }))

      if (errors[field as string]) {
        setErrors((prev) => {
          const nextErrors = { ...prev }
          delete nextErrors[field as string]
          return nextErrors
        })
      }
    },
    [errors],
  )

  const setTouchedField = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const validate = useCallback(() => {
    if (!validationFn) {
      return true
    }

    const validationErrors = validationFn(values)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [validationFn, values])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const handleSubmit = useCallback(
    async (onSubmit: (formValues: T) => Promise<unknown>) => {
      const isValid = validate()

      const allTouched = Object.fromEntries(
        Object.keys(values).map((key) => [key, true] as const),
      ) as Record<string, boolean>
      setTouched(allTouched)

      if (!isValid) {
        return
      }

      try {
        setIsSubmitting(true)
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [validate, values],
  )

  const isValid = useMemo(() => {
    if (!validationFn) {
      return true
    }

    const validationErrors = validationFn(values)
    return Object.keys(validationErrors).length === 0
  }, [validationFn, values])

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

export const useAuthRetry = () => {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const retry = useCallback(
    async <T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
      setIsRetrying(true)

      for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
          const result = await operation()
          setRetryCount(0)
          setIsRetrying(false)
          return result
        } catch (error) {
          setRetryCount(attempt + 1)

          if (attempt === maxRetries || !isNetworkError(error)) {
            setIsRetrying(false)
            throw error
          }

          const timeout = delay * 2 ** attempt
          await new Promise((resolve) => setTimeout(resolve, timeout))
        }
      }

      setIsRetrying(false)
      throw new Error('Retry attempts exceeded')
    },
    [],
  )

  return {
    retry,
    retryCount,
    isRetrying,
  }
}
