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
    name: 'Chờ Xác Nhận',
    url: '/order/status/to-pay',
    value: OrderStatus.Created,
    icon: SvgIcon.toPay({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 2,
    name: 'Chờ Lấy Hàng',
    url: '/order/status/packaging',
    value: OrderStatus.Packaging,
    icon: SvgIcon.toShip({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 3,
    name: 'Chờ Giao Hàng',
    url: '/order/status/to-deliver',
    value: OrderStatus.Delevering,
    icon: SvgIcon.toReceive({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })
  },
  {
    id: 4,
    name: 'Đánh Giá',
    url: '/order/status/to-rate',
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
  ordersCount
}: {
  status: OrderStatusUI
  ordersCount: OrderStatusCount[] | null | undefined
}) {
  const orderCount = getOrderCount(status, ordersCount)

  return (
    <View className='flex-col gap-2 items-center relative'>
      {Boolean(orderCount) ? (
        <View
          className={cn(
            'w-5 h-5 rounded-full absolute bg-red-600 justify-center items-center z-10',
            status.id === 1 && 'top-1 right-4',
            status.id === 2 && 'top-1 right-4',
            status.id === 3 && 'top-1 right-5',
            status.id === 4 && 'top-1 right-0'
          )}
        >
          <Text className='text-xs text-white font-inter-medium'>{orderCount}</Text>
        </View>
      ) : null}
      {status.icon}
      <Text className='text-xs'>{status.name}</Text>
    </View>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const { isDarkColorScheme, setColorScheme } = useColorScheme()
  const [checked, setChecked] = useState(isDarkColorScheme ? true : false)

  const { isLoading: isLoadingAuth, isAuthenticated } = useAuth()
  const { data: ordersCount, isLoading: isLoadingOrdersCount, refetch: refetOrdersCount } = useGetOrdersCount()
  const { data: currentUser, isLoading: isLoadingCurrentUser, refetch: refetchCurrentUser } = useGetCurrentUser()

  const { refreshControl } = useRefreshs([refetOrdersCount, refetchCurrentUser])

  const toggleColorScheme = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark'
    setColorScheme(newTheme)
    setChecked((prev) => !prev)
  }

  const isLoading = isLoadingAuth || isLoadingOrdersCount || isLoadingCurrentUser

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
                <Text className='font-inter-medium'>Đăng Nhập</Text>
              </Button>
              <Button className='w-32' variant='default' onPress={() => router.push('/auth?focus=register')} size='sm'>
                <Text className='font-inter-medium'>Đăng Ký</Text>
              </Button>
            </View>
          )}
        </View>
        <View className='bg-muted h-2' />
        <View className='flex flex-row items-baseline justify-between p-4 mb-2'>
          <Text className='font-inter-medium'>Đơn Mua</Text>
          <TouchableOpacity className='flex flex-row items-start' onPress={() => router.push(`/order/status/to-rate`)}>
            <Text className='text-xs text-muted-foreground mr-0.5'>Xem Lịch Sử Mua Hàng</Text>
            <Feather name='chevron-right' size={18} color='lightgray' />
          </TouchableOpacity>
        </View>
        <View className='flex flex-row items-center justify-around mb-6'>
          {statuses.map((status) => (
            <TouchableOpacity key={status.id} onPress={() => router.push(status.url as any)}>
              <OrderStage status={status} ordersCount={ordersCount} />
            </TouchableOpacity>
          ))}
        </View>

        <View className='bg-muted h-2' />

        <TouchableOpacity className='flex-row items-center p-4' onPress={() => router.push('/profile/appointment')}>
          <Feather name='calendar' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium ml-3.5'>Lịch</Text>
          <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity className='flex-row items-center p-4' onPress={() => router.push('/order/warranty/create')}>
          <Feather name='grid' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium ml-3.5'>Dịch Vụ Bảo Hành</Text>
          <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
        </TouchableOpacity>

        <Separator />

        <TouchableOpacity className='flex-row items-center p-4'>
          <Feather name='refresh-cw' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium ml-3.5'>Yêu Cầu Trả Hàng</Text>
          <Feather name='chevron-right' size={20} color='lightgray' className='ml-auto' />
        </TouchableOpacity>

        <Separator />

        <Pressable className='flex-row items-center p-4' onPress={toggleColorScheme}>
          <Feather name='moon' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='font-inter-medium ml-3.5 flex-1'>Chế Độ Tối</Text>
          <Switch checked={checked} onCheckedChange={toggleColorScheme} />
        </Pressable>
      </ScrollView>
    </SafeView>
  )
}
