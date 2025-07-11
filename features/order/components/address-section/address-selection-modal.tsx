import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { forwardRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Address } from '~/types/address.type'

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
        <Text className='text-xl font-inter-semibold text-center'>Address Selection</Text>
        <BottomSheetFlatList
          data={addresses}
          keyExtractor={(address) => address.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectAddress(item.id)}>
              <Card className={cn('p-4 gap-1', item.id === selectedAddressId && 'border-primary bg-primary/10')}>
                <Text className='font-inter-medium' numberOfLines={1}>
                  {item.street}
                </Text>
                <View className='flex-row items-center gap-1'>
                  <MaterialCommunityIcons name='map-marker' size={18} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='text-sm text-muted-foreground' numberOfLines={1}>
                    {item.ward}, {item.district}, {item.province}
                  </Text>
                </View>
                {item.isDefault && (
                  <Badge variant='default' className='mr-auto mt-1'>
                    <Text className='font-inter-medium'>Default</Text>
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

AddressSelectionModal.displayName = 'AddressSelectionModal'

export default AddressSelectionModal
