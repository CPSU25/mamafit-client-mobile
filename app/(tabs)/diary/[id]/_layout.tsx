import { Stack } from 'expo-router'

export default function DiaryDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'ios_from_right'
      }}
    >
      <Stack.Screen name='detail' options={{ title: 'Diary detail' }} />
      <Stack.Screen name='history' options={{ title: 'Diary history' }} />
      <Stack.Screen name='setting' options={{ title: 'Diary setting' }} />
    </Stack>
  )
}
