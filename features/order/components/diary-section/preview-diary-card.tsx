import { Feather } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import { Diary } from '~/types/diary.type'

interface PreviewDiaryCardProps {
  diary: Diary
  isLoading?: boolean
  onPress: () => void
}

export default function PreviewDiaryCard({ diary, isLoading, onPress }: PreviewDiaryCardProps) {
  if (isLoading) {
    return <Skeleton className='h-16 w-full rounded-2xl' />
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View className='p-2 flex-row items-center'>
        <View className='flex-1 gap-1'>
          <Text className='font-inter-medium' numberOfLines={1}>
            {diary?.name} <Text className='text-xs text-muted-foreground'>({diary?.age} tuổi)</Text>
          </Text>
          <View className='flex-row items-center gap-2'>
            <Text className='text-xs text-muted-foreground'>Cân Nặng: {diary?.weight}kg</Text>
            <Separator orientation='vertical' className='h-4' />
            <Text className='text-xs text-muted-foreground'>Chiều Cao: {diary?.height}cm</Text>
            <Separator orientation='vertical' className='h-4' />
            <Text className='text-xs text-muted-foreground'>
              Thai Kỳ: {diary?.numberOfPregnancy}
              {diary?.numberOfPregnancy === 1
                ? 'st'
                : diary?.numberOfPregnancy === 2
                  ? 'nd'
                  : diary?.numberOfPregnancy === 3
                    ? 'rd'
                    : 'th'}
            </Text>
          </View>
        </View>
        <Feather name='chevron-right' size={20} color='lightgray' />
      </View>
    </TouchableOpacity>
  )
}
