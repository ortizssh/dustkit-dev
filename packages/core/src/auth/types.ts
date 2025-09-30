import type { Session } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  user_id: string
  display_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  location?: string
  phone?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signOut: () => void
}

export interface AuthError {
  message: string
  code?: string
  details?: unknown
}

export interface SignUpData {
  email: string
  password: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  currentPassword?: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileData {
  display_name?: string
  first_name?: string
  last_name?: string
  bio?: string
  website?: string
  location?: string
  phone?: string
  date_of_birth?: string
}

export interface AuthFormState {
  isSubmitting: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface PasswordStrengthResult {
  score: number // 0-4
  feedback: string[]
  isValid: boolean
}

export type AuthEventType =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'

export interface AuthEvent {
  event: AuthEventType
  session: Session | null
  user: User | null
}

export interface AuthHookReturn {
  user: User | null
  profile: Profile | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signUp: (data: SignUpData) => Promise<{ user?: User; error?: AuthError }>
  signIn: (data: SignInData) => Promise<{ user?: User; error?: AuthError }>
  signOut: () => Promise<{ error?: AuthError }>
  resetPassword: (data: ResetPasswordData) => Promise<{ error?: AuthError }>
  updatePassword: (data: UpdatePasswordData) => Promise<{ error?: AuthError }>
  refreshSession: () => Promise<{ session?: Session; error?: AuthError }>
}

export interface ProfileHookReturn {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  updateProfile: (data: UpdateProfileData) => Promise<{
    profile?: Profile
    error?: AuthError
  }>
  refetch: () => Promise<void>
}

export interface SessionHookReturn {
  session: Session | null
  isLoading: boolean
  error: string | null
  refreshSession: () => Promise<{ session?: Session; error?: AuthError }>
}
