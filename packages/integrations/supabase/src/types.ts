export interface StorageAdapter {
  getItem(key: string): string | null | Promise<string | null>
  setItem(key: string, value: string): void | Promise<void>
  removeItem(key: string): void | Promise<void>
}

export interface SupabaseClientConfig {
  url: string
  anonKey: string
  storage?: StorageAdapter
  autoRefreshToken?: boolean
  persistSession?: boolean
  detectSessionInUrl?: boolean
}