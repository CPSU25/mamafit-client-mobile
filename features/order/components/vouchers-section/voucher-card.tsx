import { formatDate } from 'date-fns'
import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { FlattenedVoucher } from '~/types/voucher.type'

interface VoucherCardProps {
  voucher: FlattenedVoucher
  errorMessage: string
  isSelected: boolean
}

export default function VoucherCard({ voucher, errorMessage, isSelected }: VoucherCardProps) {
  return (
    <View className='flex-row'>
      <View className='w-8 h-32 bg-emerald-500 rounded-l-xl flex justify-center items-center'>
        {SvgIcon.ticket({
          size: 18,
          color: 'WHITE'
        })}
      </View>
      <View className='flex-1 p-3 border border-y-border border-r-border border-l-transparent flex-row rounded-r-xl'>
        <View className='flex-1'>
          <View className='mb-2'>
            {voucher.discountType === 'FIXED' ? (
              <Text className='font-inter-semibold text-xl text-emerald-500'>
                <Text className='underline font-inter-semibold text-emerald-500 text-lg'>đ</Text>
                {voucher.discountValue.toLocaleString('vi-VN')}
              </Text>
            ) : (
              <Text className='font-inter-semibold text-xl text-emerald-500'>
                {voucher.discountValue}% OFF Capped at{' '}
                <Text className='underline font-inter-semibold text-emerald-500 text-lg'>đ</Text>
                {voucher.maximumDiscountValue.toLocaleString('vi-VN')}
              </Text>
            )}
          </View>
          <Text className='text-sm' numberOfLines={1}>
            Min. Spend <Text className='underline text-sm'>đ</Text>
            {voucher.minimumOrderValue.toLocaleString('vi-VN')}
          </Text>
          <Text className='text-xs text-muted-foreground'>
            Valid till: {formatDate(new Date(voucher.endDate), 'dd/MM/yyyy')}
          </Text>
          {errorMessage && <Text className='text-xs text-rose-500 mt-auto'>{errorMessage}</Text>}
        </View>

        <View className='w-6 h-6 border border-black/50 rounded-full self-center flex justify-center items-center'>
          {isSelected && <View className='w-4 h-4 bg-emerald-500 rounded-full' />}
        </View>
      </View>
    </View>
  )
}
