import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import AutoHeightImage from '~/components/auto-height-image'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR } from '~/lib/constants/constants'
import { getOrderedComponentOptions } from '~/lib/utils'
import { PresetWithComponentOptions } from '~/types/preset.type'

interface PresetOrderItemProps {
  preset: PresetWithComponentOptions
  iconSize: number
}

export default function PresetOrderItem({ preset, iconSize }: PresetOrderItemProps) {
  const router = useRouter()
  const presetImage = preset.images && Array.isArray(preset.images) && preset.images.length > 0 ? preset.images[0] : ''
  const componentOptions =
    preset.componentOptions && Array.isArray(preset.componentOptions) ? preset.componentOptions : []

  return (
    <View className='p-3 gap-4'>
      <View className='flex flex-row gap-4 items-center'>
        {presetImage && <AutoHeightImage uri={presetImage} width={120} />}

        <View className='flex-1'>
          <Text className='font-inter-semibold'>{preset.styleName || 'Unknown'} Dress</Text>
          <Text className='text-xs text-muted-foreground'>Custom Made-to-Order</Text>

          <View className='bg-muted/70 rounded-xl p-3 gap-2 mt-2'>
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
      <TouchableOpacity
        className='bg-primary/10 rounded-xl p-3'
        onPress={() => router.push('/order/review/choose-add-on')}
      >
        <View className='flex-row items-center'>
          <View className='flex-row items-center gap-2 flex-1'>
            <MaterialCommunityIcons name='plus-box-multiple' size={iconSize} color={PRIMARY_COLOR.LIGHT} />
            <Text className='font-inter-medium text-sm text-primary'>MamaFit Add Ons</Text>
          </View>
          <Feather name='chevron-right' size={14} color={PRIMARY_COLOR.LIGHT} />
        </View>
      </TouchableOpacity>
    </View>
  )
}
