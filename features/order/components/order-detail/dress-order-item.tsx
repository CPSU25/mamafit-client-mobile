import { Image, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { AddOnOption } from '~/types/add-on.type'
import { DressVariant } from '~/types/dress.type'
import { OrderItem } from '~/types/order.type'

interface DressOrderItemProps {
  orderItem: OrderItem
  dress: DressVariant | null
  dressOptions: AddOnOption[]
  quantity: number
}

export default function DressOrderItem({ orderItem, dress, dressOptions, quantity }: DressOrderItemProps) {
  const hasOptions = dressOptions && Array.isArray(dressOptions) && dressOptions.length > 0

  return (
    <View className='p-3 gap-3'>
      <View className='flex-row items-center gap-3'>
        <View className='w-20 h-20 overflow-hidden relative rounded-xl'>
          <Image
            source={{ uri: dress?.image[0] }}
            style={{
              width: '100%',
              height: '180%',
              borderRadius: 12,
              position: 'absolute',
              top: 0,
              left: 0
            }}
            resizeMode='cover'
          />
        </View>

        <View className='flex-1 h-20 justify-between'>
          <View>
            <Text className='native:text-sm font-inter-medium'>{dress?.name || 'Váy có sẵn'}</Text>
            <View className='flex-row items-center justify-between'>
              <Text className='native:text-xs text-muted-foreground'>
                Phân loại: {dress?.color} - {dress?.size}
              </Text>
              <Text className='native:text-xs text-muted-foreground'>x{quantity || 1}</Text>
            </View>
          </View>
          <View className='items-end'>
            <Text className='native:text-xs'>
              <Text className='native:text-xs underline'>đ</Text>
              {orderItem?.price?.toLocaleString('vi-VN') || '0'}
            </Text>
          </View>
        </View>
      </View>

      {hasOptions ? (
        <Card className='p-1 rounded-xl gap-2 bg-mute/5'>
          {dressOptions.map((option) => (
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
              <View className='flex-1 ml-1'>
                <Text className='native:text-sm font-inter-medium' numberOfLines={1}>
                  {option.name}{' '}
                  {option.itemServiceType === 'TEXT' && (
                    <Text className='native:text-xs text-muted-foreground'>({option.value})</Text>
                  )}
                </Text>
                <Text className='native:text-xs text-muted-foreground'>Vị trí: {option.position.name}</Text>
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
    </View>
  )
}
