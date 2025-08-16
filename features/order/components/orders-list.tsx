import { ActivityIndicator, FlatList, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { CurrentStatus } from '~/app/order/status/[orderStatus]'
import Loading from '~/components/loading'
import { Text } from '~/components/ui/text'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { useGetOrders } from '../hooks/use-get-orders'
import OrderCard from './order-detail/order-card'

interface OrdersListProps {
  currentStatus: CurrentStatus
}

export default function OrdersList({ currentStatus }: OrdersListProps) {
  const {
    data: orders,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useGetOrders(currentStatus.value)
  const { refreshControl } = useRefreshs([refetch])

  return (
    <FlatList
      data={orders?.pages.flatMap((page) => page.items)}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(100 + index * 50)}>
          <OrderCard order={item} />
        </Animated.View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerClassName='gap-2 p-2'
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        isLoading ? (
          <Loading />
        ) : (
          <View className='flex items-center px-4 mt-10'>
            <Text className='text-muted-foreground text-sm mt-2'>Không tìm thấy đơn hàng</Text>
          </View>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className='py-4'>
            <ActivityIndicator size='large' color={PRIMARY_COLOR.LIGHT} />
          </View>
        ) : null
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
