import { Feather } from '@expo/vector-icons'
import { formatDistanceToNow } from 'date-fns'
import { View } from 'react-native'
import { getShadowStyles, styles } from '~/lib/constants/constants'
import { Measurement } from '~/types/diary.type'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

interface MeasurementCardProps {
  measurement: Measurement | undefined
}

export default function MeasurementCard({ measurement }: MeasurementCardProps) {
  return (
    <Card className='p-2 flex flex-row items-center gap-4' style={[styles.container, getShadowStyles()]}>
      <View className='w-16 h-16 rounded-xl bg-primary/10 items-center justify-center border border-primary/30'>
        <Text className='text-primary font-inter-semibold text-2xl'>W{measurement?.weekOfPregnancy || 'N/A'}</Text>
      </View>
      <View className='flex-1 gap-0.5'>
        <Text className='text-sm'>
          Weight: <Text className='text-sm font-inter-medium'>{measurement?.weight || 'N/A'} kg</Text>
        </Text>
        <View className='flex-row items-center justify-between gap-2'>
          <View className='flex-row items-center gap-1.5'>
            <View className='w-2 h-2 rounded-full bg-emerald-400' />
            <Text className='text-sm font-inter-medium'>{measurement?.bust || 'N/A'} cm</Text>
          </View>
          <Separator orientation='vertical' className='h-3' />
          <View className='flex-row items-center gap-1.5'>
            <View className='w-2 h-2 rounded-full bg-rose-400' />
            <Text className='text-sm font-inter-medium'>{measurement?.waist || 'N/A'} cm</Text>
          </View>
          <Separator orientation='vertical' className='h-3' />
          <View className='flex-row items-center gap-1.5'>
            <View className='w-2 h-2 rounded-full bg-amber-400' />
            <Text className='text-sm font-inter-medium'>{measurement?.hip || 'N/A'} cm</Text>
          </View>
        </View>

        <Text className='text-xs text-muted-foreground'>
          updated {formatDistanceToNow(new Date(measurement?.updatedAt || ''))} ago
        </Text>
      </View>
      <Feather name='chevron-right' size={20} color='lightgray' />
    </Card>
  )
}
