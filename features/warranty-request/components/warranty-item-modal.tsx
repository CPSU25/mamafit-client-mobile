import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { format } from 'date-fns'
import { BlurView } from 'expo-blur'
import { RefreshCcw } from 'lucide-react-native'
import { forwardRef, useMemo } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { Icon } from '~/components/ui/icon'
import { Text } from '~/components/ui/text'
import { VideoThumbnail } from '~/components/ui/video-picker'
import { WarrantyItem } from '~/types/warranty.type'

interface WarrantyItemModalProps {
  warrantyItem: WarrantyItem
  handleRefetchWarrantyItem: () => void
  isRefetching: boolean
}

const WarrantyItemModal = forwardRef<BottomSheetModal, WarrantyItemModalProps>(
  ({ warrantyItem, handleRefetchWarrantyItem, isRefetching }, ref) => {
    const snapPoints = useMemo(() => ['50%', '70%', '90%'], [])

    return (
      <BottomSheetModal
        style={{
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: 16
        }}
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={({ style }) => (
          <BlurView
            experimentalBlurMethod='dimezisBlurView'
            tint='light'
            intensity={5}
            style={[style, { overflow: 'hidden' }]}
          />
        )}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false} className='flex-1'>
          <View className='p-4 gap-4 flex-1'>
            {/* Original Order Number */}
            <View className='gap-2'>
              <View className='flex-row items-center gap-4'>
                <View className='flex-1'>
                  <Text className='font-inter-semibold'>Chi tiết đơn hàng</Text>
                  <Text className='text-muted-foreground text-xs' numberOfLines={1}>
                    Tham Chiếu Đến Đơn Hàng Gốc
                  </Text>
                </View>
                <TouchableOpacity
                  className='p-3 bg-muted rounded-full'
                  onPress={handleRefetchWarrantyItem}
                  disabled={isRefetching}
                >
                  <Icon as={RefreshCcw} size={18} color='black' />
                </TouchableOpacity>
              </View>

              <View className='gap-1 p-3 rounded-2xl border border-border bg-muted/20'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='package-variant' size={16} color='#6b7280' />
                  <Text className='text-xs text-muted-foreground'>Mã đơn gốc</Text>
                </View>
                <Text className='text-sm font-inter-medium'>#{warrantyItem.parentOrder?.code}</Text>
              </View>
            </View>

            <View className='gap-2'>
              <View>
                <Text className='font-inter-semibold'>Chi Tiết Bảo Hành</Text>
                <Text className='text-muted-foreground text-xs'>Chi Tiết bảo hành được cung cấp cho yêu cầu này.</Text>
              </View>

              {/* Estimated Time & Warranty Round */}
              <View className='flex-row items-center gap-2 bg-muted/20'>
                <View className='flex-1 gap-1 p-3 rounded-2xl border border-border'>
                  <View className='flex-row items-center gap-2'>
                    <MaterialCommunityIcons name='clock-outline' size={16} color='#6b7280' />
                    <Text className='text-xs text-muted-foreground'>Thời gian ước tính</Text>
                  </View>
                  <Text className='text-sm font-inter-medium'>
                    {warrantyItem.warrantyRequestItems?.estimateTime
                      ? format(new Date(warrantyItem?.warrantyRequestItems?.estimateTime), 'MMM dd, yyyy')
                      : 'Pending'}
                  </Text>
                </View>
                <View className='gap-1 p-3 rounded-2xl border border-border bg-muted/20'>
                  <View className='flex-row items-center gap-2'>
                    <MaterialCommunityIcons name='numeric' size={16} color='#6b7280' />
                    <Text className='text-xs text-muted-foreground'>Số Lần</Text>
                  </View>
                  <Text className='text-sm font-inter-medium'>{warrantyItem?.warrantyRequestItems?.warrantyRound}</Text>
                </View>
              </View>

              <View className='gap-1 p-3 rounded-2xl bg-emerald-50 border border-emerald-100'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='cash' size={16} color='#059669' />
                  <Text className='text-xs text-emerald-600'>Phí</Text>
                </View>
                <Text className='text-xs font-inter-medium text-emerald-600'>
                  đ
                  <Text className='text-sm font-inter-medium text-emerald-600'>
                    {Number(warrantyItem?.warrantyRequestItems?.fee ?? 0).toLocaleString('vi-VN')}
                  </Text>
                </Text>
              </View>

              <View className='flex-row items-center gap-2'>
                <View className='flex-1 gap-1 p-3 rounded-2xl border border-border bg-muted/20'>
                  <View className='flex-row items-center gap-2'>
                    <MaterialCommunityIcons name='progress-clock' size={16} color='#6b7280' />
                    <Text className='text-xs text-muted-foreground'>Trạng Thái</Text>
                  </View>
                  <Text className='text-sm font-inter-medium'>{warrantyItem?.warrantyRequestItems?.status}</Text>
                </View>
                {warrantyItem.warrantyRequestItems?.trackingCode ? (
                  <View className='flex-1 gap-1 p-3 rounded-2xl border border-border bg-muted/20'>
                    <View className='flex-row items-center gap-2'>
                      <MaterialCommunityIcons name='truck-fast-outline' size={16} color='#6b7280' />
                      <Text className='text-xs text-muted-foreground'>Mã vận đơn</Text>
                    </View>
                    <Text className='text-sm font-inter-medium'>
                      {warrantyItem?.warrantyRequestItems?.trackingCode}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View className='gap-1 rounded-2xl border border-border p-3 bg-muted/20'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='card-text-outline' size={16} color='#6b7280' />
                  <Text className='text-xs text-muted-foreground'>Mô tả</Text>
                </View>
                <Text className='text-sm'>{warrantyItem.warrantyRequestItems?.description}</Text>
              </View>

              <View className='rounded-2xl border border-border bg-muted/20 p-3 gap-2'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='image-outline' size={16} color='#6b7280' />
                  <Text className='text-xs text-muted-foreground'>Ảnh</Text>
                </View>
                <BottomSheetScrollView nestedScrollEnabled horizontal showsHorizontalScrollIndicator={false}>
                  <View className='flex-row items-center gap-2'>
                    {(warrantyItem.warrantyRequestItems?.images ?? []).map((img, index) => (
                      <Image key={index + '-' + img} source={{ uri: img }} className='w-28 h-28 rounded-xl' />
                    ))}
                  </View>
                </BottomSheetScrollView>
              </View>

              <View className='rounded-2xl border border-border bg-muted/20 p-3 gap-2'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='image-outline' size={16} color='#6b7280' />
                  <Text className='text-xs text-muted-foreground'>Video</Text>
                </View>

                {warrantyItem.warrantyRequestItems?.videos &&
                Array.isArray(warrantyItem.warrantyRequestItems?.videos) ? (
                  <BottomSheetScrollView nestedScrollEnabled horizontal showsHorizontalScrollIndicator={false}>
                    <View className='flex-row items-center gap-2'>
                      {(warrantyItem.warrantyRequestItems?.videos ?? []).map((vid, index) => (
                        <VideoThumbnail key={index + '-' + vid} uri={vid} />
                      ))}
                    </View>
                  </BottomSheetScrollView>
                ) : (
                  <Text className='text-xs text-muted-foreground text-center mt-4 mb-6'>Không có video</Text>
                )}
              </View>

              <View className='rounded-2xl bg-rose-50 border border-rose-100 p-3 gap-2'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='cancel' size={16} color='#e11d48' />
                  <Text className='text-xs text-rose-600'>Lý Do Từ Chối</Text>
                </View>
                <Text className='text-xs font-inter-medium text-rose-600'>
                  {warrantyItem.warrantyRequestItems?.rejectedReason || 'Trống'}
                </Text>
              </View>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  }
)

WarrantyItemModal.displayName = 'WarrantyItemModal'

export default WarrantyItemModal
