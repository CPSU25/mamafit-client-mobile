import { AntDesign, Feather } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import DressCarousel from '~/features/dress/components/dress-carousel'
import DressVariantSelectionModal from '~/features/dress/components/dress-variant-selection-modal'
import FeedbackItem from '~/features/dress/components/feedback-item'
import { useGetDress } from '~/features/dress/hooks/use-get-dress'
import { useGetFeedbacks } from '~/features/dress/hooks/use-get-feedbacks'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

const COLLAPSED_DESC_HEIGHT = 180

export default function ProductDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data: dress, isLoading: isLoadingDress, refetch: refetchDress } = useGetDress(id)
  const { data: feedbacks, isLoading: isLoadingFeedbacks, refetch: refetchFeedbacks } = useGetFeedbacks(id)

  const hasMultiplePrices = dress?.details?.length && dress.details.length > 1

  const minPrice = hasMultiplePrices
    ? Math.min(...dress.details.map((detail) => detail.price))
    : dress?.details[0].price
  const maxPrice = hasMultiplePrices
    ? Math.max(...dress.details.map((detail) => detail.price))
    : dress?.details[0].price

  const { bottom } = useSafeAreaInsets()

  const variantSelectionModalRef = useRef<BottomSheetModal>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [descriptionHeight, setDescriptionHeight] = useState(0)
  const canExpandDescription = descriptionHeight > COLLAPSED_DESC_HEIGHT

  const handlePresentVariantModal = useCallback(() => {
    variantSelectionModalRef.current?.present()
  }, [])

  const handleDismissVariantModal = useCallback(() => {
    variantSelectionModalRef.current?.dismiss()
  }, [])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const { refreshControl } = useRefreshs([refetchDress, refetchFeedbacks])

  if (isLoadingDress || isLoadingFeedbacks) {
    return <Loading />
  }

  return (
    <BottomSheetModalProvider>
      <View className='relative flex-1'>
        <View className='z-10 relative'>
          <TouchableOpacity onPress={handleGoBack} className='absolute top-10 left-4 bg-black/50 rounded-full p-1.5'>
            <Feather name='arrow-left' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            className='absolute top-10 right-4 bg-black/50 rounded-full p-1.5'
          >
            <Feather name='shopping-bag' size={24} color='white' />
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1' showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
          <DressCarousel images={dress?.images ?? []} />

          <View className='mb-20'>
            <View className='flex flex-row items-center justify-between px-4 pt-4 pb-2'>
              {hasMultiplePrices && minPrice !== maxPrice ? (
                <View className='flex-row items-center gap-1'>
                  <Text className='text-primary font-inter-semibold text-xl'>
                    <Text className='text-primary underline font-inter-semibold text-sm'>đ</Text>
                    {minPrice ? minPrice.toLocaleString('vi-VN') : '0'} -
                  </Text>
                  <Text className='text-primary font-inter-semibold text-xl'>
                    <Text className='text-primary underline font-inter-semibold text-sm'>đ</Text>
                    {maxPrice ? maxPrice.toLocaleString('vi-VN') : '0'}
                  </Text>
                </View>
              ) : (
                <Text className='text-primary font-inter-semibold text-xl'>
                  <Text className='text-primary underline font-inter-semibold text-sm'>đ</Text>
                  {minPrice?.toLocaleString('vi-VN')}
                </Text>
              )}
              <Text className='font-inter-medium text-xs'>Đã bán {dress?.soldCount}</Text>
            </View>

            <Text className='font-inter-medium my-1 px-4 pb-2' numberOfLines={2}>
              {dress?.name}
            </Text>

            {feedbacks?.feedbacks?.length ? (
              <>
                <View className='bg-muted h-2' />
                <TouchableOpacity
                  className='flex-row items-center gap-1 px-4 py-2'
                  onPress={() =>
                    router.push({
                      pathname: '/product/[id]/feedback',
                      params: {
                        id
                      }
                    })
                  }
                >
                  <Text className='font-inter-medium text-sm'>{feedbacks?.averageRating?.toFixed(1)}</Text>
                  <AntDesign name='star' size={14} color='orange' />
                  <Text className='ml-2 font-inter-medium text-sm flex-1'>
                    Đánh giá sản phẩm{' '}
                    <Text className='text-muted-foreground text-[10px]'>({feedbacks?.totalFeedbacks})</Text>
                  </Text>
                  <Text className='text-muted-foreground text-xs'>Xem tất cả</Text>
                  <Feather name='chevron-right' size={16} color='lightgray' />
                </TouchableOpacity>

                <Separator />

                {feedbacks?.feedbacks?.slice(0, 2).map((feedback, index) => (
                  <View key={feedback.id}>
                    <FeedbackItem feedback={feedback} className='px-4 py-2' />
                    {index !== 1 && <Separator />}
                  </View>
                ))}
              </>
            ) : null}

            <View className='bg-muted h-2' />

            <View className='px-4 pt-4'>
              <Text className='font-inter-medium text-sm'>Mô tả</Text>
              <View
                onLayout={(e) => {
                  if (descriptionHeight === 0) {
                    setDescriptionHeight(e.nativeEvent.layout.height)
                  }
                }}
                style={
                  !isDescriptionExpanded && canExpandDescription
                    ? { maxHeight: COLLAPSED_DESC_HEIGHT, overflow: 'hidden' }
                    : undefined
                }
              >
                <RenderHtml
                  tagsStyles={{
                    p: {
                      color: '#6B7280',
                      fontSize: 12,
                      marginVertical: 4,
                      lineHeight: 16
                    },
                    strong: {
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginTop: 1,
                      marginBottom: 2
                    },
                    ul: {
                      marginVertical: 3,
                      paddingLeft: 16
                    },
                    ol: {
                      marginVertical: 3,
                      paddingLeft: 16
                    },
                    li: {
                      color: '#6B7280',
                      fontSize: 12,
                      lineHeight: 16,
                      paddingLeft: 6
                    }
                  }}
                  renderersProps={{
                    ul: {
                      markerTextStyle: {
                        color: '#6B7280',
                        fontSize: 12,
                        lineHeight: 16,
                        includeFontPadding: false,
                        textAlignVertical: 'center'
                      },
                      markerBoxStyle: {
                        paddingTop: 0,
                        transform: [{ translateY: 4.5 }]
                      }
                    },
                    ol: {
                      markerTextStyle: {
                        color: '#6B7280',
                        fontSize: 12,
                        lineHeight: 16,
                        includeFontPadding: false,
                        textAlignVertical: 'center'
                      },
                      markerBoxStyle: {
                        paddingTop: 0,
                        transform: [{ translateY: 4.5 }]
                      }
                    }
                  }}
                  enableExperimentalMarginCollapsing={true}
                  contentWidth={Dimensions.get('window').width}
                  source={{ html: dress?.description ?? '' }}
                />
              </View>
            </View>
            <Separator />
            {canExpandDescription ? (
              <TouchableOpacity
                className='flex flex-row justify-center items-end gap-1 w-full p-3'
                onPress={() => setIsDescriptionExpanded((prev) => !prev)}
              >
                <Text className='text-xs text-muted-foreground'>{isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                <Feather name={isDescriptionExpanded ? 'chevron-up' : 'chevron-down'} size={16} color='gray' />
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
        <View
          className='absolute bottom-0 bg-background left-0 right-0 px-4 pt-3 flex-row items-center gap-2'
          style={{ paddingBottom: bottom, boxShadow: '0 -2px 6px -1px rgba(0, 0, 0, 0.1)' }}
        >
          <TouchableOpacity
            className='flex-1 flex-row items-center gap-2 justify-center p-2 rounded-xl border border-primary/20 bg-primary/10'
            onPress={handlePresentVariantModal}
          >
            <Feather name='shopping-bag' size={16} color={PRIMARY_COLOR.LIGHT} />
            <Text className='text-sm font-inter-medium text-primary'>Thêm giỏ hàng</Text>
          </TouchableOpacity>
        </View>

        {dress && dress.details && Array.isArray(dress.details) ? (
          <DressVariantSelectionModal
            dressImage={dress.images[0]}
            hasMultiplePrices={Boolean(hasMultiplePrices)}
            minPrice={minPrice ?? 0}
            maxPrice={maxPrice ?? 0}
            ref={variantSelectionModalRef}
            variants={dress.details}
            handleDismissVariantModal={handleDismissVariantModal}
          />
        ) : null}
      </View>
    </BottomSheetModalProvider>
  )
}
