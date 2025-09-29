import React from 'react'
import { View, ViewProps, StyleSheet } from 'react-native'
import { Text } from './Text'

interface FormProps extends ViewProps {}

export function Form({ style, ...props }: FormProps) {
  return <View style={[styles.form, style]} {...props} />
}

interface FormFieldProps extends ViewProps {}

export function FormField({ style, ...props }: FormFieldProps) {
  return <View style={[styles.field, style]} {...props} />
}

interface FormLabelProps {
  children: string
  required?: boolean
}

export function FormLabel({ children, required = false }: FormLabelProps) {
  return (
    <Text style={styles.label}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  )
}

interface FormErrorProps {
  children: string
}

export function FormError({ children }: FormErrorProps) {
  return (
    <Text style={styles.error}>
      {children}
    </Text>
  )
}

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