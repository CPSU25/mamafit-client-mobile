import { useRouter } from 'expo-router'
import { ArrowLeft, ChevronRight, CircleUserRound, MapPin } from 'lucide-react-native'
import { TouchableOpacity, View } from 'react-native'
import { useNotifications } from '~/components/providers/notifications.provider'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useLogout } from '~/features/auth/hooks/use-logout'
import { useAuth } from '~/hooks/use-auth'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function SettingScreen() {
  const router = useRouter()
  const { tokens } = useAuth()
  const { expoPushToken } = useNotifications()

  const {
    logoutMutation: { mutate, isPending }
  } = useLogout()

  const handleLogout = async () => {
    if (!tokens?.refreshToken || !expoPushToken) return

    mutate({ refreshToken: tokens.refreshToken, notificationToken: expoPushToken })
  }

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
          <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl'>Cài đặt</Text>
      </View>
      <View className='bg-muted h-2' />

      <TouchableOpacity className='flex-row items-center px-4 py-3' onPress={() => router.push('/setting/account')}>
        <View className='p-2 bg-primary/10 rounded-full'>
          <Icon as={CircleUserRound} size={18} color={PRIMARY_COLOR.LIGHT} />
        </View>
        <View className='ml-3 flex-1'>
          <Text className='font-inter-medium text-sm'>Tài khoản</Text>
          <Text className='text-xs text-muted-foreground'>Quản lý thông tin tài khoản của bạn</Text>
        </View>
        <Icon as={ChevronRight} size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity
        className='flex-row items-center px-4 py-3'
        onPress={() => router.push('/setting/my-addresses')}
      >
        <View className='p-2 bg-primary/10 rounded-full'>
          <Icon as={MapPin} size={18} color={PRIMARY_COLOR.LIGHT} />
        </View>
        <View className='ml-3 flex-1'>
          <Text className='font-inter-medium text-sm'>Địa chỉ của tôi</Text>
          <Text className='text-xs text-muted-foreground'>Quản lý địa chỉ nhận/gửi hàng của bạn</Text>
        </View>
        <Icon as={ChevronRight} size={20} color='lightgray' className='ml-auto' />
      </TouchableOpacity>

      <View className='flex-1' />

      <View className='px-4'>
        <Text className='text-xs text-muted-foreground text-center mb-2'>MamaFit &copy; 2025</Text>
        <Button variant='outline' onPress={handleLogout} disabled={isPending}>
          <Text className='text-rose-500 font-inter-medium'>{isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</Text>
        </Button>
      </View>
    </SafeView>
  )
}
