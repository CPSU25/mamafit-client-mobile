import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { WarningCard } from '~/components/ui/alert-card'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Address } from '~/types/address.type'
import { User } from '~/types/common'
import { Branch } from '~/types/order.type'
import { DeliveryMethod } from '../../validations'
import AddressCard from './address-card'
import BranchCard from './branch-card'

interface AddressSectionProps {
  tabValue: DeliveryMethod
  isLoadingAddress: boolean
  isLoadingBranch: boolean
  address: Address | null
  branch: Branch | null
  currentUserProfile: User | null | undefined
  iconSize: number
  handleSwitchTab: (value: DeliveryMethod) => void
  handlePresentAddressModal: () => void
  handlePresentBranchModal: () => void
}

export default function AddressSection({
  tabValue,
  handleSwitchTab,
  isLoadingAddress,
  isLoadingBranch,
  address,
  branch,
  currentUserProfile,
  iconSize,
  handlePresentAddressModal,
  handlePresentBranchModal
}: AddressSectionProps) {
  const router = useRouter()

  const renderAddressContent = () => {
    if (isLoadingAddress) {
      return <Skeleton className='rounded-2xl h-20' />
    }

    if (!currentUserProfile?.phoneNumber) {
      return (
        <TouchableOpacity onPress={() => router.push('/setting/account')}>
          <WarningCard title='Oops! No phone number found' description='Please add your phone number first' />
        </TouchableOpacity>
      )
    }

    if (address) {
      return (
        <AddressCard
          address={address}
          fullName={currentUserProfile?.fullName || undefined}
          phoneNumber={currentUserProfile?.phoneNumber || undefined}
          onPress={handlePresentAddressModal}
        />
      )
    } else {
      return (
        <TouchableOpacity onPress={() => router.push('/setting/my-addresses/create')}>
          <WarningCard
            title='Oops! No address found'
            description='Please add your address first to select this delivery method'
          />
        </TouchableOpacity>
      )
    }
  }

  const renderBranchContent = () => {
    if (isLoadingBranch) {
      return <Skeleton className='rounded-2xl h-20' />
    }

    if (!currentUserProfile?.phoneNumber) {
      return (
        <TouchableOpacity onPress={() => router.push('/setting/account')}>
          <WarningCard title='Oops! No phone number found' description='Please add your phone number first' />
        </TouchableOpacity>
      )
    }

    if (branch) {
      return <BranchCard branch={branch} onPress={handlePresentBranchModal} />
    }

    return <WarningCard title='Oops! No branch found' description='This feature is not available yet' />
  }

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
      <TabsContent value='DELIVERY'>{renderAddressContent()}</TabsContent>
      <TabsContent value='PICK_UP'>{renderBranchContent()}</TabsContent>
    </Tabs>
  )
}
