import React from 'react'
import { View as RNView, ViewProps as RNViewProps } from 'react-native'

export function View(props: RNViewProps) {
  return <RNView {...props} />
}