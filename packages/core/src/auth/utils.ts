import type { 
  ValidationResult, 
  PasswordStrengthResult, 
  SignUpData, 
  SignInData, 
  UpdatePasswordData,
  AuthError 
} from './types'

/**
 * Email validation utility
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (!email.trim()) {
    return { isValid: false, error: 'Email cannot be empty' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

/**
 * Password validation utility
 */
export const validatePassword = (password: string, minLength = 8): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters long` }
  }

  return { isValid: true }
}

/**
 * Password strength checker
 */
export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return {
      score: 0,
      feedback: ['Password is required'],
      isValid: false
    }
  }

  let score = 0
  const feedback: string[] = []

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Password should be at least 8 characters long')
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add lowercase letters')
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add uppercase letters')
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Add numbers')
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add special characters')
  }

  // Additional checks for very long passwords
  if (password.length >= 12) {
    score = Math.min(score + 1, 4)
  }

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  if (feedback.length === 0) {
    feedback.push(`Password strength: ${strengthLabels[score]}`)
  }

  return {
    score,
    feedback,
    isValid: score >= 3 // Consider password valid if score is 3 or higher
  }
}

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (
  password: string, 
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' }
  }

  return { isValid: true }
}

/**
 * Name validation utility
 */
export const validateName = (name: string, fieldName = 'Name'): ValidationResult => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} cannot be empty` }
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` }
  }

  // Basic name validation - allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: `${fieldName} contains invalid characters` }
  }

  return { isValid: true }
}

/**
 * Phone number validation utility
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: true } // Phone is optional in most cases
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '')
  
  // Basic phone validation - must be 10-15 digits
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, error: 'Please enter a valid phone number' }
  }

  return { isValid: true }
}

/**
 * URL validation utility
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: true } // URL is optional in most cases
  }

  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' }
  }
}

/**
 * Sign up form validation
 */
export const validateSignUpForm = (data: SignUpData): Record<string, string> => {
  const errors: Record<string, string> = {}

  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!
  }

  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!
  }

  if (data.confirmPassword !== undefined) {
    const confirmPasswordValidation = validateConfirmPassword(data.password, data.confirmPassword)
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.error!
    }
  }

  if (data.firstName) {
    const firstNameValidation = validateName(data.firstName, 'First name')
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error!
    }
  }

  if (data.lastName) {
    const lastNameValidation = validateName(data.lastName, 'Last name')
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.error!
    }
  }

  if (data.displayName) {
    const displayNameValidation = validateName(data.displayName, 'Display name')
    if (!displayNameValidation.isValid) {
      errors.displayName = displayNameValidation.error!
    }
  }

  return errors
}

/**
 * Sign in form validation
 */
export const validateSignInForm = (data: SignInData): Record<string, string> => {
  const errors: Record<string, string> = {}

  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!
  }

  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!
  }

  return errors
}

/**
 * Update password form validation
 */
export const validateUpdatePasswordForm = (data: UpdatePasswordData): Record<string, string> => {
  const errors: Record<string, string> = {}

  const passwordValidation = validatePassword(data.newPassword)
  if (!passwordValidation.isValid) {
    errors.newPassword = passwordValidation.error!
  }

  const confirmPasswordValidation = validateConfirmPassword(data.newPassword, data.confirmPassword)
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error!
  }

  return errors
}

/**
 * Format auth error for display
 */
export const formatAuthError = (error: any): AuthError => {
  if (typeof error === 'string') {
    return { message: error }
  }

  if (error?.message) {
    return {
      message: error.message,
      code: error.code,
      details: error.details
    }
  }

  // Handle common Supabase auth errors
  if (error?.error_description) {
    return { message: error.error_description }
  }

  return { message: 'An unexpected error occurred' }
}

/**
 * Check if error is network related
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false
  
  const errorMessage = error.message?.toLowerCase() || ''
  return errorMessage.includes('network') || 
         errorMessage.includes('fetch') || 
         errorMessage.includes('connection') ||
         error.code === 'NETWORK_ERROR'
}

/**
 * Generate a secure random password
 */
export const generateSecurePassword = (length = 16): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure password contains at least one character from each category
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const specials = '!@#$%^&*'
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += specials[Math.floor(Math.random() * specials.length)]
  
  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Get user display name with fallbacks
 */
export const getUserDisplayName = (user: any, profile?: any): string => {
  if (profile?.display_name) {
    return profile.display_name
  }
  
  if (profile?.first_name && profile?.last_name) {
    return `${profile.first_name} ${profile.last_name}`
  }
  
  if (profile?.first_name) {
    return profile.first_name
  }
  
  if (user?.name) {
    return user.name
  }
  
  if (user?.email) {
    return user.email.split('@')[0]
  }
  
  return 'User'
}

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: any, profile?: any): string => {
  const displayName = getUserDisplayName(user, profile)
  
  if (displayName === 'User') {
    return 'U'
  }
  
  const words = displayName.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  
  return displayName.substring(0, 2).toUpperCase()
}

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Check if session is expired
 */
export const isSessionExpired = (session: any): boolean => {
  if (!session?.expires_at) {
    return true
  }
  
  const expiresAt = new Date(session.expires_at * 1000)
  const now = new Date()
  
  // Add 5 minute buffer before expiry
  return expiresAt.getTime() - now.getTime() < 5 * 60 * 1000
}

/**
 * Calculate session time remaining in seconds
 */
export const getSessionTimeRemaining = (session: any): number => {
  if (!session?.expires_at) {
    return 0
  }
  
  const expiresAt = new Date(session.expires_at * 1000)
  const now = new Date()
  
  return Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000))
}