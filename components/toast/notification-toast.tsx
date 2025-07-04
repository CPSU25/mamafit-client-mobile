import { format } from 'date-fns'
import { View } from 'react-native'
import { styles } from '~/lib/constants/constants'
import { Notification } from '~/types/notification.type'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

export default function NotificationToast({ notification }: { notification: Notification }) {
  const { createdAt, notificationContent, notificationTitle } = notification

  return (
    <Card className='mx-4 mt-2' style={[styles.container]}>
      <View className='flex-row items-center gap-2 px-3 py-1'>
        <View className='size-2 rounded-full bg-emerald-500' />
        <Text className='text-xs font-inter-medium'>New notification</Text>
      </View>
      <Separator />
      <View className='flex-row items-center gap-3 p-3'>
        <View className='flex-1'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-sm font-inter-medium'>{notificationTitle}</Text>
            <Text className='text-xs text-muted-foreground ml-auto'>{format(createdAt, 'HH:mm a')}</Text>
          </View>
          <Text className='text-xs text-muted-foreground mr-1' numberOfLines={1}>
            {notificationContent}
          </Text>
        </View>
      </View>
    </Card>
  )
}
