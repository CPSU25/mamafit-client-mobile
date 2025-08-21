import { ActivityIndicator, View } from 'react-native'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import SafeView from './safe-view'

export default function Loading() {
  return (
    <SafeView>
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} />
      </View>
    </SafeView>
  )
}
