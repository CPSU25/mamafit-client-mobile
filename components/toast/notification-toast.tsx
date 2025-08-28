import { format } from 'date-fns'
import { View } from 'react-native'
import { styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Notification, NotificationTypeDB } from '~/types/notification.type'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

export default function NotificationToast({ notification }: { notification: Notification<NotificationTypeDB> }) {
  const { createdAt, notificationContent, notificationTitle, type } = notification

  if (type === NotificationTypeDB.Payment) {
    return (
      <Card className='mx-2' style={[styles.container]}>
        <View className='flex-row items-center gap-2 px-3 py-1'>
          <View className='size-2 rounded-full bg-amber-500' />
          <Text className='text-xs font-inter-medium'>Thông tin tài chính</Text>
        </View>
        <Separator />
        <View className='flex-row items-center gap-3 p-3'>
          <View className='p-2 rounded-xl bg-amber-50'>{SvgIcon.bankSolid({ color: 'AMBER', size: 24 })}</View>
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-sm font-inter-medium flex-1' numberOfLines={1}>
                {notificationTitle}
              </Text>
              <Text className='text-xs text-muted-foreground ml-auto'>{format(createdAt, 'hh:mm a')}</Text>
            </View>
            <Text className='text-xs text-muted-foreground mr-1 flex-1' numberOfLines={1}>
              {notificationContent}
            </Text>
          </View>
        </View>
      </Card>
    )
  }

  if (type === NotificationTypeDB.OrderProgress) {
    return (
      <Card className='mx-2' style={[styles.container]}>
        <View className='flex-row items-center gap-2 px-3 py-1'>
          <View className='size-2 rounded-full bg-emerald-500' />
          <Text className='text-xs font-inter-medium'>Cập nhật đơn hàng</Text>
        </View>
        <Separator />
        <View className='flex-row items-center gap-3 p-3'>
          <View className='p-2 rounded-xl bg-emerald-50'>{SvgIcon.box({ color: 'EMERALD', size: 24 })}</View>
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-sm font-inter-medium flex-1' numberOfLines={1}>
                {notificationTitle}
              </Text>
              <Text className='text-xs text-muted-foreground ml-auto'>{format(createdAt, 'hh:mm a')}</Text>
            </View>
            <Text className='text-xs text-muted-foreground mr-1 flex-1' numberOfLines={1}>
              {notificationContent}
            </Text>
          </View>
        </View>
      </Card>
    )
  }

  if (type === NotificationTypeDB.Appointment) {
    return (
      <Card className='mx-2' style={[styles.container]}>
        <View className='flex-row items-center gap-2 px-3 py-1'>
          <View className='size-2 rounded-full bg-blue-500' />
          <Text className='text-xs font-inter-medium'>Lịch hẹn</Text>
        </View>
        <Separator />
        <View className='flex-row items-center gap-3 p-3'>
          <View className='p-2 rounded-xl bg-blue-50'>{SvgIcon.calendar2Solid({ color: 'BLUE', size: 24 })}</View>
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-sm font-inter-medium flex-1' numberOfLines={1}>
                {notificationTitle}
              </Text>
              <Text className='text-xs text-muted-foreground ml-auto'>{format(createdAt, 'hh:mm a')}</Text>
            </View>
            <Text className='text-xs text-muted-foreground mr-1 flex-1' numberOfLines={1}>
              {notificationContent}
            </Text>
          </View>
        </View>
      </Card>
    )
  }

  if (type === NotificationTypeDB.Voucher) {
    return (
      <Card className='mx-2' style={[styles.container]}>
        <View className='flex-row items-center gap-2 px-3 py-1'>
          <View className='size-2 rounded-full bg-orange-500' />
          <Text className='text-xs font-inter-medium'>Thông báo khuyến mãi</Text>
        </View>
        <Separator />
        <View className='flex-row items-center gap-3 p-3'>
          <View className='p-2 rounded-xl bg-orange-50'>
            {SvgIcon.ticketDiscountSolid({ color: 'ORANGE', size: 24 })}
          </View>
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-sm font-inter-medium flex-1' numberOfLines={1}>
                {notificationTitle}
              </Text>
              <Text className='text-xs text-muted-foreground ml-auto'>{format(createdAt, 'hh:mm a')}</Text>
            </View>
            <Text className='text-xs text-muted-foreground mr-1 flex-1' numberOfLines={1}>
              {notificationContent}
            </Text>
          </View>
        </View>
      </Card>
    )
  }

  if (type === NotificationTypeDB.Measurement) {
    return (
      <Card className='mx-2' style={[styles.container]}>
        <View className='flex-row items-center gap-2 px-3 py-1'>
          <View className='size-2 rounded-full bg-indigo-500' />
          <Text className='text-xs font-inter-medium'>Nhật ký mang thai</Text>
        </View>
        <Separator />
        <View className='flex-row items-center gap-3 p-3'>
          <View className='p-2 rounded-xl bg-indigo-50'>{SvgIcon.rulerSolid({ color: 'INDIGO', size: 24 })}</View>
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-sm font-inter-medium flex-1' numberOfLines={1}>
                {notificationTitle}
              </Text>
              <Text className='text-xs text-muted-foreground ml-auto'>{format(createdAt, 'hh:mm a')}</Text>
            </View>
            <Text className='text-xs text-muted-foreground mr-1 flex-1' numberOfLines={1}>
              {notificationContent}
            </Text>
          </View>
        </View>
      </Card>
    )
  }

  if (type === NotificationTypeDB.Warranty) {
    return (
      <Card className='mx-2' style={[styles.container]}>
        <View className='flex-row items-center gap-2 px-3 py-1'>
          <View className='size-2 rounded-full bg-pink-500' />
          <Text className='text-xs font-inter-medium'>Bảo hành</Text>
        </View>
        <Separator />
        <View className='flex-row items-center gap-3 p-3'>
          <View className='p-2 rounded-xl bg-pink-50'>{SvgIcon.shieldTickSolid({ color: 'PINK', size: 24 })}</View>
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-sm font-inter-medium flex-1' numberOfLines={1}>
                {notificationTitle}
              </Text>
              <Text className='text-xs text-muted-foreground ml-auto'>{format(createdAt, 'hh:mm a')}</Text>
            </View>
            <Text className='text-xs text-muted-foreground mr-1 flex-1' numberOfLines={1}>
              {notificationContent}
            </Text>
          </View>
        </View>
      </Card>
    )
  }
}
