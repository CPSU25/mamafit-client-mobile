import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ActivityIndicator, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { OrderItemTemp } from '~/types/order-item.type'
import { PresetWithComponentOptions } from '~/types/preset.type'

interface OrderSummarySectionProps {
  isLoadingShippingFee: boolean
  shippingFee: number | undefined
  renderOrderSummaryContent: () => React.JSX.Element
  iconSize: number
  orderItems: OrderItemTemp<unknown> | null
  preset: PresetWithComponentOptions | null
}

export default function OrderSummarySection({
  isLoadingShippingFee,
  shippingFee,
  renderOrderSummaryContent,
  iconSize,
  orderItems,
  preset
}: OrderSummarySectionProps) {
  return (
    <Card style={[styles.container]}>
      <View className='flex flex-row items-center gap-2 p-3'>
        <MaterialCommunityIcons name='card-text' size={iconSize} color={PRIMARY_COLOR.LIGHT} />
        <Text className='text-sm font-inter-medium'>Order Summary</Text>
      </View>

      <Separator />

      {renderOrderSummaryContent()}

      <Separator />

      <View className='p-3 flex flex-col gap-2'>
        <View className='flex-row items-center gap-2'>
          <MaterialCommunityIcons name='truck-fast' size={iconSize} color='#047857' />
          <Text className='font-inter-medium text-sm'>Shipping Option</Text>
        </View>
        <View className='bg-emerald-50 border border-emerald-200 rounded-2xl py-3 px-4 flex-row items-center justify-center gap-2'>
          <View className='flex-1'>
            <Text className='text-sm font-inter-medium text-emerald-700'>Standard Delivery</Text>
            <Text className='text-xs text-emerald-600'>3-5 business days</Text>
          </View>
          {isLoadingShippingFee ? (
            <ActivityIndicator size={iconSize} color='#047857' />
          ) : (
            <Text className='text-emerald-700 text-sm font-inter-medium'>
              <Text className='underline text-sm text-emerald-700 font-inter-medium'>đ</Text>
              {shippingFee ? shippingFee.toLocaleString('vi-VN') : '0'}
            </Text>
          )}
        </View>
      </View>
      <Separator />
      <View className='p-3 flex flex-row'>
        <Text className='text-sm font-inter-medium flex-1'>
          Total {orderItems?.items && Array.isArray(orderItems.items) ? orderItems.items.length : 0} Item(s)
        </Text>
        <Text className='font-inter-medium'>
          <Text className='underline font-inter-medium text-sm'>đ</Text>
          {preset?.price && preset?.price?.toLocaleString('vi-VN')}
        </Text>
      </View>
    </Card>
  )
}
