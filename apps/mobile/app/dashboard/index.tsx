import { 
  View, 
  Text, 
  Button, 
  Card, 
  CardContent, 
  CardHeader 
} from '@dustkit/ui'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import { Alert, ScrollView, StyleSheet, RefreshControl } from 'react-native'

import { supabase } from '../../src/supabase'

import type { User } from '@supabase/supabase-js'


interface Profile {
  id: string
  updated_at: string | null
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
}

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [signOutLoading, setSignOutLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/(auth)/signin')
      } else if (session) {
        setUser(session.user)
        loadProfile(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.replace('/(auth)/signin')
        return
      }

      setUser(user)
      await loadProfile(user.id)
    } catch (error) {
      console.error('Error loading user data:', error)
      Alert.alert('Error', 'No se pudo cargar la información del usuario')
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
      } else {
        setProfile(profile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const handleSignOut = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setSignOutLoading(true)
            try {
              await supabase.auth.signOut()
              router.replace('/(auth)/signin')
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión')
            } finally {
              setSignOutLoading(false)
            }
          },
        },
      ]
    )
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadUserData()
    setRefreshing(false)
  }

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) {
      return email[0]?.toUpperCase() || 'U'
    }
    return 'U'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <Text variant="body">Cargando...</Text>
      </View>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(profile?.full_name, user.email)}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text variant="h3" style={styles.userName}>
                {profile?.full_name || 'Usuario'}
              </Text>
              <Text variant="body" style={styles.userEmail}>
                {user.email}
              </Text>
            </View>
          </View>
          
          <Button
            title={signOutLoading ? 'Cerrando...' : 'Cerrar Sesión'}
            variant="outline"
            onPress={handleSignOut}
            disabled={signOutLoading}
            style={styles.signOutButton}
          />
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>👋</Text>
            </View>
            <Text variant="caption" style={styles.statLabel}>Bienvenido</Text>
            <Text variant="h3" style={styles.statValue}>
              {profile?.full_name?.split(' ')[0] || 'Usuario'}
            </Text>
          </CardContent>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <View style={[styles.statIcon, { backgroundColor: '#10b981' }]}>
              <Text style={styles.statIconText}>✓</Text>
            </View>
            <Text variant="caption" style={styles.statLabel}>Estado del perfil</Text>
            <Text variant="h3" style={styles.statValue}>
              {profile ? 'Completo' : 'Incompleto'}
            </Text>
          </CardContent>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <CardContent style={styles.statCardContent}>
            <View style={[styles.statIcon, { backgroundColor: '#8b5cf6' }]}>
              <Text style={styles.statIconText}>⚡</Text>
            </View>
            <Text variant="caption" style={styles.statLabel}>Plan</Text>
            <Text variant="h3" style={styles.statValue}>Gratuito</Text>
          </CardContent>
        </Card>
      </View>

      {/* User Information Card */}
      <Card variant="elevated" style={styles.infoCard}>
        <CardHeader>
          <Text variant="h3" style={styles.cardTitle}>
            Información del Usuario
          </Text>
        </CardHeader>
        <CardContent style={styles.infoCardContent}>
          <View style={styles.infoRow}>
            <Text variant="body" style={styles.infoLabel}>Email</Text>
            <Text variant="body" style={styles.infoValue}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" style={styles.infoLabel}>Nombre completo</Text>
            <Text variant="body" style={styles.infoValue}>
              {profile?.full_name || 'No configurado'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" style={styles.infoLabel}>Nombre de usuario</Text>
            <Text variant="body" style={styles.infoValue}>
              {profile?.username || 'No configurado'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" style={styles.infoLabel}>Sitio web</Text>
            <Text variant="body" style={styles.infoValue}>
              {profile?.website || 'No configurado'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" style={styles.infoLabel}>Fecha de registro</Text>
            <Text variant="body" style={styles.infoValue}>
              {formatDate(user.created_at)}
            </Text>
          </View>

          <Button
            title="Editar Perfil"
            variant="outline"
            onPress={() => Alert.alert('Próximamente', 'La función de editar perfil estará disponible pronto')}
            style={styles.editProfileButton}
          />
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card variant="elevated" style={styles.activityCard}>
        <CardHeader>
          <Text variant="h3" style={styles.cardTitle}>
            Actividad Reciente
          </Text>
        </CardHeader>
        <CardContent style={styles.activityCardContent}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📊</Text>
            <Text variant="body" style={styles.emptyStateText}>
              No hay actividad reciente que mostrar
            </Text>
            <Text variant="caption" style={styles.emptyStateSubtext}>
              Tu actividad aparecerá aquí una vez que comiences a usar la aplicación
            </Text>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    color: '#6b7280',
    fontSize: 14,
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 18,
    color: '#ffffff',
  },
  statLabel: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    color: '#111827',
    textAlign: 'center',
    fontSize: 16,
  },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  cardTitle: {
    color: '#111827',
  },
  infoCardContent: {
    padding: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    color: '#6b7280',
    flex: 1,
    marginRight: 16,
  },
  infoValue: {
    color: '#111827',
    flex: 2,
    textAlign: 'right',
  },
  editProfileButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  activityCard: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  activityCardContent: {
    padding: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
})