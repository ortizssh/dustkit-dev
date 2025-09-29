let SecureStore: any

try {
  SecureStore = require('expo-secure-store')
} catch {
  // expo-secure-store not available (web platform)
}

export const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    if (!SecureStore) {
      return localStorage.getItem(key)
    }
    return SecureStore.getItemAsync(key)
  },
  setItem: async (key: string, value: string) => {
    if (!SecureStore) {
      localStorage.setItem(key, value)
      return
    }
    return SecureStore.setItemAsync(key, value)
  },
  removeItem: async (key: string) => {
    if (!SecureStore) {
      localStorage.removeItem(key)
      return
    }
    return SecureStore.deleteItemAsync(key)
  },
}