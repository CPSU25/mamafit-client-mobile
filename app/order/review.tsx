import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, SubmitHandler } from 'react-hook-form'
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AutoHeightImage from '~/components/auto-height-image'
import Loading from '~/components/loading'
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
import { useColorScheme } from '~/hooks/use-color-scheme'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { cn } from '~/lib/utils'
import { Address } from '~/types/address.type'
import { Diary } from '~/types/diary.type'
import { ComponentOptionWithComponent, PresetWithComponentOptions } from '~/types/preset.type'

interface OrderItem<T> {
  type: string
  items: T[]
}

const ORDERED_COMPONENTS_OPTIONS = ['Neckline', 'Sleeves', 'Waist', 'Hem', 'Color', 'Fabric']
const SMALL_ICON_SIZE = 18

const getOrderedComponentOptions = (options: ComponentOptionWithComponent[]) => {
  if (!Array.isArray(options)) return []

  return ORDERED_COMPONENTS_OPTIONS.map((key) => {
    const option = options.find((option) => option?.componentName === key)
    return option || null
  }).filter(Boolean)
}

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

    const parsedOrderItems = JSON.parse(orderItems) as OrderItem<unknown>
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
  const { methods, initForm, placePresetOrderMutation } = usePlacePresetOrder(clearOrderItems)
  const { bottom } = useSafeAreaInsets()
  const { isDarkColorScheme } = useColorScheme()

  const addressSelectionModalRef = useRef<BottomSheetModal>(null)
  const diarySelectionModalRef = useRef<BottomSheetModal>(null)

  const [tabValue, setTabValue] = useState<DeliveryMethod>(methods.watch('deliveryMethod'))
  const [orderItems, setOrderItems] = useState<OrderItem<unknown> | null>(null)
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

  const isLoadingAddressCard = isLoadingAddresses || isLoadingUserProfile

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

  const handlePresetDiaryModal = useCallback(() => {
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
  const onSubmit: SubmitHandler<PlaceOrderPresetFormSchema> = (data) => {
    console.log(data)
    if (orderType === 'preset') {
      placePresetOrderMutation.mutate(data)
    } else {
      console.log('Not implemented')
    }
  }

  // Initialize form with default address + selected preset
  useEffect(() => {
    const initializeForm = async () => {
      if (isFetchedAddresses && isFetchedDiaries && defaultAddress?.id && activeDiary?.id) {
        const items = await getOrderItems()
        if (!items) {
          router.replace('/')
          return
        }

        setOrderItems(items)

        if (items?.type === 'preset' && Array.isArray(items.items) && items.items.length > 0) {
          const presetItem = items.items[0]
          if (presetItem && typeof presetItem === 'object' && 'id' in presetItem) {
            const typedPreset = presetItem as PresetWithComponentOptions
            setPreset(typedPreset)
            if (initForm && typedPreset.id && defaultAddress.id && activeDiary.id) {
              initForm(typedPreset.id, defaultAddress.id, activeDiary.id)
            }
          }
        }
      }
    }

    initializeForm()
  }, [initForm, defaultAddress, isFetchedAddresses, isFetchedDiaries, activeDiary, router])

  // Set shipping fee to form
  useEffect(() => {
    if (isFetchedShippingFee && shippingFee && methods?.setValue) {
      methods.setValue('shippingFee', shippingFee)
    }
  }, [isFetchedShippingFee, shippingFee, methods])

  const renderOrderSummaryContent = () => {
    // TODO: Add UI for empty order items
    if (!orderItems) {
      return null
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
      {orderItems ? (
        <>
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
                  {/* Address Selection */}
                  <Tabs
                    value={tabValue}
                    onValueChange={(value) => handleSwitchTab(value as DeliveryMethod)}
                    className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
                  >
                    <TabsList className='flex-row w-full'>
                      <TabsTrigger value={DeliveryMethod.DELIVERY} className='flex-1 flex-row items-center gap-2'>
                        {SvgIcon.toReceive({ size: SMALL_ICON_SIZE })}
                        <Text>Delivery</Text>
                      </TabsTrigger>
                      <TabsTrigger value={DeliveryMethod.PICK_UP} className='flex-1 flex-row items-center gap-2'>
                        {SvgIcon.shop({ size: SMALL_ICON_SIZE })}
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
                    {/* TODO: Add Pick Up option */}
                    <TabsContent value='PICK_UP'></TabsContent>
                  </Tabs>

                  {/* Diary Selection */}
                  <Card className='p-1 gap-2' style={[styles.container]}>
                    <View
                      className={cn(
                        'rounded-xl p-2 flex-row items-center gap-2',
                        isDarkColorScheme ? 'bg-primary/20' : 'bg-primary/10'
                      )}
                    >
                      {SvgIcon.folderFavorite({ size: ICON_SIZE.LARGE, color: 'PRIMARY' })}
                      <View className='flex-1'>
                        <Text
                          className={cn(
                            'font-inter-medium text-sm',
                            isDarkColorScheme ? 'text-primary-foreground' : 'text-primary'
                          )}
                        >
                          Choose a diary
                        </Text>
                        <Text
                          className={cn(
                            'text-xs',
                            isDarkColorScheme ? 'text-primary-foreground/70' : 'text-primary/70'
                          )}
                        >
                          This will help shape your maternity dress
                        </Text>
                      </View>
                    </View>

                    <DiaryCard
                      diary={currentDiary || undefined}
                      isLoading={isLoadingDiaries}
                      onPress={handlePresetDiaryModal}
                    />
                  </Card>

                  {/* Order Summary */}
                  <Card style={[styles.container]}>
                    <View className='flex flex-row items-center gap-2 p-3'>
                      <MaterialCommunityIcons name='card-text' size={SMALL_ICON_SIZE} color={PRIMARY_COLOR.LIGHT} />
                      <Text className='text-sm font-inter-medium'>Order Summary</Text>
                    </View>

                    <Separator />

                    {renderOrderSummaryContent()}

                    <Separator />

                    <View className='p-3 flex flex-col gap-2'>
                      <View className='flex-row items-center gap-2'>
                        <MaterialCommunityIcons name='truck-fast' size={SMALL_ICON_SIZE} color='#047857' />
                        <Text className='font-inter-medium text-sm'>Shipping Option</Text>
                      </View>
                      <View className='bg-emerald-50 border border-emerald-200 rounded-2xl py-3 px-4 flex-row items-center justify-center gap-2'>
                        <View className='flex-1'>
                          <Text className='text-sm font-inter-medium text-emerald-700'>Standard Delivery</Text>
                          <Text className='text-xs text-emerald-600'>3-5 business days</Text>
                        </View>
                        {isLoadingShippingFee ? (
                          <ActivityIndicator size={SMALL_ICON_SIZE} color='#047857' />
                        ) : (
                          <Text className='text-emerald-700 text-sm font-inter-medium'>
                            <Text className='underline text-sm text-emerald-700 font-inter-medium'>đ</Text>
                            {shippingFee && shippingFee.toLocaleString('vi-VN')}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Separator />
                    <View className='p-3 flex flex-row'>
                      <Text className='text-sm font-inter-medium flex-1'>
                        Total {orderItems?.items && Array.isArray(orderItems.items) ? orderItems.items.length : 0}{' '}
                        Item(s)
                      </Text>
                      <Text className='font-inter-medium'>
                        <Text className='underline font-inter-medium text-sm'>đ</Text>
                        {preset?.price && preset?.price?.toLocaleString('vi-VN')}
                      </Text>
                    </View>
                  </Card>

                  {/* MamaFit Vouchers */}
                  <Card className='p-3' style={[styles.container]}>
                    <View className='flex-row items-center'>
                      <View className='flex-row items-center gap-2 flex-1'>
                        <MaterialCommunityIcons
                          name='ticket-percent'
                          size={SMALL_ICON_SIZE}
                          color={PRIMARY_COLOR.LIGHT}
                        />
                        <Text className='font-inter-medium text-sm'>MamaFit Vouchers</Text>
                      </View>
                      <View className='flex flex-row items-center gap-1'>
                        <Text className='text-xs text-muted-foreground'>View All</Text>
                        <Feather name='chevron-right' size={20} color='lightgray' />
                      </View>
                    </View>
                  </Card>

                  {/* Payment Methods */}
                  <Card className='p-2 flex flex-col gap-4 text-sky-50' style={[styles.container]}>
                    <Controller
                      control={methods.control}
                      name='paymentType'
                      render={({ field: { value, onChange } }) => (
                        <RadioGroup
                          value={value}
                          onValueChange={(val) => onChange(val as PaymentType)}
                          className='gap-2'
                        >
                          <RadioGroupItemWithLabel
                            value='FULL'
                            onPress={() => onChange('FULL')}
                            label='Full Payment (Banking)'
                            iconColor='#38bdf8'
                            backgroundColor='#f0f9ff'
                            description='Pay the full amount now'
                          />
                          <RadioGroupItemWithLabel
                            value='DEPOSIT'
                            onPress={() => onChange('DEPOSIT')}
                            label='Deposit 50% (Banking)'
                            iconColor='#fbbf24'
                            backgroundColor='#fffbeb'
                            description='Pay 50% of the total amount now'
                          />
                        </RadioGroup>
                      )}
                    />
                  </Card>

                  {/* Payment Details */}
                  <Card className='p-3' style={[styles.container]}>
                    <View className='flex-row items-center gap-2'>
                      <MaterialCommunityIcons name='information' size={SMALL_ICON_SIZE} color={PRIMARY_COLOR.LIGHT} />
                      <Text className='font-inter-medium text-sm'>Payment Details</Text>
                    </View>
                    <View className='flex flex-col gap-2 mt-2'>
                      <View className='flex-row items-baseline'>
                        <Text className='text-xs text-muted-foreground flex-1'>Merchandise Subtotal</Text>
                        <Text className='text-xs text-muted-foreground'>
                          <Text className='underline text-xs text-muted-foreground'>đ</Text>
                          {preset?.price && preset?.price?.toLocaleString('vi-VN')}
                        </Text>
                      </View>
                      <View className='flex-row items-baseline'>
                        <Text className='text-xs text-muted-foreground flex-1'>Shipping Subtotal</Text>
                        <Text className='text-xs text-muted-foreground'>
                          <Text className='underline text-xs text-muted-foreground'>đ</Text>
                          {shippingFee && shippingFee.toLocaleString('vi-VN')}
                        </Text>
                      </View>
                      {voucherId ? (
                        <View className='flex-row items-baseline'>
                          <Text className='text-xs text-muted-foreground flex-1'>Discount Subtotal</Text>
                          <Text className='text-xs text-primary'>
                            -<Text className='underline text-xs text-primary'>đ</Text>12.800
                          </Text>
                        </View>
                      ) : null}
                      <Separator />
                      <View className='flex-row items-baseline'>
                        <Text className='text-sm font-inter-medium flex-1'>Total Payment</Text>
                        <Text className='font-inter-medium text-sm'>
                          <Text className='underline font-inter-medium text-xs'>đ</Text>
                          {totalPayment.toLocaleString('vi-VN')}
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
                style={{ paddingBottom: bottom, boxShadow: '0 -2px 6px -1px rgba(0, 0, 0, 0.1)' }}
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
        </>
      ) : (
        <Loading />
      )}
    </SafeView>
  )
}
const RadioGroupItemWithLabel = ({
  value,
  onPress,
  label,
  iconColor,
  backgroundColor,
  description
}: {
  value: string
  onPress: () => void
  label: string
  iconColor: string
  backgroundColor: string
  description: string
}) => {
  return (
    <TouchableOpacity className='flex-row justify-between items-center p-2 rounded-xl' onPress={onPress}>
      <View className='flex flex-row items-center gap-3'>
        <View className='p-2 rounded-full' style={{ backgroundColor }}>
          <MaterialCommunityIcons name='credit-card' size={20} color={iconColor} />
        </View>
        <View>
          <Label className='native:text-sm font-inter-medium' nativeID={`label-for-${value}`} onPress={onPress}>
            {label}
          </Label>
          <Text className='text-xs text-muted-foreground'>{description}</Text>
        </View>
      </View>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
    </TouchableOpacity>
  )
}
