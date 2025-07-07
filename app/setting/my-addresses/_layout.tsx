import { Redirect, Stack } from 'expo-router'
import Loading from '~/components/loading'
import { useAuth } from '~/hooks/use-auth'

export default function AddressesLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='index' options={{ title: 'My Addresses' }} />
      <Stack.Screen name='create' options={{ title: 'Create Address' }} />
    </Stack>
  )
}
