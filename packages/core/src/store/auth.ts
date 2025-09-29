import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthState {
  user: User | null
  session: any | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setSession: (session: any | null) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),
      signOut: () => set({ user: null, session: null, isAuthenticated: false }),
    })
  )
)