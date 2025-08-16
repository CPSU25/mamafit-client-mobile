import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { formatVnPhone } from '~/lib/utils'
import { Address } from '~/types/address.type'

interface PreviewAddressCardProps {
  address: Address
  fullName?: string
  phoneNumber?: string
  onPress: () => void
}

export default function PreviewAddressCard({ address, fullName, phoneNumber, onPress }: PreviewAddressCardProps) {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <TouchableOpacity onPress={onPress}>
      <Card className='p-3 flex flex-row items-start gap-2' style={[styles.container]}>
        <MaterialCommunityIcons name='map-marker' size={18} color={PRIMARY_COLOR.LIGHT} />
        <View className='flex-1 gap-0.5'>
          <Text className='text-sm font-inter-medium' numberOfLines={1}>
            {fullName}{' '}
            <Text className='text-muted-foreground text-xs'>
              {phoneNumber ? formatVnPhone(phoneNumber) : '(thiếu số điện thoại)'}
            </Text>
          </Text>

          <Text numberOfLines={2} className={`text-xs ${isDarkColorScheme ? 'text-white/70' : 'text-black/70'}`}>
            {address?.street}, {address?.ward}, {address?.district}, {address?.province}
          </Text>
        </View>
        <Feather name='chevron-right' size={20} color='lightgray' className='self-center' />
      </Card>
    </TouchableOpacity>
  )
}
