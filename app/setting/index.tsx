import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function SettingScreen() {
  const router = useRouter()

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
        <Text className='font-inter-semibold text-xl'>Cài Đặt</Text>
      </View>
      <View className='bg-muted h-2' />

      <TouchableOpacity className='flex-row items-center p-4' onPress={() => router.push('/setting/account')}>
        <Feather name='user' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5'>Tài Khoản</Text>
        <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity className='flex-row items-center p-4' onPress={() => router.push('/setting/my-addresses')}>
        <Feather name='map-pin' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium ml-2.5'>Địa Chỉ Của Tôi</Text>
        <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
    </SafeView>
  )
}
