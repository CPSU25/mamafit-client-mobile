import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { getOrderedComponentOptions } from '~/lib/utils'
import { OrderItemType } from '~/types/order.type'
import { PresetWithComponentOptions } from '~/types/preset.type'
import { AddOnOptionItem } from '../../types'
import PreviewAddOnOptionCard from '../add-on-section/preview-add-on-option-card'

interface PresetOrderItemProps {
  preset: PresetWithComponentOptions
  presetOptions: AddOnOptionItem[]
  iconSize: number
  quantity: number
  onRemoveAddOnOption: (presetId: string, optionId: string) => void
}

export default function PresetOrderItem({
  preset,
  iconSize,
  presetOptions,
  onRemoveAddOnOption,
  quantity
}: PresetOrderItemProps) {
  const router = useRouter()
  const presetImage = preset.images && Array.isArray(preset.images) && preset.images.length > 0 ? preset.images[0] : ''
  const componentOptions =
    preset.componentOptions && Array.isArray(preset.componentOptions) ? preset.componentOptions : []

  const hasOptions = presetOptions && Array.isArray(presetOptions) && presetOptions.length > 0

  return (
    <View className='p-3'>
      <View className='flex-row items-center gap-4'>
        <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
          <Image source={{ uri: presetImage }} className='w-full h-full' resizeMode='contain' />
        </View>

        <View className='flex-1 h-20 justify-between'>
          <View>
            <Text className='native:text-sm font-inter-medium'>{preset?.styleName || 'Custom'} Dress</Text>
            <View className='flex-row items-center justify-between'>
              <Text className='native:text-xs text-muted-foreground'>
                {preset?.styleName ? 'Made-to-Order Custom Style' : 'Tailored Just for You'}
              </Text>
              <Text className='native:text-xs text-muted-foreground'>x{quantity || 1}</Text>
            </View>
          </View>
          <View className='items-end'>
            <Text className='native:text-xs'>
              <Text className='native:text-xs underline'>đ</Text>
              {preset?.price?.toLocaleString('vi-VN') || '0'}
            </Text>
          </View>
        </View>
      </View>

      <View className='gap-2'>
        {componentOptions && componentOptions.length > 0 ? (
          <View className='bg-muted/50 rounded-xl p-3 gap-2 mt-2'>
            {getOrderedComponentOptions(componentOptions).map((option) =>
              option ? (
                <View className='flex-row items-center justify-between' key={option.componentName}>
                  <Text className='native:text-xs text-muted-foreground'>{option.componentName}</Text>
                  <Text className='native:text-xs font-inter-medium text-foreground'>{option.name}</Text>
                </View>
              ) : null
            )}
          </View>
        ) : null}

        <View className='bg-blue-50 rounded-2xl p-1'>
          <TouchableOpacity
            onPress={() => router.push(`/order/review/choose-add-on?itemId=${preset.id}&type=${OrderItemType.Preset}`)}
          >
            <View className='flex-row items-center p-2 gap-2'>
              <MaterialCommunityIcons name='plus-box-multiple' size={iconSize} color='#2563eb' />
              <Text className='font-inter-medium native:text-sm text-blue-600 flex-1'>MamaFit Add-Ons</Text>
              {hasOptions ? (
                <Feather name='chevron-down' size={iconSize} color='#2563eb' />
              ) : (
                <Feather name='chevron-right' size={iconSize} color='#2563eb' />
              )}
            </View>
          </TouchableOpacity>

          {hasOptions ? (
            <>
              <Card className='p-1 rounded-xl gap-2'>
                {presetOptions.map((option) => (
                  <View key={option.addOnOptionId}>
                    <PreviewAddOnOptionCard
                      option={option}
                      onRemove={() => onRemoveAddOnOption(preset.id, option.addOnOptionId)}
                      iconSize={iconSize}
                      quantity={quantity}
                    />
                  </View>
                ))}
              </Card>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/order/review/choose-add-on?itemId=${preset.id}&type=${OrderItemType.Preset}`)
                }
                className='flex-row items-center gap-2 justify-center py-2'
              >
                <Feather name='plus' size={iconSize} color='#2563eb' />
                <Text className='native:text-sm text-blue-600 font-inter-medium'>
                  Add More ({presetOptions.length})
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </View>
  )
}
