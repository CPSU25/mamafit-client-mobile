import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { cn } from '~/lib/utils'
import { Order, OrderItem, OrderItemType, OrderStatus, OrderType } from '~/types/order.type'
import { getOrderItemTypeStyle } from '../utils'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const router = useRouter()

  const orderItemTypeSet = [...new Set(order.items.map((item) => item.itemType))]

  const totalPrice = order.subTotalAmount - (order.discountSubtotal || 0)

  const isDisplayPayButton = order.status === OrderStatus.Created || order.status === OrderStatus.AwaitingPaidRest

  if (orderItemTypeSet.length > 1) {
    return <Text>Invalid Order</Text>
  }

  return (
    <Card className='overflow-hidden'>
      {/* Tag Section */}
      <View className='p-2'>
        <View className='flex-row items-center gap-2 flex-wrap'>
          {order.type === OrderType.Warranty ? (
            <View className='px-3 py-1.5 bg-rose-50 rounded-xl flex-row items-center gap-1.5'>
              <MaterialIcons name='safety-check' size={14} color='#e11d48' />
              <Text className='text-xs text-rose-600 font-inter-medium'>Warranty Order</Text>
            </View>
          ) : null}
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
              <Text className={cn('text-xs font-inter-medium', getOrderItemTypeStyle(type).textColor)}>
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

      <View className='m-2 items-end'>
        <Text className='text-xs'>
          Total {order.items?.length} Item{order.items?.length > 1 ? 's' : ''}:{' '}
          <Text className='text-sm font-inter-semibold'>
            <Text className='text-xs font-inter-semibold underline'>đ</Text>
            {totalPrice.toLocaleString('vi-VN')}
          </Text>
        </Text>
      </View>

      <View className='px-2 pb-2 flex-row justify-end gap-2'>
        <TouchableOpacity
          className='px-6 py-2 border border-border rounded-xl items-center'
          onPress={() =>
            router.push({
              pathname: '/order/[orderId]',
              params: {
                orderId: order.id
              }
            })
          }
        >
          <Text className='text-sm font-inter-medium'>View Details</Text>
        </TouchableOpacity>
        {isDisplayPayButton ? (
          <TouchableOpacity
            className='px-6 py-2 bg-emerald-50 rounded-xl items-center border border-emerald-50'
            onPress={() =>
              router.push({
                pathname: '/payment/[orderId]/qr-code',
                params: {
                  orderId: order.id
                }
              })
            }
          >
            <Text className='text-sm font-inter-medium text-emerald-600'>Pay Now</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Card>
  )
}

const PresetOrderItem = ({ item }: { item: OrderItem }) => {
  const { preset, quantity, price } = item
  const itemPrice = price * quantity

  return (
    <View className='flex-row items-start gap-3'>
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-50'>
        <Image source={{ uri: preset?.images[0] }} className='w-full h-full' resizeMode='contain' />
      </View>
      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='text-sm font-inter-medium'>{preset?.styleName} Dress</Text>
          <View className='flex-row items-center justify-between'>
            <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
              Custom Made-to-Order
            </Text>
            <Text className='text-xs text-muted-foreground'>x{quantity}</Text>
          </View>
        </View>
        <View className='items-end'>
          <Text className='text-xs'>
            <Text className='text-xs underline'>đ</Text>
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
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-gray-50'>
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
          <Text className='text-xs'>
            <Text className='text-xs underline'>đ</Text>
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
