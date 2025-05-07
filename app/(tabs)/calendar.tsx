import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'

export default function CalendarScreen() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <SafeAreaView>
        <Text>Please login to continue</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <Text>CalendarScreen</Text>
    </SafeAreaView>
  )
}
