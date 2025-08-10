import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from 'expo-blur'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { toast } from 'sonner-native'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Text } from '~/components/ui/text'
import AddressSection from '~/features/order/components/address-section/address-section'
import AddressSelectionModal from '~/features/order/components/address-section/address/address-selection-modal'
import BranchSelectionModal from '~/features/order/components/address-section/branch/branch-selection-modal'
import DiarySection from '~/features/order/components/diary-section/diary-section'
import DiarySelectionModal from '~/features/order/components/diary-section/diary-selection-modal'
import OrderSummarySection from '~/features/order/components/order-summary-section/order-summary-section'
import PresetOrderItem from '~/features/order/components/order-summary-section/preset-order-item'
import PaymentDetailsSection from '~/features/order/components/payment-details-section/payment-details-section'
import PaymentMethodsSection from '~/features/order/components/payment-methods-section/payment-methods-section'
import VouchersSection from '~/features/order/components/vouchers-section/vouchers-section'
import VouchersSelectionModal from '~/features/order/components/vouchers-section/vouchers-selection-modal'
import { useGetShippingFee } from '~/features/order/hooks/use-get-shipping-fee'
import { usePlacePresetOrder } from '~/features/order/hooks/use-place-preset-order'
import { useReviewOrderQueries } from '~/features/order/hooks/use-review-order-queries'
import { AddOnOptionItem } from '~/features/order/types'
import { getOrderItems } from '~/features/order/utils'
import { PlacePresetOrderFormSchema } from '~/features/order/validations'
import { useGetPresetDetails } from '~/features/preset/hooks/use-get-preset-details'
import { useAuth } from '~/hooks/use-auth'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { Address } from '~/types/address.type'
import { Diary } from '~/types/diary.type'
import { OrderItemTemp, PresetInStorage } from '~/types/order-item.type'
import { Branch, DeliveryMethod, OrderItemType, PaymentType } from '~/types/order.type'
import { FlattenedVoucher, VoucherBatchWithVouchers } from '~/types/voucher.type'

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

const getDefaultBranch = (branches: Branch[] | null | undefined) => {
  if (!branches || !Array.isArray(branches) || branches.length === 0) return null
  return branches[0] || null
}

const getPaymentDetails = ({
  orderType,
  price = 0,
  paymentType,
  shippingFee,
  voucher,
  addOnOptions,
  depositRate
}: {
  orderType: OrderItemType
  price: number
  paymentType: PaymentType
  shippingFee: number
  voucher: FlattenedVoucher | null
  addOnOptions: { option: AddOnOptionItem; quantity: number }[]
  depositRate: number
}) => {
  // Original cost (no deposit, no vouchers, no shipping fee)
  // Used to check if this order is able to use voucher that has minimum order value
  const fullMerchandiseTotal = orderType === OrderItemType.Preset ? price : 0

  const addOnsSubtotal = addOnOptions.reduce(
    (acc, addOnWithQuantity) => acc + addOnWithQuantity.option.price * addOnWithQuantity.quantity,
    0
  )

  // How much user saved on this order
  const savedAmount = getSavedAmount(voucher, fullMerchandiseTotal)

  // Final price after applying voucher
  const discountedMerchandiseTotal = fullMerchandiseTotal - savedAmount

  // How much user must pay (if the option is deposit - pay 50% else 100%)
  const payableMerchandisePortion =
    paymentType === 'DEPOSIT' ? discountedMerchandiseTotal * depositRate : discountedMerchandiseTotal

  // Final amount (voucher + shipping fee + deposit/full)
  const totalPaymentNow =
    shippingFee > 0
      ? payableMerchandisePortion + shippingFee + addOnsSubtotal
      : payableMerchandisePortion + addOnsSubtotal

  // How much user must pay after the order is completed at the factory (for deposit)
  const remainingBalance = paymentType === 'DEPOSIT' ? discountedMerchandiseTotal * (1 - depositRate) : 0

  return {
    isVoucherValid: true,
    fullMerchandiseTotal,
    savedAmount,
    discountedMerchandiseTotal,
    payableMerchandisePortion,
    totalPaymentNow,
    remainingBalance,
    addOnsSubtotal
  }
}

export function getSavedAmount(voucher: FlattenedVoucher | null, merchandiseTotal: number): number {
  if (!voucher) return 0

  if (voucher.discountType === 'FIXED') {
    return Math.min(voucher.discountValue, merchandiseTotal)
  }

  const percentageDiscount = (voucher.discountValue * merchandiseTotal) / 100
  const cappedDiscount =
    voucher.maximumDiscountValue > 0 ? Math.min(percentageDiscount, voucher.maximumDiscountValue) : percentageDiscount

  return Math.min(cappedDiscount, merchandiseTotal)
}

const getFlattenedVouchers = (vouchers: VoucherBatchWithVouchers[]): FlattenedVoucher[] => {
  return vouchers.flatMap((batch) => {
    const { details, id: voucherBatchId, ...parentRest } = batch
    return details.map((detail) => {
      const { id: voucherId, voucherBatchId: _omit, ...detailRest } = detail
      return {
        voucherId,
        voucherBatchId,
        ...detailRest,
        ...parentRest
      }
    })
  })
}

const clearOrderItems = async () => {
  try {
    await AsyncStorage.removeItem('order-items')
  } catch (error) {
    console.log(error)
  }
}

const getPresetPrice = (presetId: string, price: number, orderItems: OrderItemTemp<unknown> | null) => {
  if (!orderItems) return 0

  const presetItem = (orderItems as OrderItemTemp<PresetInStorage>).items[presetId]
  return price * (presetItem?.quantity || 1)
}

const getAllAddOnOptionsWithQuantities = (
  orderItems: OrderItemTemp<unknown> | null
): { option: AddOnOptionItem; quantity: number }[] => {
  if (!orderItems || orderItems.type !== OrderItemType.Preset) return []

  const presetItems = orderItems.items as Record<string, PresetInStorage>
  const allAddOnOptions: { option: AddOnOptionItem; quantity: number }[] = []

  Object.values(presetItems).forEach((presetItem) => {
    presetItem.options.forEach((option) => {
      allAddOnOptions.push({
        option,
        quantity: presetItem.quantity
      })
    })
  })

  return allAddOnOptions
}

export default function ReviewOrderScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { methods, placePresetOrderMutation } = usePlacePresetOrder(clearOrderItems)
  const { setValue } = methods

  const deliveryMethod = methods.watch('deliveryMethod')

  // UI states
  const [tabValue, setTabValue] = useState<DeliveryMethod>(deliveryMethod)
  const addressSelectionModalRef = useRef<BottomSheetModal>(null)
  const diarySelectionModalRef = useRef<BottomSheetModal>(null)
  const branchSelectionModalRef = useRef<BottomSheetModal>(null)
  const voucherSelectionModalRef = useRef<BottomSheetModal>(null)

  // Data from AsyncStorage states
  const [orderItems, setOrderItems] = useState<OrderItemTemp<unknown> | null>(null)
  const [presetIds, setPresetIds] = useState<string[]>([])

  // Get form values
  const addressId = methods.watch('addressId')
  const diaryId = methods.watch('measurementDiaryId')
  const branchId = methods.watch('branchId')
  const voucherId = methods.watch('voucherDiscountId')
  const paymentType = methods.watch('paymentType')
  const formPresets = methods.watch('presets')

  // Queries to get user addresses, profile and diaries
  const {
    '0': { data: addresses, refetch: refetchAddresses, isLoading: isLoadingAddresses, isFetched: isFetchedAddresses },
    '1': { data: currentUserProfile, refetch: refetchUserProfile, isLoading: isLoadingUserProfile },
    '2': { data: diaries, refetch: refetchDiaries, isLoading: isLoadingDiaries, isFetched: isFetchedDiaries },
    '3': { data: branches, refetch: refetchBranches, isLoading: isLoadingBranches, isFetched: isFetchedBranches },
    '4': { data: vouchers, refetch: refetchVouchers, isLoading: isLoadingVouchers },
    '5': { data: config, refetch: refetchConfig, isLoading: isLoadingConfig },
    '6': {
      data: latestMeasurement,
      refetch: refetchLatestMeasurement,
      isLoading: isLoadingLatestMeasurement,
      isFetched: isFetchedLatestMeasurement
    }
  } = useReviewOrderQueries(user?.userId, diaryId)

  const { presetDetails, isLoading: isLoadingPresetDetails } = useGetPresetDetails(presetIds, Boolean(presetIds.length))

  // Get default address + active diary for auto selecting
  const defaultAddress = getDefaultAddress(addresses)
  const activeDiary = getActiveDiary(diaries?.items)
  const defaultBranch = getDefaultBranch(branches)

  // Get current address + diary base on form values (if present)
  const currentAddress =
    (Array.isArray(addresses) ? addresses.find((address) => address?.id === addressId) : null) || defaultAddress
  const currentDiary =
    (Array.isArray(diaries?.items) ? diaries.items.find((diary) => diary?.id === diaryId) : null) || activeDiary
  const currentBranch =
    (Array.isArray(branches) ? branches.find((branch) => branch?.id === branchId) : null) || defaultBranch
  const currentVoucher =
    (Array.isArray(vouchers)
      ? getFlattenedVouchers(vouchers).find((voucher) => voucher?.voucherId === voucherId)
      : null) || null

  // Get shipping fee from current address
  const {
    data: shippingFee,
    isLoading: isLoadingShippingFee,
    refetch: refetchShippingFee,
    isFetched: isFetchedShippingFee
  } = useGetShippingFee({
    province:
      deliveryMethod === DeliveryMethod.Delivery ? currentAddress?.province || '' : currentBranch?.province || '',
    district:
      deliveryMethod === DeliveryMethod.Delivery ? currentAddress?.district || '' : currentBranch?.district || '',
    weight: 500
  })

  const isLoadingAddressSection = isLoadingAddresses || isLoadingUserProfile
  const isLoading =
    isLoadingAddressSection ||
    isLoadingDiaries ||
    isLoadingBranches ||
    isLoadingShippingFee ||
    isLoadingVouchers ||
    isLoadingConfig ||
    isLoadingLatestMeasurement ||
    isLoadingPresetDetails

  const orderType = orderItems?.type as OrderItemType

  const { fullMerchandiseTotal, savedAmount, payableMerchandisePortion, totalPaymentNow, addOnsSubtotal } =
    getPaymentDetails({
      orderType,
      price:
        orderType === OrderItemType.Preset
          ? presetDetails.reduce((acc, preset) => acc + getPresetPrice(preset.id, preset.price, orderItems), 0)
          : 0,
      paymentType,
      shippingFee: shippingFee || 0,
      voucher: currentVoucher,
      addOnOptions: getAllAddOnOptionsWithQuantities(orderItems),
      depositRate: config?.depositRate || 0
    })

  const { refreshControl } = useRefreshs([
    refetchAddresses,
    refetchUserProfile,
    refetchShippingFee,
    refetchDiaries,
    refetchBranches,
    refetchVouchers,
    refetchLatestMeasurement,
    refetchConfig
  ])

  // Modal handlers
  const handlePresentAddressModal = useCallback(() => {
    addressSelectionModalRef.current?.present()
  }, [])

  const handleSelectAddress = useCallback(
    (addressId: string) => {
      if (setValue) {
        setValue('addressId', addressId)
      }
      addressSelectionModalRef.current?.dismiss()
    },
    [setValue]
  )

  const handlePresentDiaryModal = useCallback(() => {
    diarySelectionModalRef.current?.present()
  }, [])

  const handleSelectDiary = useCallback(
    (diaryId: string) => {
      if (setValue) {
        setValue('measurementDiaryId', diaryId)
      }
      diarySelectionModalRef.current?.dismiss()
    },
    [setValue]
  )

  const handlePresentBranchModal = useCallback(() => {
    branchSelectionModalRef.current?.present()
  }, [])

  const handleSelectBranch = useCallback(
    (branchId: string) => {
      if (setValue) {
        setValue('branchId', branchId)
      }
      branchSelectionModalRef.current?.dismiss()
    },
    [setValue]
  )

  const handlePresentVoucherModal = useCallback(() => {
    voucherSelectionModalRef.current?.present()
  }, [])

  const handleSelectVoucher = useCallback(
    (voucherId: string | null) => {
      if (setValue) {
        setValue('voucherDiscountId', voucherId)
      }
      voucherSelectionModalRef.current?.dismiss()
    },
    [setValue]
  )

  // Tab handler
  const handleSwitchTab = (value: DeliveryMethod) => {
    setTabValue(value)
    if (setValue) {
      setValue('deliveryMethod', value)
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
    if (!currentUserProfile?.phoneNumber) {
      // TODO: create a custom component for toast error
      toast.error('Please add your phone number first')
      return
    }

    console.log({
      ...data,
      fullMerchandiseTotal,
      savedAmount,
      payableMerchandisePortion,
      totalPaymentNow,
      addOnsSubtotal
    })

    const { measurementDiaryId, ...rest } = data

    if (orderType === OrderItemType.Preset) {
      placePresetOrderMutation.mutate(rest)
    } else {
      console.log('Not implemented')
    }
  }

  const removeAddOnOption = async (presetId: string, addOnOptionId: string) => {
    const items = await getOrderItems()

    if (!items) return

    // Remove in form
    const newPresetsForm = formPresets.map((preset) => ({
      ...preset,
      options: preset.options.filter((option) => option.addOnOptionId !== addOnOptionId)
    }))

    setValue('presets', newPresetsForm)

    // Remove in Storage
    const presetItems = items.items as Record<string, PresetInStorage>
    const preset = presetItems[presetId]
    const newOptions = preset.options.filter((option) => option.addOnOptionId !== addOnOptionId)
    preset.options = newOptions

    await AsyncStorage.setItem('order-items', JSON.stringify(items))

    // Update order items state to trigger recalculation
    setOrderItems(items)
  }

  // Set preset to form
  useFocusEffect(
    useCallback(() => {
      const getPreset = async () => {
        const items = await getOrderItems()

        if (!items) {
          router.replace('/')
          return
        }

        setOrderItems(items)

        if (items.type === OrderItemType.Preset) {
          const presetItems = items.items as Record<string, PresetInStorage>
          const newPresetsForm = Object.values(presetItems).map((preset) => ({
            id: preset.presetId,
            quantity: preset.quantity,
            options: preset.options.map((opt) => ({
              addOnOptionId: opt.addOnOptionId,
              value: opt.value
            }))
          }))

          setValue('presets', newPresetsForm)
          const presetIds = Object.keys(presetItems)
          setPresetIds(presetIds)
        }
      }

      getPreset()
    }, [router, setValue])
  )

  // Set latest measurement to form
  useEffect(() => {
    if (isFetchedLatestMeasurement && latestMeasurement && setValue && diaryId) {
      setValue('measurementId', latestMeasurement.id)
    }
  }, [isFetchedLatestMeasurement, latestMeasurement, setValue, diaryId])

  // Set default address to form if delivery method is delivery
  useEffect(() => {
    if (isFetchedAddresses && defaultAddress?.id && setValue && deliveryMethod === DeliveryMethod.Delivery) {
      setValue('addressId', defaultAddress.id)
      setValue('branchId', null)
    }
  }, [isFetchedAddresses, defaultAddress, setValue, deliveryMethod])

  // Set default branch to form if delivery method is pick up
  useEffect(() => {
    if (isFetchedBranches && defaultBranch?.id && setValue && deliveryMethod === DeliveryMethod.PickUp) {
      setValue('branchId', defaultBranch.id)
      setValue('addressId', null)
    }
  }, [isFetchedBranches, defaultBranch, setValue, deliveryMethod])

  // Set active diary to form
  useEffect(() => {
    if (isFetchedDiaries && activeDiary?.id && setValue) {
      setValue('measurementDiaryId', activeDiary.id)
    }
  }, [isFetchedDiaries, activeDiary, setValue])

  // Set shipping fee to form
  useEffect(() => {
    if (isFetchedShippingFee && shippingFee && setValue) {
      setValue('shippingFee', shippingFee)
    }
  }, [isFetchedShippingFee, shippingFee, setValue])

  const renderOrderSummaryContent = () => {
    if (!orderItems) {
      return <Skeleton className='h-60 m-2 rounded-2xl' />
    }

    if (orderType === OrderItemType.Preset && presetIds.length && presetDetails) {
      return (
        <View>
          {presetDetails.map((preset, index) => {
            const quantity = (orderItems.items[preset.id] as PresetInStorage)?.quantity || 1
            const presetItems = orderItems.items as Record<string, PresetInStorage>

            return (
              <React.Fragment key={preset.id}>
                <PresetOrderItem
                  preset={preset}
                  presetOptions={presetItems[preset.id].options}
                  onRemoveAddOnOption={removeAddOnOption}
                  iconSize={SMALL_ICON_SIZE}
                  quantity={quantity}
                />
                {index !== presetDetails.length - 1 ? (
                  <View className='border-b border-dashed border-muted-foreground/30 my-1' />
                ) : null}
              </React.Fragment>
            )
          })}
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
      <View className='flex-1 relative'>
        {isLoading ? (
          <>
            <BlurView
              experimentalBlurMethod='dimezisBlurView'
              tint='dark'
              intensity={5}
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 50 }}
            />
            <ActivityIndicator
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51]'
              size='large'
              color={PRIMARY_COLOR.LIGHT}
            />
          </>
        ) : null}

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
              contentContainerStyle={{ paddingBottom: 56 }}
              refreshControl={refreshControl}
            >
              <View className='flex flex-col gap-4 p-2 flex-1'>
                {/* Address Section */}
                <Animated.View entering={FadeInDown.delay(100)}>
                  <AddressSection
                    tabValue={tabValue}
                    isLoadingAddress={isLoadingAddressSection}
                    isLoadingBranch={isLoadingBranches}
                    address={currentAddress}
                    branch={currentBranch}
                    currentUserProfile={currentUserProfile}
                    iconSize={SMALL_ICON_SIZE}
                    handleSwitchTab={handleSwitchTab}
                    handlePresentAddressModal={handlePresentAddressModal}
                    handlePresentBranchModal={handlePresentBranchModal}
                  />
                </Animated.View>

                {/* Diary Section */}
                <Animated.View entering={FadeInDown.delay(200)}>
                  <DiarySection
                    isLoading={isLoadingDiaries}
                    diary={currentDiary}
                    handlePresentDiaryModal={handlePresentDiaryModal}
                    latestMeasurement={latestMeasurement}
                    iconSize={SMALL_ICON_SIZE}
                  />
                </Animated.View>

                {/* Order Summary Section */}
                <Animated.View entering={FadeInDown.delay(300)}>
                  <OrderSummarySection
                    isLoadingShippingFee={isLoadingShippingFee}
                    shippingFee={shippingFee}
                    renderOrderSummaryContent={renderOrderSummaryContent}
                    iconSize={SMALL_ICON_SIZE}
                    orderItems={orderItems}
                    fullMerchandiseTotal={fullMerchandiseTotal}
                  />
                </Animated.View>

                {/* MamaFit Vouchers */}
                <Animated.View entering={FadeInDown.delay(400)}>
                  <VouchersSection
                    iconSize={SMALL_ICON_SIZE}
                    voucher={currentVoucher}
                    onPress={handlePresentVoucherModal}
                    savedAmount={savedAmount}
                  />
                </Animated.View>

                {/* Payment Methods Section */}
                <Animated.View entering={FadeInDown.delay(500)}>
                  <PaymentMethodsSection iconSize={SMALL_ICON_SIZE} depositRate={config?.depositRate || 0} />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(600)} className='gap-2'>
                  {/* Payment Details Section */}
                  <PaymentDetailsSection
                    iconSize={SMALL_ICON_SIZE}
                    fullMerchandiseTotal={fullMerchandiseTotal}
                    shippingFee={shippingFee}
                    totalPaymentNow={totalPaymentNow}
                    savedAmount={savedAmount}
                    paymentType={paymentType}
                    payableMerchandisePortion={payableMerchandisePortion}
                    addOnsSubtotal={addOnsSubtotal}
                    addOnsCount={getAllAddOnOptionsWithQuantities(orderItems).reduce(
                      (acc, addOn) => acc + addOn.quantity,
                      0
                    )}
                    depositRate={config?.depositRate || 0}
                  />

                  <Text className='text-xs text-muted-foreground px-2 mb-4'>
                    By clicking &apos;Place Order&apos;, you are agreeing to MamaFit&apos;s General Transaction Terms
                  </Text>
                </Animated.View>
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
                  {totalPaymentNow.toLocaleString('vi-VN')}
                </Text>

                <Text className='font-inter-medium text-primary text-sm'>
                  <Text className='text-xs'>Saved</Text>{' '}
                  <Text className='underline font-inter-medium text-sm text-primary'>đ</Text>
                  {savedAmount > 0 ? savedAmount.toLocaleString('vi-VN') : '0'}
                </Text>
              </View>
              <Button
                onPress={methods.handleSubmit(onSubmit)}
                disabled={placePresetOrderMutation.isPending || isLoading}
              >
                <Text className='font-inter-medium'>
                  {placePresetOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                </Text>
              </Button>
            </View>

            {/* Modals */}
            {addresses && Array.isArray(addresses) ? (
              <AddressSelectionModal
                ref={addressSelectionModalRef}
                addresses={addresses}
                selectedAddressId={addressId || undefined}
                onSelectAddress={handleSelectAddress}
              />
            ) : null}

            {diaries && diaries.items && Array.isArray(diaries.items) ? (
              <DiarySelectionModal
                ref={diarySelectionModalRef}
                diaries={diaries.items}
                selectedDiaryId={diaryId || undefined}
                onSelectDiary={handleSelectDiary}
              />
            ) : null}

            {branches && Array.isArray(branches) && deliveryMethod === DeliveryMethod.PickUp ? (
              <BranchSelectionModal
                ref={branchSelectionModalRef}
                branches={branches}
                selectedBranchId={branchId || undefined}
                onSelectBranch={handleSelectBranch}
              />
            ) : null}

            {vouchers && Array.isArray(vouchers) ? (
              <VouchersSelectionModal
                ref={voucherSelectionModalRef}
                vouchers={getFlattenedVouchers(vouchers)}
                selectedVoucherId={voucherId || undefined}
                onSelectVoucher={handleSelectVoucher}
                fullMerchandiseTotal={fullMerchandiseTotal}
              />
            ) : null}
          </FormProvider>
        </BottomSheetModalProvider>
      </View>
    </SafeView>
  )
}
