import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from '~/components/ui/text'
import { Branch } from '~/types/order.type'
import BranchCard from './branch-card'

interface BranchSelectionModalProps {
  branches: Branch[]
  selectedBranchId?: string
  onSelectBranch: (branchId: string) => void
}

const BranchSelectionModal = forwardRef<BottomSheetModal, BranchSelectionModalProps>(
  ({ branches, onSelectBranch, selectedBranchId }, ref) => {
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
        <Text className='text-xl font-inter-medium text-center'>Chọn Chi Nhánh</Text>
        <BottomSheetFlatList
          data={branches}
          keyExtractor={(address) => address.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectBranch(item.id)}>
              <BranchCard isSelected={item.id === selectedBranchId} branch={item} />
            </TouchableOpacity>
          )}
          contentContainerClassName='p-4 gap-2'
        />
      </BottomSheetModal>
    )
  }
)

BranchSelectionModal.displayName = 'BranchSelectionModal'

export default BranchSelectionModal
