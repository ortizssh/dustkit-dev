import React from 'react'
import { StyleSheet, TextInput, type TextInputProps, type TextStyle } from 'react-native'

type InputVariant = 'default' | 'outline'

export interface InputProps extends TextInputProps {
  variant?: InputVariant
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

const getInputVariantStyle = (variant: InputVariant): TextStyle => {
  switch (variant) {
    case 'outline':
      return styles.outline
    case 'default':
    default:
      return styles.default
  }
}

export const Input = ({ variant = 'default', style, ...props }: InputProps) => (
  <TextInput
    style={[styles.input, getInputVariantStyle(variant), style]}
    placeholderTextColor="#999"
    {...props}
  />
)