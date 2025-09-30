import { View, Text, Input, Button, Card, CardContent } from '@dustkit/ui'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Alert } from 'react-native'

export default function SignUpScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }

    setLoading(true)
    
    // Simulamos registro
    setTimeout(() => {
      setLoading(false)
      Alert.alert('Éxito', 'Cuenta creada exitosamente', [
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
        <Text variant="h1" style={styles.title}>
          Crear Cuenta
        </Text>
        
        <Text variant="body" style={styles.subtitle}>
          Únete a Dustkit Dev
        </Text>

        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text variant="body" style={styles.label}>
                  Nombre
                </Text>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre completo"
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text variant="body" style={styles.label}>
                  Email
                </Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text variant="body" style={styles.label}>
                  Contraseña
                </Text>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Crea una contraseña"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <Button
                title={loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                onPress={handleSignUp}
                disabled={loading}
                style={styles.button}
              />
            </View>
          </CardContent>
        </Card>

        <View style={styles.footer}>
          <Text variant="body" style={styles.footerText}>
            ¿Ya tienes cuenta?{' '}
          </Text>
          <Text 
            variant="body" 
            style={styles.link}
            onPress={() => router.push('/(auth)/signin')}
          >
            Inicia sesión
          </Text>
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
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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