import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import SafeView from '~/components/safe-view'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'

const orderStatuses = [
  {
    id: 1,
    label: 'To Pay',
    value: 'CREATED',
    urlValue: 'to-pay',
    description: 'Order created, waiting for initial payment'
  },
  {
    id: 2,
    label: 'In Design',
    value: 'IN_DESIGN',
    urlValue: 'in-design',
    description: 'Designer is working with customer on the design'
  },
  {
    id: 3,
    label: 'To Make',
    value: 'CONFIRMED',
    urlValue: 'to-make',
    description: 'Payment done and order confirmed, waiting to start production'
  },
  {
    id: 4,
    label: 'In Production',
    value: 'IN_PRODUCTION',
    urlValue: 'in-production',
    description: 'Order is being manufactured'
  },
  {
    id: 5,
    label: 'In QC',
    value: 'IN_QC',
    urlValue: 'in-qc',
    description: 'Order is being quality checked after production or repair'
  },
  {
    id: 6,
    label: 'To Paid Rest',
    value: 'AWAITING_PAID_REST',
    urlValue: 'to-paid-rest',
    description: 'QC passed, waiting for customer to pay remaining balance'
  },
  {
    id: 7,
    label: 'Packaging',
    value: 'PACKAGING',
    urlValue: 'packaging',
    description: 'Order is being packaged for shipping'
  },
  {
    id: 8,
    label: 'To Deliver',
    value: 'SHIPPING',
    urlValue: 'to-deliver',
    description: 'Order has been handed over to courier for delivery'
  },
  {
    id: 9,
    label: 'To Rate',
    value: 'COMPLETED',
    urlValue: 'to-rate',
    description: 'Order delivered, waiting for customer confirmation and feedback'
  },
  {
    id: 10,
    label: 'Warranty Check',
    value: 'WARRANTY_CHECK',
    urlValue: 'warranty-check',
    description: 'Waiting for staff to check if the issue is covered by warranty'
  },
  {
    id: 11,
    label: 'In Warranty',
    value: 'IN_WARRANTY',
    urlValue: 'in-warranty',
    description: 'Order is under warranty repair or replacement'
  }
]

export default function OrdersByStatusScreen() {
  const router = useRouter()
  const { orderStatus } = useLocalSearchParams() as { orderStatus: string }

  const scrollViewRef = useRef<ScrollView>(null)

  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({})
  const [currentStatus, setCurrentStatus] = useState({
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
          <View className='flex-row items-center gap-2'>
            {orderStatuses.map((status) => (
              <TouchableOpacity
                key={status.id}
                onPress={() =>
                  setCurrentStatus({
                    value: status.value,
                    urlValue: status.urlValue
                  })
                }
                onLayout={(event) => handleTabLayout(status.urlValue, event)}
                className={cn('px-4 pb-2', isSelected(status.urlValue) && 'border-b-2 border-primary')}
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
        <View className='py-4'>
          <Text>{currentStatus.value}</Text>
        </View>
      </View>
    </SafeView>
  )
}
