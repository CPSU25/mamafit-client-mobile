import { Feather, FontAwesome } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'
import { PRIMARY_COLOR } from '~/lib/constants/constants'

export default function PaymentScreen() {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()
  const { bottom } = useSafeAreaInsets()
  const { orderId } = useLocalSearchParams() as { orderId: string }
  const [value, setValue] = useState<'full' | 'deposit'>('full')

  function onLabelPress(label: 'full' | 'deposit') {
    return () => {
      setValue(label)
    }
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  return (
    <SafeView>
      <View className='flex flex-row items-center gap-4 p-4'>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
        <Text className='font-inter-semibold text-xl'>Payment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 46 }}>
        <View className='flex flex-col gap-2 p-2 bg-muted flex-1'>
          <Card className='p-3 flex flex-row items-baseline gap-2'>
            <Feather name='map-pin' size={16} color={PRIMARY_COLOR.LIGHT} />
            <View className='flex-1'>
              <Text className='font-inter-medium'>
                Danh Nguyen <Text className='text-muted-foreground text-sm'>(+84) 961 030 903</Text>
              </Text>
              <Text className={`text-sm ${isDarkColorScheme ? 'text-white/70' : 'text-black/70'} mt-1`}>
                Hẻm 4a Lò Lu, phường Trường Thạnh, Thành Phố Thủ Đức, TP.Hồ Chí Minh
              </Text>
            </View>
            <Feather name='chevron-right' size={20} color='lightgray' className='self-center' />
          </Card>
          <Card>
            <View className='flex flex-row items-baseline gap-2 p-3'>
              <Feather name='box' size={16} color={PRIMARY_COLOR.LIGHT} />
              <Text className='text-sm font-inter-medium'>Order Summary</Text>
            </View>
            <Separator />
            <View className='flex flex-col gap-4 p-3'>
              <OrderItem />
              <OrderItem />
              <OrderItem />
            </View>
            <Separator />
            <View className='p-3 flex flex-col gap-4'>
              <View className='flex-row items-center'>
                <Text className='font-inter-medium flex-1 text-sm'>Shipping Option</Text>
                <View className='flex flex-row items-center gap-1'>
                  <Text className='text-xs text-muted-foreground'>View All</Text>
                  <Feather name='chevron-right' size={20} color='lightgray' />
                </View>
              </View>
              <View className='min-h-24 bg-emerald-50 border border-emerald-200 rounded-2xl p-3'></View>
            </View>
            <Separator />
            <View className='p-3 flex flex-row'>
              <Text className='text-sm flex-1'>Total 3 Item(s)</Text>
              <Text className='font-inter-medium'>
                <Text className='underline font-inter-medium text-sm'>đ</Text>19.499.999
              </Text>
            </View>
          </Card>
          <Card className='p-3'>
            <View className='flex-row items-center'>
              <Text className='font-inter-medium flex-1 text-sm'>MamaFit Vouchers</Text>
              <View className='flex flex-row items-center gap-1'>
                <Text className='text-xs text-muted-foreground'>View All</Text>
                <Feather name='chevron-right' size={20} color='lightgray' />
              </View>
            </View>
          </Card>
          <Card className='p-3 flex flex-col gap-4'>
            <View className='flex-row items-center'>
              <Text className='font-inter-medium flex-1 text-sm'>Payment Methods</Text>
              <View className='flex flex-row items-center gap-1'>
                <Text className='text-xs text-muted-foreground'>View All</Text>
                <Feather name='chevron-right' size={20} color='lightgray' />
              </View>
            </View>

            <RadioGroup
              value={value}
              onValueChange={(value) => setValue(value as 'full' | 'deposit')}
              className='gap-3'
            >
              <RadioGroupItemWithLabel
                value='full'
                onLabelPress={onLabelPress('full')}
                label='Banking (Full Payment)'
              />
              <RadioGroupItemWithLabel
                value='deposit'
                onLabelPress={onLabelPress('deposit')}
                label='Banking (Deposit 50%)'
              />
            </RadioGroup>
          </Card>

          <Card className='p-3'>
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

      {/* Fixed bottom section */}
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
        <Button
          onPress={() =>
            router.replace({
              pathname: '/payment/[orderId]/qr-code',
              params: { orderId }
            })
          }
        >
          <Text className='font-inter-medium'>Place Order</Text>
        </Button>
      </View>
    </SafeView>
  )
}

const OrderItem = () => {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <View className='flex flex-row items-center gap-3 h-20'>
      <Image source={require('~/assets/images/mesh.jpg')} className='aspect-square w-20 rounded-2xl' />
      <View className='flex-1'>
        <View className='flex-1'>
          <Text className={`text-sm ${isDarkColorScheme ? 'text-white/70' : 'text-black/70'}`} numberOfLines={1}>
            Váy bầu hiện đại, thanh lịch nhất năm 2025 dành cho các mẹ thích sự đơn giản
          </Text>
          <Text className='text-xs text-muted-foreground'>Navy</Text>
        </View>
        <View className='flex flex-row justify-between items-baseline'>
          <Text className='text-primary font-inter-medium'>
            <Text className='underline text-primary font-inter-medium text-sm'>đ</Text>19.499.999
          </Text>
          <Text className='text-muted-foreground text-xs'>x1</Text>
        </View>
      </View>
    </View>
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
