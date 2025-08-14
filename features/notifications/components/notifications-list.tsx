import { formatDistanceToNow } from 'date-fns'
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { NotificationTypeDB } from '~/types/notification.type'
import { useGetNotifications } from '../hooks/use-get-notifications'

const getIconByType = (type: NotificationTypeDB, isRead: boolean) => {
  switch (type) {
    case NotificationTypeDB.OrderProgress:
      return SvgIcon.box({ size: 28, color: isRead ? 'GRAY' : 'PRIMARY' })
    case NotificationTypeDB.Appointment:
      return SvgIcon.appointment({ size: 28, color: isRead ? 'GRAY' : 'PRIMARY' })
    case NotificationTypeDB.Payment:
      return SvgIcon.card({ size: 28, color: isRead ? 'GRAY' : 'PRIMARY' })
    default:
      return SvgIcon.messageQuestion({ size: 28, color: isRead ? 'GRAY' : 'PRIMARY' })
  }
}

export default function NotificationsList() {
  const {
    data: notifications,
    refetch: refetchNotifications,
    isLoading: isLoadingNotifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetNotifications()

  const { refreshControl } = useRefreshs([refetchNotifications])

  return (
    <FlatList
      data={notifications?.pages.flatMap((page) => page.items)}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.duration(100).delay(index * 50)}>
          <TouchableOpacity className='relative'>
            <Card
              className={cn('p-3 flex-row items-center gap-3', !item.isRead && 'bg-primary/5 border border-primary/10')}
            >
              {getIconByType(item.type, item.isRead)}
              <View className='flex-1'>
                <View className='flex-row items-center gap-4'>
                  <Text
                    className={cn('text-sm font-inter-medium flex-1', !item.isRead && 'text-primary')}
                    numberOfLines={1}
                  >
                    {item.notificationTitle}
                  </Text>

                  <Text className={cn('text-xs text-muted-foreground', !item.isRead && 'text-primary/60')}>
                    {item.createdAt ? formatDistanceToNow(item.createdAt, { addSuffix: true }) : null}
                  </Text>
                </View>
                <Text
                  className={cn('text-xs text-muted-foreground pr-2', !item.isRead && 'text-primary/80')}
                  numberOfLines={1}
                >
                  {item.notificationContent}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerClassName='gap-3 p-4 pb-20'
      ListEmptyComponent={
        isLoadingNotifications ? (
          <Loading />
        ) : (
          <View className='flex flex-1 items-center px-4 mt-20'>
            {SvgIcon.bell({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
            <Text className='text-muted-foreground text-sm mt-2'>You don&apos;t have any notifications yet.</Text>
          </View>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} className='mt-2' /> : null
      }
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.2}
      contentInsetAdjustmentBehavior='automatic'
      refreshControl={refreshControl}
    />
  )
}
