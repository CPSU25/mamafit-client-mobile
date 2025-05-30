import { ActivityIndicator, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PRIMARY_COLOR } from '~/lib/constants'

export default function Loading() {
  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} />
      </View>
    </SafeAreaView>
  )
}
