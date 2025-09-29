let SecureStore: any

try {
  SecureStore = require('expo-secure-store')
} catch {
  // expo-secure-store not available (web platform)
}

// Check if we're in a web environment with localStorage available
const isWebEnvironment = (): boolean => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (SecureStore) {
      return SecureStore.getItemAsync(key)
    }
    
    if (isWebEnvironment()) {
      return window.localStorage.getItem(key)
    }
    
    // Fallback for environments without secure storage
    console.warn('No secure storage available, returning null for key:', key)
    return null
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (SecureStore) {
      return SecureStore.setItemAsync(key, value)
    }
    
    if (isWebEnvironment()) {
      window.localStorage.setItem(key, value)
      return
    }
    
    // Fallback for environments without secure storage
    console.warn('No secure storage available, cannot store key:', key)
  },
  removeItem: async (key: string): Promise<void> => {
    if (SecureStore) {
      return SecureStore.deleteItemAsync(key)
    }
    
    if (isWebEnvironment()) {
      window.localStorage.removeItem(key)
      return
    }
    
    // Fallback for environments without secure storage
    console.warn('No secure storage available, cannot remove key:', key)
  },
}