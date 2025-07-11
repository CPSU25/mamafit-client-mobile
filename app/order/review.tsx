import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import AutoHeightImage from '~/components/auto-height-image'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import { useGetAllDiaries } from '~/features/diary/hooks/use-get-all-diaries'
import AddressSection from '~/features/order/components/address-section/address-section'
import AddressSelectionModal from '~/features/order/components/address-section/address-selection-modal'
import DiarySection from '~/features/order/components/diary-section/diary-section'
import DiarySelectionModal from '~/features/order/components/diary-section/diary-selection-modal'
import OrderSummarySection from '~/features/order/components/order-summary-section/order-summary-section'
import PaymentDetailsSection from '~/features/order/components/payment-details-section/payment-details-section'
import PaymentMethodsSection from '~/features/order/components/payment-methods-section/payment-methods-section'
import VouchersSection from '~/features/order/components/vouchers-section/vouchers-section'
import { useGetShippingFee } from '~/features/order/hooks/use-get-shipping-fee'
import { usePlacePresetOrder } from '~/features/order/hooks/use-place-preset-order'
import { DeliveryMethod, PlacePresetOrderFormSchema } from '~/features/order/validations'
import { useGetAddresses } from '~/features/user/hooks/use-get-addresses'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import { useAuth } from '~/hooks/use-auth'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { getOrderedComponentOptions } from '~/lib/utils'
import { Address } from '~/types/address.type'
import { Diary } from '~/types/diary.type'
import { OrderItemTemp } from '~/types/order-item.type'
import { PresetWithComponentOptions } from '~/types/preset.type'

const SMALL_ICON_SIZE = 18

const getDefaultAddress = (addresses: Address[] | null | undefined) => {
  if (!addresses || !Array.isArray(addresses) || addresses.length === 0) return null
  const defaultAddress = addresses.find((address) => address?.isDefault)
  return defaultAddress || addresses[0] || null
}

const getActiveDiary = (diaries: Diary[] | null | undefined) => {
  if (!diaries || !Array.isArray(diaries) || diaries.length === 0) return null
  const activeDiary = diaries.find((diary) => diary?.isActive)
  return activeDiary || diaries[0] || null
}

const getOrderItems = async () => {
  try {
    const orderItems = await AsyncStorage.getItem('order-items')
    if (!orderItems) return null

    const parsedOrderItems = JSON.parse(orderItems) as OrderItemTemp<unknown>
    if (
      parsedOrderItems &&
      typeof parsedOrderItems === 'object' &&
      'type' in parsedOrderItems &&
      'items' in parsedOrderItems
    ) {
      return parsedOrderItems
    }

    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

const clearOrderItems = async () => {
  try {
    await AsyncStorage.removeItem('order-items')
  } catch (error) {
    console.log(error)
  }
}

export default function ReviewOrderScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { methods, placePresetOrderMutation } = usePlacePresetOrder(clearOrderItems)

  const addressSelectionModalRef = useRef<BottomSheetModal>(null)
  const diarySelectionModalRef = useRef<BottomSheetModal>(null)

  const [tabValue, setTabValue] = useState<DeliveryMethod>(methods.watch('deliveryMethod'))
  const [orderItems, setOrderItems] = useState<OrderItemTemp<unknown> | null>(null)
  const [preset, setPreset] = useState<PresetWithComponentOptions | null>(null)

  const {
    data: addresses,
    refetch: refetchAddresses,
    isLoading: isLoadingAddresses,
    isFetched: isFetchedAddresses
  } = useGetAddresses()
  const {
    data: currentUserProfile,
    refetch: refetchUserProfile,
    isLoading: isLoadingUserProfile
  } = useGetProfile(user?.userId)

  const {
    data: diaries,
    refetch: refetchDiaries,
    isLoading: isLoadingDiaries,
    isFetched: isFetchedDiaries
  } = useGetAllDiaries()

  const isLoadingAddressSection = isLoadingAddresses || isLoadingUserProfile

  // Get default address or first address on load
  const defaultAddress = getDefaultAddress(addresses)
  const activeDiary = getActiveDiary(diaries?.items)

  // Take user selected address to calculate shipping fee
  const addressId = methods.watch('addressId')
  const diaryId = methods.watch('measurementDiaryId')
  const voucherId = methods.watch('voucherDiscountId')

  const currentAddress =
    (Array.isArray(addresses) ? addresses.find((address) => address?.id === addressId) : null) || defaultAddress
  const currentDiary =
    (Array.isArray(diaries?.items) ? diaries.items.find((diary) => diary?.id === diaryId) : null) || activeDiary

  const orderType = orderItems?.type || null

  const {
    data: shippingFee,
    isLoading: isLoadingShippingFee,
    refetch: refetchShippingFee,
    isFetched: isFetchedShippingFee
  } = useGetShippingFee({
    province: currentAddress?.province || '',
    district: currentAddress?.district || '',
    weight: 500
  })

  const totalPayment = shippingFee ? (preset?.price || 0) + shippingFee : preset?.price || 0

  const { refreshControl } = useRefreshs([refetchAddresses, refetchUserProfile, refetchShippingFee, refetchDiaries])

  // Modal handlers
  const handlePresentAddressModal = useCallback(() => {
    addressSelectionModalRef.current?.present()
  }, [])

  const handleSelectAddress = useCallback(
    (addressId: string) => {
      if (methods?.setValue) {
        methods.setValue('addressId', addressId)
      }
      addressSelectionModalRef.current?.dismiss()
    },
    [methods]
  )

  const handlePresentDiaryModal = useCallback(() => {
    diarySelectionModalRef.current?.present()
  }, [])

  const handleSelectDiary = useCallback(
    (diaryId: string) => {
      if (methods?.setValue) {
        methods.setValue('measurementDiaryId', diaryId)
      }
      diarySelectionModalRef.current?.dismiss()
    },
    [methods]
  )

  // Tab handler
  const handleSwitchTab = (value: DeliveryMethod) => {
    setTabValue(value)
    if (methods?.setValue) {
      methods.setValue('deliveryMethod', value)
    }
  }

  const handleGoBack = async () => {
    if (router.canGoBack()) {
      await clearOrderItems()
      router.back()
    } else {
      await clearOrderItems()
      router.replace('/')
    }
  }

  // Place order
  const onSubmit: SubmitHandler<PlacePresetOrderFormSchema> = (data) => {
    console.log(data)
    if (orderType === 'preset') {
      placePresetOrderMutation.mutate(data)
    } else {
      console.log('Not implemented')
    }
  }

  // Set preset to form
  useEffect(() => {
    const getPreset = async () => {
      const items = await getOrderItems()

      if (!items) {
        router.replace('/')
        return
      }

      setOrderItems(items)

      if (Array.isArray(items.items) && items.items.length > 0) {
        if (items?.type === 'preset') {
          const presetItem = items.items[0]
          if (presetItem && typeof presetItem === 'object' && 'id' in presetItem) {
            const typedPreset = presetItem as PresetWithComponentOptions
            setPreset(typedPreset)
            methods.setValue('presetId', typedPreset.id)
          }
        }
      }
    }

    getPreset()
  }, [methods, router])

  // Set shipping fee to form
  useFocusEffect(
    useCallback(() => {
      if (isFetchedShippingFee && shippingFee && methods?.setValue) {
        methods.setValue('shippingFee', shippingFee)
      }
    }, [isFetchedShippingFee, shippingFee, methods])
  )

  // Set default address to form
  useFocusEffect(
    useCallback(() => {
      if (isFetchedAddresses && defaultAddress?.id && methods?.setValue) {
        methods.setValue('addressId', defaultAddress.id)
      }
    }, [isFetchedAddresses, defaultAddress, methods])
  )

  // Set active diary to form
  useFocusEffect(
    useCallback(() => {
      if (isFetchedDiaries && activeDiary?.id && methods?.setValue) {
        methods.setValue('measurementDiaryId', activeDiary.id)
      }
    }, [isFetchedDiaries, activeDiary, methods])
  )

  // If address changes, refetch shipping fee
  useFocusEffect(
    useCallback(() => {
      if (currentAddress?.province && currentAddress?.district) {
        refetchShippingFee()
      }
    }, [currentAddress?.province, currentAddress?.district, refetchShippingFee])
  )

  const renderOrderSummaryContent = () => {
    if (!orderItems) {
      return <Skeleton className='h-60 m-2 rounded-2xl' />
    }

    if (orderType === 'preset' && preset) {
      const presetImage =
        preset.images && Array.isArray(preset.images) && preset.images.length > 0 ? preset.images[0] : ''
      const componentOptions =
        preset.componentOptions && Array.isArray(preset.componentOptions) ? preset.componentOptions : []

      return (
        <View className='p-4'>
          <View className='flex flex-row gap-4 items-center'>
            {presetImage && <AutoHeightImage uri={presetImage} width={120} />}

            <View className='flex-1'>
              <Text className='font-inter-semibold'>{preset.styleName || 'Unknown'} Dress</Text>
              <Text className='text-xs text-muted-foreground'>Custom Made-to-Order</Text>

              <View className='bg-muted/70 rounded-2xl p-3 gap-2 mt-2'>
                {getOrderedComponentOptions(componentOptions).map(
                  (option) =>
                    option && (
                      <View className='flex-row items-center justify-between' key={option.componentName}>
                        <Text className='text-xs text-muted-foreground'>{option.componentName}</Text>
                        <Text className='text-xs font-inter-medium text-foreground'>{option.name}</Text>
                      </View>
                    )
                )}
              </View>
            </View>
          </View>
        </View>
      )
    }

    // TODO: Handle other order types here
    return (
      <View className='flex items-center justify-center min-h-60 px-6'>
        <MaterialCommunityIcons name='package-variant' size={48} color='#E5E7EB' />
        <Text className='text-muted-foreground text-center mt-4'>Unsupported order type: {orderType}</Text>
      </View>
    )
  }

  return (
    <SafeView>
      <View className='flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Review Order</Text>
      </View>

      <BottomSheetModalProvider>
        <FormProvider {...methods}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 46 }}
            refreshControl={refreshControl}
          >
            <View className='flex flex-col gap-4 p-2 flex-1'>
              {/* Address Section */}
              <AddressSection
                tabValue={tabValue}
                isLoading={isLoadingAddressSection}
                currentAddress={currentAddress}
                currentUserProfile={currentUserProfile}
                iconSize={SMALL_ICON_SIZE}
                handleSwitchTab={handleSwitchTab}
                handlePresentAddressModal={handlePresentAddressModal}
              />

              {/* Diary Section */}
              <DiarySection
                isLoading={isLoadingDiaries}
                diary={currentDiary}
                handlePresentDiaryModal={handlePresentDiaryModal}
              />

              {/* Order Summary Section */}
              <OrderSummarySection
                isLoadingShippingFee={isLoadingShippingFee}
                shippingFee={shippingFee}
                renderOrderSummaryContent={renderOrderSummaryContent}
                iconSize={SMALL_ICON_SIZE}
                orderItems={orderItems}
                preset={preset}
              />

              {/* MamaFit Vouchers */}
              <VouchersSection iconSize={SMALL_ICON_SIZE} />

              {/* Payment Methods Section */}
              <PaymentMethodsSection />

              {/* Payment Details Section */}
              <PaymentDetailsSection
                iconSize={SMALL_ICON_SIZE}
                preset={preset}
                shippingFee={shippingFee}
                voucherId={voucherId}
                totalPayment={totalPayment}
              />

              <Text className='text-xs text-muted-foreground px-2 mb-4'>
                By clicking &apos;Place Order&apos;, you are agreeing to MamaFit&apos;s General Transaction Terms
              </Text>
            </View>
          </ScrollView>

          {/* Place Order */}
          <View
            className='absolute bottom-0 left-0 right-0 flex-row justify-end gap-3 bg-background p-3 border-t border-border'
            style={{ boxShadow: '0 -2px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <View className='flex flex-col items-end gap-1'>
              <Text className='font-inter-semibold text-primary'>
                <Text className='text-sm'>Total</Text>{' '}
                <Text className='underline font-inter-semibold text-sm text-primary'>đ</Text>
                {totalPayment.toLocaleString('vi-VN')}
              </Text>

              <Text className='font-inter-medium text-primary text-sm'>
                <Text className='text-xs'>Saved</Text>{' '}
                <Text className='underline font-inter-medium text-sm text-primary'>đ</Text>
                {voucherId ? '12.800' : '0'}
              </Text>
            </View>
            <Button onPress={methods.handleSubmit(onSubmit)} disabled={placePresetOrderMutation.isPending}>
              <Text className='font-inter-medium'>
                {placePresetOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              </Text>
            </Button>
          </View>

          {/* Modals */}
          {addresses && Array.isArray(addresses) && (
            <AddressSelectionModal
              ref={addressSelectionModalRef}
              addresses={addresses}
              selectedAddressId={addressId || undefined}
              onSelectAddress={handleSelectAddress}
            />
          )}

          {diaries && diaries.items && Array.isArray(diaries.items) && (
            <DiarySelectionModal
              ref={diarySelectionModalRef}
              diaries={diaries.items}
              selectedDiaryId={diaryId || undefined}
              onSelectDiary={handleSelectDiary}
            />
          )}
        </FormProvider>
      </BottomSheetModalProvider>
    </SafeView>
  )
}
