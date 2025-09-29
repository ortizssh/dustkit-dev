import { createClient } from '@supabase/supabase-js'

import type { SupabaseClientConfig } from './types'

export const createSupabaseClient = (config: SupabaseClientConfig) => {
  return createClient(config.url, config.anonKey, {
    auth: {
      storage: config.storage,
      autoRefreshToken: config.autoRefreshToken ?? true,
      persistSession: config.persistSession ?? true,
      detectSessionInUrl: config.detectSessionInUrl ?? true,
    },
  })
}