import { Redirect, Stack } from 'expo-router'
import Loading from '~/components/loading'
import { useAuth } from '~/hooks/use-auth'

export default function SettingLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='index' options={{ title: 'Settings' }} />
      <Stack.Screen name='account' options={{ title: 'Account' }} />
      <Stack.Screen name='my-addresses' options={{ title: 'My Addresses' }} />
    </Stack>
  )
}
