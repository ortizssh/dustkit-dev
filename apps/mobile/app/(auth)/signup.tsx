import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet } from 'react-native'
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
  Form,
  FormField,
  FormLabel,
  FormError
} from '@dustkit/ui'
import { supabase } from '../../src/supabase'

// Configure WebBrowser for auth session
WebBrowser.maybeCompleteAuthSession()

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
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
        handleGoogleSignUp(authentication.accessToken)
      }
    }
  }, [response])

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!validateEmail(email)) {
      setError('Ingresa un email válido')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (fullName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccessMessage('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.')
        // Clear form
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setFullName('')
      }
    } catch (err) {
      setError('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async (accessToken: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'exp://127.0.0.1:19000/--/(auth)/signup', // Adjust for your setup
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

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '' }
    if (password.length < 6) return { strength: 1, text: 'Muy débil' }
    
    let strength = 1
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const strengthTexts = ['', 'Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte']
    return { strength, text: strengthTexts[strength] }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          Crear Cuenta
        </Text>
        <Text variant="body" style={styles.subtitle}>
          Únete a nosotros y comienza tu experiencia
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

            {successMessage ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            <FormField>
              <FormLabel required>Nombre completo</FormLabel>
              <Input
                value={fullName}
                onChangeText={setFullName}
                placeholder="Tu nombre completo"
                autoCapitalize="words"
                autoComplete="name"
                variant="outline"
                style={styles.input}
              />
              {fullName && fullName.trim().length < 2 && (
                <FormError>El nombre debe tener al menos 2 caracteres</FormError>
              )}
            </FormField>

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
                autoComplete="new-password"
                variant="outline"
                style={styles.input}
              />
              {password && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.passwordStrengthBar}>
                    <View 
                      style={[
                        styles.passwordStrengthFill,
                        { 
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          backgroundColor: passwordStrength.strength < 3 ? '#ef4444' : passwordStrength.strength < 4 ? '#f59e0b' : '#10b981'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.passwordStrengthText}>{passwordStrength.text}</Text>
                </View>
              )}
            </FormField>

            <FormField>
              <FormLabel required>Confirmar contraseña</FormLabel>
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry
                autoComplete="new-password"
                variant="outline"
                style={styles.input}
              />
              {confirmPassword && password !== confirmPassword && (
                <FormError>Las contraseñas no coinciden</FormError>
              )}
            </FormField>

            <Button
              title={loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              onPress={handleSignUp}
              disabled={
                loading || 
                !validateEmail(email) || 
                password.length < 6 || 
                password !== confirmPassword ||
                fullName.trim().length < 2
              }
              style={styles.signUpButton}
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

            <View style={styles.termsContainer}>
              <Text variant="caption" style={styles.termsText}>
                Al crear una cuenta, aceptas nuestros{' '}
                <Link href="#" style={styles.link}>
                  <Text style={styles.termsLink}>Términos de Servicio</Text>
                </Link>
                {' '}y{' '}
                <Link href="#" style={styles.link}>
                  <Text style={styles.termsLink}>Política de Privacidad</Text>
                </Link>
              </Text>
            </View>

            <View style={styles.signInContainer}>
              <Text variant="body" style={styles.linkText}>
                ¿Ya tienes cuenta?{' '}
              </Text>
              <Link href="/(auth)/signin" style={styles.link}>
                <Text style={styles.linkTextBold}>Inicia sesión</Text>
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
  passwordStrengthContainer: {
    marginTop: 8,
  },
  passwordStrengthBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    color: '#6b7280',
  },
  signUpButton: {
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
  termsContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  termsText: {
    textAlign: 'center',
    lineHeight: 18,
    color: '#9ca3af',
  },
  termsLink: {
    color: '#2563eb',
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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
  successContainer: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
  },
  successText: {
    color: '#166534',
    fontSize: 14,
    textAlign: 'center',
  },
})