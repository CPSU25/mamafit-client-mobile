import { useLocalSearchParams } from 'expo-router'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'

export default function ViewOrderDetailScreen() {
  const { orderId } = useLocalSearchParams() as { orderId: string }

  return (
    <SafeView>
      <Text>{orderId}</Text>
    </SafeView>
  )
}
