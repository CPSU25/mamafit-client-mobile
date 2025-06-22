import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'

export default function PaymentQRCode() {
  // Display QR Code and status of payment

  return (
    <SafeAreaView className='flex-1'>
      <Text>PaymentQRCode</Text>
    </SafeAreaView>
  )
}
