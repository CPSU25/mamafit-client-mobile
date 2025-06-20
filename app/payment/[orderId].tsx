import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'

export default function PaymentScreen() {
  const { orderId } = useLocalSearchParams() as { orderId: string }

  return (
    <SafeAreaView className='flex-1'>
      <Text>PaymentScreen {orderId}</Text>
    </SafeAreaView>
  )
}
