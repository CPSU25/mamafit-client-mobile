import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import { orderStatuses, statusStyles } from '~/features/order/constants'
import { getStatusIcon } from '~/features/order/utils'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'

export default function OrdersByStatusScreen() {
  const router = useRouter()
  const { orderStatus } = useLocalSearchParams() as { orderStatus: string }

  const scrollViewRef = useRef<ScrollView>(null)

  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({})
  const [currentStatus, setCurrentStatus] = useState({
    title: orderStatuses.find((status) => status.urlValue === orderStatus)?.title || 'Waiting for Payment',
    description:
      orderStatuses.find((status) => status.urlValue === orderStatus)?.description ||
      'Your order has been created. Please complete the payment to start processing.',
    value: orderStatuses.find((status) => status.urlValue === orderStatus)?.value || 'CREATED',
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
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>My Purchases</Text>
      </View>

      <View className='px-4'>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onLayout={handleScrollViewLayout}
        >
          <View className='flex-row items-center gap-6'>
            {orderStatuses.map((status) => (
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
                    'font-inter-medium',
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

      <View className='flex-1 p-4 bg-muted'>
        <OrderStatusCard
          title={currentStatus.title}
          description={currentStatus.description}
          value={currentStatus.value}
        />
      </View>
    </SafeView>
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
          <View className='flex-row items-center gap-3 mb-2'>
            <Feather name={getStatusIcon(value) as any} size={20} color={styleConfig.iconColor} />
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

          <View className='flex-row justify-end space-x-1'>
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
