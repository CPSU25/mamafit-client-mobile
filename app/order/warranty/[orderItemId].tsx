import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useGetWarrantyItems } from '~/features/warranty-request/hooks/use-get-warranty-items'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { WarrantyRequestItemStatus } from '~/types/order.type'

const getStatusBadge = (status: WarrantyRequestItemStatus) => {
  switch (status) {
    case 'APPROVED':
      return {
        bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
        bgSolid: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        textLight: 'text-emerald-600',
        icon: 'check-circle' as const,
        gradientColors: ['#10b981', '#22c55e'],
        shadowColor: 'rgba(16, 185, 129, 0.3)'
      }
    case 'REJECTED':
      return {
        bg: 'bg-gradient-to-r from-rose-500 to-red-500',
        bgSolid: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        textLight: 'text-rose-600',
        icon: 'close-circle' as const,
        gradientColors: ['#f43f5e', '#ef4444'],
        shadowColor: 'rgba(244, 63, 94, 0.3)'
      }
    case 'IN_TRANSIT':
      return {
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        bgSolid: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        textLight: 'text-blue-600',
        icon: 'truck-fast' as const,
        gradientColors: ['#3b82f6', '#6366f1'],
        shadowColor: 'rgba(59, 130, 246, 0.3)'
      }
    case 'PENDING':
    default:
      return {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
        bgSolid: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        textLight: 'text-amber-600',
        icon: 'progress-clock' as const,
        gradientColors: ['#f59e0b', '#f97316'],
        shadowColor: 'rgba(245, 158, 11, 0.3)'
      }
  }
}

export default function ViewWarrantyHistory() {
  const router = useRouter()
  const { orderItemId, currentOrderItemId } = useLocalSearchParams<{
    orderItemId: string
    currentOrderItemId?: string
  }>()

  const {
    data: warrantyItems,
    isLoading: isLoadingWarrantyItems,
    refetch: refetchWarrantyItems
  } = useGetWarrantyItems(orderItemId ?? '')

  const generalStats = useMemo(() => {
    if (warrantyItems && Array.isArray(warrantyItems)) {
      const count = warrantyItems.length
      const totalFee = warrantyItems.reduce((sum, wi) => sum + Number(wi.warrantyRequestItems?.fee ?? 0), 0)
      const parentOrder = warrantyItems.find((item) => !item.warrantyRequestItems)
      return { count, totalFee, parentOrder }
    }

    return { count: 0, totalFee: 0, parentOrder: undefined }
  }, [warrantyItems])

  const childItems = useMemo(() => {
    if (warrantyItems && Array.isArray(warrantyItems)) {
      return warrantyItems.filter((item) => item.warrantyRequestItems)
    }
    return []
  }, [warrantyItems])

  const { refreshControl } = useRefreshs([refetchWarrantyItems])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }

  if (isLoadingWarrantyItems) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex-row items-center gap-2 px-4 pt-4'>
        <TouchableOpacity onPress={handleGoBack} className='p-1'>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl text-foreground'>Warranty History</Text>
      </View>

      <View className='flex-1 p-4'>
        <Card style={styles.container}>
          <Text className='font-inter-medium px-3 py-2 text-sm'>
            Original Order {generalStats.parentOrder?.order.code ? `#${generalStats.parentOrder.order.code}` : ''}
          </Text>
          <Separator />

          <View className='flex-row items-start gap-3 p-3'>
            <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
              <Image
                source={{ uri: generalStats.parentOrder?.order?.items?.[0]?.preset?.images?.[0] }}
                className='w-full h-full'
                resizeMode='contain'
              />
            </View>

            <View className='flex-1 h-20 justify-between'>
              <View>
                <Text className='text-sm font-inter-medium' numberOfLines={1}>
                  {generalStats.parentOrder?.order?.items?.[0]?.preset?.styleName || 'Custom'} Dress
                </Text>

                <View className='flex-row items-center gap-2'>
                  <View className='bg-muted-foreground/10 px-2 rounded-md mr-auto'>
                    <Text className='text-xs text-muted-foreground font-inter-medium'>
                      {generalStats.parentOrder?.order?.items?.[0]?.preset?.sku
                        ? `SKU: ${generalStats.parentOrder?.order?.items?.[0]?.preset?.sku}`
                        : ''}
                    </Text>
                  </View>
                  <Text className='text-xs text-muted-foreground'>
                    x{generalStats.parentOrder?.order?.items?.[0].quantity || 1}
                  </Text>
                </View>
              </View>

              <View className='items-end'>
                <Text className='text-xs'>
                  <Text className='text-xs underline'>đ</Text>
                  {generalStats.parentOrder?.order?.items?.[0]?.price
                    ? generalStats.parentOrder?.order?.items?.[0]?.price?.toLocaleString('vi-VN')
                    : '0'}
                </Text>
              </View>
            </View>
          </View>

          <View className='flex-row items-center gap-2 p-3'>
            <Text className='text-sm font-inter-medium'>Warranty Items</Text>
            <Text className='text-sm font-inter-medium'>{generalStats.count}</Text>
          </View>
        </Card>
      </View>
    </SafeView>
  )
}
