import { MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, Link } from 'lucide-react-native'
import { useEffect, useMemo, useRef } from 'react'
import { Animated, FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Card } from '~/components/ui/card'
import { Icon } from '~/components/ui/icon'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { VideoThumbnail } from '~/components/ui/video-picker'
import { useGetWarrantyItems } from '~/features/warranty-request/hooks/use-get-warranty-items'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { WarrantyRequestItemStatus } from '~/types/warranty.type'

const getStatusText = (status: WarrantyRequestItemStatus) => {
  switch (status) {
    case WarrantyRequestItemStatus.Approved:
      return 'Chấp nhận bảo hành'
    case WarrantyRequestItemStatus.InTransit:
      return 'Đang vận chuyển'
    case WarrantyRequestItemStatus.Rejected:
      return 'Từ chối'
    case WarrantyRequestItemStatus.Completed:
      return 'Hoàn thành'
    default:
      return 'Đang chờ'
  }
}

const getStatusBadge = (status: WarrantyRequestItemStatus) => {
  switch (status) {
    case WarrantyRequestItemStatus.Approved:
      return {
        text: 'text-emerald-800',
        textLight: 'text-emerald-600',
        bgLight: 'bg-emerald-100',
        activeBorder: 'border border-emerald-100',
        gradientColors: ['#f3fbf6', '#d1fae5', '#6ee7b7']
      }
    case WarrantyRequestItemStatus.Rejected:
      return {
        text: 'text-rose-800',
        textLight: 'text-rose-600',
        bgLight: 'bg-rose-100',
        activeBorder: 'border border-rose-100',
        gradientColors: ['#fff5f5', '#ffe4e6', '#fda4af']
      }
    case WarrantyRequestItemStatus.InTransit:
      return {
        text: 'text-blue-800',
        textLight: 'text-blue-600',
        bgLight: 'bg-blue-100',
        activeBorder: 'border border-blue-100',
        gradientColors: ['#f0f9ff', '#bae6fd', '#93c5fd']
      }
    case WarrantyRequestItemStatus.Pending:
    default:
      return {
        text: 'text-amber-800',
        textLight: 'text-amber-600',
        bgLight: 'bg-amber-100',
        activeBorder: 'border border-amber-100',
        gradientColors: ['#fffaeb', '#fef3c7', '#fde68a']
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

  const childItems = useMemo(() => {
    if (warrantyItems && Array.isArray(warrantyItems)) {
      return warrantyItems
        .filter((item) => item.warrantyRequestItems)
        .sort((a, b) => a.warrantyRequestItems.warrantyRound - b.warrantyRequestItems.warrantyRound)
    }
    return []
  }, [warrantyItems])

  const generalStats = useMemo(() => {
    if (warrantyItems && Array.isArray(warrantyItems)) {
      const count = childItems.length
      const totalFee = warrantyItems.reduce((sum, wi) => sum + Number(wi.warrantyRequestItems?.fee ?? 0), 0)
      const parentOrder = warrantyItems.find((item) => !item.warrantyRequestItems)
      return { count, totalFee, parentOrder }
    }

    return { count: 0, totalFee: 0, parentOrder: undefined }
  }, [warrantyItems, childItems])

  const { refreshControl } = useRefreshs([refetchWarrantyItems])

  const listRef = useRef<FlatList<any>>(null)

  const pulseValuesRef = useRef(new Map<string, Animated.Value>())
  const pulseStartedRef = useRef(new Set<string>())

  const highlightIndex = useMemo(() => {
    return childItems.findIndex((ci) => ci.order.items?.[0]?.id === currentOrderItemId)
  }, [childItems, currentOrderItemId])

  useEffect(() => {
    if (highlightIndex >= 0) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToIndex({ index: highlightIndex, animated: true, viewPosition: 0.5 })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [highlightIndex])

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
          <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl text-foreground'>Lịch sử bảo hành</Text>
      </View>

      <View className='flex-1'>
        <FlatList
          ref={listRef}
          data={childItems}
          keyExtractor={(item) => item.order.id}
          refreshControl={refreshControl}
          ListHeaderComponent={
            <>
              <View className='flex-1'>
                <Card style={styles.container} className='overflow-hidden'>
                  <LinearGradient
                    colors={['#6d28d9', '#7c3aed', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className='overflow-hidden'
                  >
                    <View className='flex-row items-center gap-3 px-3 py-2'>
                      <View className='p-2 bg-white/10 rounded-full'>
                        <MaterialCommunityIcons name='receipt' size={20} color='white' />
                      </View>
                      <View>
                        <Text className='font-inter-medium text-white text-sm'>
                          Đơn hàng gốc{' '}
                          {generalStats.parentOrder?.order.code ? `#${generalStats.parentOrder.order.code}` : ''}
                        </Text>
                        <Text className='text-[9px] text-white/80'>
                          Đặt:{' '}
                          {generalStats.parentOrder?.order?.createdAt
                            ? format(new Date(generalStats.parentOrder.order.createdAt), "MMM dd, yyyy 'lúc' hh:mm a")
                            : 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>

                  <Separator />

                  <View className='flex-row items-start gap-3 px-3 pt-3'>
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
                          {generalStats.parentOrder?.order?.items?.[0]?.preset?.styleName || 'Không có kiểu'}
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

                  <View className='p-3 gap-3'>
                    <View className='flex-row items-center gap-3'>
                      <View className='flex-1 gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl'>
                        <View className='flex-row items-center gap-2'>
                          <View className='p-2 rounded-full bg-blue-600'>
                            <MaterialCommunityIcons name='inbox-multiple' size={14} color='white' />
                          </View>
                          <Text className='text-sm font-inter-medium text-blue-600'>Tổng yêu cầu</Text>
                        </View>
                        <Text className='text-blue-600 font-inter-semibold text-lg'>{generalStats.count}</Text>
                      </View>
                      <View className='flex-1 gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl'>
                        <View className='flex-row items-center gap-2'>
                          <View className='p-2 rounded-full bg-emerald-600'>
                            <MaterialCommunityIcons name='cash-register' size={14} color='white' />
                          </View>
                          <Text className='text-sm font-inter-medium text-emerald-600'>Tổng phí</Text>
                        </View>
                        <Text className='text-emerald-600 font-inter-semibold text-lg'>
                          <Text className='text-emerald-600 font-inter-semibold'>đ</Text>
                          {generalStats.totalFee.toLocaleString('vi-VN')}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: '/order/[orderId]',
                          params: { orderId: generalStats.parentOrder?.order?.id ?? '' }
                        })
                      }
                      className='bg-primary/10 border border-primary/20 rounded-xl p-2 flex-row justify-center items-center gap-2'
                    >
                      <Icon as={Link} size={16} color={PRIMARY_COLOR.LIGHT} />
                      <Text className='text-primary font-inter-medium text-sm'>Xem đơn hàng</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </View>

              <View className='mt-4 gap-1'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='clock-fast' size={24} color='black' />
                  <Text className='font-inter-semibold'>Yêu cầu gần nhất</Text>
                </View>
                <Text className='text-muted-foreground text-xs'>
                  Xem lịch sử yêu cầu bảo hành cho sản phẩm này, để xem sản phẩm đã được sửa chữa bao nhiêu lần.
                </Text>
              </View>
            </>
          }
          renderItem={({ item }) => {
            const isHere = item.order.items[0].id === currentOrderItemId
            const { gradientColors, text, bgLight, textLight, activeBorder } = getStatusBadge(
              item.warrantyRequestItems.status
            )
            const idKey = item.order.id

            let pulse = pulseValuesRef.current.get(idKey)
            if (!pulse) {
              pulse = new Animated.Value(1)
              pulseValuesRef.current.set(idKey, pulse)
            }
            if (isHere && !pulseStartedRef.current.has(idKey)) {
              pulseStartedRef.current.add(idKey)
              Animated.loop(
                Animated.sequence([
                  Animated.timing(pulse, { toValue: 1.006, duration: 700, useNativeDriver: true }),
                  Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true })
                ])
              ).start()
            }

            return (
              <Animated.View style={{ transform: [{ scale: pulse ?? 1 }] }}>
                <Card style={styles.container} className={cn('overflow-hidden', isHere && activeBorder)}>
                  <LinearGradient
                    colors={gradientColors as [string, string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View className='flex-row items-center gap-3 px-3 py-2'>
                      <View className={cn('w-10 h-10 justify-center items-center rounded-full', bgLight)}>
                        <Text className={cn('font-inter-semibold text-lg', text)}>
                          {item.warrantyRequestItems.warrantyRound}
                        </Text>
                      </View>
                      <View>
                        <Text className={cn('font-inter-semibold text-sm', text)}>
                          Request #{item.warrantyRequestItems.warrantyRequest.sku}
                        </Text>
                        <Text className={cn('text-xs', textLight)}>
                          {getStatusText(item.warrantyRequestItems.status)}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>

                  <View className='p-3 gap-3'>
                    <View className='flex-row items-center gap-2'>
                      <View className='flex-1 gap-1 px-2 py-1 rounded-xl border border-border bg-muted/50'>
                        <View className='flex-row items-center gap-1.5'>
                          <MaterialCommunityIcons name='package-variant' size={14} color='#6b7280' />
                          <Text className='text-xs text-muted-foreground'>Mã đơn</Text>
                        </View>
                        <Text className='text-xs font-inter-semibold'>#{item.order.code}</Text>
                      </View>
                      <View className='gap-1 px-2 py-1 rounded-xl border border-border bg-muted/50'>
                        <View className='flex-row items-center gap-1.5'>
                          <MaterialCommunityIcons name='barcode' size={14} color='#6b7280' />
                          <Text className='text-xs text-muted-foreground'>Mã vận đơn</Text>
                        </View>
                        <Text className='text-xs font-inter-semibold'>
                          {item.warrantyRequestItems.trackingCode || 'N/A'}
                        </Text>
                      </View>
                    </View>

                    <View className='flex-row items-center gap-2'>
                      <View className='flex-1 gap-1 px-2 py-1 rounded-xl bg-emerald-50 border border-emerald-100'>
                        <View className='flex-row items-center gap-1.5'>
                          <MaterialCommunityIcons name='cash' size={14} color='#059669' />
                          <Text className='text-xs text-emerald-600'>Phí</Text>
                        </View>
                        <Text className='text-xs font-inter-medium text-emerald-600'>
                          đ
                          <Text className='text-sm font-inter-medium text-emerald-600'>
                            {Number(item.warrantyRequestItems?.fee ?? 0).toLocaleString('vi-VN')}
                          </Text>
                        </Text>
                      </View>
                      <View className='flex-1 gap-1 px-2 py-1 rounded-xl bg-orange-50 border border-orange-100'>
                        <View className='flex-row items-center gap-1.5'>
                          <MaterialCommunityIcons name='clock-outline' size={14} color='#ea580c' />
                          <Text className='text-xs text-orange-600'>Dự kiến xong</Text>
                        </View>
                        <Text className='text-xs font-inter-medium text-orange-600'>
                          <Text className='text-sm font-inter-medium text-orange-600'>
                            {item.warrantyRequestItems?.estimateTime
                              ? format(new Date(item.warrantyRequestItems?.estimateTime), 'MMM dd, yyyy')
                              : 'N/A'}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    <View className='gap-1 px-2 py-1 rounded-xl border border-border bg-muted/50'>
                      <View className='flex-row items-center gap-1.5'>
                        <MaterialCommunityIcons name='card-text-outline' size={14} color='#6b7280' />
                        <Text className='text-xs text-muted-foreground'>Mô tả</Text>
                      </View>
                      <Text className='text-xs'>{item.warrantyRequestItems.description || 'N/A'}</Text>
                    </View>

                    <View className='gap-1 mb-1'>
                      <Text className='text-sm font-inter-semibold'>
                        Ảnh đính kèm{' '}
                        <Text className='text-xs text-muted-foreground'>
                          {item.warrantyRequestItems.images &&
                          Array.isArray(item.warrantyRequestItems.images) &&
                          item.warrantyRequestItems.images.length > 0
                            ? `(${item.warrantyRequestItems.images.length})`
                            : '(0)'}
                        </Text>
                      </Text>
                      {item.warrantyRequestItems.images &&
                      Array.isArray(item.warrantyRequestItems.images) &&
                      item.warrantyRequestItems.images.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View className='flex-row items-center gap-2'>
                            {item.warrantyRequestItems.images.map((image: string, index: number) => (
                              <Image
                                key={`${image}-${index}`}
                                source={{ uri: image }}
                                className='w-24 h-24 rounded-xl'
                              />
                            ))}
                          </View>
                        </ScrollView>
                      ) : (
                        <View className='px-2 py-1 rounded-xl border border-border bg-muted/50'>
                          <Text className='text-center text-xs text-muted-foreground my-4'>Không có ảnh</Text>
                        </View>
                      )}
                    </View>

                    <View className='gap-1 mb-1'>
                      <Text className='text-sm font-inter-semibold'>
                        Video đính kèm{' '}
                        <Text className='text-xs text-muted-foreground'>
                          {item.warrantyRequestItems.videos &&
                          Array.isArray(item.warrantyRequestItems.videos) &&
                          item.warrantyRequestItems.videos.length > 0
                            ? `(${item.warrantyRequestItems.videos.length})`
                            : '(0)'}
                        </Text>
                      </Text>
                      {item.warrantyRequestItems.videos &&
                      Array.isArray(item.warrantyRequestItems.videos) &&
                      item.warrantyRequestItems.videos.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View className='flex-row items-center gap-2'>
                            {item.warrantyRequestItems.videos.map((video: string, index: number) => (
                              <VideoThumbnail key={`${video}-${index}`} uri={video} className='w-24 h-24 rounded-xl' />
                            ))}
                          </View>
                        </ScrollView>
                      ) : (
                        <View className='px-2 py-1 rounded-xl border border-border bg-muted/50'>
                          <Text className='text-center text-xs text-muted-foreground my-4'>Không có video</Text>
                        </View>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: '/order/[orderId]',
                          params: { orderId: item.order.id }
                        })
                      }
                      className='bg-primary/10 border border-primary/20 rounded-xl p-2 flex-row justify-center items-center gap-2'
                    >
                      <Icon as={Link} size={16} color={PRIMARY_COLOR.LIGHT} />
                      <Text className='text-primary font-inter-medium text-sm'>Xem đơn hàng</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </Animated.View>
            )
          }}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5
              })
            }, 300)
          }}
          contentContainerClassName='gap-4 p-4'
        />
      </View>
    </SafeView>
  )
}
