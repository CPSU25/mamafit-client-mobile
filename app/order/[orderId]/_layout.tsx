import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export default function OrderDetailLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='index' options={{ title: 'Order Detail' }} />
      <Stack.Screen name='rate' options={{ title: 'Rate Order' }} />
    </Stack>
  )
}
