import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import { useGetWarrantyItem } from '~/features/warranty-request/hooks/use-get-warranty-item'
import { styles } from '~/lib/constants/constants'
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
          </View>

          {isLoadingWarrantyItem ? (
            <Skeleton className='w-full h-20 rounded-xl' />
          ) : (
            <View className='gap-3'>
              <Card style={styles.container}>
                <View className='flex-row items-center gap-2 px-3 py-2'>
                  <MaterialCommunityIcons name='card-text' size={16} color='#2563eb' />
                  <Text className='font-inter-medium text-sm'>Warranty Details</Text>
                </View>

                <Separator />

                <View className='p-2 gap-1'>
                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-muted-foreground/80'>Original Order Number</Text>
                    <Text className='text-foreground/80 text-xs'>#{warrantyItem?.parentOrder?.code}</Text>
                  </View>

                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-muted-foreground/80'>Estimation Time</Text>
                    <Text className='text-foreground/80 text-xs'>
                      {warrantyItem?.warrantyRequestItems?.estimateTime
                        ? format(new Date(warrantyItem?.warrantyRequestItems?.estimateTime), 'MMM dd, yyyy')
                        : 'Not Yet'}
                    </Text>
                  </View>

                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-muted-foreground/80'>Warranty Round</Text>
                    <Text className='text-foreground/80 text-xs'>
                      {warrantyItem?.warrantyRequestItems?.warrantyRound}
                    </Text>
                  </View>

                  <View className='flex-row items-center gap-2'>
                    <Text className='flex-1 text-xs text-muted-foreground/80'>Warranty Fee</Text>
                    <Text className='text-foreground/80 text-xs'>
                      đ
                      {warrantyItem?.warrantyRequestItems?.fee
                        ? warrantyItem?.warrantyRequestItems?.fee.toLocaleString('vi-VN')
                        : '0'}
                    </Text>
                  </View>

                  <Separator className='my-2' />

                  <View>
                    <Text className='text-xs text-muted-foreground/80'>Description</Text>
                    <Text className='text-xs text-foreground/80' numberOfLines={2}>
                      {warrantyItem?.warrantyRequestItems?.description}
                    </Text>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className='flex-row items-center gap-2 mt-2'>
                      {warrantyItem?.warrantyRequestItems?.images?.map((img, index) => (
                        <Image key={index} source={{ uri: img }} className='w-20 h-20 rounded-lg bg-muted/30' />
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {!isSameOrder ? (
                  <>
                    <View className='flex-row items-center gap-3 px-2 pb-2'>
                      <TouchableOpacity
                        onPress={() => handleGoToOrder(warrantyItem?.parentOrder?.id ?? '')}
                        className='w-full px-4 py-2 rounded-xl flex-row items-center justify-center gap-3 bg-blue-600'
                      >
                        <Feather name='link' size={16} color='white' />
                        <Text className='text-sm text-white font-inter-medium'>Go To Order</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}
              </Card>
            </View>
          )}
        </>
      ) : null}
    </View>
  )
}
