export interface SupabaseClientConfig {
  url: string
  anonKey: string
  storage?: any
  autoRefreshToken?: boolean
  persistSession?: boolean
  detectSessionInUrl?: boolean
}