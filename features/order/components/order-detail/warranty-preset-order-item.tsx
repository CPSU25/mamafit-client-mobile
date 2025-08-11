import { Feather } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useRef } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import WarrantyItemModal from '~/features/warranty-request/components/warranty-item-modal'
import { useGetWarrantyItem } from '~/features/warranty-request/hooks/use-get-warranty-item'
import { getOrderedComponentOptions } from '~/lib/utils'
import { AddOnOption } from '~/types/add-on.type'
import { OrderItem } from '~/types/order.type'
import { Preset, PresetWithComponentOptions } from '~/types/preset.type'

interface WarrantyPresetOrderItemProps {
  orderItem: OrderItem
  preset: Preset | null | undefined
  presetDetail: PresetWithComponentOptions | null | undefined
  presetOptions: AddOnOption[]
  quantity: number | undefined
  isSameOrder: boolean
  isViewMore?: boolean
  onToggleViewMore?: () => void
}

export default function WarrantyPresetOrderItem({
  orderItem,
  preset,
  presetDetail,
  presetOptions,
  quantity,
  isSameOrder,
  isViewMore = false,
  onToggleViewMore
}: WarrantyPresetOrderItemProps) {
  const router = useRouter()
  const warrantyDetailModalRef = useRef<BottomSheetModal>(null)

  const { data: warrantyItem, isLoading: isLoadingWarrantyItem } = useGetWarrantyItem(orderItem.id)

  const orderedComponents = useMemo(
    () => getOrderedComponentOptions(presetDetail?.componentOptions || []),
    [presetDetail?.componentOptions]
  )

  const hasOptions = presetOptions && Array.isArray(presetOptions) && presetOptions.length > 0

  const handleGoToOrder = (orderId: string) => {
    router.push({
      pathname: '/order/[orderId]',
      params: { orderId }
    })
  }

  const handlePresentModal = useCallback(() => {
    warrantyDetailModalRef.current?.present()
  }, [])

  return (
    <View className='gap-2 p-3'>
      <TouchableOpacity onPress={onToggleViewMore}>
        <View className='flex-row items-start gap-2'>
          <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
            <Image source={{ uri: preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
          </View>
          <View className='flex-1 h-20 justify-between'>
            <View>
              <Text className='text-sm font-inter-medium'>
                {preset?.styleName || 'Custom'} Dress - {preset?.sku}
              </Text>
              <View className='flex-row items-center justify-between'>
                <Text className='text-xs text-muted-foreground'>
                  {preset?.styleName ? 'Made-to-Order Custom Style' : 'Tailored Just for You'}
                </Text>
                <Text className='text-xs text-muted-foreground'>x{quantity || 1}</Text>
              </View>
            </View>
            <View className='flex-row items-center gap-2'>
              <Text className='text-xs text-muted-foreground/60 flex-1'>Press for more</Text>
              <Text className='text-xs'>
                <Text className='text-xs underline'>đ</Text>
                {orderItem?.price?.toLocaleString('vi-VN') || '0'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {isViewMore ? (
        <>
          <View className='gap-2'>
            {orderedComponents.length > 0 ? (
              <View className='bg-muted/50 rounded-xl p-3 gap-2'>
                {orderedComponents.map((option) => (
                  <View className='flex-row items-center justify-between' key={option?.componentName}>
                    <Text className='text-xs text-muted-foreground'>{option?.componentName}</Text>
                    <Text className='text-xs font-inter-medium text-foreground'>{option?.name}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {hasOptions ? (
              <>
                <Card className='p-1 rounded-xl gap-2'>
                  {presetOptions.map((option) => (
                    <View key={option.id} className='flex-row items-center px-2 py-0.5 gap-2'>
                      {option.itemServiceType === 'IMAGE' && (
                        <Image source={{ uri: option.value || '' }} className='w-8 h-8 rounded-lg' />
                      )}
                      {option.itemServiceType === 'TEXT' && (
                        <Image source={require('~/assets/icons/font.png')} className='w-8 h-8' />
                      )}
                      {option.itemServiceType === 'PATTERN' && (
                        <Image source={require('~/assets/icons/pattern.png')} className='w-8 h-8' />
                      )}
                      <View className='flex-1'>
                        <Text className='native:text-sm font-inter-medium' numberOfLines={1}>
                          {option.name}{' '}
                          {option.itemServiceType === 'TEXT' && (
                            <Text className='native:text-xs text-muted-foreground'>({option.value})</Text>
                          )}
                        </Text>
                        <Text className='native:text-xs text-muted-foreground'>Position: {option.position.name}</Text>
                      </View>

                      <Text className='native:text-sm font-inter-medium text-blue-600'>
                        <Text className='underline font-inter-medium native:text-xs text-blue-600'>đ</Text>
                        {(quantity ? option.price * quantity : option.price).toLocaleString('vi-VN')}
                        {quantity && quantity > 1 ? ` (x${quantity})` : ''}
                      </Text>
                    </View>
                  ))}
                </Card>
              </>
            ) : null}
            <TouchableOpacity
              onPress={handlePresentModal}
              className='w-full px-4 py-2 rounded-xl flex-row items-center justify-center gap-3 bg-blue-50 border border-blue-100'
            >
              <Feather name='file-text' size={16} color='#2563eb' />
              <Text className='text-sm text-blue-600 font-inter-medium'>View Request Details</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {warrantyItem ? (
        <WarrantyItemModal
          ref={warrantyDetailModalRef}
          warrantyItem={warrantyItem}
          isSameOrder={isSameOrder}
          handleGoToOrder={handleGoToOrder}
        />
      ) : null}
    </View>
  )
}
