import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { addDays, format } from 'date-fns'
import { Image, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { getOrderItemTypeStyle } from '~/features/order/utils'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Order, OrderItem, OrderType } from '~/types/order.type'
import { calculateWarrantyStatus, canSelectOrderItem } from '../utils'
import { WarrantyStatusBadge } from './warranty-status-badge'

interface OrderCardProps {
  order: Order
  selectedWarrantyType: 'free' | 'expired' | null
  warrantyPeriod: number
  warrantyCount: number
  handleSelectOrderItem: (orderItem: OrderItem) => void
  isSelected: (orderItem: OrderItem) => boolean
}

export default function OrderCard({
  order,
  selectedWarrantyType,
  warrantyPeriod,
  warrantyCount,
  handleSelectOrderItem,
  isSelected
}: OrderCardProps) {
  const orderItemTypeSet = [...new Set(order.items.map((item) => item.itemType))]
  const { isFree } = calculateWarrantyStatus(order.receivedAt ?? '', warrantyPeriod)

  const OrderItemRow = ({ orderItem }: { orderItem: OrderItem }) => {
    const canSelect = canSelectOrderItem(
      orderItem,
      selectedWarrantyType,
      order.receivedAt ?? '',
      warrantyPeriod,
      warrantyCount
    )

    const selected = isSelected(orderItem)

    return (
      <TouchableOpacity
        className={`flex-row items-center gap-4 ${canSelect ? 'opacity-100' : 'opacity-40'}`}
        onPress={() => {
          if (canSelect) handleSelectOrderItem(orderItem)
        }}
        disabled={!canSelect}
      >
        <View className='w-5 h-5 border border-border rounded-md justify-center items-center'>
          {selected ? <MaterialCommunityIcons name='check-bold' size={14} color={PRIMARY_COLOR.LIGHT} /> : null}
        </View>
        <View className='flex-1 flex-row items-start gap-2'>
          <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
            <Image source={{ uri: orderItem?.preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
          </View>
          <View className='flex-1 h-20 justify-between'>
            <View>
              <Text className='native:text-sm font-inter-medium'>
                {orderItem?.preset?.styleName || 'Váy Bầu Tùy Chỉnh'}
              </Text>
              <Text className='native:text-xs text-muted-foreground'>SKU: {orderItem?.preset?.sku}</Text>
            </View>
            <View className='flex-row items-center gap-2'>
              {!isFree ? (
                <WarrantyStatusBadge receivedAt={order.receivedAt ?? ''} warrantyPeriod={warrantyPeriod} />
              ) : orderItem.warrantyRound >= warrantyCount ? (
                <View className='px-2 bg-rose-50 border border-rose-100 rounded-lg'>
                  <Text className='native:text-[10px] text-rose-600 font-inter-medium'>Hết lượt bảo hành miễn phí</Text>
                </View>
              ) : (
                <View className='px-2 bg-emerald-50 border border-emerald-100 rounded-lg'>
                  <Text className='native:text-[10px] text-emerald-600 font-inter-medium'>
                    Còn {warrantyCount - orderItem.warrantyRound} lần bảo hành miễn phí
                  </Text>
                </View>
              )}

              <Text className='native:text-xs ml-auto'>x{orderItem?.quantity || 1}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Card style={styles.container}>
      <View className='flex-row items-center gap-2 p-2'>
        {order.type === OrderType.Warranty ? (
          <View className='px-3 py-1.5 bg-blue-50 rounded-lg flex-row items-center gap-1.5'>
            <MaterialIcons name='safety-check' size={14} color='#2563eb' />
            <Text className='text-xs text-blue-600 font-inter-medium'>Đơn bảo hành</Text>
          </View>
        ) : null}

        {orderItemTypeSet.map((type, index) => (
          <View
            key={index}
            className={cn('px-3 py-1.5 rounded-lg flex-row items-center gap-1.5', getOrderItemTypeStyle(type).tagColor)}
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

      <Separator />

      <View className='p-3 gap-2'>
        {order.items.map((orderItem) => (
          <OrderItemRow key={orderItem.id} orderItem={orderItem} />
        ))}
      </View>

      <Separator />

      <View className='p-3 gap-1'>
        <View className='flex-row items-center gap-2'>
          <Text className='flex-1 text-xs text-muted-foreground/80'>Mã đơn</Text>
          <Text className='text-foreground/80 text-xs'>#{order?.code}</Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <Text className='flex-1 text-xs text-muted-foreground/80'>Nhận hàng</Text>
          <Text className='text-foreground/80 text-xs'>
            {order?.receivedAt ? format(new Date(order.receivedAt), "MMM dd, yyyy 'lúc' hh:mm a") : 'N/A'}
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <Text className='flex-1 text-xs text-muted-foreground/80'>Hiệu lực bảo hành</Text>
          <Text className='text-foreground/80 text-xs'>
            {order?.receivedAt
              ? format(addDays(new Date(order.receivedAt), warrantyPeriod), "MMM dd, yyyy 'lúc' hh:mm a")
              : 'N/A'}
          </Text>
        </View>
      </View>
    </Card>
  )
}
