import { AntDesign, Feather } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { FlatList, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import Ratings from '~/components/ratings'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import DressCarousel from '~/features/dress/components/dress-carousel'
import DressVariantSelectionModal from '~/features/dress/components/dress-variant-selection-modal'
import { useGetDress } from '~/features/dress/hooks/use-get-dress'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

const variations = Array(10)
  .fill(null)
  .map((_, index) => ({
    id: index.toString()
  }))

export default function ProductDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data: dress, isLoading: isLoadingDress, refetch: refetchDress } = useGetDress(id)

  const hasMultiplePrices = dress?.details?.length && dress.details.length > 1

  const minPrice = hasMultiplePrices
    ? Math.min(...dress.details.map((detail) => detail.price))
    : dress?.details[0].price
  const maxPrice = hasMultiplePrices
    ? Math.max(...dress.details.map((detail) => detail.price))
    : dress?.details[0].price

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const { bottom } = useSafeAreaInsets()

  const variantSelectionModalRef = useRef<BottomSheetModal>(null)

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

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev)
  }

  const { refreshControl } = useRefreshs([refetchDress])

  if (isLoadingDress) {
    return <Loading />
  }

  return (
    <BottomSheetModalProvider>
      <View className='relative flex-1'>
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
          <DressCarousel images={dress?.images ?? []} />

          <TouchableOpacity onPress={handleGoBack} className='absolute top-10 left-4 bg-black/50 rounded-full p-1.5'>
            <Feather name='arrow-left' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            className='absolute top-10 right-4 bg-black/50 rounded-full p-1.5'
          >
            <Feather name='shopping-bag' size={24} color='white' />
          </TouchableOpacity>

          <View className='flex flex-col gap-2'>
            <View className='flex flex-row items-center justify-between px-4 pt-4'>
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

            <Text className='font-inter-medium my-1 px-4' numberOfLines={2}>
              {dress?.name}
            </Text>

            <View className='bg-muted h-2' />

            <TouchableOpacity className='flex flex-row items-center gap-1 px-4'>
              <Text className='font-inter-medium'>5.0</Text>
              <AntDesign name='star' size={14} color='orange' />
              <Text className='ml-2 font-inter-medium text-[11px] flex-1'>
                Đánh giá sản phẩm <Text className='text-muted-foreground text-[8px]'>(100)</Text>
              </Text>
              <Text className='text-muted-foreground text-xs'>Xem tất cả</Text>
              <Feather name='chevron-right' size={16} color='lightgray' />
            </TouchableOpacity>
            <Separator />
            <Feedback />
            <Separator />
            <Feedback />
            <View className='bg-muted h-2' />
            <View className='px-4'>
              <Text className='font-inter-medium text-sm'>Mô tả</Text>
              <Text
                className='text-muted-foreground text-sm my-2'
                numberOfLines={isDescriptionExpanded ? undefined : 3}
              >
                THÔNG TIN SẢN PHẨM: Chất liệu: 100% Cotton Màu sắc: Đen Size áo: S/ M Video HƯỚNG DẪN BẢO QUẢN SẢN PHẨM:
                - Khuyển khích giặt bằng tay để giữ được form - Không giặt chung với quần áo sáng màu Không sử dụng nước
                tẩy lên sản phẩm Phơi mặt trong của sản phẩm để giữ được độ bển màu CHÍNH SÁCH ĐỔI SẢN PHẨM: 1. Thời hạn
                đổi sản phẩm: - Victim hỗ trợ đổi sản phẩm trong vòng 7 ngày kể từ khi nhận hàng (bao gồm thời gian
                thông báo đổi với shop và thời gian gửi lại sản phẩm) - Mỗi hóa đơn chỉ được áp dụng tối đa 1 lần đổi
                sản phẩm 2. Điều kiện đổi sản phẩm: Chỉ áp dụng đổi hàng đối với sản phẩm nguyên giá - Sản phẩm phải
                chưa qua sử dụng, còn nguyên tag, bao bì và hóa đơn
              </Text>
            </View>
            <Separator />
            <TouchableOpacity
              onPress={toggleDescription}
              className='flex flex-row justify-center items-end gap-1 w-full mb-28'
            >
              <Text className='text-xs text-muted-foreground'>{isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
              <Feather name={isDescriptionExpanded ? 'chevron-up' : 'chevron-down'} size={16} color='gray' />
            </TouchableOpacity>
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

function Feedback() {
  return (
    <View className='flex flex-col gap-1.5 px-4'>
      <View className='flex flex-row items-center gap-2'>
        <Avatar alt="Zach Nugent's Avatar" className='size-6'>
          <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>
        <Text className='font-inter-medium text-xs'>9u4aclg24u</Text>
      </View>
      <Ratings rating={5} displayCount={false} />
      <Text className='text-muted-foreground text-xs'>Phân loại: Trắng, S</Text>
      <Text numberOfLines={2} className='text-xs'>
        Áo mềm chất ổn, form rộng nha, phù hợp với các bạn cao to mặc vừa che khuyết điểm tốt vừa có gu
      </Text>
      <FlatList
        data={variations}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Image
              source={{
                uri: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDRydmdvZ2ltbHUycTQwc21lODh1anVmY2Exb3VmMXhrbDE1bGZ4ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Dg4TxjYikCpiGd7tYs/giphy.gif'
              }}
              className='size-32 rounded-xl'
            />
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName='gap-2'
      />
    </View>
  )
}
