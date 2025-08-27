import { ChevronRight } from 'lucide-react-native'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '~/components/ui/icon'
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
            <Text className='text-xs text-muted-foreground'>Cân nặng: {diary?.weight}kg</Text>
            <Separator orientation='vertical' className='h-4' />
            <Text className='text-xs text-muted-foreground'>Chiều cao: {diary?.height}cm</Text>
            <Separator orientation='vertical' className='h-4' />
            <Text className='text-xs text-muted-foreground'>Thai kỳ: Lần {diary?.numberOfPregnancy}</Text>
          </View>
        </View>
        <Icon as={ChevronRight} size={20} color='lightgray' />
      </View>
    </TouchableOpacity>
  )
}
