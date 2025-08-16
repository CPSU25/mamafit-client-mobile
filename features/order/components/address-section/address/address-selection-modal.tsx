import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from '~/components/ui/text'
import { Address } from '~/types/address.type'
import AddressCard from './address-card'

interface AddressSelectionModalProps {
  addresses: Address[]
  selectedAddressId?: string
  onSelectAddress: (addressId: string) => void
}

const AddressSelectionModal = forwardRef<BottomSheetModal, AddressSelectionModalProps>(
  ({ addresses, onSelectAddress, selectedAddressId }, ref) => {
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
        <Text className='text-xl font-inter-semibold text-center'>Chọn Địa Chỉ</Text>
        <BottomSheetFlatList
          data={addresses}
          keyExtractor={(address) => address.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectAddress(item.id)}>
              <AddressCard isSelected={item.id === selectedAddressId} address={item} />
            </TouchableOpacity>
          )}
          contentContainerClassName='p-4 gap-2'
        />
      </BottomSheetModal>
    )
  }
)

AddressSelectionModal.displayName = 'AddressSelectionModal'

export default AddressSelectionModal
