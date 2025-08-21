import { Feather } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import { forwardRef, useMemo, useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { useAddToCart } from '~/features/cart/hooks/use-add-to-cart'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { DressVariant } from '~/types/dress.type'
import { OrderItemType } from '~/types/order.type'

interface DressVariantSelectionModalProps {
  dressImage: string
  hasMultiplePrices: boolean
  minPrice: number
  maxPrice: number
  variants: DressVariant[]
  handleDismissVariantModal: () => void
}

const DressVariantSelectionModal = forwardRef<BottomSheetModal, DressVariantSelectionModalProps>(
  ({ dressImage, hasMultiplePrices, minPrice, maxPrice, variants, handleDismissVariantModal }, ref) => {
    const { addToCartMutation } = useAddToCart()
    const snapPoints = useMemo(() => ['60%'], [])

    const [selectedVariant, setSelectedVariant] = useState<DressVariant | null>(null)
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

    const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color))), [variants])

    const sizes = useMemo(() => {
      const rawSizes = Array.from(new Set(variants.map((v) => v.size)))
      const ORDER = ['xs', 's', 'm', 'l', 'xl', '2xl']
      const normalize = (s: string) => s.toLowerCase()
      const orderIndex = (s: string) => {
        const idx = ORDER.indexOf(normalize(s))
        return idx === -1 ? Number.MAX_SAFE_INTEGER : idx
      }
      return rawSizes.sort((a, b) => orderIndex(a) - orderIndex(b))
    }, [variants])

    const colorPreviewByColor = useMemo(() => {
      const preview: Record<string, string | undefined> = {}
      for (const variant of variants) {
        if (!preview[variant.color]) {
          preview[variant.color] =
            Array.isArray(variant.image) && variant.image.length > 0 ? variant.image[0] : undefined
        }
      }
      return preview
    }, [variants])

    const isSizeDisabled = (size: string) => {
      if (!selectedColor) return false
      return !variants.some((v) => v.color === selectedColor && v.size === size)
    }

    const isColorDisabled = (color: string) => {
      if (!selectedSize) return false
      return !variants.some((v) => v.size === selectedSize && v.color === color)
    }

    const tryPrintSelectedVariantId = (color?: string | null, size?: string | null) => {
      const c = color ?? selectedColor
      const s = size ?? selectedSize
      if (!c || !s) {
        setSelectedVariant(null)
        setSelectedQuantity(1)
        return
      }
      const found = variants.find((v) => v.color === c && v.size === s)
      if (found) {
        setSelectedVariant(found)
        setSelectedQuantity((prev) => Math.min(Math.max(1, prev), found.quantity))
      } else {
        setSelectedVariant(null)
        setSelectedQuantity(1)
      }
    }

    const handleSelectColor = (color: string) => {
      const nextColor = selectedColor === color ? null : color
      let nextSize = selectedSize
      if (nextSize && nextColor && !variants.some((v) => v.color === nextColor && v.size === nextSize)) {
        setSelectedSize(null)
        nextSize = null
      }
      setSelectedColor(nextColor)
      tryPrintSelectedVariantId(nextColor, nextSize)
    }

    const handleSelectSize = (size: string) => {
      const nextSize = selectedSize === size ? null : size
      let nextColor = selectedColor
      if (nextColor && nextSize && !variants.some((v) => v.size === nextSize && v.color === nextColor)) {
        setSelectedColor(null)
        nextColor = null
      }
      setSelectedSize(nextSize)
      tryPrintSelectedVariantId(nextColor, nextSize)
    }

    const handleAddToCart = (id: string, quantity: number) => {
      if (!id) return

      addToCartMutation.mutate({
        itemId: id,
        quantity,
        type: OrderItemType.ReadyToBuy
      })

      setTimeout(() => {
        setSelectedVariant(null)
        setSelectedQuantity(1)
        setSelectedColor(null)
        setSelectedSize(null)
        handleDismissVariantModal()
      }, 500)
    }

    const handleIncreaseQuantity = () => {
      if (!selectedVariant) return
      setSelectedQuantity((prev) => Math.min(prev + 1, selectedVariant.quantity))
    }

    const handleDecreaseQuantity = () => {
      setSelectedQuantity((prev) => Math.max(1, prev - 1))
    }

    return (
      <BottomSheetModal
        style={{
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          borderRadius: 16
        }}
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={({ style }) => (
          <BlurView
            experimentalBlurMethod='dimezisBlurView'
            tint='light'
            intensity={5}
            style={[style, { overflow: 'hidden' }]}
          />
        )}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false} className='flex-1'>
          <View className='flex-1 gap-2'>
            <View className='flex-row items-end gap-3 px-4'>
              <View className='w-24 h-24 rounded-xl overflow-hidden bg-muted/50'>
                <Image
                  source={{ uri: dressImage }}
                  style={{ width: '100%', height: '180%', position: 'absolute', top: 0, left: 0 }}
                  resizeMode='cover'
                />
              </View>
              <View className='gap-3'>
                {selectedVariant ? (
                  <Text className='text-primary font-inter-medium'>
                    <Text className='text-primary underline font-inter-medium text-sm'>đ</Text>
                    {selectedVariant?.price?.toLocaleString('vi-VN')}
                  </Text>
                ) : hasMultiplePrices && minPrice !== maxPrice ? (
                  <View className='flex-row items-center gap-1'>
                    <Text className='text-primary font-inter-medium'>
                      <Text className='text-primary underline font-inter-medium text-sm'>đ</Text>
                      {minPrice ? minPrice.toLocaleString('vi-VN') : '0'} -
                    </Text>
                    <Text className='text-primary font-inter-medium'>
                      <Text className='text-primary underline font-inter-medium text-sm'>đ</Text>
                      {maxPrice ? maxPrice.toLocaleString('vi-VN') : '0'}
                    </Text>
                  </View>
                ) : (
                  <Text className='text-primary font-inter-medium'>
                    <Text className='text-primary underline font-inter-medium text-sm'>đ</Text>
                    {minPrice?.toLocaleString('vi-VN')}
                  </Text>
                )}

                {selectedVariant ? (
                  <Text className='text-muted-foreground text-sm'>Kho: {selectedVariant?.quantity}</Text>
                ) : null}
              </View>
            </View>

            <Separator className='mt-1 mb-2' />

            <View className='gap-2 px-4'>
              <Text className='text-sm font-inter-medium'>Màu sắc</Text>
              <View className='flex-row flex-wrap gap-3 items-center'>
                {colors.map((color) => {
                  const selected = selectedColor === color
                  const disabled = isColorDisabled(color)

                  return (
                    <TouchableOpacity
                      key={color}
                      className={cn(
                        'border border-border p-1 rounded-xl',
                        selected ? 'border-primary' : '',
                        disabled ? 'opacity-40 border-dashed' : 'opacity-100'
                      )}
                      disabled={disabled}
                      onPress={() => handleSelectColor(color)}
                    >
                      <View className='flex-row items-center gap-2 pr-2'>
                        {colorPreviewByColor[color] ? (
                          <View className='w-10 h-10 rounded-lg overflow-hidden'>
                            <Image
                              source={{ uri: colorPreviewByColor[color] as string }}
                              style={{ width: '100%', height: '180%', position: 'absolute', top: 0, left: 0 }}
                              resizeMode='cover'
                            />
                          </View>
                        ) : null}
                        <Text className={cn('text-xs', selected ? 'text-primary font-inter-medium' : '')}>{color}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <Separator className='mt-1 mb-2' />

            <View className='gap-2 px-4'>
              <Text className='font-inter-medium text-sm'>Kích thước</Text>
              <View className='flex-row flex-wrap gap-2 items-center'>
                {sizes.map((size) => {
                  const selected = selectedSize === size
                  const disabled = isSizeDisabled(size)

                  return (
                    <TouchableOpacity
                      key={size}
                      className={cn(
                        'py-2 w-[23%] border border-border rounded-xl',
                        selected ? 'border-primary' : '',
                        disabled ? 'opacity-40 border-dashed' : 'opacity-100'
                      )}
                      disabled={disabled}
                      onPress={() => handleSelectSize(size)}
                    >
                      <Text className={cn('text-sm text-center', selected ? 'text-primary font-inter-medium' : '')}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <Separator className='mt-1 mb-2' />

            <View className='px-4 gap-2 flex-row items-center justify-between'>
              <Text className='text-sm font-inter-medium'>Số lượng</Text>

              <View className={cn('flex-row items-center gap-1', !selectedVariant && 'opacity-40')}>
                <TouchableOpacity
                  className='w-8 h-8 rounded-lg border border-border items-center justify-center'
                  onPress={handleDecreaseQuantity}
                  disabled={selectedQuantity <= 1}
                >
                  <Feather name='minus' size={12} color={PRIMARY_COLOR.LIGHT} />
                </TouchableOpacity>

                <View className='w-12 h-8 border border-border rounded-lg items-center justify-center'>
                  <Text className='text-xs font-inter-medium'>{selectedQuantity}</Text>
                </View>

                <TouchableOpacity
                  className='w-8 h-8 rounded-lg border border-border items-center justify-center'
                  onPress={handleIncreaseQuantity}
                  disabled={!selectedVariant || selectedQuantity >= (selectedVariant?.quantity ?? 1)}
                >
                  <Feather name='plus' size={12} color={PRIMARY_COLOR.LIGHT} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BottomSheetScrollView>

        <View className='p-4'>
          <TouchableOpacity
            onPress={() => handleAddToCart(selectedVariant?.id ?? '', selectedQuantity)}
            disabled={!selectedVariant || selectedQuantity < 1 || addToCartMutation.isPending}
            className='flex-row items-center gap-2 justify-center p-2 rounded-xl border border-primary/20 bg-primary/10'
          >
            <Feather name='shopping-bag' size={16} color={PRIMARY_COLOR.LIGHT} />
            <Text className='text-sm font-inter-medium text-primary'>
              {addToCartMutation.isPending ? 'Đang thêm...' : `Thêm giỏ hàng (${selectedQuantity})`}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    )
  }
)

DressVariantSelectionModal.displayName = 'DressVariantSelectionModal'

export default DressVariantSelectionModal
