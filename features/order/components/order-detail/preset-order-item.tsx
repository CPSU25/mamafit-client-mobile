import { useMemo } from 'react'
import { Image, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { getOrderedComponentOptions } from '~/lib/utils'
import { Preset, PresetWithComponentOptions } from '~/types/preset.type'

interface PresetOrderItemProps {
  preset: Preset | null | undefined
  presetDetail: PresetWithComponentOptions | null | undefined
  quantity: number | undefined
}

export default function PresetOrderItem({ preset, presetDetail, quantity }: PresetOrderItemProps) {
  const orderedComponents = useMemo(
    () => getOrderedComponentOptions(presetDetail?.componentOptions || []),
    [presetDetail?.componentOptions]
  )

  return (
    <View className='gap-2 p-3'>
      <View className='flex-row items-start gap-2'>
        <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
          <Image source={{ uri: preset?.images?.[0] }} className='w-full h-full' resizeMode='contain' />
        </View>
        <View className='flex-1 h-20 justify-between'>
          <View>
            <Text className='text-sm font-inter-medium'>{preset?.styleName || 'Custom'} Dress</Text>
            <View className='flex-row items-center justify-between'>
              <Text className='text-xs text-muted-foreground'>
                {preset?.styleName ? 'Made-to-Order Custom Style' : 'Tailored Just for You'}
              </Text>
              <Text className='text-xs text-muted-foreground'>x{quantity || 1}</Text>
            </View>
          </View>
          <View className='items-end'>
            <Text className='text-xs'>
              <Text className='text-xs underline'>đ</Text>
              {preset?.price?.toLocaleString('vi-VN') || '0'}
            </Text>
          </View>
        </View>
      </View>
      {orderedComponents.length > 0 ? (
        <View className='bg-muted/50 rounded-xl p-3 gap-2'>
          {orderedComponents.map((option) => (
            <View className='flex-row items-center justify-between' key={option?.componentName}>
              <Text className='text-xs text-muted-foreground'>{option?.componentName}</Text>
              <Text className='text-xs font-inter-medium text-foreground'>{option?.name}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  )
}
