import { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { AddOnOption } from '~/types/add-on.type'
import { OrderItem, OrderItemMilestone } from '~/types/order.type'
import { Preset } from '~/types/preset.type'
import OrderItemProgress from './order-item-progress'

interface PresetOrderItemProps {
  orderItem: OrderItem
  preset: Preset | null | undefined
  presetOptions: AddOnOption[]
  quantity: number | undefined
  orderCreatedAt?: string
  milestones?: OrderItemMilestone[] | null
}

export default function PresetOrderItem({
  preset,
  presetOptions,
  quantity,
  orderItem,
  orderCreatedAt,
  milestones
}: PresetOrderItemProps) {
  const hasOptions = presetOptions && Array.isArray(presetOptions) && presetOptions.length > 0

  const [completedMilestones, setCompletedMilestones] = useState<OrderItemMilestone[] | null>(null)
  const [currentMilestone, setCurrentMilestone] = useState<OrderItemMilestone | null>(null)

  useEffect(() => {
    if (!milestones || milestones.length === 0) return

    const nextCurrent = milestones.find((m) => m.progress !== 100 && !m.isDone) || null
    setCurrentMilestone(nextCurrent)
    const completed = [...milestones.filter((m) => m.progress === 100 || m.isDone)]
    setCompletedMilestones(completed)
  }, [milestones])

  return (
    <View className='gap-2 p-3'>
      <View className='flex-row items-start gap-2'>
        <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
          <Image source={{ uri: preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
        </View>
        <View className='flex-1 h-20 justify-between'>
          <View>
            <Text className='text-sm font-inter-medium' numberOfLines={1}>
              {preset?.styleName || 'Custom'} Dress
            </Text>

            <View className='flex-row items-center gap-2'>
              <Text className='text-xs text-muted-foreground flex-1'>{preset?.sku ? `SKU: ${preset?.sku}` : ''}</Text>
              <Text className='text-xs text-muted-foreground'>x{quantity || 1}</Text>
            </View>
          </View>
          <View className='items-end'>
            <Text className='text-xs'>
              <Text className='text-xs underline'>đ</Text>
              {orderItem?.price?.toLocaleString('vi-VN') || '0'}
            </Text>
          </View>
        </View>
      </View>

      {hasOptions ? (
        <Card className='p-1 rounded-xl gap-2 bg-mute/5'>
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
      ) : null}

      <OrderItemProgress
        completedMilestones={completedMilestones}
        currentMilestone={currentMilestone}
        milestones={milestones}
        createdAt={orderCreatedAt}
      />
    </View>
  )
}
