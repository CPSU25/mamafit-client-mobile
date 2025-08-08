import { useMemo } from 'react'
import { Image, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { getOrderedComponentOptions } from '~/lib/utils'
import { AddOnOption } from '~/types/add-on.type'
import { Preset, PresetWithComponentOptions } from '~/types/preset.type'

interface PresetOrderItemProps {
  preset: Preset | null | undefined
  presetDetail: PresetWithComponentOptions | null | undefined
  presetOptions: AddOnOption[]
  quantity: number | undefined
}

export default function PresetOrderItem({ preset, presetDetail, presetOptions, quantity }: PresetOrderItemProps) {
  const orderedComponents = useMemo(
    () => getOrderedComponentOptions(presetDetail?.componentOptions || []),
    [presetDetail?.componentOptions]
  )

  const hasOptions = presetOptions && Array.isArray(presetOptions) && presetOptions.length > 0

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
      {hasOptions ? (
        <>
          <Card className='p-1 rounded-xl gap-2'>
            {presetOptions.map((option) => (
              <View key={option.id} className='flex-row items-center px-2 py-0.5 gap-2'>
                {option.itemServiceType === 'IMAGE' && (
                  <Image source={{ uri: option.value || '' }} className='w-8 h-8 rounded-lg' />
                )}
                {option.itemServiceType === 'TEXT' && (
                  <Image source={require('~/assets/icons/font.png')} className='w-8 h-8' />
                )}
                {option.itemServiceType === 'PATTERN' && (
                  <Image source={require('~/assets/icons/pattern.png')} className='w-8 h-8' />
                )}
                <View className='flex-1'>
                  <Text className='native:text-sm font-inter-medium' numberOfLines={1}>
                    {option.name}{' '}
                    {option.itemServiceType === 'TEXT' && (
                      <Text className='native:text-xs text-muted-foreground'>({option.value})</Text>
                    )}
                  </Text>
                  <Text className='native:text-xs text-muted-foreground'>Position: {option.position.name}</Text>
                </View>

                <Text className='native:text-sm font-inter-medium text-blue-600'>
                  <Text className='underline font-inter-medium native:text-xs text-blue-600'>đ</Text>
                  {(quantity ? option.price * quantity : option.price).toLocaleString('vi-VN')}
                  {quantity && quantity > 1 ? ` (x${quantity})` : ''}
                </Text>
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </View>
  )
}
