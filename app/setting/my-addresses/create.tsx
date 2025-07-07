import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function CreateAddressScreen() {
  const router = useRouter()

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/setting')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>New Address</Text>
      </View>

      <View className='bg-muted h-2' />

      <View className='p-4'>
        <Text>Create Address</Text>
      </View>
    </SafeView>
  )
}
