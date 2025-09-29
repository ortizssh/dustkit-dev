import React from 'react'
import { TextInput, TextInputProps, StyleSheet } from 'react-native'

interface InputProps extends TextInputProps {
  variant?: 'default' | 'outline'
}

export function Input({ variant = 'default', style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, styles[variant], style]}
      placeholderTextColor="#999"
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 8,
  },
  default: {
    backgroundColor: '#f5f5f5',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
})