import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { WarningCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { ICON_SIZE, PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { Diary, Measurement } from '~/types/diary.type'
import PreviewLatestMeasurement from '../order-detail/preview-latest-measurement'
import PreviewDiaryCard from './preview-diary-card'

interface DiarySectionProps {
  isLoading: boolean
  diary: Diary | null
  latestMeasurement: Measurement | null | undefined
  handlePresentDiaryModal: () => void
  iconSize: number
}

export default function DiarySection({
  isLoading,
  diary,
  latestMeasurement,
  handlePresentDiaryModal,
  iconSize
}: DiarySectionProps) {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { width } = useWindowDimensions()

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
              Chọn nhật ký
            </Text>
            <Text className={cn('text-xs', isDarkColorScheme ? 'text-primary-foreground/70' : 'text-primary/70')}>
              Hãy giúp chúng tôi tạo ra chiếc váy phù hợp nhất
            </Text>
          </View>
        </View>
        <PreviewDiaryCard diary={diary} isLoading={isLoading} onPress={handlePresentDiaryModal} />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <TouchableOpacity className='flex-1 gap-2 px-2 pb-2 flex-row items-center justify-center'>
              <MaterialCommunityIcons name='eye' size={iconSize} color={PRIMARY_COLOR.LIGHT} />
              <Text className='text-sm font-inter-medium text-primary'>Xem Số Đo Gần Nhất</Text>
            </TouchableOpacity>
          </DialogTrigger>
          <DialogContent
            displayCloseButton={false}
            style={{
              padding: 16,
              width: width - 30
            }}
          >
            <PreviewLatestMeasurement measurement={latestMeasurement ?? undefined} />
            <Button variant='outline' onPress={() => setDialogOpen(false)}>
              <Text className='font-inter-medium'>Đóng</Text>
            </Button>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

  return (
    <TouchableOpacity onPress={() => router.push('/diary/create?redirectTo=/order/review')}>
      <WarningCard title='Chưa có nhật ký' description='Vui lòng tạo nhật ký để đặt hàng' />
    </TouchableOpacity>
  )
}
