import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { styles } from '~/lib/constants/constants'
import { formatVnPhone, openInMaps } from '~/lib/utils'
import { Address } from '~/types/address.type'
import { Branch, DeliveryMethod, OrderStatus } from '~/types/order.type'

interface DeliveryInformationProps {
  status: OrderStatus | undefined
  trackingOrderCode: string | null | undefined
  deliveryMethod: DeliveryMethod | undefined
  address: Address | null | undefined
  branch: Branch | null | undefined
  fullName: string | null | undefined
  phoneNumber: string | null | undefined
}

export default function DeliveryInformation({
  status,
  trackingOrderCode,
  deliveryMethod,
  address,
  branch,
  fullName,
  phoneNumber
}: DeliveryInformationProps) {
  const showShippingInfo = status === OrderStatus.Delevering || status === OrderStatus.Completed
  const isDelivery = deliveryMethod === DeliveryMethod.Delivery && address
  const isPickup = deliveryMethod === DeliveryMethod.PickUp && branch

  return (
    <Card className='bg-muted/5' style={styles.container}>
      {showShippingInfo ? (
        <>
          <View className='px-3 py-2 flex-row items-center gap-2'>
            <MaterialCommunityIcons name='truck-fast' size={16} color='#059669' />
            <Text className='font-inter-medium text-sm'>Mã vận đơn</Text>
          </View>

          <View className='flex-1 px-3 pb-3'>
            <Text className='text-xs text-foreground/80'>GHTK Express: {trackingOrderCode}</Text>
          </View>

          <View className='border-b border-dashed border-muted-foreground/30' />
        </>
      ) : null}

      <View className='px-3 py-2 flex-row items-center gap-2'>
        <MaterialCommunityIcons name='map-marker' size={16} color='#059669' />
        <Text className='font-inter-medium text-sm'>Thông tin giao hàng</Text>
      </View>

      <View className='flex-1 px-3 pb-3'>
        {isDelivery ? (
          <>
            <View className='flex-row items-center gap-1.5 mb-0.5'>
              <Text className='text-sm font-inter-medium'>
                {fullName}{' '}
                <Text className='text-muted-foreground text-xs'>
                  {phoneNumber ? formatVnPhone(phoneNumber) : '(thiếu số điện thoại)'}
                </Text>
              </Text>
              <View className='bg-emerald-50 rounded-lg px-2 py-0.5'>
                <Text className='text-xs font-inter-medium text-emerald-600 text-center'>Giao hàng</Text>
              </View>
            </View>
            <Text className='text-xs text-muted-foreground'>
              {address.street}, {address.ward}, {address.district}, {address.province}
            </Text>
          </>
        ) : null}

        {isPickup ? (
          <>
            <View className='flex-row items-center gap-2 mb-0.5'>
              <Text className='text-sm font-inter-medium'>{branch.name}</Text>
              <View className='bg-emerald-50 rounded-lg px-2 py-0.5'>
                <Text className='text-xs font-inter-medium text-emerald-600 text-center'>Nhận tại cửa hàng</Text>
              </View>
            </View>
            <Text className='text-xs text-muted-foreground'>
              {branch.street}, {branch.ward}, {branch.district}, {branch.province}
            </Text>
            <TouchableOpacity
              className='px-4 py-2 rounded-xl flex-row items-center justify-center gap-3 bg-emerald-50 mt-2'
              onPress={() => openInMaps(branch.latitude, branch.longitude)}
            >
              <Feather name='map' size={16} color='#059669' />
              <Text className='text-sm text-emerald-600 font-inter-medium'>Mở Google Maps</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </Card>
  )
}
