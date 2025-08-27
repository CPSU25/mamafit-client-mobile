import { format } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '~/components/loading'
import Ratings from '~/components/ratings'
import SafeView from '~/components/safe-view'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import { useGetRatedOrders } from '~/features/feedback/hooks/use-get-rated-orders'
import { useGetUnratedOrder } from '~/features/feedback/hooks/use-get-unrated-orders'
import OrderCard from '~/features/order/components/order-detail/order-card'
import { FEEDBACK_STATUS_TYPES } from '~/features/order/constants'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { OrderItemType } from '~/types/order.type'

export default function FeedbackHistoryScreen() {
  const router = useRouter()
  const { feedbackStatus } = useLocalSearchParams() as { feedbackStatus: string }

  const [currentStatus, setCurrentStatus] = useState(feedbackStatus || 'rated')

  const {
    data: ratedOrders,
    isLoading: isLoadingRatedOrders,
    refetch: refetchRatedOrders
  } = useGetRatedOrders(currentStatus === 'rated')
  const {
    data: unratedOrders,
    isLoading: isLoadingUnratedOrders,
    refetch: refetchUnratedOrders
  } = useGetUnratedOrder(currentStatus === 'unrated')

  const isSelected = useCallback((status: string) => currentStatus === status, [currentStatus])

  const { refreshControl: ratedOrdersRefreshControl } = useRefreshs([refetchRatedOrders])
  const { refreshControl: unratedOrdersRefreshControl } = useRefreshs([refetchUnratedOrders])

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
          <Icon as={ArrowLeft} size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl'>Đánh giá của tôi</Text>
      </View>

      <View className='pt-2'>
        <View className='flex-row items-center gap-4 px-4'>
          {FEEDBACK_STATUS_TYPES.map((status) => (
            <TouchableOpacity
              key={status.id}
              onPress={() => setCurrentStatus(status.urlValue)}
              className={cn('px-2 pb-2 flex-1', isSelected(status.urlValue) && 'border-b-2 border-primary')}
            >
              <Text
                className={cn(
                  'font-inter-medium text-sm text-center',
                  isSelected(status.urlValue) ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className='h-2 bg-muted' />

        {currentStatus === 'rated' ? (
          <FlatList
            data={ratedOrders}
            keyExtractor={(item) => item.id}
            refreshControl={ratedOrdersRefreshControl}
            showsVerticalScrollIndicator={false}
            contentContainerClassName='pb-24'
            ListEmptyComponent={
              isLoadingRatedOrders ? (
                <Loading />
              ) : (
                <View className='flex items-center px-4 mt-10'>
                  <Text className='text-muted-foreground text-sm mt-2'>Không tìm thấy đánh giá</Text>
                </View>
              )
            }
            renderItem={({ item, index }) => (
              <>
                <View className='p-3 gap-2'>
                  <View className='flex-row items-center gap-2 justify-between'>
                    <Ratings rating={item.feedbacks[0].rated} displayCount={false} size={14} />
                    <Text className='text-xs text-muted-foreground'>
                      {item.feedbacks[0].createdAt
                        ? format(new Date(item.feedbacks[0].createdAt), "MMM dd, yyyy 'lúc' hh:mm a")
                        : 'N/A'}
                    </Text>
                  </View>
                  <Text className='text-sm'>{item.feedbacks[0].description}</Text>
                  {Array.isArray(item.feedbacks[0].images) && item.feedbacks[0].images.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View className='flex-row items-center gap-3'>
                        {item.feedbacks[0].images.map((image, index) => (
                          <Image
                            key={`${image}-${index}`}
                            source={{ uri: image }}
                            className='w-24 h-24 rounded-xl'
                            resizeMode='cover'
                          />
                        ))}
                      </View>
                    </ScrollView>
                  ) : null}
                  <View className='bg-muted/50 rounded-2xl overflow-hidden'>
                    {item.itemType === OrderItemType.Preset || item.itemType === OrderItemType.Warranty ? (
                      <View className='flex-row items-center gap-3 p-1'>
                        <View className='w-[60px] h-[60px]'>
                          <Image
                            source={{ uri: item.preset?.images?.[0] }}
                            className='w-full h-full rounded-xl'
                            resizeMode='contain'
                          />
                        </View>
                        <View className='flex-1'>
                          <Text className='text-sm font-inter-medium'>{item.preset?.name}</Text>
                          <Text className='text-xs text-muted-foreground'>{item.preset?.styleName}</Text>
                        </View>
                      </View>
                    ) : null}
                    {item.itemType === OrderItemType.DesignRequest ? (
                      <View className='p-1 flex-row items-center gap-3'>
                        <View className='w-[60px] h-[60px]'>
                          <Image
                            source={{ uri: item.designRequest?.images?.[0] }}
                            className='w-full h-full rounded-xl'
                            resizeMode='cover'
                          />
                        </View>
                        <View className='flex-1'>
                          <Text className='text-sm font-inter-medium'>Yêu cầu thiết kế</Text>
                          <Text className='text-xs text-muted-foreground'>{item.designRequest?.description}</Text>
                        </View>
                      </View>
                    ) : null}
                    {item.itemType === OrderItemType.ReadyToBuy ? (
                      <View className='flex-row items-center gap-3 p-1'>
                        <View className='w-[60px] h-[60px] overflow-hidden relative rounded-xl'>
                          <Image
                            source={{ uri: item.maternityDressDetail?.image[0] }}
                            style={{
                              width: '100%',
                              height: '180%',
                              position: 'absolute',
                              top: 0,
                              left: 0
                            }}
                            resizeMode='cover'
                          />
                        </View>
                        <View className='flex-1'>
                          <Text className='text-sm font-inter-medium' numberOfLines={1}>
                            {item.maternityDressDetail?.name}
                          </Text>
                          <Text className='text-xs text-muted-foreground'>{item.maternityDressDetail?.sku}</Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
                {index !== (ratedOrders?.length ?? 0) - 1 && <View className='h-2 bg-muted' />}
              </>
            )}
          />
        ) : null}

        {currentStatus === 'unrated' ? (
          <FlatList
            data={unratedOrders}
            keyExtractor={(item) => item.id}
            refreshControl={unratedOrdersRefreshControl}
            showsVerticalScrollIndicator={false}
            contentContainerClassName='gap-3 p-3 pb-32'
            ListEmptyComponent={
              isLoadingUnratedOrders ? (
                <Loading />
              ) : (
                <View className='flex items-center px-4 mt-10'>
                  <Text className='text-muted-foreground text-sm mt-2'>Không tìm thấy đánh giá</Text>
                </View>
              )
            }
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInDown.delay(100 + index * 50)}>
                <OrderCard order={item} />
              </Animated.View>
            )}
          />
        ) : null}
      </View>
    </SafeView>
  )
}
