import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TextStyle,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native'

type ButtonVariant = 'primary' | 'secondary' | 'outline'

export interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: ButtonVariant
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#000',
  },
  secondary: {
    backgroundColor: '#666',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#000',
  },
})

const getButtonVariantStyle = (variant: ButtonVariant): ViewStyle => {
  switch (variant) {
    case 'secondary':
      return styles.secondary
    case 'outline':
      return styles.outline
    case 'primary':
    default:
      return styles.primary
  }
}

const getTextVariantStyle = (variant: ButtonVariant): TextStyle => {
  switch (variant) {
    case 'secondary':
      return styles.secondaryText
    case 'outline':
      return styles.outlineText
    case 'primary':
    default:
      return styles.primaryText
  }
}

export const Button = ({ title, variant = 'primary', style, ...props }: ButtonProps) => (
  <TouchableOpacity style={[styles.button, getButtonVariantStyle(variant), style]} {...props}>
    <Text style={[styles.text, getTextVariantStyle(variant)]}>{title}</Text>
  </TouchableOpacity>
)