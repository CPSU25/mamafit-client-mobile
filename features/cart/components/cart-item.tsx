import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { SelectedItem } from '~/app/cart'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { CartItem as CartItemType } from '~/types/common'
import { OrderItemType } from '~/types/order.type'
import { useUpdateCartItem } from '../hooks/use-update-cart-item'
import { UpdateCartItemFormSchema } from '../validations'

interface CartItemProps {
  item: CartItemType
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItem[]>>
  selectedItems: SelectedItem[]
}

export default function CartItem({ item, setSelectedItems, selectedItems }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const { updateCartItemMutation, removeCartItemMutation } = useUpdateCartItem()

  const isSelected = selectedItems.some((selectedItem) => selectedItem.itemId === item.itemId)
  // Ensure same type of items should be selected
  const isDisabled = selectedItems.some((selectedItem) => selectedItem.type !== item.type)

  const handleSelectItem = (selectedItem: SelectedItem) => {
    if (isSelected) {
      setSelectedItems(selectedItems.filter((item) => item.itemId !== selectedItem.itemId))
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          itemId: selectedItem.itemId,
          type: selectedItem.type,
          quantity: selectedItem.quantity,
          price: selectedItem.price
        }
      ])
    }
  }

  // Update selected item quantity when cart item quantity changes
  const updateSelectedItemQuantity = (newQuantity: number) => {
    if (isSelected) {
      setSelectedItems((prevSelected: SelectedItem[]) =>
        prevSelected.map((selectedItem: SelectedItem) =>
          selectedItem.itemId === item.itemId ? { ...selectedItem, quantity: newQuantity } : selectedItem
        )
      )
    }
  }

  useEffect(() => {
    setQuantity(item.quantity)
  }, [item.quantity])

  const updateQuantity = async (input: UpdateCartItemFormSchema) => {
    return await updateCartItemMutation.mutateAsync(input)
  }

  const removeItem = async (itemId: string) => {
    await removeCartItemMutation.mutateAsync(itemId)
    setSelectedItems((prevSelected: SelectedItem[]) =>
      prevSelected.filter((selectedItem: SelectedItem) => selectedItem.itemId !== itemId)
    )
  }

  const handleDecrement = async () => {
    const newQuantity = Math.max(1, quantity - 1)

    if (newQuantity !== quantity) {
      setQuantity(newQuantity)
      await updateQuantity({
        itemId: item.itemId,
        quantity: newQuantity,
        type: item.type as OrderItemType.Preset | OrderItemType.ReadyToBuy
      })
      updateSelectedItemQuantity(newQuantity)
    }
  }

  const handleIncrement = async () => {
    const newQuantity = Math.min(99, quantity + 1)

    if (newQuantity !== quantity) {
      setQuantity(newQuantity)
      await updateQuantity({
        itemId: item.itemId,
        quantity: newQuantity,
        type: item.type as OrderItemType.Preset | OrderItemType.ReadyToBuy
      })
      updateSelectedItemQuantity(newQuantity)
    }
  }

  if (item.type === OrderItemType.Preset) {
    return (
      <View className='flex-row items-center justify-between gap-3'>
        <View className='gap-4 items-center'>
          <TouchableOpacity
            className={isDisabled ? 'opacity-10' : 'opacity-100'}
            onPress={() =>
              handleSelectItem({
                itemId: item.itemId,
                price: item.preset?.price || 0,
                quantity: item.quantity,
                type: item.type
              })
            }
            disabled={isDisabled}
          >
            <View className={cn('w-5 h-5 rounded-md border border-muted-foreground', isSelected && 'bg-primary')}>
              {isSelected && <Feather name='check' size={16} color='white' />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(item.itemId)} disabled={removeCartItemMutation.isPending}>
            <Feather name='trash-2' size={16} color='#f43f5e' />
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: item.preset?.images[0] }}
          className='w-20 h-20 rounded-xl bg-muted/50'
          resizeMode='contain'
        />

        <View className='flex-1'>
          <View className='flex-1'>
            <Text className='font-inter-medium pr-4' numberOfLines={1}>
              {item.preset?.name || 'Váy bầu tùy chỉnh'}
            </Text>
            <Text className='text-xs text-muted-foreground'>{item.preset?.styleName || 'Không có kiểu'}</Text>
          </View>

          <View className='flex-row items-center justify-between'>
            <Text className='text-sm font-inter-semibold text-primary'>
              <Text className='text-xs font-inter-semibold text-primary'>đ</Text>
              {item.preset?.price ? item.preset.price.toLocaleString('vi-VN') : ''}
            </Text>

            <View className='flex-col items-center gap-2'>
              <View className='flex-row items-center gap-2 border border-border rounded-md'>
                <TouchableOpacity
                  className='px-2 py-1.5'
                  onPress={handleDecrement}
                  disabled={updateCartItemMutation.isPending || quantity <= 1}
                >
                  <Feather
                    name='minus'
                    size={12}
                    color={quantity <= 1 || updateCartItemMutation.isPending ? 'lightgray' : PRIMARY_COLOR.LIGHT}
                  />
                </TouchableOpacity>

                <Text className='text-xs w-4 text-center'>{quantity.toString()}</Text>

                <TouchableOpacity
                  className='px-2 py-1.5'
                  onPress={handleIncrement}
                  disabled={updateCartItemMutation.isPending || quantity >= 99}
                >
                  <Feather
                    name='plus'
                    size={12}
                    color={quantity >= 99 || updateCartItemMutation.isPending ? 'lightgray' : PRIMARY_COLOR.LIGHT}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  if (item.type === OrderItemType.ReadyToBuy) {
    return (
      <View className='flex-row items-center justify-between gap-3'>
        <View className='gap-4 items-center'>
          <TouchableOpacity
            className={isDisabled ? 'opacity-10' : 'opacity-100'}
            onPress={() =>
              handleSelectItem({
                itemId: item.itemId,
                price: item.maternityDressDetail?.price || 0,
                quantity: item.quantity,
                type: item.type
              })
            }
            disabled={isDisabled}
          >
            <View className={cn('w-5 h-5 rounded-md border border-muted-foreground', isSelected && 'bg-primary')}>
              {isSelected && <Feather name='check' size={16} color='white' />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(item.itemId)} disabled={removeCartItemMutation.isPending}>
            <Feather name='trash-2' size={16} color='#f43f5e' />
          </TouchableOpacity>
        </View>

        <View className='w-20 h-20 overflow-hidden relative rounded-xl'>
          <Image
            source={{ uri: item.maternityDressDetail?.image[0] }}
            style={{
              width: '100%',
              height: '180%',
              borderRadius: 12,
              position: 'absolute',
              top: 0,
              left: 0
            }}
            resizeMode='cover'
          />
        </View>

        <View className='flex-1'>
          <View className='flex-1'>
            <Text className='font-inter-medium pr-4' numberOfLines={1}>
              {item.maternityDressDetail?.name || 'Váy có sẵn'}
            </Text>
            <Text className='text-xs text-muted-foreground'>
              Phân loại: {item.maternityDressDetail?.color} - {item.maternityDressDetail?.size}
            </Text>
          </View>

          <View className='flex-row items-center justify-between'>
            <Text className='text-sm font-inter-semibold text-primary'>
              <Text className='text-xs font-inter-semibold text-primary'>đ</Text>
              {item.maternityDressDetail?.price ? item.maternityDressDetail.price.toLocaleString('vi-VN') : ''}
            </Text>

            <View className='flex-col items-center gap-2'>
              <View className='flex-row items-center gap-2 border border-border rounded-md'>
                <TouchableOpacity
                  className='px-2 py-1.5'
                  onPress={handleDecrement}
                  disabled={updateCartItemMutation.isPending || quantity <= 1}
                >
                  <Feather
                    name='minus'
                    size={12}
                    color={quantity <= 1 || updateCartItemMutation.isPending ? 'lightgray' : PRIMARY_COLOR.LIGHT}
                  />
                </TouchableOpacity>

                <Text className='text-xs w-4 text-center'>{quantity.toString()}</Text>

                <TouchableOpacity
                  className='px-2 py-1.5'
                  onPress={handleIncrement}
                  disabled={updateCartItemMutation.isPending || quantity >= 99}
                >
                  <Feather
                    name='plus'
                    size={12}
                    color={quantity >= 99 || updateCartItemMutation.isPending ? 'lightgray' : PRIMARY_COLOR.LIGHT}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return null
}
