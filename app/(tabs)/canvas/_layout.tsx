import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export default function CanvasLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='index' options={{ title: 'Canvas' }} />
      <Stack.Screen name='create' options={{ title: 'Create Canvas' }} />
    </Stack>
  )
}
