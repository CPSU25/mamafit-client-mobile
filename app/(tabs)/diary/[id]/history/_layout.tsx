import { Stack } from 'expo-router'
import React from 'react'

export default function DiaryHistoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'ios_from_right'
      }}
    >
      <Stack.Screen name='index' options={{ title: 'History' }} />
      <Stack.Screen name='[measurementId]' options={{ title: 'History Detail' }} />
    </Stack>
  )
}
