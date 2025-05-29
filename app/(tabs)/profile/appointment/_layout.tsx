import { Stack } from 'expo-router'

export default function AppointmentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='index' options={{ title: 'Appointment' }} />
      <Stack.Screen name='[id]' options={{ title: 'Appointment Detail' }} />
      <Stack.Screen name='history' options={{ title: 'Appointment History' }} />
    </Stack>
  )
}
