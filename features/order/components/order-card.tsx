import { MaterialIcons } from '@expo/vector-icons'
import { Image, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Order, OrderItem, OrderItemType } from '~/types/order.type'
import { getOrderItemTypeStyle } from '../utils'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const orderItemTypeSet = [...new Set(order.items.map((item) => item.itemType))]
  const totalPrice = order.subTotalAmount - (order.discountSubtotal || 0)

  if (orderItemTypeSet.length > 1) {
    return <Text>Invalid Order</Text>
  }

  return (
    <Card className='overflow-hidden' style={styles.container}>
      {/* Tag Section */}
      <View className='p-2'>
        <View className='flex-row items-center gap-2 flex-wrap'>
          {order.type === 'WARRANTY' && (
            <View className='px-3 py-1.5 bg-emerald-100 rounded-xl flex-row items-center gap-1.5'>
              <MaterialIcons name='safety-check' size={14} color='#059669' />
              <Text className='text-xs text-emerald-700 font-inter-semibold'>Warranty Order</Text>
            </View>
          )}
          {orderItemTypeSet.map((type, index) => (
            <View
              key={index}
              className={cn(
                'px-3 py-1.5 rounded-xl flex-row items-center gap-1.5',
                getOrderItemTypeStyle(type).tagColor
              )}
            >
              <MaterialIcons
                name={getOrderItemTypeStyle(type).icon}
                size={14}
                color={getOrderItemTypeStyle(type).iconColor}
              />
              <Text className={cn('text-xs font-inter-semibold', getOrderItemTypeStyle(type).textColor)}>
                {getOrderItemTypeStyle(type).text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Separator />

      {/* Items Section */}
      <View className='p-2 gap-3'>
        {order.items.map((item, index) => {
          let component = null
          if (item.itemType === OrderItemType.Preset && item.preset) {
            component = <PresetOrderItem key={item.id} item={item} />
          }
          if (item.itemType === OrderItemType.DesignRequest && item.designRequest) {
            component = <DesignRequestOrderItem key={item.id} item={item} />
          }
          if (item.itemType === OrderItemType.ReadyToBuy && item.maternityDressDetail) {
            component = <ReadyToBuyOrderItem key={item.id} item={item} />
          }

          if (component) {
            return (
              <View key={item.id}>
                {component}
                {index < order.items.length - 1 && <View className='h-px bg-gray-100 mt-3' />}
              </View>
            )
          }
          return null
        })}
      </View>

      <View className='p-2 bg-muted/70 rounded-xl mx-2 mb-2 mt-3'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-xs font-inter-medium'>#{order.code}</Text>

          <View className='items-end'>
            <Text className='text-xs font-inter-medium'>
              Total {order.items?.length} Item{order.items?.length > 1 ? 's' : ''}:{' '}
              <Text className='text-sm font-inter-medium'>
                <Text className='text-xs font-inter-medium underline'>đ</Text>
                {totalPrice.toLocaleString('vi-VN')}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </Card>
  )
}

const PresetOrderItem = ({ item }: { item: OrderItem }) => {
  const { preset, quantity, price } = item
  const itemPrice = price * quantity

  return (
    <View className='flex-row items-start gap-3'>
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-100'>
        <Image source={{ uri: preset?.images[0] }} className='w-full h-full' resizeMode='contain' />
      </View>
      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='text-sm font-inter-medium'>{preset?.styleName} Dress</Text>
          <View className='flex-row items-center justify-between'>
            <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
              Press to view details
            </Text>
            <Text className='text-xs text-muted-foreground'>x{quantity}</Text>
          </View>
        </View>
        <View className='items-end'>
          <Text className='text-xs font-inter-medium'>
            <Text className='text-xs font-inter-medium underline'>đ</Text>
            {itemPrice.toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>
    </View>
  )
}

const DesignRequestOrderItem = ({ item }: { item: OrderItem }) => {
  const { designRequest, quantity, price } = item
  const itemPrice = price * quantity

  return (
    <View className='flex-row items-start gap-3'>
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-100'>
        <Image source={{ uri: designRequest?.images[0] }} className='w-full h-full' resizeMode='cover' />
      </View>
      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='text-sm font-inter-medium'>Design Request</Text>
          <View className='flex-row items-center justify-between'>
            <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
              {designRequest?.description}
            </Text>
            <Text className='text-xs text-muted-foreground'>x{quantity}</Text>
          </View>
        </View>
        <View className='items-end'>
          <Text className='text-xs font-inter-medium'>
            <Text className='text-xs font-inter-medium underline'>đ</Text>
            {itemPrice.toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>
    </View>
  )
}

const ReadyToBuyOrderItem = ({ item }: { item: OrderItem }) => {
  return <Text>To Be Implemented</Text>
}
