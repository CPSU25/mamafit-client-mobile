import { Feather } from '@expo/vector-icons'
import { formatDistanceToNow } from 'date-fns'
import { View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useGetWeekOfPregnancy } from '~/features/diary/hooks/use-get-week-of-pregnancy'
import { getShadowStyles, styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Measurement } from '~/types/diary.type'

interface MeasurementCardProps {
  measurement: Measurement | undefined
  diaryId: string
}

export default function MeasurementCard({ measurement, diaryId }: MeasurementCardProps) {
  const { data: weekOfPregnancy } = useGetWeekOfPregnancy(diaryId)

  const isActive = weekOfPregnancy === measurement?.weekOfPregnancy

  return (
    <Card className='p-2 flex flex-row items-center gap-4' style={[styles.container, getShadowStyles()]}>
      <View
        className={cn(
          'w-16 h-16 rounded-xl items-center justify-center border ',
          isActive ? 'bg-emerald-500/10 border-emerald-500' : 'bg-muted-foreground/10 border-muted-foreground/30'
        )}
      >
        <Text className={cn('font-inter-semibold text-xl', isActive ? 'text-emerald-500' : 'text-muted-foreground')}>
          W{measurement?.weekOfPregnancy || 'N/A'}
        </Text>
      </View>
      <View className='flex-1 gap-0.5'>
        <Text className='text-sm'>
          Weight: <Text className='text-sm font-inter-medium'>{measurement?.weight || 'N/A'} kg</Text>
        </Text>
        <View className='flex-row items-center justify-between gap-2'>
          <View className='flex-row items-center gap-1.5'>
            <View className='w-2 h-2 rounded-full bg-sky-400' />
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
