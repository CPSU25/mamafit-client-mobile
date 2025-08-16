import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { PaymentType } from '~/types/order.type'

interface OrderDetailsProps {
  orderCode: string | undefined
  orderPlacedAt: string | undefined
  subTotalAmount: number | undefined
  serviceAmount: number | null | undefined
  voucherDiscountId: string | null | undefined
  discountSubtotal: number | null | undefined
  depositSubtotal: number | null | undefined
  remainingBalance: number | null | undefined
  isViewMoreOrderDetails: boolean
  shippingFee: number | undefined
  paymentType: PaymentType | undefined
  depositRate: number | undefined
  totalAmount: number | undefined
  toggleViewMore: () => void
}

export default function OrderDetails({
  orderCode,
  orderPlacedAt,
  subTotalAmount,
  serviceAmount,
  voucherDiscountId,
  discountSubtotal,
  depositSubtotal,
  isViewMoreOrderDetails,
  remainingBalance,
  paymentType,
  depositRate,
  shippingFee,
  totalAmount,
  toggleViewMore
}: OrderDetailsProps) {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <Card className='bg-muted/5' style={[styles.container, { marginBottom: 48 }]}>
      <View className='px-3 py-2 flex-row items-center gap-2'>
        <MaterialCommunityIcons name='receipt' size={16} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium text-sm'>Chi Tiết Đơn Hàng</Text>
      </View>

      <View className='gap-1 px-3 pb-3'>
        <View className='flex-row items-center gap-2'>
          <Text className='flex-1 text-xs text-muted-foreground/80'>Mã Đơn Hàng</Text>
          <Text className='text-foreground/80 text-xs'>#{orderCode}</Text>
        </View>

        <View className='flex-row items-center gap-2'>
          <Text className='flex-1 text-xs text-muted-foreground/80'>Ngày Đặt</Text>
          <Text className='text-foreground/80 text-xs'>
            {orderPlacedAt ? format(new Date(orderPlacedAt), "MMM dd, yyyy 'lúc' hh:mm a") : 'N/A'}
          </Text>
        </View>

        {isViewMoreOrderDetails ? (
          <View className='gap-1'>
            {subTotalAmount ? (
              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-muted-foreground/80'>Tổng Hàng Hóa</Text>
                <Text className='text-foreground/80 text-xs'>
                  đ{subTotalAmount > 0 ? subTotalAmount.toLocaleString('vi-VN') : '0'}
                </Text>
              </View>
            ) : null}

            {serviceAmount ? (
              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-muted-foreground/80'>Phí Dịch Vụ</Text>
                <Text className='text-foreground/80 text-xs'>
                  đ{serviceAmount > 0 ? serviceAmount.toLocaleString('vi-VN') : '0'}
                </Text>
              </View>
            ) : null}

            {voucherDiscountId && discountSubtotal ? (
              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-muted-foreground/80'>Giảm Giá Voucher</Text>
                <Text className='text-foreground/80 text-xs'>
                  đ{discountSubtotal > 0 ? discountSubtotal.toLocaleString('vi-VN') : '0'}
                </Text>
              </View>
            ) : null}

            {paymentType === PaymentType.Deposit && depositSubtotal ? (
              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-muted-foreground/80'>
                  Tiền Cọc ({depositRate && !isNaN(depositRate) ? `${depositRate * 100}%` : '0%'})
                </Text>
                <Text className='text-foreground/80 text-xs'>
                  đ{depositSubtotal > 0 ? depositSubtotal.toLocaleString('vi-VN') : '0'}
                </Text>
              </View>
            ) : null}

            {paymentType === PaymentType.Deposit && remainingBalance ? (
              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-primary font-inter-medium'>
                  Số Còn Lại ({depositRate && !isNaN(depositRate) ? `${100 - depositRate * 100}%` : '0%'})
                </Text>
                <Text className='text-primary font-inter-medium text-xs'>
                  đ{remainingBalance > 0 ? remainingBalance.toLocaleString('vi-VN') : '0'}
                </Text>
              </View>
            ) : null}

            {shippingFee ? (
              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-muted-foreground/80'>Phí Vận Chuyển</Text>
                <Text className='text-foreground/80 text-xs'>
                  đ{shippingFee > 0 ? shippingFee.toLocaleString('vi-VN') : '0'}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {isViewMoreOrderDetails ? <View className='border-b border-border border-dashed my-2' /> : null}

        <View className='flex-row items-center gap-2'>
          <Text
            className={cn(
              'flex-1 text-xs text-muted-foreground/80',
              isViewMoreOrderDetails && 'font-inter-medium text-foreground text-sm'
            )}
          >
            Tổng Thanh Toán
          </Text>
          <Text className={cn('text-foreground/80 text-xs', isViewMoreOrderDetails && 'font-inter-medium text-sm')}>
            đ{totalAmount ? totalAmount.toLocaleString('vi-VN') : '0'}
          </Text>
        </View>

        <View className='mt-2'>
          {isViewMoreOrderDetails ? (
            <TouchableOpacity className='flex-row items-center gap-1 justify-center p-2' onPress={toggleViewMore}>
              <Text className='text-muted-foreground text-xs'>Thu Gọn</Text>
              <Feather name='chevron-up' color={isDarkColorScheme ? 'lightgray' : 'gray'} size={16} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className='flex-row items-center gap-1 justify-center p-2' onPress={toggleViewMore}>
              <Text className='text-muted-foreground text-xs'>Xem Thêm</Text>
              <Feather name='chevron-down' color={isDarkColorScheme ? 'lightgray' : 'gray'} size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  )
}
