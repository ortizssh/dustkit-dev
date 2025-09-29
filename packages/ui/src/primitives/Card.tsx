import React from 'react'
import { View, ViewProps, StyleSheet } from 'react-native'

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated'
}

export function Card({ variant = 'default', style, ...props }: CardProps) {
  return (
    <View
      style={[styles.card, styles[variant], style]}
      {...props}
    />
  )
}

interface CardHeaderProps extends ViewProps {}

export function CardHeader({ style, ...props }: CardHeaderProps) {
  return <View style={[styles.header, style]} {...props} />
}

interface CardContentProps extends ViewProps {}

export function CardContent({ style, ...props }: CardContentProps) {
  return <View style={[styles.content, style]} {...props} />
}

interface CardFooterProps extends ViewProps {}

export function CardFooter({ style, ...props }: CardFooterProps) {
  return <View style={[styles.footer, style]} {...props} />
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  default: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
  },
})