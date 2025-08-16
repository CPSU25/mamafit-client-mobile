import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export default function WarrantyLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='[orderItemId]' options={{ title: 'Warranty Request Detail' }} />
      <Stack.Screen name='create' options={{ title: 'Create Warranty Request' }} />
      <Stack.Screen name='policy' options={{ title: 'Warranty Policy' }} />
    </Stack>
  )
}
