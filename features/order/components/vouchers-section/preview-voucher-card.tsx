import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { FlattenedVoucher } from '~/types/voucher.type'

interface VoucherCardProps {
  voucher: FlattenedVoucher
  savedAmount: number
}

export default function PreviewVoucherCard({ voucher, savedAmount }: VoucherCardProps) {
  return (
    <View className='flex-row'>
      <View className='w-9 bg-emerald-500 rounded-l-xl flex justify-center items-center'>
        {SvgIcon.ticket({
          size: 18,
          color: 'WHITE'
        })}
      </View>
      <View className='flex-1 p-2 border border-y-border border-r-border border-l-transparent flex-row items-center rounded-r-xl'>
        <Text className='text-xs flex-1 font-inter-medium'>{voucher.code}</Text>
        <Text className='font-inter-semibold text-emerald-500 pr-1'>
          -<Text className='underline font-inter-semibold text-emerald-500 text-sm'>đ</Text>
          {savedAmount.toLocaleString('vi-VN')}
        </Text>
      </View>
    </View>
  )
}
