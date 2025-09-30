import React from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'

import { Text } from './Text'

export type FormProps = ViewProps

export const Form = ({ style, ...props }: FormProps) => (
  <View style={[styles.form, style]} {...props} />
)

export type FormFieldProps = ViewProps

export const FormField = ({ style, ...props }: FormFieldProps) => (
  <View style={[styles.field, style]} {...props} />
)

interface FormLabelProps {
  children: string
  required?: boolean
}

export const FormLabel = ({ children, required = false }: FormLabelProps) => (
  <Text style={styles.label}>
    {children}
    {required && <Text style={styles.required}> *</Text>}
  </Text>
)

interface FormErrorProps {
  children: string
}

export const FormError = ({ children }: FormErrorProps) => (
  <Text style={styles.error}>
    {children}
  </Text>
)

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#ef4444',
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
})