import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { WarningCard } from '~/components/ui/alert-card'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Address } from '~/types/address.type'
import { User } from '~/types/common'
import { DeliveryMethod } from '../../validations'
import AddressCard from './address-card'

interface AddressSectionProps {
  tabValue: DeliveryMethod
  isLoading: boolean
  currentAddress: Address | null
  currentUserProfile: User | null | undefined
  iconSize: number
  handleSwitchTab: (value: DeliveryMethod) => void
  handlePresentAddressModal: () => void
}

export default function AddressSection({
  tabValue,
  handleSwitchTab,
  isLoading,
  currentAddress,
  currentUserProfile,
  iconSize,
  handlePresentAddressModal
}: AddressSectionProps) {
  const router = useRouter()

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => handleSwitchTab(value as DeliveryMethod)}
      className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
    >
      <TabsList className='flex-row w-full'>
        <TabsTrigger value={DeliveryMethod.DELIVERY} className='flex-1 flex-row items-center gap-2'>
          {SvgIcon.toReceive({ size: iconSize })}
          <Text>Delivery</Text>
        </TabsTrigger>
        <TabsTrigger value={DeliveryMethod.PICK_UP} className='flex-1 flex-row items-center gap-2'>
          {SvgIcon.shop({ size: iconSize })}
          <Text>Pick Up</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value='DELIVERY'>
        {isLoading ? (
          <Skeleton className='rounded-2xl h-16' />
        ) : currentAddress ? (
          <AddressCard
            address={currentAddress}
            fullName={currentUserProfile?.fullName || undefined}
            phoneNumber={currentUserProfile?.phoneNumber || undefined}
            isLoading={isLoading}
            onPress={handlePresentAddressModal}
          />
        ) : (
          <TouchableOpacity onPress={() => router.push('/setting/my-addresses/create')}>
            <WarningCard
              title='Oops! No address found'
              description='Please add your address first to select this delivery method'
            />
          </TouchableOpacity>
        )}
      </TabsContent>
      {/* TODO: Add Pick Up option */}
      <TabsContent value='PICK_UP'></TabsContent>
    </Tabs>
  )
}
