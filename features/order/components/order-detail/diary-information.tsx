import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { DiaryDetail } from '~/types/diary.type'
import PreviewLatestMeasurement from './preview-latest-measurement'

interface DiaryInformationProps {
  diary: DiaryDetail | null | undefined
}

export default function DiaryInformation({ diary }: DiaryInformationProps) {
  const { width } = useWindowDimensions()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Card className='bg-muted/5' style={styles.container}>
      <View className='flex-row items-center gap-2 px-3 py-2'>
        <MaterialCommunityIcons name='book-multiple' size={16} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium text-sm'>Thông Tin Nhật Ký</Text>
      </View>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <TouchableOpacity className='flex-1 gap-1 px-3 pb-3'>
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
          </TouchableOpacity>
        </DialogTrigger>
        <DialogContent
          displayCloseButton={false}
          style={{
            padding: 16,
            width: width - 30
          }}
        >
          <PreviewLatestMeasurement measurement={diary?.measurements?.[0]} />
          <Button variant='outline' onPress={() => setDialogOpen(false)}>
            <Text className='font-inter-medium'>Đóng</Text>
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
