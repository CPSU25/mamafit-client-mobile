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
      <View className='flex flex-row items-center gap-3 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl'>Cài Đặt</Text>
      </View>
      <View className='bg-muted h-2' />

      <TouchableOpacity className='flex-row items-center px-4 py-3' onPress={() => router.push('/setting/account')}>
        <View className='p-2 bg-primary/10 rounded-full'>
          <Feather name='user' size={18} color={PRIMARY_COLOR.LIGHT} />
        </View>
        <View className='ml-3 flex-1'>
          <Text className='font-inter-medium text-sm'>Tài khoản</Text>
          <Text className='text-xs text-muted-foreground'>Quản lý thông tin tài khoản của bạn</Text>
        </View>
        <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity
        className='flex-row items-center px-4 py-3'
        onPress={() => router.push('/setting/my-addresses')}
      >
        <View className='p-2 bg-primary/10 rounded-full'>
          <Feather name='map-pin' size={18} color={PRIMARY_COLOR.LIGHT} />
        </View>
        <View className='ml-3 flex-1'>
          <Text className='font-inter-medium text-sm'>Địa chỉ của tôi</Text>
          <Text className='text-xs text-muted-foreground'>Quản lý địa chỉ nhận/gửi hàng của bạn</Text>
        </View>
        <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
    </SafeView>
  )
}
