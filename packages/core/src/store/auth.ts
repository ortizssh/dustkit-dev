import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { AuthState } from '../auth/types'

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      profile: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      signOut: () => set({ 
        user: null, 
        profile: null, 
        session: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      }),
    }),
    {
      name: 'auth-store',
    }
  )
)