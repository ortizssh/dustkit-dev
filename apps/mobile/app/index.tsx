import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, Text } from '@dustkit/ui'
import { supabase } from '../src/supabase'

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Wait a bit for a better UX
      setTimeout(() => {
        if (session) {
          router.replace('/dashboard')
        } else {
          router.replace('/(auth)/signin')
        }
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Error checking auth state:', error)
      router.replace('/(auth)/signin')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.logoContainer}>
          <Text variant="h1" style={styles.title}>Dustkit</Text>
          <Text variant="body" style={styles.subtitle}>
            Universal monorepo para desarrollo móvil
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text variant="body" style={styles.loadingText}>
            Cargando...
          </Text>
        </View>
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
    marginTop: 16,
  },
})