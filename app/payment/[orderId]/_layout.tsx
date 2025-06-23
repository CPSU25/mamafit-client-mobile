import { Stack } from 'expo-router'

export default function PaymentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen name='index' options={{ title: 'Payment' }} />
      <Stack.Screen name='qr-code' options={{ title: 'Payment QR Code' }} />
    </Stack>
  )
}
