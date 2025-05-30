import Loading from '~/components/loading'
import { Redirect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'

export default function CanvasesScreen() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <SafeAreaView>
      <Text>CanvasesScreen</Text>
    </SafeAreaView>
  )
}
