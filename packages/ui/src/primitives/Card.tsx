import React from 'react'
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native'

type CardVariant = 'default' | 'elevated'

export interface CardProps extends ViewProps {
  variant?: CardVariant
}

export type CardHeaderProps = ViewProps
export type CardContentProps = ViewProps
export type CardFooterProps = ViewProps

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

const getCardVariantStyle = (variant: CardVariant): ViewStyle => {
  switch (variant) {
    case 'elevated':
      return styles.elevated
    case 'default':
    default:
      return styles.default
  }
}

export const Card = ({ variant = 'default', style, ...props }: CardProps) => (
  <View style={[styles.card, getCardVariantStyle(variant), style]} {...props} />
)

export const CardHeader = ({ style, ...props }: CardHeaderProps) => (
  <View style={[styles.header, style]} {...props} />
)

export const CardContent = ({ style, ...props }: CardContentProps) => (
  <View style={[styles.content, style]} {...props} />
)

export const CardFooter = ({ style, ...props }: CardFooterProps) => (
  <View style={[styles.footer, style]} {...props} />
)