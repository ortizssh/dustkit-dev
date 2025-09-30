import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }

    setLoading(true)
    
    // Simulamos autenticación
    setTimeout(() => {
      setLoading(false)
      Alert.alert('Éxito', 'Iniciando sesión...', [
        {
          text: 'OK',
          onPress: () => router.replace('/home')
        }
      ])
    }, 1000)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          Dustkit Dev
        </Text>
        
        <Text style={styles.subtitle}>
          Inicia sesión en tu cuenta
        </Text>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  Contraseña
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Tu contraseña"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes cuenta?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.link}>
              Regístrate aquí
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 32,
  },
  card: {
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 24,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  link: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
})