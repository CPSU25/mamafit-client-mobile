import { Feather } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { Address } from '~/types/address.type'

interface AddressCardProps {
  address?: Address
  fullName?: string
  phoneNumber?: string
  isLoading?: boolean
  onPress: () => void
}

export default function AddressCard({ address, fullName, phoneNumber, isLoading, onPress }: AddressCardProps) {
  const { isDarkColorScheme } = useColorScheme()

  if (isLoading) {
    return <Skeleton className='h-24 w-full rounded-2xl' />
  }

  const isEmptyAddress = !address?.street && !address?.ward && !address?.district && !address?.province

  return (
    <TouchableOpacity onPress={onPress}>
      <Card className='p-3 flex flex-row items-baseline gap-2' style={[styles.container]}>
        <Feather name='map-pin' size={16} color={PRIMARY_COLOR.LIGHT} />
        <View className='flex-1 gap-1'>
          <Text className='font-inter-medium' numberOfLines={1}>
            {fullName} <Text className='text-muted-foreground text-sm'>(+84) {phoneNumber}</Text>
          </Text>
          {isEmptyAddress ? (
            <Text numberOfLines={2} className='text-sm text-rose-500'>
              Add your address to place your order
            </Text>
          ) : (
            <Text numberOfLines={2} className={`text-sm ${isDarkColorScheme ? 'text-white/70' : 'text-black/70'}`}>
              {address?.street}, {address?.ward}, {address?.district}, {address?.province}
            </Text>
          )}
        </View>
        <Feather name='chevron-right' size={20} color='lightgray' className='self-center' />
      </Card>
    </TouchableOpacity>
  )
}
