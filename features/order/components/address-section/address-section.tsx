import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { WarningCard } from '~/components/ui/alert-card'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { Address } from '~/types/address.type'
import { User } from '~/types/common'
import { Branch, DeliveryMethod } from '~/types/order.type'
import PreviewAddressCard from './address/preview-address-card'
import PreviewBranchCard from './branch/preview-branch-card'

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

    if (address) {
      return (
        <View className='gap-2'>
          {!currentUserProfile?.phoneNumber ? (
            <TouchableOpacity onPress={() => router.push('/setting/account')}>
              <WarningCard
                title='Chưa có số điện thoại'
                description='Vui lòng thêm số điện thoại trước'
                hasAnimation={false}
              />
            </TouchableOpacity>
          ) : null}
          <PreviewAddressCard
            address={address}
            fullName={currentUserProfile?.fullName || undefined}
            phoneNumber={currentUserProfile?.phoneNumber || undefined}
            onPress={handlePresentAddressModal}
          />
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => router.push('/setting/my-addresses/create')}>
          <WarningCard
            title='Chưa có địa chỉ'
            description='Vui lòng thêm địa chỉ để sử dụng phương thức giao hàng này'
          />
        </TouchableOpacity>
      )
    }
  }

  const renderBranchContent = () => {
    if (isLoadingBranch) {
      return <Skeleton className='rounded-2xl h-20' />
    }

    if (branch) {
      return (
        <View className='gap-2'>
          {!currentUserProfile?.phoneNumber ? (
            <TouchableOpacity onPress={() => router.push('/setting/account')}>
              <WarningCard
                title='Chưa có số điện thoại'
                description='Vui lòng thêm số điện thoại trước'
                hasAnimation={false}
              />
            </TouchableOpacity>
          ) : null}
          <PreviewBranchCard branch={branch} onPress={handlePresentBranchModal} />
        </View>
      )
    }

    return <WarningCard title='Chưa có chi nhánh' description='Tính năng này chưa khả dụng' />
  }

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => handleSwitchTab(value as DeliveryMethod)}
      className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
    >
      <TabsList className='flex-row w-full'>
        <TabsTrigger value={DeliveryMethod.Delivery} className='flex-1 flex-row items-center gap-2'>
          {SvgIcon.toReceive({
            size: iconSize,
            color: tabValue === DeliveryMethod.Delivery ? 'PRIMARY' : 'GRAY'
          })}
          <Text>Giao hàng</Text>
        </TabsTrigger>
        <TabsTrigger value={DeliveryMethod.PickUp} className='flex-1 flex-row items-center gap-2'>
          {SvgIcon.shop({ size: iconSize, color: tabValue === DeliveryMethod.PickUp ? 'PRIMARY' : 'GRAY' })}
          <Text>Tại cửa hàng</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value='DELIVERY'>{renderAddressContent()}</TabsContent>
      <TabsContent value='PICK_UP'>{renderBranchContent()}</TabsContent>
    </Tabs>
  )
}
