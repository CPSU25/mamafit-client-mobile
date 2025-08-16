import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from '~/components/ui/text'
import { Diary } from '~/types/diary.type'
import DiaryCard from './diary-card'

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
        snapPoints={['50%', '80%']}
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
        <Text className='text-xl font-inter-semibold text-center'>Chọn Nhật Ký</Text>
        <BottomSheetFlatList
          data={diaries}
          keyExtractor={(diary) => diary.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectDiary(item.id)}>
              <DiaryCard isSelected={item.id === selectedDiaryId} diary={item} />
            </TouchableOpacity>
          )}
          contentContainerClassName='p-4 gap-4'
        />
      </BottomSheetModal>
    )
  }
)

DiarySelectionModal.displayName = 'DiarySelectionModal'

export default DiarySelectionModal
