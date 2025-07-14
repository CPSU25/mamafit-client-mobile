import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export default function OrderLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='review' options={{ title: 'Review Order' }} />
      <Stack.Screen name='[orderStatus]' options={{ title: 'Orders By Status' }} />
    </Stack>
  )
}
