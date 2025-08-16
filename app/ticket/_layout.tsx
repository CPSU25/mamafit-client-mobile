import { Redirect, Stack } from 'expo-router'
import Loading from '~/components/loading'
import { useAuth } from '~/hooks/use-auth'

export default function TicketLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='create' options={{ title: 'Create Ticket' }} />
      <Stack.Screen name='[ticketId]/detail' options={{ title: 'Ticket Detail' }} />
    </Stack>
  )
}
