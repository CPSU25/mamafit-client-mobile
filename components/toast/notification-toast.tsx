import { format } from 'date-fns'
import { View } from 'react-native'
import { styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Notification } from '~/types/notification.type'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

// TODO: add more types of notifications
export default function NotificationToast({ notification }: { notification: Notification }) {
  const { createdAt, notificationContent, notificationTitle } = notification

  return (
    <Card className='mx-4' style={[styles.container]}>
      <View className='flex-row items-center gap-2 px-3 py-1'>
        <View className='size-2 rounded-full bg-amber-500' />
        <Text className='text-xs font-inter-medium'>New notification</Text>
      </View>
      <Separator />
      <View className='flex-row items-center gap-3 p-3'>
        <View className='p-2 rounded-xl bg-amber-100'>{SvgIcon.bank({ size: 24 })}</View>
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
