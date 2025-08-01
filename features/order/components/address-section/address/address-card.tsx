import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View } from 'react-native'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Address } from '~/types/address.type'

interface AddressCardProps {
  isSelected: boolean
  address: Address
}

export default function AddressCard({ isSelected, address }: AddressCardProps) {
  return (
    <Card className={cn('p-4 gap-1', isSelected && 'border-primary bg-primary/10')}>
      <Text className='font-inter-medium' numberOfLines={1}>
        {address.street}
      </Text>
      <View className='flex-row addresss-center gap-1'>
        <MaterialCommunityIcons name='map-marker' size={18} color={PRIMARY_COLOR.LIGHT} />
        <Text className='text-sm text-muted-foreground' numberOfLines={1}>
          {address.ward}, {address.district}, {address.province}
        </Text>
      </View>
      {address.isDefault ? (
        <Badge variant='default' className='mr-auto mt-1'>
          <Text className='font-inter-medium'>Default</Text>
        </Badge>
      ) : null}
    </Card>
  )
}
