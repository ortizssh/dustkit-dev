import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: AppState['theme']) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        setTheme: (theme) => set({ theme }),
        isLoading: false,
        setIsLoading: (isLoading) => set({ isLoading }),
        error: null,
        setError: (error) => set({ error }),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({ theme: state.theme }),
      }
    )
  )
)