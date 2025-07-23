import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { FlattenedVoucher } from '~/types/voucher.type'
import PreviewVoucherCard from './preview-voucher-card'

interface VoucherSectionProps {
  iconSize: number
  voucher: FlattenedVoucher | null
  onPress: () => void
  savedAmount: number
}

export default function VouchersSection({ iconSize, voucher, onPress, savedAmount }: VoucherSectionProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card className='p-3 gap-2' style={[styles.container]}>
        <View className='flex-row items-center'>
          <View className='flex-row items-center gap-2 flex-1'>
            <MaterialCommunityIcons name='ticket-percent' size={iconSize} color={PRIMARY_COLOR.LIGHT} />
            <Text className='font-inter-medium text-sm'>MamaFit Vouchers</Text>
          </View>
          <View className='flex flex-row items-center gap-1'>
            <Text className='text-xs text-muted-foreground'>View All</Text>
            <Feather name='chevron-right' size={20} color='lightgray' />
          </View>
        </View>
        {voucher && <PreviewVoucherCard voucher={voucher} savedAmount={savedAmount} />}
      </Card>
    </TouchableOpacity>
  )
}
