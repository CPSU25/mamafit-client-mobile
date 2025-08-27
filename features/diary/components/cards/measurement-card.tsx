import { formatDistanceToNow } from 'date-fns'
import { ChevronRight, Lock } from 'lucide-react-native'
import { View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Icon } from '~/components/ui/icon'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useGetWeekOfPregnancy } from '~/features/diary/hooks/use-get-week-of-pregnancy'
import { cn } from '~/lib/utils'
import { Measurement } from '~/types/diary.type'

interface MeasurementCardProps {
  measurement: Measurement | undefined
  diaryId: string
}

export default function MeasurementCard({ measurement, diaryId }: MeasurementCardProps) {
  const { data: currentWeekData } = useGetWeekOfPregnancy(diaryId)

  const isActive = currentWeekData?.weekOfPregnancy === measurement?.weekOfPregnancy
  const isLocked = Boolean(measurement?.isLocked)

  return (
    <Card className='p-2 flex flex-row items-center gap-4'>
      <View className='relative'>
        <View
          className={cn(
            'w-16 h-16 rounded-xl items-center justify-center border ',
            isLocked
              ? 'bg-rose-500/10 border-rose-500'
              : isActive
                ? 'bg-emerald-500/10 border-emerald-500'
                : 'bg-muted-foreground/10 border-muted-foreground/30'
          )}
        >
          <Text
            className={cn(
              'font-inter-semibold text-xl',
              isLocked ? 'text-rose-500' : isActive ? 'text-emerald-500' : 'text-muted-foreground'
            )}
          >
            W{measurement?.weekOfPregnancy || 'N/A'}
          </Text>
        </View>
        {isLocked && (
          <View className='absolute -top-1.5 -right-1.5 bg-rose-100 rounded-full p-0.5'>
            <Icon as={Lock} size={12} color='#e11d48' />
          </View>
        )}
      </View>
      <View className='flex-1 gap-0.5'>
        <Text className='text-sm'>
          Cân nặng: <Text className='text-sm font-inter-medium'>{measurement?.weight || 'N/A'} kg</Text>
        </Text>
        <View className='flex-row items-center justify-between gap-2'>
          <View className='flex-row items-center gap-2'>
            <View className='w-2 h-2 rounded-full bg-sky-400' />
            <Text className='text-sm font-inter-medium'>{measurement?.bust || 'N/A'} cm</Text>
          </View>
          <Separator orientation='vertical' className='h-3' />
          <View className='flex-row items-center gap-2'>
            <View className='w-2 h-2 rounded-full bg-rose-400' />
            <Text className='text-sm font-inter-medium'>{measurement?.waist || 'N/A'} cm</Text>
          </View>
          <Separator orientation='vertical' className='h-3' />
          <View className='flex-row items-center gap-2'>
            <View className='w-2 h-2 rounded-full bg-amber-400' />
            <Text className='text-sm font-inter-medium'>{measurement?.hip || 'N/A'} cm</Text>
          </View>
        </View>

        <Text className='text-xs text-muted-foreground'>
          updated {formatDistanceToNow(new Date(measurement?.updatedAt || ''))} ago
        </Text>
      </View>
      <Icon as={ChevronRight} size={20} color='lightgray' />
    </Card>
  )
}
