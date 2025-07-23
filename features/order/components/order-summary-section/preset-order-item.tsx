import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import AutoHeightImage from '~/components/auto-height-image'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { getOrderedComponentOptions } from '~/lib/utils'
import { PresetItem } from '../../types'
import PreviewAddOnOptionCard from '../add-on-section/preview-add-on-option-card'

interface PresetOrderItemProps {
  preset: PresetItem
  iconSize: number
  onRemoveAddOnOption?: (optionId: string) => void
  addOnsSubtotal: number
}

export default function PresetOrderItem({
  preset,
  iconSize,
  addOnsSubtotal,
  onRemoveAddOnOption
}: PresetOrderItemProps) {
  const router = useRouter()
  const presetImage = preset.images && Array.isArray(preset.images) && preset.images.length > 0 ? preset.images[0] : ''
  const componentOptions =
    preset.componentOptions && Array.isArray(preset.componentOptions) ? preset.componentOptions : []

  const hasOptions = preset.addOnOptions && Array.isArray(preset.addOnOptions) && preset.addOnOptions.length > 0

  return (
    <View className='p-3 gap-4'>
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

      <View className='bg-blue-50 rounded-2xl p-1'>
        <TouchableOpacity onPress={() => router.push(`/order/review/choose-add-on?itemId=${preset.id}&type=preset`)}>
          <View className='flex-row items-center p-2 gap-2'>
            <MaterialCommunityIcons name='plus-box-multiple' size={iconSize} color='#2563eb' />
            <Text className='font-inter-medium text-sm text-blue-600 flex-1'>MamaFit Add-Ons</Text>
            {preset?.addOnOptions?.length > 0 ? (
              <Feather name='chevron-down' size={iconSize} color='#2563eb' />
            ) : (
              <Feather name='chevron-right' size={iconSize} color='#2563eb' />
            )}
          </View>
        </TouchableOpacity>

        {hasOptions && (
          <>
            <Card className='p-1 rounded-xl gap-2'>
              {preset.addOnOptions.map((option) => (
                <View key={option.addOnOptionId}>
                  <PreviewAddOnOptionCard
                    option={option}
                    onRemove={onRemoveAddOnOption ? () => onRemoveAddOnOption(option.addOnOptionId) : undefined}
                    iconSize={iconSize}
                  />
                </View>
              ))}
            </Card>
            <TouchableOpacity
              onPress={() => router.push(`/order/review/choose-add-on?itemId=${preset.id}&type=preset`)}
              className='flex-row items-center gap-2 justify-center py-2'
            >
              <Feather name='plus' size={iconSize} color='#2563eb' />
              <Text className='text-sm text-blue-600 font-inter-medium'>Add More ({preset.addOnOptions.length})</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}
