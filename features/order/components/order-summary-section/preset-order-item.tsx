import { View } from 'react-native'
import AutoHeightImage from '~/components/auto-height-image'
import { Text } from '~/components/ui/text'
import { ComponentOptionWithComponent, PresetWithComponentOptions } from '~/types/preset.type'

const COMPONENT_OPTION_ORDER = ['Neckline', 'Sleeves', 'Waist', 'Hem', 'Color', 'Fabric'] as const

const getOrderedComponentOptions = (options: ComponentOptionWithComponent[]): ComponentOptionWithComponent[] => {
  return COMPONENT_OPTION_ORDER.map((key) => options.find((option) => option.componentName === key)).filter(
    (option): option is ComponentOptionWithComponent => option !== undefined
  )
}

export default function PresetOrderItem({ preset }: { preset: PresetWithComponentOptions }) {
  const orderedComponentOptions = getOrderedComponentOptions(preset.componentOptions ?? [])

  return (
    <View className='flex flex-row gap-3'>
      <AutoHeightImage uri={preset?.images?.[0] ?? ''} width={120} />
      <View className='flex-1 gap-2'>
        <Text className='font-inter-medium text-sm'>{preset.styleName}</Text>
        <View className='gap-1'>
          {orderedComponentOptions.map((option, index) => (
            <View key={index} className='flex flex-row justify-between'>
              <Text className='text-xs text-muted-foreground'>{option.componentName}:</Text>
              <Text className='text-xs'>{option.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
