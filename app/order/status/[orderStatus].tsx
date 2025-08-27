import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import OrdersList from '~/features/order/components/orders-list'
import { ORDER_STATUS_TYPES } from '~/features/order/constants'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { OrderStatus } from '~/types/order.type'

export interface CurrentStatus {
  title: string
  description: string
  value: OrderStatus
  urlValue: string
}

export default function OrdersByStatusScreen() {
  const router = useRouter()
  const { orderStatus } = useLocalSearchParams() as { orderStatus: string }

  const scrollViewRef = useRef<ScrollView>(null)

  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({})
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus>({
    title: ORDER_STATUS_TYPES.find((status) => status.urlValue === orderStatus)?.title || 'Đang Chờ Thanh Toán',
    description:
      ORDER_STATUS_TYPES.find((status) => status.urlValue === orderStatus)?.description ||
      'Đơn hàng của bạn đã được tạo. Vui lòng hoàn thành thanh toán để bắt đầu xử lý.',
    value: ORDER_STATUS_TYPES.find((status) => status.urlValue === orderStatus)?.value || OrderStatus.Created,
    urlValue: orderStatus || 'to-pay'
  })

  const isSelected = useCallback((status: string) => currentStatus.urlValue === status, [currentStatus.urlValue])

  // Auto-scroll to center the selected status tab
  useEffect(() => {
    const selectedTabLayout = tabLayouts[currentStatus.urlValue]
    if (selectedTabLayout && scrollViewRef.current && scrollViewWidth > 0) {
      const centerPosition = selectedTabLayout.x + selectedTabLayout.width / 2 - scrollViewWidth / 2
      const scrollPosition = Math.max(0, centerPosition)

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollPosition,
          animated: true
        })
      }, 100)
    }
  }, [currentStatus.urlValue, tabLayouts, scrollViewWidth])

  const handleTabLayout = (urlValue: string, event: any) => {
    const { x, width } = event.nativeEvent.layout
    setTabLayouts((prev) => ({
      ...prev,
      [urlValue]: { x, width }
    }))
  }

  const handleScrollViewLayout = (event: any) => {
    const { width } = event.nativeEvent.layout
    setScrollViewWidth(width)
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-3 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl'>Đơn mua</Text>
      </View>

      <View className='px-4 pt-2'>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onLayout={handleScrollViewLayout}
        >
          <View className='flex-row items-center gap-4'>
            {ORDER_STATUS_TYPES.map((status) => (
              <TouchableOpacity
                key={status.id}
                onPress={() =>
                  setCurrentStatus({
                    title: status.title,
                    description: status.description,
                    value: status.value,
                    urlValue: status.urlValue
                  })
                }
                onLayout={(event) => handleTabLayout(status.urlValue, event)}
                className={cn('px-2 pb-2', isSelected(status.urlValue) && 'border-b-2 border-primary')}
              >
                <Text
                  className={cn(
                    'font-inter-medium text-sm',
                    isSelected(status.urlValue) ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className='flex-1 bg-muted'>
        <OrdersList currentStatus={currentStatus} />
      </View>
    </SafeView>
  )
}
