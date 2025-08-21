import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Redirect, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '~/components/loading'
import SafeView from '~/components/safe-view'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import CartItem from '~/features/cart/components/cart-item'
import { useGetCart } from '~/features/cart/hooks/use-get-cart'
import { useAuth } from '~/hooks/use-auth'
import { useRefreshs } from '~/hooks/use-refresh'
import { ICON_SIZE, PRIMARY_COLOR } from '~/lib/constants/constants'
import { SvgIcon } from '~/lib/constants/svg-icon'
import { DressInStorage, PresetInStorage } from '~/types/order-item.type'
import { OrderItemType } from '~/types/order.type'

export interface SelectedItem {
  itemId: string
  type: OrderItemType
  quantity: number
  price: number
}

export default function CartScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth()
  const { bottom } = useSafeAreaInsets()
  const [checkAll, setCheckAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

  const { data: cart, isLoading: isLoadingCart, refetch: refetchCart } = useGetCart()

  const { refreshControl } = useRefreshs([refetchCart])

  const isLoading = isLoadingCart || isLoadingAuth

  const orderItemTypeSet = useMemo(() => [...new Set(cart?.map((item) => item.type) || [])], [cart])
  const selectedItemsTypeSet = useMemo(
    () => [...new Set(selectedItems?.map((item) => item.type) || [])],
    [selectedItems]
  )

  useEffect(() => {
    if (cart && Array.isArray(cart) && cart.length > 0) {
      const allItemsSelected = cart.every((cartItem) =>
        selectedItems.some((selectedItem) => selectedItem.itemId === cartItem.itemId)
      )
      setCheckAll(allItemsSelected)
    } else {
      setCheckAll(false)
    }
  }, [selectedItems, cart])

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const toggleCheckAll = () => {
    if (cart && Array.isArray(cart)) {
      setCheckAll((prev) => {
        if (prev) {
          setSelectedItems([])
        } else {
          setSelectedItems(
            cart.map((item) => ({
              itemId: item.itemId,
              type: item.type,
              quantity: item.quantity,
              price:
                item.type === OrderItemType.Preset ? item.preset?.price || 0 : item.maternityDressDetail?.price || 0
            }))
          )
        }
        return !prev
      })
    }
  }

  const handleCheckOut = async () => {
    if (selectedItemsTypeSet[0] === OrderItemType.Preset) {
      await AsyncStorage.setItem(
        'order-items',
        JSON.stringify({
          type: OrderItemType.Preset,
          items: selectedItems.reduce(
            (acc, item) => {
              acc[item.itemId] = {
                presetId: item.itemId,
                quantity: item.quantity,
                options: []
              }
              return acc
            },
            {} as Record<string, PresetInStorage>
          )
        })
      )
    }

    if (selectedItemsTypeSet[0] === OrderItemType.ReadyToBuy) {
      await AsyncStorage.setItem(
        'order-items',
        JSON.stringify({
          type: OrderItemType.ReadyToBuy,
          items: selectedItems.reduce(
            (acc, item) => {
              acc[item.itemId] = {
                maternityDressDetailId: item.itemId,
                quantity: item.quantity,
                options: []
              }
              return acc
            },
            {} as Record<string, DressInStorage>
          )
        })
      )
    }

    setSelectedItems([])
    router.push('/order/review')
  }

  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  if (isLoading) return <Loading />

  if (!isAuthenticated) return <Redirect href='/auth?focus=sign-in' />

  return (
    <SafeView>
      <View className='flex flex-row items-center justify-between p-4'>
        <View className='flex flex-row items-center gap-3'>
          <TouchableOpacity onPress={handleGoBack}>
            <Feather name='arrow-left' size={24} color={PRIMARY_COLOR.LIGHT} />
          </TouchableOpacity>
          <Text className='font-inter-medium text-xl'>Giỏ hàng</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/chat')}>
          <Feather name='message-circle' size={24} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
      <View className='bg-muted h-2' />

      <View className='flex-1'>
        <FlatList
          data={cart}
          renderItem={({ item }) => (
            <CartItem item={item} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
          )}
          keyExtractor={(item) => item.itemId}
          contentContainerClassName='gap-4 p-4'
          refreshControl={refreshControl}
          ListEmptyComponent={
            isLoadingCart ? (
              <ActivityIndicator size='small' color={PRIMARY_COLOR.LIGHT} />
            ) : (
              <View className='flex-1 items-center mt-48'>
                {SvgIcon.cart({ size: ICON_SIZE.EXTRA_LARGE, color: 'GRAY' })}
                <Text className='text-muted-foreground text-sm mt-2'>Giỏ hàng trống</Text>
              </View>
            )
          }
        />
      </View>
      <View
        className='absolute bottom-0 left-0 right-0 bg-background border-t border-border'
        style={{
          paddingBottom: bottom
        }}
      >
        <View className='flex flex-row items-center gap-4 p-4'>
          <Feather name='dollar-sign' size={20} color={PRIMARY_COLOR.LIGHT} />
          <Text className='text-sm font-inter-medium'>Tổng</Text>
          <Text className='font-inter-semibold text-lg text-primary ml-auto'>
            <Text className='underline font-inter-semibold text-primary'>đ</Text>
            {totalPrice > 0 ? totalPrice.toLocaleString('vi-VN') : 0}
          </Text>
        </View>
        <Separator />
        <View className='flex flex-row justify-between items-center p-4'>
          <View className='flex flex-row items-center gap-4'>
            <Checkbox
              checked={checkAll}
              onCheckedChange={toggleCheckAll}
              disabled={!cart?.length || orderItemTypeSet.length > 1}
            />
            <Text className='text-sm font-inter-medium'>Chọn tất cả</Text>
          </View>
          <Button onPress={handleCheckOut} disabled={selectedItems.length === 0}>
            <Text className='text-white text-center font-inter-medium'>
              Thanh toán {selectedItems.length ? `(${selectedItems.length})` : ''}
            </Text>
          </Button>
        </View>
      </View>
    </SafeView>
  )
}
