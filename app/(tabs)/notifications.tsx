import { Feather } from '@expo/vector-icons'
import { Redirect, useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import NotificationsList from '~/features/notifications/notifications-list'
import { useAuth } from '~/hooks/use-auth'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

interface Notification {
  id: number
  name: string
  description: string
  icon: React.ReactNode
}

const notifications: Notification[] = [
  {
    id: 1,
    name: 'Promotions',
    description: 'Latest deals and special offers.',
    icon: SvgIcon.promotions({ size: ICON_SIZE.LARGE })
  },
  {
    id: 2,
    name: 'Order Updates',
    description: 'Track your order from start to finish.',
    icon: SvgIcon.orderUpdates({ size: ICON_SIZE.LARGE })
  },
  {
    id: 3,
    name: 'Payment Status',
    description: "Don't forget to pay your bills on time.",
    icon: SvgIcon.paymentStatus({ size: ICON_SIZE.LARGE })
  },
  {
    id: 4,
    name: 'Appointment Reminders',
    description: "Don't forget your appointment.",
    icon: SvgIcon.appointmentReminders({ size: ICON_SIZE.LARGE })
  }
]

export default function NotificationsScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <SafeAreaView className='flex-1'>
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
      {notifications.map((notification, index) => {
        return (
          <React.Fragment key={notification.id}>
            {index !== 0 && <Separator />}
            <TouchableOpacity>
              <NotificationCard notification={notification} />
            </TouchableOpacity>
            {index === notifications.length - 1 && <View className='bg-muted h-2' />}
          </React.Fragment>
        )
      })}
      <View className='flex flex-row justify-between items-center p-4'>
        <Text className='text-sm font-inter-medium'>Order Updates</Text>
        <TouchableOpacity>
          <Text className='text-xs text-muted-foreground'>Read All</Text>
        </TouchableOpacity>
      </View>
      <NotificationsList />
    </SafeAreaView>
  )
}

function NotificationCard({ notification }: { notification: Notification }) {
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
