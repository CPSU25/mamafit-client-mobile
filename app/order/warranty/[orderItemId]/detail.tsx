import { useLocalSearchParams } from 'expo-router'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'

export default function ViewWarrantyDetailScreen() {
  const { orderItemId } = useLocalSearchParams<{ orderItemId: string }>()

  return (
    <SafeView>
      <Text>To be implemented</Text>
      <Text>{orderItemId}</Text>
    </SafeView>
  )
}
