import { Feather } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { WarningCard } from '~/components/ui/alert-card'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import PreviewAddressCard from '~/features/order/components/address-section/address/preview-address-card'
import { useGetAddresses } from '~/features/user/hooks/use-get-addresses'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import ChooseOrderItems from '~/features/warranty-request/components/choose-order-items'
import CreateWarrantyRequestForms from '~/features/warranty-request/components/create-warranty-request-forms'
import { useCreateWarrantyRequest } from '~/features/warranty-request/hooks/use-create-warranty-request'
import { useGetOrderRequests } from '~/features/warranty-request/hooks/use-get-order-requests'
import { getWarrantyType } from '~/features/warranty-request/utils'
import { CreateWarrantyRequestSchema } from '~/features/warranty-request/validations'
import { useAuth } from '~/hooks/use-auth'
import { useGetConfig } from '~/hooks/use-get-config'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { DeliveryMethod, OrderItem } from '~/types/order.type'

// Custom hook for managing order item selection
const useOrderItemSelection = (replaceFormItems: (items: any[]) => void) => {
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([])

  const handleSelectOrderItem = useCallback(
    (orderItem: OrderItem) => {
      setSelectedOrderItems((prev) => {
        const isCurrentlySelected = prev?.some((item) => item.id === orderItem.id)

        const nextItems = isCurrentlySelected
          ? prev.filter((item) => item.id !== orderItem.id)
          : [...(prev ?? []), orderItem]

        // Update form items
        const formItems = nextItems.map((item) => ({
          orderItemId: item.id,
          images: [],
          description: ''
        }))
        replaceFormItems(formItems)

        return nextItems
      })
    },
    [replaceFormItems]
  )

  const isSelected = useCallback(
    (orderItem: OrderItem) => selectedOrderItems?.some((item) => item.id === orderItem.id),
    [selectedOrderItems]
  )

  return {
    selectedOrderItems,
    handleSelectOrderItem,
    isSelected
  }
}

// Custom hook for managing address data and interactions
const useAddressManagement = (setValue: any, deliveryMethod: DeliveryMethod) => {
  const { user } = useAuth()
  const {
    data: currentUserProfile,
    refetch: refetchUserProfile,
    isLoading: isLoadingUserProfile
  } = useGetProfile(user?.userId)

  const {
    data: addresses,
    refetch: refetchAddresses,
    isLoading: isLoadingAddresses,
    isFetched: isFetchedAddresses
  } = useGetAddresses()

  const defaultAddress = Array.isArray(addresses) ? addresses.find((a) => a?.isDefault) || addresses[0] || null : null

  // Set default address when delivery method changes
  useEffect(() => {
    if (isFetchedAddresses && defaultAddress?.id && setValue && deliveryMethod === DeliveryMethod.Delivery) {
      setValue('addressId', defaultAddress.id)
      setValue('branchId', null)
    }
  }, [isFetchedAddresses, defaultAddress, setValue, deliveryMethod])

  return {
    currentUserProfile,
    addresses,
    defaultAddress,
    isLoadingUserProfile,
    isLoadingAddresses,
    refetchUserProfile,
    refetchAddresses
  }
}

export default function CreateWarrantyRequestScreen() {
  const router = useRouter()
  const { methods, createWarrantyMutation } = useCreateWarrantyRequest()
  const { control, setValue, watch, handleSubmit } = methods
  const { replace } = useFieldArray({ name: 'items', control })

  const [currentStep, setCurrentStep] = useState(1)

  const { data: config, isLoading: isLoadingConfig, refetch: refetchConfig } = useGetConfig()
  const {
    data: orderRequests,
    isLoading: isLoadingOrderRequests,
    refetch: refetchOrderRequests
  } = useGetOrderRequests()

  const addressId = watch('addressId')
  const deliveryMethod = watch('deliveryMethod')

  const { selectedOrderItems, handleSelectOrderItem, isSelected } = useOrderItemSelection(replace)

  const {
    currentUserProfile,
    addresses,
    defaultAddress,
    isLoadingUserProfile,
    isLoadingAddresses,
    refetchUserProfile,
    refetchAddresses
  } = useAddressManagement(setValue, deliveryMethod)

  const isLoadingAddressSection = isLoadingAddresses || isLoadingUserProfile
  const isLoading = isLoadingConfig || isLoadingOrderRequests || isLoadingAddressSection
  const { refreshControl } = useRefreshs([refetchOrderRequests, refetchConfig, refetchAddresses, refetchUserProfile])

  const addressSelectionModalRef = useRef<BottomSheetModal>(null)

  const currentAddress = useMemo(() => {
    if (!Array.isArray(addresses)) return defaultAddress
    return addresses.find((address) => address?.id === addressId) || defaultAddress
  }, [addresses, addressId, defaultAddress])

  const handlePresentAddressModal = useCallback(() => {
    addressSelectionModalRef.current?.present()
  }, [])

  const handleSelectAddress = useCallback(
    (addressId: string) => {
      setValue('addressId', addressId)
      addressSelectionModalRef.current?.dismiss()
    },
    [setValue]
  )

  const handleGoBack = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/profile')
    }
  }, [router, currentStep])

  const onSubmit: SubmitHandler<CreateWarrantyRequestSchema> = (data) => {
    console.log(data)
    createWarrantyMutation.mutate(data)
  }

  const renderAddressContent = () => {
    if (isLoadingAddresses) {
      return <Skeleton className='rounded-2xl h-20' />
    }

    if (currentAddress) {
      return (
        <View className='gap-2'>
          {!currentUserProfile?.phoneNumber ? (
            <TouchableOpacity onPress={() => router.push('/setting/account')}>
              <WarningCard
                title='Oops! Không tìm thấy số điện thoại'
                description='Vui lòng thêm số điện thoại của bạn trước'
                hasAnimation={false}
              />
            </TouchableOpacity>
          ) : null}
          <PreviewAddressCard
            address={currentAddress}
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
            title='Oops! Không tìm thấy địa chỉ'
            description='Vui lòng thêm địa chỉ của bạn trước để chọn phương thức giao hàng này'
          />
        </TouchableOpacity>
      )
    }
  }

  const selectedWarrantyType = useMemo(() => {
    return getWarrantyType(selectedOrderItems, orderRequests, config?.warrantyPeriod ?? 0, config?.warrantyTime ?? 0)
  }, [selectedOrderItems, orderRequests, config?.warrantyPeriod, config?.warrantyTime])

  if (isLoading) {
    return <Loading />
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-3 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-medium text-xl'>Dịch vụ bảo hành</Text>
      </View>

      <View className='bg-muted h-2' />

      <View className='flex-1'>
        {currentStep === 1 ? (
          <ChooseOrderItems
            orderRequests={orderRequests}
            handleSelectOrderItem={handleSelectOrderItem}
            isSelected={isSelected}
            warrantyPeriod={config?.warrantyPeriod ?? 0}
            warrantyCount={config?.warrantyTime ?? 0}
            isLoading={isLoadingOrderRequests}
            refreshControl={refreshControl}
            selectedWarrantyType={selectedWarrantyType}
            handleNext={() => setCurrentStep(2)}
            isDisabled={selectedOrderItems.length === 0}
          />
        ) : null}

        {currentStep === 2 ? (
          <FormProvider {...methods}>
            <CreateWarrantyRequestForms
              renderAddressContent={renderAddressContent}
              selectedOrderItems={selectedOrderItems}
              onSubmitPress={handleSubmit(onSubmit)}
              isSubmitting={createWarrantyMutation.isPending}
              addresses={Array.isArray(addresses) ? addresses : undefined}
              addressSelectionModalRef={addressSelectionModalRef}
              addressId={addressId}
              onSelectAddress={handleSelectAddress}
            />
          </FormProvider>
        ) : null}
      </View>
    </SafeView>
  )
}
