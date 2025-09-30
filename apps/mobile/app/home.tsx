import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function HomeScreen() {
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => router.replace('/(auth)/signin')
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>
            ¡Hola Mundo! 👋
          </Text>
          
          <Text style={styles.subtitle}>
            Bienvenido a Dustkit Dev
          </Text>
          
          <Text style={styles.description}>
            Esta es tu aplicación móvil funcionando perfectamente.
            El proyecto está configurado con:
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Expo Router</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Metro Bundler</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎨</Text>
            <Text style={styles.featureText}>UI Components</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📦</Text>
            <Text style={styles.featureText}>Monorepo</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => Alert.alert('Info', '¡Todo funcionando correctamente!')}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              Probar Funcionalidad
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 20,
    width: '40%',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  actions: {
    gap: 16,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
})