import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { calculateWarrantyStatus } from '~/features/warranty-request/utils'

interface WarrantyStatusBadgeProps {
  receivedAt: string
  warrantyPeriod: number
}

export const WarrantyStatusBadge = ({ receivedAt, warrantyPeriod }: WarrantyStatusBadgeProps) => {
  const { isFree, daysLeft } = calculateWarrantyStatus(receivedAt, warrantyPeriod)

  if (isFree) {
    return (
      <View className='px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg'>
        <Text className='native:text-xs text-emerald-600 font-inter-medium'>{daysLeft} ngày để bảo hành miễn phí</Text>
      </View>
    )
  }

  return (
    <View className='px-2 py-1 bg-rose-50 border border-rose-100 rounded-lg'>
      <Text className='native:text-xs text-rose-600 font-inter-medium'>Bảo hành miễn phí hết hạn</Text>
    </View>
  )
}
