import { Redirect } from 'expo-router'

export default function IndexScreen() {
  // Redirect to signin as the default entry point
  return <Redirect href="/(auth)/signin" />
}