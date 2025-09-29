import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Platform } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { 
  View, 
  Text, 
  Input, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Form,
  FormField,
  FormLabel,
  FormError
} from '@dustkit/ui'
import { supabase } from '../../src/supabase'

// Configure WebBrowser for auth session
WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Create auth request for Google OAuth
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  )

  // Handle OAuth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response
      if (authentication?.accessToken) {
        handleGoogleSignIn(authentication.accessToken)
      }
    }
  }, [response])

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Por favor ingresa email y contraseña')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.replace('/dashboard')
      }
    } catch (err) {
      setError('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async (accessToken: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'exp://127.0.0.1:19000/--/(auth)/signin', // Adjust for your setup
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('Error con la autenticación de Google')
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          Iniciar Sesión
        </Text>
        <Text variant="body" style={styles.subtitle}>
          Ingresa a tu cuenta para continuar
        </Text>
      </View>

      <Card variant="elevated" style={styles.card}>
        <CardContent style={styles.cardContent}>
          <Form style={styles.form}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <FormField>
              <FormLabel required>Email</FormLabel>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                variant="outline"
                style={styles.input}
              />
              {email && !validateEmail(email) && (
                <FormError>Ingresa un email válido</FormError>
              )}
            </FormField>

            <FormField>
              <FormLabel required>Contraseña</FormLabel>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                autoComplete="current-password"
                variant="outline"
                style={styles.input}
              />
              {password && password.length < 6 && (
                <FormError>La contraseña debe tener al menos 6 caracteres</FormError>
              )}
            </FormField>

            <Button
              title={loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              onPress={handleSignIn}
              disabled={loading || !validateEmail(email) || password.length < 6}
              style={styles.signInButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text variant="caption" style={styles.dividerText}>
                O continúa con
              </Text>
              <View style={styles.divider} />
            </View>

            <Button
              title="Continuar con Google"
              variant="outline"
              onPress={() => promptAsync()}
              disabled={!request}
              style={styles.googleButton}
            />

            <View style={styles.linkContainer}>
              <Text variant="body" style={styles.linkText}>
                ¿Olvidaste tu contraseña?{' '}
              </Text>
              <Link href="#" style={styles.link}>
                <Text style={styles.linkTextBold}>Recupérala aquí</Text>
              </Link>
            </View>

            <View style={styles.signupContainer}>
              <Text variant="body" style={styles.linkText}>
                ¿No tienes cuenta?{' '}
              </Text>
              <Link href="/(auth)/signup" style={styles.link}>
                <Text style={styles.linkTextBold}>Regístrate</Text>
              </Link>
            </View>
          </Form>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
  },
  card: {
    marginBottom: 20,
  },
  cardContent: {
    padding: 24,
  },
  form: {
    gap: 20,
  },
  input: {
    fontSize: 16,
    paddingVertical: 16,
  },
  signInButton: {
    marginTop: 8,
    paddingVertical: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#9ca3af',
  },
  googleButton: {
    paddingVertical: 16,
    borderColor: '#e5e7eb',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#6b7280',
  },
  link: {
    // No styles needed, handled by Link component
  },
  linkTextBold: {
    color: '#2563eb',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
})