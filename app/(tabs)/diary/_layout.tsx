import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export default function DiaryLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' options={{ title: 'Diary', animation: 'ios_from_right' }} />
      <Stack.Screen name='[id]' options={{ title: 'Diary Detail', animation: 'ios_from_right' }} />
      <Stack.Screen name='create' options={{ title: 'Create Diary', animation: 'ios_from_right' }} />
    </Stack>
  )
}
