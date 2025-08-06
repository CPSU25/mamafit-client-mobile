import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import NotificationsList from '~/features/notifications/components/notifications-list'
import { useMarkAsRead } from '~/features/notifications/hooks/use-mark-as-read'
import { useAuth } from '~/hooks/use-auth'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
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
    name: 'Promotions',
    description: 'Latest deals and special offers.',
    icon: SvgIcon.promotions({ size: ICON_SIZE.MEDIUM })
  },
  {
    id: 2,
    name: 'Order Updates',
    description: 'Track your order from start to finish.',
    icon: SvgIcon.orderUpdates({ size: ICON_SIZE.MEDIUM })
  },
  {
    id: 3,
    name: 'Payment Status',
    description: "Don't forget to pay your bills on time.",
    icon: SvgIcon.paymentStatus({ size: ICON_SIZE.MEDIUM })
  },
  {
    id: 4,
    name: 'Appointment Reminders',
    description: "Don't forget your appointment.",
    icon: SvgIcon.appointmentReminders({ size: ICON_SIZE.MEDIUM })
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
        <Text className='text-xl font-inter-semibold'>Notifications</Text>
        <View className='flex flex-row items-center gap-6 mr-1.5'>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Feather name='shopping-bag' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')}>
            <Feather name='message-circle' size={24} color={PRIMARY_COLOR.LIGHT} />
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
        <Text className='text-sm font-inter-medium'>Order Updates</Text>
        <TouchableOpacity onPress={() => markAllAsRead()} disabled={isPending}>
          <Text className='text-xs text-muted-foreground'>Read All</Text>
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
      <Feather name='chevron-right' size={20} color='lightgray' />
    </View>
  )
}
