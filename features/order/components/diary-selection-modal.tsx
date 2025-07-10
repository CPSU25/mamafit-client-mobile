import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { forwardRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Diary } from '~/types/diary.type'

interface DiarySelectionModalProps {
  diaries: Diary[]
  selectedDiaryId?: string
  onSelectDiary: (addressId: string) => void
}

const DiarySelectionModal = forwardRef<BottomSheetModal, DiarySelectionModalProps>(
  ({ diaries, onSelectDiary, selectedDiaryId }, ref) => {
    return (
      <BottomSheetModal
        style={{
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
          maxHeight: '100%'
        }}
        ref={ref}
        snapPoints={['50%']}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={({ style }) => (
          <BlurView
            experimentalBlurMethod='dimezisBlurView'
            tint='light'
            intensity={5}
            style={[style, { overflow: 'hidden' }]}
          />
        )}
      >
        <Text className='text-xl font-inter-semibold text-center'>Diary Selection</Text>
        <BottomSheetFlatList
          data={diaries}
          keyExtractor={(diary) => diary.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectDiary(item.id)}>
              <Card className={cn('p-4 gap-1', item.id === selectedDiaryId && 'border-primary bg-primary/10')}>
                <Text className='font-inter-medium'>{item.name}</Text>
                <View className='flex-row items-center gap-2'>
                  <MaterialCommunityIcons name='book' size={18} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='text-xs text-muted-foreground'>Weight: {item?.weight}</Text>
                  <Separator orientation='vertical' className='h-4' />
                  <Text className='text-xs text-muted-foreground'>Height: {item?.height}</Text>
                  <Separator orientation='vertical' className='h-4' />
                  <Text className='text-xs text-muted-foreground'>
                    Pregnancy: {item?.numberOfPregnancy}
                    {item?.numberOfPregnancy === 1
                      ? 'st'
                      : item?.numberOfPregnancy === 2
                        ? 'nd'
                        : item?.numberOfPregnancy === 3
                          ? 'rd'
                          : 'th'}
                  </Text>
                </View>
                {item.isActive && (
                  <Badge variant='default' className='mr-auto mt-1'>
                    <Text className='font-inter-medium'>Active</Text>
                  </Badge>
                )}
              </Card>
            </TouchableOpacity>
          )}
          contentContainerClassName='p-4 gap-2'
        />
      </BottomSheetModal>
    )
  }
)

DiarySelectionModal.displayName = 'DiarySelectionModal'

export default DiarySelectionModal
