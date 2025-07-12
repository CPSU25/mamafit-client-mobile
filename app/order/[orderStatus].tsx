import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function OrdersByStatusScreen() {
  const router = useRouter()
  const { orderStatus } = useLocalSearchParams() as { orderStatus: string }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>My Purchases</Text>
      </View>

      <View className='h-2 bg-muted' />

      <View className='p-4'>
        <Text>{orderStatus}</Text>
      </View>
    </SafeView>
  )
}
