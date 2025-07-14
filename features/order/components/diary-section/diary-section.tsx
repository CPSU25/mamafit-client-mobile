import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { WarningCard } from '~/components/ui/alert-card'
import { Card } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { Diary } from '~/types/diary.type'
import PreviewDiaryCard from './preview-diary-card'

interface DiarySectionProps {
  isLoading: boolean
  diary: Diary | null
  handlePresentDiaryModal: () => void
}

export default function DiarySection({ isLoading, diary, handlePresentDiaryModal }: DiarySectionProps) {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()

  if (isLoading) {
    return <Skeleton className='rounded-2xl h-32' />
  }

  if (diary) {
    return (
      <Card className='p-1 gap-2' style={[styles.container]}>
        <View
          className={cn(
            'rounded-xl p-2 flex-row items-center gap-2',
            isDarkColorScheme ? 'bg-primary/20' : 'bg-primary/10'
          )}
        >
          {SvgIcon.folderFavorite({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })}
          <View className='flex-1'>
            <Text
              className={cn(
                'font-inter-medium text-sm',
                isDarkColorScheme ? 'text-primary-foreground' : 'text-primary'
              )}
            >
              Choose a diary
            </Text>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-primary-foreground/70' : 'text-primary/70')}>
              This will help shape your maternity dress
            </Text>
          </View>
        </View>
        <PreviewDiaryCard diary={diary} isLoading={isLoading} onPress={handlePresentDiaryModal} />
      </Card>
    )
  }

  return (
    <TouchableOpacity onPress={() => router.push('/diary/create')}>
      <WarningCard title='Oops! No diary found' description='Press to create your diary first to place your order' />
    </TouchableOpacity>
  )
}
