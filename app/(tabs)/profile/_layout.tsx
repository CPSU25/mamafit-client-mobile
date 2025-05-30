import { Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'ios_from_right'
      }}
    >
      <Stack.Screen name='index' options={{ title: 'Profile' }} />
      <Stack.Screen name='appointment' options={{ title: 'Appointment' }} />
      <Stack.Screen name='setting' options={{ title: 'Setting' }} />
    </Stack>
  )
}
