import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, MessageCircle, ShoppingBag } from 'lucide-react-native'
import { TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import NotificationsList from '~/features/notifications/components/notifications-list'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { NotificationTypeDB } from '~/types/notification.type'

const getScreenTitle = (notificationType: NotificationTypeDB) => {
  switch (notificationType) {
    case NotificationTypeDB.Voucher:
      return 'Khuyến mãi'
    case NotificationTypeDB.OrderProgress:
      return 'Cập nhật đơn hàng'
    case NotificationTypeDB.Payment:
      return 'Thông tin tài chính'
    case NotificationTypeDB.Appointment:
      return 'Nhắc nhở lịch hẹn'
    default:
      return 'Thông báo'
  }
}

export default function NotificationsByTypeScreen() {
  const router = useRouter()
  const { notificationType } = useLocalSearchParams<{ notificationType: NotificationTypeDB }>()

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/notifications')
    }
  }

  return (
    <SafeView>
      <View className='flex-row items-center gap-2 p-4'>
        <View className='flex-row items-center gap-3 flex-1'>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-medium text-xl'>{getScreenTitle(notificationType)}</Text>
        </View>
        <View className='flex flex-row items-center gap-4 mr-2'>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Icon as={ShoppingBag} size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')}>
            <Icon as={MessageCircle} size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
        </View>
      </View>

      <View className='h-2 bg-muted' />

      <NotificationsList type={notificationType} />
    </SafeView>
  )
}
