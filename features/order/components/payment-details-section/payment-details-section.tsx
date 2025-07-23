import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { PaymentType } from '../../validations'

interface PaymentDetailsSectionProps {
  iconSize: number
  fullMerchandiseTotal: number
  shippingFee: number | undefined
  totalPaymentNow: number
  savedAmount: number
  paymentType: PaymentType
  payableMerchandisePortion: number
  addOnsSubtotal: number
  addOnsCount: number
  depositRate: number
}

export default function PaymentDetailsSection({
  iconSize,
  fullMerchandiseTotal,
  shippingFee,
  totalPaymentNow,
  savedAmount,
  paymentType,
  payableMerchandisePortion,
  addOnsSubtotal,
  addOnsCount,
  depositRate
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
            {fullMerchandiseTotal.toLocaleString('vi-VN')}
          </Text>
        </View>

        {savedAmount > 0 ? (
          <View className='flex-row items-baseline'>
            <Text className='text-xs text-muted-foreground flex-1'>Voucher Discount</Text>
            <Text className='text-xs text-primary'>
              -<Text className='underline text-xs text-primary'>đ</Text>
              {savedAmount.toLocaleString('vi-VN')}
            </Text>
          </View>
        ) : null}

        {paymentType === PaymentType.DEPOSIT && payableMerchandisePortion > 0 ? (
          <View className='flex-row items-baseline'>
            <Text className='text-xs text-muted-foreground flex-1'>Deposit Subtotal ({depositRate * 100}%)</Text>
            <Text className='text-xs text-muted-foreground'>
              <Text className='underline text-xs text-muted-foreground'>đ</Text>
              {payableMerchandisePortion.toLocaleString('vi-VN')}
            </Text>
          </View>
        ) : null}

        {addOnsSubtotal > 0 && addOnsCount > 0 && (
          <View className='flex-row items-baseline'>
            <Text className='text-xs text-muted-foreground flex-1'>Add-ons Subtotal ({addOnsCount})</Text>
            <Text className='text-xs text-muted-foreground'>
              <Text className='underline text-xs text-muted-foreground'>đ</Text>
              {addOnsSubtotal.toLocaleString('vi-VN')}
            </Text>
          </View>
        )}

        <View className='flex-row items-baseline'>
          <Text className='text-xs text-muted-foreground flex-1'>Shipping Subtotal</Text>
          <Text className='text-xs text-muted-foreground'>
            <Text className='underline text-xs text-muted-foreground'>đ</Text>
            {shippingFee ? shippingFee.toLocaleString('vi-VN') : '0'}
          </Text>
        </View>

        <Separator className='my-1' />

        <View className='flex-row items-baseline'>
          <Text className='font-inter-medium text-sm flex-1'>Total Payment</Text>
          <Text className='font-inter-medium text-sm'>
            <Text className='underline font-inter-medium text-sm'>đ</Text>
            {totalPaymentNow.toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>
    </Card>
  )
}
