import { useLocalSearchParams } from 'expo-router'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams() as { id: string }

  return (
    <SafeView>
      <Text>{id}</Text>
    </SafeView>
  )
}
