import React from 'react'
import { StyleSheet, Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native'

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption'

export interface TextProps extends RNTextProps {
  variant?: TextVariant
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: '#666',
  },
})

const getTextVariantStyle = (variant: TextVariant): TextStyle => {
  switch (variant) {
    case 'h1':
      return styles.h1
    case 'h2':
      return styles.h2
    case 'h3':
      return styles.h3
    case 'caption':
      return styles.caption
    case 'body':
    default:
      return styles.body
  }
}

export const Text = ({ variant = 'body', style, ...props }: TextProps) => (
  <RNText style={[getTextVariantStyle(variant), style]} {...props} />
)