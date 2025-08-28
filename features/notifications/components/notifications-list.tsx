import { formatDistanceToNow } from 'date-fns'
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import { Text } from '~/components/ui/text'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { NotificationTypeDB } from '~/types/notification.type'
import { useGetNotifications } from '../hooks/use-get-notifications'

const getIconByType = (type: NotificationTypeDB) => {
  switch (type) {
    case NotificationTypeDB.OrderProgress:
      return {
        color: 'rgba(52, 211, 153, 1)',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        icon: SvgIcon.boxSearchSolid({ size: 20, color: 'EMERALD' }),
        shadow: 'rgba(52, 211, 153, 0.25)'
      }
    case NotificationTypeDB.Appointment:
      return {
        color: 'rgba(96, 165, 250, 1)',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        icon: SvgIcon.calendar2Solid({ size: 20, color: 'BLUE' }),
        shadow: 'rgba(96, 165, 250, 0.25)'
      }
    case NotificationTypeDB.Warranty:
      return {
        color: 'rgba(244, 114, 182, 1)',
        backgroundColor: 'rgba(244, 114, 182, 0.1)',
        icon: SvgIcon.shieldTickSolid({ size: 20, color: 'PINK' }),
        shadow: 'rgba(244, 114, 182, 0.25)'
      }
    case NotificationTypeDB.Payment:
      return {
        color: 'rgba(251, 191, 36, 1)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        icon: SvgIcon.bankSolid({ size: 20, color: 'AMBER' }),
        shadow: 'rgba(251, 191, 36, 0.25)'
      }
    case NotificationTypeDB.Voucher:
      return {
        color: 'rgba(251, 146, 60, 1)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        icon: SvgIcon.ticketDiscountSolid({ size: 20, color: 'ORANGE' }),
        shadow: 'rgba(251, 146, 60, 0.25)'
      }
    case NotificationTypeDB.Measurement:
      return {
        color: 'rgba(129, 140, 248, 1)',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        icon: SvgIcon.rulerSolid({ size: 20, color: 'INDIGO' }),
        shadow: 'rgba(129, 140, 248, 0.25)'
      }
    default:
      return {
        color: 'rgba(129, 140, 248, 1)',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        icon: SvgIcon.moreSolid({ size: 20, color: 'INDIGO' }),
        shadow: 'rgba(129, 140, 248, 0.25)'
      }
  }
}

export default function NotificationsList({ type }: { type?: NotificationTypeDB }) {
  const {
    data: notifications,
    refetch: refetchNotifications,
    isLoading: isLoadingNotifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetNotifications(type)

  const { refreshControl } = useRefreshs([refetchNotifications])

  return (
    <View className='bg-muted flex-1'>
      <FlatList
        data={notifications?.pages.flatMap((page) => page.items)}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50)}>
            <TouchableOpacity className='relative bg-background'>
              <View className='p-4'>
                <View className='flex-row items-start gap-3'>
                  <View className='relative'>
                    <View
                      className='rounded-lg p-2'
                      style={{
                        backgroundColor: getIconByType(item.type).backgroundColor,
                        boxShadow: `0 0 3px 0 ${getIconByType(item.type).shadow}`
                      }}
                    >
                      {getIconByType(item.type).icon}
                    </View>
                    {!item.isRead ? (
                      <View
                        className='absolute -top-0.5 -right-0.5 size-2.5 rounded-full'
                        style={{ backgroundColor: getIconByType(item.type).color }}
                      />
                    ) : null}
                  </View>

                  <View className='flex-1'>
                    <Text className={cn('text-sm font-inter-medium')} numberOfLines={1}>
                      {item.notificationTitle}
                    </Text>

                    <Text className={cn('text-[10px] text-muted-foreground pr-2')} numberOfLines={1}>
                      {item.notificationContent}
                    </Text>
                  </View>
                </View>
                <Text className={cn('text-[9px] text-muted-foreground ml-auto mt-2')}>
                  {item.createdAt ? formatDistanceToNow(item.createdAt, { addSuffix: true }) : null}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerClassName='gap-2 pb-16'
        ListEmptyComponent={
          isLoadingNotifications ? (
            <Loading />
          ) : (
            <View className='flex flex-1 items-center px-4 mt-20'>
              {SvgIcon.bell({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
              <Text className='text-muted-foreground text-sm mt-2'>Bạn chưa có thông báo nào.</Text>
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
    </View>
  )
}
