import { Redirect, useRouter } from 'expo-router'
import { ChevronRight, MessageCircle, ShoppingBag } from 'lucide-react-native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Icon } from '~/components/ui/icon'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import NotificationsList from '~/features/notifications/components/notifications-list'
import { useMarkAsRead } from '~/features/notifications/hooks/use-mark-as-read'
import { useAuth } from '~/hooks/use-auth'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

interface NotificationFilter {
  id: number
  name: string
  description: string
  icon: React.ReactNode
}

const notificationFilters: NotificationFilter[] = [
  {
    id: 1,
    name: 'Khuyến mãi',
    description: 'Khuyến mãi và ưu đãi mới nhất.',
    icon: SvgIcon.promotions({ size: 28 })
  },
  {
    id: 2,
    name: 'Cập nhật đơn hàng',
    description: 'Theo dõi đơn hàng của bạn từ đầu đến cuối.',
    icon: SvgIcon.orderUpdates({ size: 28 })
  },
  {
    id: 3,
    name: 'Trạng thái thanh toán',
    description: 'Đừng quên thanh toán hóa đơn đúng hạn.',
    icon: SvgIcon.paymentStatus({ size: 28 })
  },
  {
    id: 4,
    name: 'Nhắc nhở lịch hẹn',
    description: 'Đừng quên lịch hẹn của bạn.',
    icon: SvgIcon.appointmentReminders({ size: 28 })
  }
]

export default function NotificationsScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { mutate: markAllAsRead, isPending } = useMarkAsRead()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <SafeView>
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-xl font-inter-medium'>Thông báo</Text>
        <View className='flex flex-row items-center gap-6 mr-1.5'>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Icon as={ShoppingBag} size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')}>
            <Icon as={MessageCircle} size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
        </View>
      </View>

      <View className='bg-muted h-2' />

      {notificationFilters.map((notification, index) => {
        return (
          <React.Fragment key={notification.id}>
            {index !== 0 && <Separator />}
            <TouchableOpacity>
              <NotificationCard notification={notification} />
            </TouchableOpacity>
            {index === notificationFilters.length - 1 && <View className='bg-muted h-2' />}
          </React.Fragment>
        )
      })}

      <View className='flex flex-row justify-between items-center px-4 pt-4'>
        <Text className='text-sm font-inter-medium'>Đơn hàng</Text>
        <TouchableOpacity onPress={() => markAllAsRead()} disabled={isPending}>
          <Text className='text-xs text-muted-foreground'>Đọc tất cả</Text>
        </TouchableOpacity>
      </View>
      <NotificationsList />
    </SafeView>
  )
}

function NotificationCard({ notification }: { notification: NotificationFilter }) {
  return (
    <View className='flex flex-row items-center gap-4 px-4 py-2'>
      <View className='border-2 border-muted rounded-full'>{notification.icon}</View>
      <View className='flex flex-col items-start flex-1'>
        <Text className='text-sm font-inter-medium'>{notification.name}</Text>
        <Text className='text-muted-foreground text-xs'>{notification.description}</Text>
      </View>
      <Icon as={ChevronRight} size={18} color='lightgray' />
    </View>
  )
}
