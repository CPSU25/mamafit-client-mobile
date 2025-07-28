import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { CurrentStatus } from '~/app/order/status/[orderStatus]'
import Loading from '~/components/loading'
import { Text } from '~/components/ui/text'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { statusStyles } from '../constants'
import { useGetOrders } from '../hooks/use-get-orders'
import { getStatusIcon } from '../utils'
import OrderCard from './order-card'

interface OrdersListProps {
  currentStatus: CurrentStatus
}

export default function OrdersList({ currentStatus }: OrdersListProps) {
  const router = useRouter()

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
      data={orders?.pages
        .flatMap((page) => page.items)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(100 + index * 50)}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/order/[orderId]',
                params: { orderId: item.id }
              })
            }
          >
            <OrderCard order={item} />
          </Pressable>
        </Animated.View>
      )}
      ListHeaderComponent={
        <OrderStatusCard
          title={currentStatus.title}
          description={currentStatus.description}
          value={currentStatus.value}
        />
      }
      showsVerticalScrollIndicator={false}
      contentContainerClassName='gap-4 p-4'
      ListEmptyComponent={
        isLoading ? (
          <Loading />
        ) : (
          <View className='flex items-center px-4 mt-10'>
            <Text className='text-muted-foreground text-sm mt-2'>No orders found</Text>
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

const OrderStatusCard = ({ title, description, value }: { title: string; description: string; value: string }) => {
  const styleConfig = statusStyles[value] || {
    colors: ['#ffffff', '#f8fafc', '#e2e8f0'],
    textColor: '#1f2937',
    iconColor: '#6b7280',
    shadowColor: '#e2e8f0'
  }

  return (
    <View className='relative overflow-hidden rounded-2xl' style={styles.container}>
      <LinearGradient
        colors={styleConfig.colors as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='p-4 rounded-2xl overflow-hidden'
      >
        <View className='relative z-10'>
          <View className='flex-row items-center gap-2 mb-2'>
            <MaterialIcons name={getStatusIcon(value)} size={20} color={styleConfig.iconColor} />
            <View className='flex-1'>
              <Text style={{ color: styleConfig.textColor }} className='font-inter-semibold'>
                {title}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: styleConfig.textColor,
              opacity: 0.85
            }}
            className='text-xs'
          >
            {description}
          </Text>

          <View className='flex-row justify-end space-x-1 mt-2'>
            {[...Array(3)].map((_, i) => (
              <View
                key={i}
                className='w-1 h-1 rounded-full'
                style={{
                  backgroundColor: styleConfig.iconColor,
                  opacity: 0.4 + i * 0.2
                }}
              />
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}
