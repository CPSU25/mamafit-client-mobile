import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { ICON_SIZE } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'

export default function NotificationsList() {
  const notifications = []

  if (notifications.length) {
    return (
      <View className='flex-1 px-4'>
        <Text>NotificationsList</Text>
      </View>
    )
  } else {
    return (
      <View className='flex flex-1 items-center px-4 mt-20'>
        {SvgIcon.bell({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
        <Text className='text-muted-foreground text-sm mt-2'>You don&apos;t have any notifications yet.</Text>
      </View>
    )
  }
}
