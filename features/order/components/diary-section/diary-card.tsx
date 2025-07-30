import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { useGetWeekOfPregnancy } from '~/features/diary/hooks/use-get-week-of-pregnancy'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Diary } from '~/types/diary.type'

interface DiaryCardProps {
  isSelected: boolean
  diary: Diary
}

export default function DiaryCard({ isSelected, diary }: DiaryCardProps) {
  const { data: currentWeekData } = useGetWeekOfPregnancy(diary.id)

  const content = (
    <View className='gap-2'>
      <View className='flex-row justify-between items-start'>
        <View className='flex-row items-center gap-2'>
          <View className={cn('p-2 rounded-xl', isSelected ? 'bg-white/10' : 'bg-primary/10')}>
            <MaterialCommunityIcons name='notebook' size={24} color={isSelected ? 'white' : PRIMARY_COLOR.LIGHT} />
          </View>
          <View>
            <Text className={cn('text-lg font-inter-medium', isSelected && 'text-white')} numberOfLines={1}>
              {diary.name}
            </Text>
            <Text className={cn('text-xs', isSelected ? 'text-white/60' : 'text-muted-foreground')}>
              Week {currentWeekData?.weekOfPregnancy || 0} of pregnancy
            </Text>
          </View>
        </View>
        {diary.isActive ? (
          <Badge variant='default' className={cn('border-0', isSelected ? 'bg-white/20' : 'bg-emerald-500')}>
            <Text className={cn('font-inter-medium', isSelected && 'text-white')}>Active</Text>
          </Badge>
        ) : null}
      </View>

      <View className='px-4 py-2 rounded-xl bg-black/5'>
        <View className='flex-row justify-between'>
          <View className='items-center'>
            <Text className={cn('text-xs mb-1', isSelected ? 'text-white/60' : 'text-muted-foreground')}>Age</Text>
            <Text className={cn('text-xl font-inter-semibold', isSelected && 'text-white')}>{diary.age}</Text>
          </View>
          <View className='items-center'>
            <Text className={cn('text-xs mb-1', isSelected ? 'text-white/60' : 'text-muted-foreground')}>Weight</Text>
            <Text className={cn('text-xl font-inter-semibold', isSelected && 'text-white')}>
              {diary.weight}
              <Text className={cn('text-sm font-inter-medium', isSelected ? 'text-white/60' : 'text-muted-foreground')}>
                kg
              </Text>
            </Text>
          </View>
          <View className='items-center'>
            <Text className={cn('text-xs mb-1', isSelected ? 'text-white/60' : 'text-muted-foreground')}>Height</Text>
            <Text className={cn('text-xl font-inter-semibold', isSelected && 'text-white')}>
              {diary.height}
              <Text className={cn('text-sm font-inter-medium', isSelected ? 'text-white/60' : 'text-muted-foreground')}>
                cm
              </Text>
            </Text>
          </View>
          <View className='items-center'>
            <Text className={cn('text-xs mb-1', isSelected ? 'text-white/60' : 'text-muted-foreground')}>
              Pregnancy
            </Text>
            <Text className={cn('text-xl font-inter-semibold', isSelected && 'text-white')}>
              {diary.numberOfPregnancy}
              <Text className={cn('text-sm font-inter-medium', isSelected ? 'text-white/60' : 'text-muted-foreground')}>
                {diary.numberOfPregnancy === 1
                  ? 'st'
                  : diary.numberOfPregnancy === 2
                    ? 'nd'
                    : diary.numberOfPregnancy === 3
                      ? 'rd'
                      : 'th'}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <Card className='overflow-hidden' style={[styles.container]}>
      {isSelected ? (
        <LinearGradient colors={['#6d28d9', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className='p-2'>
          {content}
        </LinearGradient>
      ) : (
        <View className='p-2'>{content}</View>
      )}
    </Card>
  )
}
