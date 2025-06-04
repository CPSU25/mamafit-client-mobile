import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export default function DiaryLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (!isAuthenticated && !isLoading) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' options={{ title: 'Measurement Diary', animation: 'ios_from_right' }} />
      <Stack.Screen name='[id]' options={{ title: 'Measurement Diary Detail', animation: 'ios_from_right' }} />
    </Stack>
  )
}
