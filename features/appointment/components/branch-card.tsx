import { MaterialCommunityIcons } from '@expo/vector-icons'
import { format, parse } from 'date-fns'
import { Image, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { BranchWithDirection } from '~/types/order.type'

interface BranchCardProps {
  branch: BranchWithDirection
  onPress: () => void
  isFirstBranch: boolean
}

export default function BranchCard({ branch, onPress, isFirstBranch }: BranchCardProps) {
  return (
    <Card className='p-2 gap-2' style={styles.container}>
      <View className='flex-row items-start gap-2'>
        <Image source={{ uri: branch.images[0] }} className='w-24 h-24 rounded-xl' />
        <View className='flex-1 gap-2'>
          <View className='flex-row items-center gap-2'>
            <Text className='font-inter-medium flex-1' numberOfLines={1}>
              {branch.name}
            </Text>
            {isFirstBranch && (
              <View className='bg-emerald-500 px-3 py-1 rounded-xl'>
                <Text className='text-xs font-inter-semibold text-white'>Nearest</Text>
              </View>
            )}
          </View>
          <View className='gap-1'>
            <View className='flex-row items-center gap-1.5'>
              <MaterialCommunityIcons name='storefront' size={14} color={PRIMARY_COLOR.LIGHT} />
              <Text className='flex-1 text-xs text-muted-foreground pr-2' numberOfLines={1}>
                {branch.street}, {branch.ward}, {branch.district}, {branch.province}
              </Text>
            </View>
            <View className='flex-row items-center gap-1.5'>
              <MaterialCommunityIcons name='clock' size={14} color={PRIMARY_COLOR.LIGHT} />
              <Text className='flex-1 text-xs text-muted-foreground pr-2' numberOfLines={1}>
                {format(parse(branch.openingHour, 'HH:mm:ss', new Date()), 'hh:mm a')} -{' '}
                {format(parse(branch.closingHour, 'HH:mm:ss', new Date()), 'hh:mm a')}
              </Text>
            </View>
            <View className='flex-row items-center gap-1.5'>
              <MaterialCommunityIcons name='motorbike' size={14} color={PRIMARY_COLOR.LIGHT} />
              <Text className='flex-1 text-xs text-muted-foreground pr-2' numberOfLines={1}>
                Distance: {branch.distance?.toFixed(1)}km
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onPress} className='bg-primary/10 p-2 rounded-xl flex-row items-center'>
        <MaterialCommunityIcons name='chevron-right' size={24} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium text-primary'>Book Now!</Text>
      </TouchableOpacity>
    </Card>
  )
}
