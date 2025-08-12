import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { format } from 'date-fns'
import { BlurView } from 'expo-blur'
import { forwardRef, useMemo } from 'react'
import { Image, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { WarrantyItem } from '~/types/order.type'

interface WarrantyItemModalProps {
  warrantyItem: WarrantyItem
  isSameOrder: boolean
  handleGoToOrder: (orderId: string) => void
}

const WarrantyItemModal = forwardRef<BottomSheetModal, WarrantyItemModalProps>(
  ({ warrantyItem, isSameOrder, handleGoToOrder }, ref) => {
    const snapPoints = useMemo(() => ['50%', '70%', '90%'], [])

    return (
      <BottomSheetModal
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
          elevation: 6
        }}
        backgroundStyle={{ borderRadius: 16 }}
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
              <View>
                <Text className='font-inter-semibold'>Order Details</Text>
                <Text className='text-muted-foreground text-xs'>
                  Reference to the original order associated with this request.
                </Text>
              </View>

              <View className='gap-1 px-3 py-2 rounded-2xl border border-border'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='package-variant' size={16} color='#6b7280' />
                  <Text className='text-xs text-muted-foreground'>Original Order Number</Text>
                </View>
                <Text className='text-sm font-inter-medium'>#{warrantyItem.parentOrder?.code}</Text>
              </View>
            </View>

            <View className='gap-2'>
              <View>
                <Text className='font-inter-semibold'>Warranty Details</Text>
                <Text className='text-muted-foreground text-xs'>
                  Details of the warranty provided for this request.
                </Text>
              </View>

              {/* Estimated Time & Warranty Round */}
              <View className='flex-row items-center gap-2'>
                <View className='flex-1 gap-1 px-3 py-2 rounded-2xl border border-border'>
                  <View className='flex-row items-center gap-2'>
                    <MaterialCommunityIcons name='clock-outline' size={16} color='#6b7280' />
                    <Text className='text-xs text-muted-foreground'>Estimated Time</Text>
                  </View>
                  <Text className='text-sm font-inter-medium'>
                    {warrantyItem.warrantyRequestItems?.estimateTime
                      ? format(new Date(warrantyItem?.warrantyRequestItems?.estimateTime), 'MMM dd, yyyy')
                      : 'Pending'}
                  </Text>
                </View>
                <View className='gap-1 px-3 py-2 rounded-2xl border border-border'>
                  <View className='flex-row items-center gap-2'>
                    <MaterialCommunityIcons name='numeric' size={16} color='#6b7280' />
                    <Text className='text-xs text-muted-foreground'>Round</Text>
                  </View>
                  <Text className='text-sm font-inter-medium'>{warrantyItem?.warrantyRequestItems?.warrantyRound}</Text>
                </View>
              </View>

              <View className='gap-1 px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-100'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='cash' size={16} color='#059669' />
                  <Text className='text-xs text-emerald-600'>Fee</Text>
                </View>
                <Text className='text-xs font-inter-medium text-emerald-600'>
                  đ
                  <Text className='text-sm font-inter-medium text-emerald-600'>
                    {Number(warrantyItem?.warrantyRequestItems?.fee ?? 0).toLocaleString('vi-VN')}
                  </Text>
                </Text>
              </View>

              <View className='flex-row items-center gap-2'>
                <View className='flex-1 gap-1 px-3 py-2 rounded-2xl border border-border'>
                  <View className='flex-row items-center gap-2'>
                    <MaterialCommunityIcons name='progress-clock' size={16} color='#6b7280' />
                    <Text className='text-xs text-muted-foreground'>Status</Text>
                  </View>
                  <Text className='text-sm font-inter-medium'>{warrantyItem?.warrantyRequestItems?.status}</Text>
                </View>
                {warrantyItem.warrantyRequestItems?.trackingCode ? (
                  <View className='flex-1 gap-1 px-3 py-2 rounded-2xl border border-border'>
                    <View className='flex-row items-center gap-2'>
                      <MaterialCommunityIcons name='truck-fast-outline' size={16} color='#6b7280' />
                      <Text className='text-xs text-muted-foreground'>Tracking Code</Text>
                    </View>
                    <Text className='text-sm font-inter-medium'>
                      {warrantyItem?.warrantyRequestItems?.trackingCode}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View className='gap-1 px-3 py-2 rounded-2xl border border-border'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='card-text-outline' size={16} color='#6b7280' />
                  <Text className='text-xs text-muted-foreground'>Description</Text>
                </View>
                <Text className='text-sm'>{warrantyItem.warrantyRequestItems?.description}</Text>
              </View>

              <View className='gap-1 px-3 py-2 rounded-2xl border border-border'>
                <View className='flex-row items-center gap-2 mb-1'>
                  <MaterialCommunityIcons name='image-outline' size={16} color='#6b7280' />
                  <Text className='text-xs text-muted-foreground'>Images</Text>
                </View>
                <BottomSheetScrollView nestedScrollEnabled horizontal showsHorizontalScrollIndicator={false}>
                  <View className='flex-row items-center gap-2'>
                    {(warrantyItem.warrantyRequestItems?.images ?? []).map((img) => (
                      <Image
                        key={warrantyItem.warrantyRequestItems?.warrantyRequestId + img}
                        source={{ uri: img }}
                        className='w-28 h-28 rounded-xl'
                      />
                    ))}
                  </View>
                </BottomSheetScrollView>
              </View>

              <View className='gap-1 px-3 py-2 rounded-2xl bg-rose-50 border border-rose-100'>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='cancel' size={16} color='#e11d48' />
                  <Text className='text-xs text-rose-600'>Reject Reason</Text>
                </View>
                <Text className='text-xs font-inter-medium text-rose-600'>
                  {warrantyItem.warrantyRequestItems?.rejectedReason || 'Empty'}
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
