import { Stack } from 'expo-router'

export default function DressLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='index' options={{ title: 'Dress Detail' }} />
      <Stack.Screen name='feedback' options={{ title: 'Dress Feedback' }} />
    </Stack>
  )
}
