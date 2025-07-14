import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Branch } from '~/types/order.type'

interface BranchCardProps {
  isSelected: boolean
  branch: Branch
}

export default function BranchCard({ isSelected, branch }: BranchCardProps) {
  return (
    <Card className={cn('p-2 flex-row gap-3', isSelected && 'border-primary bg-primary/10')}>
      <Image source={{ uri: branch.images[0] }} className='w-20 h-20 rounded-xl' />
      <View className='flex-1 justify-between'>
        <Text className='text-lg font-inter-medium' numberOfLines={1}>
          {branch.name}
        </Text>
        <View className='gap-1'>
          <Text className='text-sm' numberOfLines={1}>
            {branch.street}
          </Text>
          <View className='flex-row items-center gap-1'>
            <MaterialCommunityIcons name='storefront' size={14} color={PRIMARY_COLOR.LIGHT} />
            <Text className='text-xs text-muted-foreground' numberOfLines={1}>
              {branch.ward}, {branch.district}, {branch.province}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  )
}
