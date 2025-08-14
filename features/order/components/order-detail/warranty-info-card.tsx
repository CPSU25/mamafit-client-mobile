import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { getWarrantyRequestStatus } from '~/features/warranty-request/utils'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { WarrantyRequestDetail } from '~/types/order.type'

interface WarrantyInfoCardProps {
  warrantyRequestDetail: WarrantyRequestDetail | null | undefined
  isSameOrder: boolean
}

export default function WarrantyInfoCard({ warrantyRequestDetail, isSameOrder }: WarrantyInfoCardProps) {
  const router = useRouter()

  const handleGoToOrder = () => {
    if (isSameOrder) {
      router.push(`/order/${warrantyRequestDetail?.originalOrders[0].id}`)
    }
  }

  const formatWarrantyDate = (date: string | undefined) => {
    if (!date) return 'N/A'
    return format(new Date(date), "MMM dd, yyyy 'at' hh:mm a")
  }

  const { text, color, backgroundColor } = getWarrantyRequestStatus(warrantyRequestDetail?.warrantyRequest.status)

  return (
    <Card style={styles.container}>
      <View className='flex-row items-center px-3 py-2'>
        <MaterialCommunityIcons className='mr-2' name='shield' size={16} color='#2563eb' />
        <Text className='font-inter-medium text-sm mr-1.5'>Warranty Information</Text>

        {warrantyRequestDetail?.warrantyRequest?.requestType === 'FEE' ? (
          <View className='px-2 bg-rose-50 border border-rose-100 rounded-lg'>
            <Text className='text-xs font-inter-medium text-rose-600'>Paid Service</Text>
          </View>
        ) : (
          <View className='px-2 bg-emerald-50 border border-emerald-100 rounded-lg'>
            <Text className='text-xs font-inter-medium text-emerald-600'>Free Service</Text>
          </View>
        )}
      </View>

      <View className='gap-2'>
        <View className={cn('gap-1.5 px-3', !isSameOrder && 'pb-3')}>
          {isSameOrder ? (
            <View className='flex-row items-start gap-2'>
              <Text className='flex-1 text-xs text-muted-foreground/80'>Order Number</Text>
              <Text className='text-foreground/80 text-xs'>#{warrantyRequestDetail?.originalOrders[0]?.code}</Text>
            </View>
          ) : null}

          <View className='flex-row items-center gap-2'>
            <Text className='flex-1 text-xs text-muted-foreground/80'>Request Number</Text>
            <Text className='text-foreground/80 text-xs'>#{warrantyRequestDetail?.warrantyRequest?.sku}</Text>
          </View>

          <View className='flex-row items-center gap-2'>
            <Text className='flex-1 text-xs text-muted-foreground/80'>Status</Text>
            <Text className='text-xs px-2 py-0.5 font-inter-medium rounded-lg' style={{ color, backgroundColor }}>
              {text}
            </Text>
          </View>

          {warrantyRequestDetail?.warrantyRequest?.requestType === 'FEE' ? (
            <View className='flex-row items-center gap-2'>
              <Text className='flex-1 text-xs text-muted-foreground/80'>Total Fee</Text>
              <Text className='text-xs px-2 py-0.5 font-inter-medium rounded-lg'>
                {warrantyRequestDetail?.warrantyRequest?.totalFee
                  ? `đ${warrantyRequestDetail?.warrantyRequest?.totalFee.toLocaleString('vi-VN')}`
                  : 'N/A'}
              </Text>
            </View>
          ) : null}

          <View className='flex-row items-center gap-2'>
            <Text className='flex-1 text-xs text-muted-foreground/80'>Submitted At</Text>
            <Text className='text-foreground/80 text-xs'>
              {formatWarrantyDate(warrantyRequestDetail?.warrantyRequest.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {isSameOrder ? (
        <>
          <View className='border-b border-dashed border-muted-foreground/30 my-3' />

          <View className='px-3 pb-3'>
            <TouchableOpacity
              onPress={handleGoToOrder}
              className='w-full px-4 py-2 rounded-xl flex-row items-center justify-center gap-2 bg-blue-600'
            >
              <Feather name='link' size={16} color='white' />
              <Text className='text-sm text-white font-inter-medium'>Go To Order</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </Card>
  )
}
