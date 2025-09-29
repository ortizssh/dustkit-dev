// Export all auth types
export type {
  User,
  Profile,
  AuthState,
  AuthError,
  SignUpData,
  SignInData,
  ResetPasswordData,
  UpdatePasswordData,
  UpdateProfileData,
  AuthFormState,
  ValidationResult,
  PasswordStrengthResult,
  AuthEventType,
  AuthEvent,
  AuthHookReturn,
  ProfileHookReturn,
  SessionHookReturn,
} from './types'

// Export all auth hooks
export {
  useAuth,
  useSession,
  useProfile,
  useAuthForm,
  useAuthRetry,
} from './hooks'

// Export all auth utilities
export {
  validateEmail,
  validatePassword,
  checkPasswordStrength,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateUrl,
  validateSignUpForm,
  validateSignInForm,
  validateUpdatePasswordForm,
  formatAuthError,
  isNetworkError,
  generateSecurePassword,
  getUserDisplayName,
  getUserInitials,
  sanitizeInput,
  isSessionExpired,
  getSessionTimeRemaining,
} from './utils'