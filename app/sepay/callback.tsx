import { Redirect, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'

export default function SepayCallback() {
  const { isAuthenticated, isLoading } = useAuth()
  const { code } = useLocalSearchParams()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <SafeView>
      <View>
        <Text>{code}</Text>
      </View>
    </SafeView>
  )
}
