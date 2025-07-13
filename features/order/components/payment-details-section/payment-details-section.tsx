import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { PresetWithComponentOptions } from '~/types/preset.type'

interface PaymentDetailsSectionProps {
  iconSize: number
  preset: PresetWithComponentOptions | null
  shippingFee: number | undefined
  voucherId: string | null
  totalPayment: number
  savedAmount: number
}

export default function PaymentDetailsSection({
  iconSize,
  preset,
  shippingFee,
  voucherId,
  totalPayment,
  savedAmount
}: PaymentDetailsSectionProps) {
  return (
    <Card className='p-3' style={[styles.container]}>
      <View className='flex-row items-center gap-2'>
        <MaterialCommunityIcons name='information' size={iconSize} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium text-sm'>Payment Details</Text>
      </View>
      <View className='flex flex-col gap-2 mt-2'>
        <View className='flex-row items-baseline'>
          <Text className='text-xs text-muted-foreground flex-1'>Merchandise Subtotal</Text>
          <Text className='text-xs text-muted-foreground'>
            <Text className='underline text-xs text-muted-foreground'>đ</Text>
            {preset?.price && preset?.price?.toLocaleString('vi-VN')}
          </Text>
        </View>
        <View className='flex-row items-baseline'>
          <Text className='text-xs text-muted-foreground flex-1'>Shipping Subtotal</Text>
          <Text className='text-xs text-muted-foreground'>
            <Text className='underline text-xs text-muted-foreground'>đ</Text>
            {shippingFee ? shippingFee.toLocaleString('vi-VN') : '0'}
          </Text>
        </View>
        {voucherId ? (
          <View className='flex-row items-baseline'>
            <Text className='text-xs text-muted-foreground flex-1'>Discount Subtotal</Text>
            <Text className='text-xs text-primary'>
              -<Text className='underline text-xs text-primary'>đ</Text>
              {savedAmount.toLocaleString('vi-VN')}
            </Text>
          </View>
        ) : null}
        <Separator />
        <View className='flex-row items-baseline'>
          <Text className='text-sm font-inter-medium flex-1'>Total Payment</Text>
          <Text className='font-inter-medium text-sm'>
            <Text className='underline font-inter-medium text-xs'>đ</Text>
            {totalPayment.toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>
    </Card>
  )
}
