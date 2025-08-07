import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { getShadowStyles, styles } from '~/lib/constants/constants'
import { WarrantyRequest } from '~/types/order.type'

interface WarrantyInfoCardProps {
  warrantyRequest: WarrantyRequest
}

export default function WarrantyInfoCard({ warrantyRequest }: WarrantyInfoCardProps) {
  const router = useRouter()

  const handleGoToOrder = () => {
    router.push({
      pathname: '/order/[orderId]',
      params: { orderId: warrantyRequest.orderId }
    })
  }

  const handleGoToRequestDetail = () => {
    router.push({
      pathname: '/order/warranty/[orderItemId]/detail',
      params: { orderItemId: warrantyRequest.warrantyOrderItemId }
    })
  }

  const formatWarrantyDate = (date: string | undefined) => {
    if (!date) return 'N/A'
    return format(new Date(date), "MMM dd, yyyy 'at' hh:mm a")
  }

  return (
    <LinearGradient
      colors={['#e0f2fe', '#bae6fd', '#7dd3fc']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className='rounded-2xl overflow-hidden'
      style={[styles.container, getShadowStyles('#cdeafe')]}
    >
      <Card className='bg-white/60 border border-blue-100'>
        <TouchableOpacity onPress={handleGoToRequestDetail}>
          <View className='flex-row items-center gap-2 px-3 py-2'>
            <MaterialCommunityIcons name='shield' size={16} color='#1e40af' />
            <Text className='font-inter-medium text-sm text-blue-800'>
              Warranty Information <Text className='text-xs text-blue-600'>(press for more)</Text>
            </Text>
          </View>

          <View className='gap-2'>
            <View className='gap-1 px-3'>
              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-blue-800'>Order Number</Text>
                <Text className='text-blue-700 text-xs'>#{warrantyRequest?.orderCode}</Text>
              </View>

              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-blue-800'>Status</Text>
                <Text className='text-blue-700 text-xs'>{warrantyRequest?.status}</Text>
              </View>

              <View className='flex-row items-center gap-2'>
                <Text className='flex-1 text-xs text-blue-800'>Submitted At</Text>
                <Text className='text-blue-700 text-xs'>{formatWarrantyDate(warrantyRequest?.createdAt)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View className='border-b border-dashed border-blue-300 my-3' />

        <View className='flex-row items-center gap-3 px-3 pb-3'>
          <View className='flex-1'>
            <TouchableOpacity
              onPress={handleGoToOrder}
              className='w-full px-4 py-2 rounded-xl flex-row items-center justify-center gap-3 bg-blue-800'
            >
              <Feather name='link' size={16} color='white' />
              <Text className='text-sm text-white font-inter-medium'>Go To Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </LinearGradient>
  )
}
