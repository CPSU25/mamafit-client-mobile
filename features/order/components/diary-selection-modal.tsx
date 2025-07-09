import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
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
                <Text>{item.name}</Text>
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
