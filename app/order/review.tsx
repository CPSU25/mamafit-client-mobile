import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, SubmitHandler } from 'react-hook-form'
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Text } from '~/components/ui/text'
import { useGetAllDiaries } from '~/features/diary/hooks/use-get-all-diaries'
import AddressCard from '~/features/order/components/address-card'
import AddressSelectionModal from '~/features/order/components/address-selection-modal'
import DiaryCard from '~/features/order/components/diary-card'
import DiarySelectionModal from '~/features/order/components/diary-selection-modal'
import { useGetShippingFee } from '~/features/order/hooks/use-get-shipping-fee'
import { usePlacePresetOrder } from '~/features/order/hooks/use-place-preset-order'
import { DeliveryMethod, PaymentType, PlaceOrderPresetFormSchema } from '~/features/order/validations'
import { useGetAddresses } from '~/features/user/hooks/use-get-addresses'
import { useGetProfile } from '~/features/user/hooks/use-get-profile'
import { useAuth } from '~/hooks/use-auth'
import { useRefreshs } from '~/hooks/use-refresh'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { Address } from '~/types/address.type'
import { Diary } from '~/types/diary.type'

const getDefaultAddress = (addresses: Address[] | null | undefined) => {
  if (!addresses || addresses.length === 0) return null
  const defaultAddress = addresses.find((address) => address.isDefault)
  return defaultAddress || addresses[0]
}

const getActiveDiary = (diaries: Diary[] | null | undefined) => {
  if (!diaries || diaries.length === 0) return null
  const activeDiary = diaries.find((diary) => diary.isActive)
  return activeDiary || diaries[0]
}

export default function ReviewOrderScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { methods, initForm } = usePlacePresetOrder()
  const { bottom } = useSafeAreaInsets()

  const addressSelectionModalRef = useRef<BottomSheetModal>(null)
  const diarySelectionModalRef = useRef<BottomSheetModal>(null)

  const [tabValue, setTabValue] = useState<DeliveryMethod>(methods.watch('deliveryMethod'))

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

  const isLoadingAddressCard = isLoadingAddresses || isLoadingUserProfile

  // Get default address or first address on load
  const defaultAddress = getDefaultAddress(addresses)
  const activeDiary = getActiveDiary(diaries?.items)

  // Take user selected address to calculate shipping fee
  const addressId = methods.watch('addressId')
  const diaryId = methods.watch('measurementDiaryId')

  const currentAddress = addresses?.find((address) => address.id === addressId) || defaultAddress
  const currentDiary = diaries?.items.find((diary) => diary.id === diaryId) || activeDiary

  // Type the order to display UI
  const orderType = 'preset'

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

  const { refreshControl } = useRefreshs([refetchAddresses, refetchUserProfile, refetchShippingFee, refetchDiaries])

  // Initialize form with default address + selected preset
  useEffect(() => {
    if (isFetchedAddresses && isFetchedDiaries && defaultAddress?.id && activeDiary?.id) {
      initForm('4f4d8b91705f4a9bb95ecf18b57b0306', defaultAddress.id, activeDiary.id)
    }
  }, [initForm, defaultAddress, isFetchedAddresses, isFetchedDiaries, activeDiary])

  // Set shipping fee to form
  useEffect(() => {
    if (isFetchedShippingFee && shippingFee) {
      methods.setValue('shippingFee', shippingFee)
    }
  }, [isFetchedShippingFee, shippingFee, methods])

  // Modal handlers
  const handlePresentAddressModal = useCallback(() => {
    addressSelectionModalRef.current?.present()
  }, [])

  const handleSelectAddress = useCallback(
    (addressId: string) => {
      methods.setValue('addressId', addressId)
      addressSelectionModalRef.current?.dismiss()
    },
    [methods]
  )

  const handlePresetDiaryModal = useCallback(() => {
    diarySelectionModalRef.current?.present()
  }, [])

  const handleSelectDiary = useCallback(
    (diaryId: string) => {
      methods.setValue('measurementDiaryId', diaryId)
      diarySelectionModalRef.current?.dismiss()
    },
    [methods]
  )

  // Tab handler
  const handleSwitchTab = (value: DeliveryMethod) => {
    setTabValue(value)
    methods.setValue('deliveryMethod', value)
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  // Place order
  const onSubmit: SubmitHandler<PlaceOrderPresetFormSchema> = (data) => {
    console.log(data)
  }

  return (
    <SafeView>
      <View className='flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Review Order</Text>
      </View>

      <View className='h-2 bg-muted' />

      <BottomSheetModalProvider>
        <FormProvider {...methods}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 46 }}
            refreshControl={refreshControl}
          >
            <View className='flex flex-col gap-4 p-4 flex-1'>
              {/* TODO: Add Pick Up option */}
              {/* Address Selection */}
              <Tabs
                value={tabValue}
                onValueChange={(value) => handleSwitchTab(value as DeliveryMethod)}
                className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
              >
                <TabsList className='flex-row w-full'>
                  <TabsTrigger value={DeliveryMethod.DELIVERY} className='flex-1'>
                    <Text>Delivery</Text>
                  </TabsTrigger>
                  <TabsTrigger value={DeliveryMethod.PICK_UP} className='flex-1'>
                    <Text>Pick Up</Text>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='DELIVERY'>
                  <AddressCard
                    address={currentAddress || undefined}
                    fullName={currentUserProfile?.fullName || undefined}
                    phoneNumber={currentUserProfile?.phoneNumber || undefined}
                    isLoading={isLoadingAddressCard}
                    onPress={handlePresentAddressModal}
                  />
                </TabsContent>
                <TabsContent value='PICK_UP'></TabsContent>
              </Tabs>

              {/* DiarySelection */}
              <DiaryCard
                diary={currentDiary || undefined}
                isLoading={isLoadingDiaries}
                onPress={handlePresetDiaryModal}
              />

              {/* Order Summary */}
              <Card style={[styles.container]}>
                <View className='flex flex-row items-baseline gap-2 p-3'>
                  <Feather name='box' size={16} color={PRIMARY_COLOR.LIGHT} />
                  <Text className='text-sm font-inter-medium'>Order Summary</Text>
                </View>

                <Separator />

                {orderType === 'preset' && <View className='flex flex-col gap-4 p-3'></View>}

                <Separator />

                <View className='p-3 flex flex-col gap-2'>
                  <Text className='font-inter-medium flex-1 text-sm'>Shipping Option</Text>
                  <View className='bg-emerald-50 border border-emerald-200 rounded-2xl px-3 flex-row items-center justify-center h-12 gap-2'>
                    <MaterialCommunityIcons name='truck-fast-outline' size={18} color='#047857' />
                    <Text className='text-xs font-inter-medium flex-1 text-emerald-700'>Normal Delivery</Text>
                    {isLoadingShippingFee ? (
                      <ActivityIndicator size={18} color='#047857' />
                    ) : (
                      <Text className='text-emerald-700 text-xs font-inter-medium'>
                        <Text className='underline text-xs text-emerald-700 font-inter-medium'>đ</Text>
                        {shippingFee && shippingFee.toLocaleString('vi-VN')}
                      </Text>
                    )}
                  </View>
                </View>
                <Separator />
                <View className='p-3 flex flex-row'>
                  <Text className='text-sm flex-1'>Total 3 Item(s)</Text>
                  <Text className='font-inter-medium'>
                    <Text className='underline font-inter-medium text-sm'>đ</Text>19.499.999
                  </Text>
                </View>
              </Card>

              {/* MamaFit Vouchers */}
              <Card className='p-3' style={[styles.container]}>
                <View className='flex-row items-center'>
                  <Text className='font-inter-medium flex-1 text-sm'>MamaFit Vouchers</Text>
                  <View className='flex flex-row items-center gap-1'>
                    <Text className='text-xs text-muted-foreground'>View All</Text>
                    <Feather name='chevron-right' size={20} color='lightgray' />
                  </View>
                </View>
              </Card>

              {/* Payment Methods */}
              <Card className='p-3 flex flex-col gap-4' style={[styles.container]}>
                <Text className='font-inter-medium flex-1 text-sm'>Payment Methods</Text>

                <Controller
                  control={methods.control}
                  name='paymentType'
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup value={value} onValueChange={(val) => onChange(val as PaymentType)} className='gap-3'>
                      <RadioGroupItemWithLabel
                        value='FULL'
                        onLabelPress={() => onChange('FULL')}
                        label='Banking (Full Payment)'
                      />
                      <RadioGroupItemWithLabel
                        value='DEPOSIT'
                        onLabelPress={() => onChange('DEPOSIT')}
                        label='Banking (Deposit 50%)'
                      />
                    </RadioGroup>
                  )}
                />
              </Card>

              {/* Payment Details */}
              <Card className='p-3' style={[styles.container]}>
                <Text className='font-inter-medium text-sm'>Payment Details</Text>
                <View className='flex flex-col gap-2 mt-4'>
                  <View className='flex-row items-baseline'>
                    <Text className='text-xs text-muted-foreground flex-1'>Merchandise Subtotal</Text>
                    <Text className='text-xs text-muted-foreground'>
                      <Text className='underline text-xs text-muted-foreground'>đ</Text>19.499.999
                    </Text>
                  </View>
                  <View className='flex-row items-baseline'>
                    <Text className='text-xs text-muted-foreground flex-1'>Shipping Subtotal</Text>
                    <Text className='text-xs text-muted-foreground'>
                      <Text className='underline text-xs text-muted-foreground'>đ</Text>12.800
                    </Text>
                  </View>
                  <View className='flex-row items-baseline'>
                    <Text className='text-xs text-muted-foreground flex-1'>Discount Subtotal</Text>
                    <Text className='text-xs text-primary'>
                      -<Text className='underline text-xs text-primary'>đ</Text>12.800
                    </Text>
                  </View>
                  <Separator />
                  <View className='flex-row items-baseline'>
                    <Text className='text-sm flex-1'>Total Payment</Text>
                    <Text className='font-inter-medium text-sm'>
                      <Text className='underline font-inter-medium text-xs'>đ</Text>19.499.999
                    </Text>
                  </View>
                </View>
              </Card>

              <Text className='text-xs text-muted-foreground px-2 mb-4'>
                By clicking &apos;Place Order&apos;, you are agreeing to MamaFit&apos;s General Transaction Terms
              </Text>
            </View>
          </ScrollView>

          {/* Place Order */}
          <View
            className='absolute bottom-0 left-0 right-0 flex-row justify-end gap-3 bg-background p-3 border-t border-border'
            style={{ paddingBottom: bottom }}
          >
            <View className='flex flex-col items-end gap-1'>
              <Text className='font-inter-semibold text-primary'>
                <Text className='text-sm'>Total</Text>{' '}
                <Text className='underline font-inter-semibold text-sm text-primary'>đ</Text>19.499.999
              </Text>
              <Text className='font-inter-medium text-primary text-sm'>
                <Text className='text-xs'>Saved</Text>{' '}
                <Text className='underline font-inter-medium text-sm text-primary'>đ</Text>12.800
              </Text>
            </View>
            <Button onPress={methods.handleSubmit(onSubmit)}>
              <Text className='font-inter-medium'>Place Order</Text>
            </Button>
          </View>

          {addresses && (
            <AddressSelectionModal
              ref={addressSelectionModalRef}
              addresses={addresses}
              selectedAddressId={addressId || undefined}
              onSelectAddress={handleSelectAddress}
            />
          )}

          {diaries && diaries.items && (
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

const RadioGroupItemWithLabel = ({
  value,
  onLabelPress,
  label
}: {
  value: string
  onLabelPress: () => void
  label: string
}) => {
  return (
    <View className='flex-row justify-between items-center'>
      <View className='flex flex-row items-center gap-3'>
        <FontAwesome name='credit-card' size={20} color={PRIMARY_COLOR.LIGHT} />
        <Label className='native:text-xs' nativeID={`label-for-${value}`} onPress={onLabelPress}>
          {label}
        </Label>
      </View>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
    </View>
  )
}
