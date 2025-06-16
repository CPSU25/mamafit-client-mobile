import Loading from '~/components/loading'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '~/hooks/use-auth'

export default function DiaryLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' options={{ title: 'Measurement Diary', animation: 'ios_from_right' }} />
      <Stack.Screen name='detail/[id]' options={{ title: 'Measurement Diary Detail', animation: 'ios_from_right' }} />
      <Stack.Screen name='create' options={{ title: 'Measurement Diary Create', animation: 'ios_from_right' }} />
    </Stack>
  )
}
