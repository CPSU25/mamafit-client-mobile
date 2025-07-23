import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import AutoHeightImage from '~/components/auto-height-image'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { getOrderedComponentOptions } from '~/lib/utils'
import { PresetItem } from '../../types'
import PreviewAddOnOptionCard from '../add-on-section/preview-add-on-option-card'

interface PresetOrderItemProps {
  preset: PresetItem
  iconSize: number
  onRemoveAddOnOption?: (optionId: string) => void
}

export default function PresetOrderItem({ preset, iconSize, onRemoveAddOnOption }: PresetOrderItemProps) {
  const router = useRouter()
  const presetImage = preset.images && Array.isArray(preset.images) && preset.images.length > 0 ? preset.images[0] : ''
  const componentOptions =
    preset.componentOptions && Array.isArray(preset.componentOptions) ? preset.componentOptions : []

  return (
    <View className='p-3 gap-2'>
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

      <View className='bg-primary/10 rounded-2xl p-1'>
        <TouchableOpacity onPress={() => router.push(`/order/review/choose-add-on?itemId=${preset.id}&type=preset`)}>
          <View className='flex-row items-center p-2 gap-2'>
            <MaterialCommunityIcons name='plus-box-multiple' size={iconSize} color={PRIMARY_COLOR.LIGHT} />
            <Text className='font-inter-medium text-sm text-primary flex-1'>
              {preset?.addOnOptions?.length > 0
                ? `Press To Add More (${preset.addOnOptions?.length})`
                : 'Customize Your Order Even More!'}
            </Text>
            {preset?.addOnOptions?.length > 0 ? (
              <Feather name='chevron-down' size={iconSize} color={PRIMARY_COLOR.LIGHT} />
            ) : (
              <Feather name='chevron-right' size={iconSize} color={PRIMARY_COLOR.LIGHT} />
            )}
          </View>
        </TouchableOpacity>

        {preset && preset.addOnOptions && Array.isArray(preset.addOnOptions) && preset.addOnOptions.length > 0 && (
          <Card className='p-1 rounded-xl gap-2' style={styles.container}>
            {preset.addOnOptions?.map((option) => (
              <View key={option.addOnOptionId}>
                <PreviewAddOnOptionCard
                  option={option}
                  onRemove={onRemoveAddOnOption ? () => onRemoveAddOnOption(option.addOnOptionId) : undefined}
                  iconSize={iconSize}
                />
              </View>
            ))}
          </Card>
        )}
      </View>
    </View>
  )
}
