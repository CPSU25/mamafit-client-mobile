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
  return (
    <Card className='bg-muted/5' style={styles.container}>
      {status === OrderStatus.Delevering || status === OrderStatus.Completed ? (
        <>
          <View className='px-3 py-2 flex-row items-center gap-2'>
            <MaterialCommunityIcons name='truck-fast' size={16} color='#059669' />
            <Text className='font-inter-medium text-sm'>Shipping Information</Text>
          </View>

          <View className='flex-1 px-3 pb-3'>
            <Text className='text-xs text-foreground/80'>GHTK Express: {trackingOrderCode}</Text>
          </View>

          <View className='border-b border-dashed border-muted-foreground/30' />
        </>
      ) : null}

      <View className='px-3 py-2 flex-row items-center gap-2'>
        <MaterialCommunityIcons name='map-marker' size={16} color='#059669' />
        <Text className='font-inter-medium text-sm'>Delivery Information</Text>
      </View>

      <View className='flex-1 px-3 pb-3'>
        {deliveryMethod === DeliveryMethod.Delivery && address ? (
          <>
            <View className='flex-row items-center gap-1.5 mb-0.5'>
              <Text className='text-sm font-inter-medium' numberOfLines={1}>
                {fullName}{' '}
                <Text className='text-muted-foreground text-xs'>
                  {phoneNumber ? formatVnPhone(phoneNumber) : '(missing phone number)'}
                </Text>
              </Text>
              <View className='bg-emerald-50 rounded-lg px-2 py-0.5'>
                <Text className='text-xs font-inter-medium text-emerald-600 text-center'>Ship</Text>
              </View>
            </View>
            <Text className='text-xs text-muted-foreground' numberOfLines={2}>
              {address.street}, {address.ward}, {address.district}, {address.province}
            </Text>
          </>
        ) : null}

        {deliveryMethod === DeliveryMethod.PickUp && branch ? (
          <>
            <View className='flex-row items-center gap-2 mb-0.5'>
              <Text className='text-sm font-inter-medium'>{branch.name}</Text>
              <View className='bg-emerald-50 rounded-lg px-2 py-0.5'>
                <Text className='text-xs font-inter-medium text-emerald-600 text-center'>Pickup</Text>
              </View>
            </View>
            <Text className='text-xs text-muted-foreground' numberOfLines={2}>
              {branch.street}, {branch.ward}, {branch.district}, {branch.province}
            </Text>
            <TouchableOpacity
              className='px-4 py-2 rounded-xl flex-row items-center justify-center gap-3 bg-emerald-50 mt-2'
              onPress={() => openInMaps(branch.latitude, branch.longitude)}
            >
              <Feather name='map' size={16} color='#059669' />
              <Text className='text-sm text-emerald-600 font-inter-medium'>Open In Maps</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </Card>
  )
}
