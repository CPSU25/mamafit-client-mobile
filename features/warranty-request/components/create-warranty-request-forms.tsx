import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { TipCard } from '~/components/ui/alert-card'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import AddressSelectionModal from '~/features/order/components/address-section/address/address-selection-modal'
import { Address } from '~/types/address.type'
import { OrderItem } from '~/types/order.type'
import { CreateWarrantyRequestSchema } from '../validations'
import CreateWarrantyRequestForm from './create-warranty-request-form'

interface CreateWarrantyRequestFormsProps {
  renderAddressContent: () => React.JSX.Element
  selectedOrderItems: OrderItem[]
  onSubmitPress: () => void
  isSubmitting: boolean
  addresses?: Address[]
  addressSelectionModalRef: React.RefObject<BottomSheetModal | null>
  addressId: string | null
  onSelectAddress: (addressId: string) => void
}

export default function CreateWarrantyRequestForms({
  renderAddressContent,
  selectedOrderItems,
  onSubmitPress,
  isSubmitting,
  addresses,
  addressSelectionModalRef,
  addressId,
  onSelectAddress
}: CreateWarrantyRequestFormsProps) {
  const methods = useFormContext<CreateWarrantyRequestSchema>()
  const { control } = methods
  const { fields } = useFieldArray({ name: 'items', control })

  return (
    <BottomSheetModalProvider>
      <KeyboardAwareScrollView bottomOffset={50} className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='flex-1'>
          <Animated.View entering={FadeInDown.delay(100)} className='p-2'>
            {renderAddressContent()}
          </Animated.View>

          <View className='gap-2 px-2 pb-4'>
            {fields.map((field, index) => (
              <Animated.View key={field.id} entering={FadeInDown.delay(200 + index * 50)}>
                <CreateWarrantyRequestForm index={index} orderItem={selectedOrderItems[index]} />
              </Animated.View>
            ))}

            <TipCard title='Tips' delay={300 + fields.length * 50}>
              <View className='flex flex-col gap-1'>
                <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
                  • Describe the defect and where it appears.
                </Text>
                <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
                  • Upload mandatory high-res photos (multiple angles).
                </Text>
                <Text className='text-xs text-emerald-600 dark:text-emerald-500'>
                  • Make sure images are well-lit and sharply focused.
                </Text>
              </View>
            </TipCard>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View
        className='bg-background px-2 pt-4 border-t border-border'
        style={{ boxShadow: '0 -2px 6px -1px rgba(0, 0, 0, 0.1)' }}
      >
        <Button onPress={onSubmitPress} disabled={isSubmitting}>
          <Text className='font-inter-medium'>{isSubmitting ? 'Submitting...' : 'Submit Warranty'}</Text>
        </Button>
      </View>

      {/* Modals */}
      {addresses && Array.isArray(addresses) ? (
        <AddressSelectionModal
          ref={addressSelectionModalRef}
          addresses={addresses}
          selectedAddressId={addressId || undefined}
          onSelectAddress={onSelectAddress}
        />
      ) : null}
    </BottomSheetModalProvider>
  )
}
