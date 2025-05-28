import { Stack } from 'expo-router'

export default function CalendarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' options={{ title: 'Calendar', animation: 'ios_from_right' }} />
      <Stack.Screen name='history' options={{ title: 'History', animation: 'ios_from_right' }} />
    </Stack>
  )
}
