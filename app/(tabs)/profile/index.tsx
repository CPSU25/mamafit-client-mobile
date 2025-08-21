import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Switch } from '~/components/ui/switch'
import { Text } from '~/components/ui/text'
import CurrentUser from '~/features/auth/components/current-user'
import { useGetCurrentUser } from '~/features/auth/hooks/use-get-current-user'
import { useGetUnratedOrder } from '~/features/feedback/hooks/use-get-unrated-orders'
import { useGetOrdersCount } from '~/features/order/hooks/use-get-orders-count'
import { useAuth } from '~/hooks/use-auth'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { OrderStatus, OrderStatusCount } from '~/types/order.type'

interface OrderStatusUI {
  id: number
  name: string
  url: string
  value: OrderStatus
  icon: React.ReactNode
}

const statuses: OrderStatusUI[] = [
  {
    id: 1,
    name: 'Chờ xác nhận',
    url: '/order/status/to-pay',
    value: OrderStatus.Created,
    icon: SvgIcon.toPay({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 2,
    name: 'Chờ lấy hàng',
    url: '/order/status/packaging',
    value: OrderStatus.Packaging,
    icon: SvgIcon.toShip({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 3,
    name: 'Chờ giao hàng',
    url: '/order/status/to-deliver',
    value: OrderStatus.Delevering,
    icon: SvgIcon.toReceive({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 4,
    name: 'Đánh giá',
    url: '/order/feedback/rated',
    value: OrderStatus.Completed,
    icon: SvgIcon.toRate({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  }
]

const getOrderCount = (status: OrderStatusUI, ordersCount: OrderStatusCount[] | null | undefined) => {
  if (!ordersCount) return 0

  return ordersCount.find((order) => order.orderStatus === status.value)?.orderNumber
}

function OrderStage({
  status,
  ordersCount,
  unratedOrders
}: {
  status: OrderStatusUI
  ordersCount: OrderStatusCount[] | null | undefined
  unratedOrders: number
}) {
  const orderCount = status.id === 4 ? unratedOrders : getOrderCount(status, ordersCount)

  return (
    <View className='flex-col gap-1.5 items-center relative'>
      {Boolean(orderCount) ? (
        <View
          className={cn(
            'w-5 h-5 rounded-full absolute bg-red-600 justify-center items-center z-10',
            status.id === 1 && 'top-1 right-3',
            status.id === 2 && 'top-1 right-2.5',
            status.id === 3 && 'top-1 right-3.5',
            status.id === 4 && 'top-1 -right-1'
          )}
        >
          <Text className='text-xs text-white font-inter-medium'>{status.id === 4 ? unratedOrders : orderCount}</Text>
        </View>
      ) : null}
      {status.icon}
      <Text className='text-[9.5px] text-foreground/90'>{status.name}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const { isDarkColorScheme, setColorScheme } = useColorScheme()
  const [checked, setChecked] = useState(isDarkColorScheme ? true : false)

  const { isLoading: isLoadingAuth, isAuthenticated } = useAuth()
  const { data: ordersCount, isLoading: isLoadingOrdersCount, refetch: refetOrdersCount } = useGetOrdersCount()
  const {
    data: unratedOrders,
    isLoading: isLoadingUnratedOrders,
    refetch: refetchUnratedOrders
  } = useGetUnratedOrder(true)
  const { data: currentUser, isLoading: isLoadingCurrentUser, refetch: refetchCurrentUser } = useGetCurrentUser()

  const { refreshControl } = useRefreshs([refetOrdersCount, refetchCurrentUser, refetchUnratedOrders])

  const toggleColorScheme = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark'
    setColorScheme(newTheme)
    setChecked((prev) => !prev)
  }

  const isLoading = isLoadingAuth || isLoadingOrdersCount || isLoadingCurrentUser || isLoadingUnratedOrders

  if (isLoading) return <Loading />

  return (
    <SafeView>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
        <View className='flex flex-row items-center justify-between p-4'>
          <CurrentUser currentUser={currentUser} />
          {isAuthenticated ? (
            <View className='flex flex-row items-center gap-6 mr-2'>
              <TouchableOpacity onPress={() => router.push('/setting')}>
                <Feather name='settings' size={24} color={PRIMARY_COLOR.LIGHT} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/cart')}>
                <Feather name='shopping-bag' size={24} color={PRIMARY_COLOR.LIGHT} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/chat')}>
                <Feather name='message-circle' size={24} color={PRIMARY_COLOR.LIGHT} />
              </TouchableOpacity>
            </View>
          ) : (
            <View className='flex flex-row items-center gap-2'>
              <Button className='w-32' variant='outline' onPress={() => router.push('/auth?focus=sign-in')} size='sm'>
                <Text className='font-inter-medium native:text-sm'>Đăng nhập</Text>
              </Button>
              <Button className='w-32' variant='default' onPress={() => router.push('/auth?focus=register')} size='sm'>
                <Text className='font-inter-medium native:text-sm'>Đăng ký</Text>
              </Button>
            </View>
          )}
        </View>
        <View className='bg-muted h-2' />
        <View className='flex flex-row items-baseline justify-between p-4 mb-2'>
          <Text className='font-inter-medium text-sm'>Đơn mua</Text>
          <TouchableOpacity className='flex flex-row items-start' onPress={() => router.push(`/order/status/to-rate`)}>
            <Text className='text-[10px] text-muted-foreground mr-0.5'>Xem lịch sử mua hàng</Text>
            <Feather name='chevron-right' size={18} color='lightgray' />
          </TouchableOpacity>
        </View>
        <View className='flex flex-row items-center justify-around mb-6'>
          {statuses.map((status) => (
            <TouchableOpacity key={status.id} onPress={() => router.push(status.url as any)}>
              <OrderStage status={status} ordersCount={ordersCount} unratedOrders={unratedOrders?.length ?? 0} />
            </TouchableOpacity>
          ))}
        </View>

        <View className='bg-muted h-2' />

        <TouchableOpacity
          className='flex-row items-center px-4 py-2.5'
          onPress={() => router.push('/profile/appointment')}
        >
          <View className='p-2 bg-primary/10 rounded-full'>
            <Feather name='calendar' size={18} color={PRIMARY_COLOR.LIGHT} />
          </View>
          <View className='ml-3.5 flex-1'>
            <Text className='font-inter-medium text-sm'>Lịch hẹn</Text>
            <Text className='text-xs text-muted-foreground'>Đặt lịch hẹn tại chi nhánh gần nhất</Text>
          </View>
          <Feather name='chevron-right' size={18} color='lightgray' className='ml-auto' />
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity
          className='flex-row items-center px-4 py-2.5'
          onPress={() => router.push('/order/warranty/create')}
        >
          <View className='p-2 bg-primary/10 rounded-full'>
            <Feather name='shield' size={18} color={PRIMARY_COLOR.LIGHT} />
          </View>
          <View className='ml-3.5 flex-1'>
            <Text className='font-inter-medium text-sm'>Dịch vụ bảo hành</Text>
            <Text className='text-xs text-muted-foreground'>Báo lỗi sản phẩm và gửi bảo hành</Text>
          </View>
          <Feather name='chevron-right' size={18} color='lightgray' className='ml-auto' />
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity className='flex-row items-center px-4 py-2.5' onPress={() => router.push('/ticket/create')}>
          <View className='p-2 bg-primary/10 rounded-full'>
            <Feather name='alert-triangle' size={18} color={PRIMARY_COLOR.LIGHT} />
          </View>
          <View className='ml-3.5 flex-1'>
            <Text className='font-inter-medium text-sm'>Yêu cầu hỗ trợ</Text>
            <Text className='text-xs text-muted-foreground'>Gửi yêu cầu hỗ trợ tới hệ thống</Text>
          </View>
          <Feather name='chevron-right' size={18} color='lightgray' className='ml-auto' />
        </TouchableOpacity>

        <Separator />

        <Pressable className='flex-row items-center px-4 py-2.5' onPress={toggleColorScheme}>
          <View className='p-2 bg-primary/10 rounded-full'>
            <Feather name='moon' size={18} color={PRIMARY_COLOR.LIGHT} />
          </View>
          <Text className='font-inter-medium text-sm ml-3.5 flex-1'>Chế độ tối</Text>
          <Switch checked={checked} onCheckedChange={toggleColorScheme} />
        </Pressable>
      </ScrollView>
    </SafeView>
  )
}
