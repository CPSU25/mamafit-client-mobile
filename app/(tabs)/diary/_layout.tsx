import { Stack } from 'expo-router'

export default function DiaryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' options={{ title: 'Measurement Diary', animation: 'ios_from_right' }} />
      <Stack.Screen name='[id]' options={{ title: 'Measurement Diary Detail', animation: 'ios_from_right' }} />
    </Stack>
  )
}
