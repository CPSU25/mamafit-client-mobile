import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { PresetWithComponentOptions } from '~/types/preset.type'

interface DesignRequestInformationProps {
  designRequestDetail: PresetWithComponentOptions[] | null | undefined
  handleCheckOut: (preset: PresetWithComponentOptions) => void
}

export default function DesignRequestInformation({
  designRequestDetail,
  handleCheckOut
}: DesignRequestInformationProps) {
  return (
    <Card style={styles.container}>
      <View className='px-3 py-2 flex-row items-center gap-2'>
        <MaterialCommunityIcons name='file-multiple' size={16} color={PRIMARY_COLOR.LIGHT} />
        <Text className='font-inter-medium text-sm'>
          Your Designed Presets{' '}
          <Text className='text-xs text-muted-foreground'>({designRequestDetail?.length || 0})</Text>
        </Text>
      </View>

      <Separator />

      <View className='p-3 gap-3'>
        {designRequestDetail && designRequestDetail.length > 0 ? (
          designRequestDetail?.map((preset) => (
            <TouchableOpacity key={preset.id} onPress={() => handleCheckOut(preset)}>
              <View key={preset.id} className='flex-row items-start gap-2'>
                <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/50'>
                  <Image source={{ uri: preset.images?.[0] }} className='w-full h-full' resizeMode='cover' />
                </View>
                <View className='flex-1 h-20 justify-between'>
                  <View>
                    <Text className='text-sm font-inter-medium'>{preset.name ? preset.name : 'Untitled Preset'}</Text>
                    <View className='flex-row'>
                      <Text className='text-xs text-muted-foreground ml-auto'>x1</Text>
                    </View>
                  </View>
                  <View className='items-end'>
                    <Text className='text-xs'>
                      <Text className='text-xs underline'>đ</Text>
                      {preset.price?.toLocaleString('vi-VN') || '0'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className='flex-row items-center justify-center my-4'>
            <Text className='text-muted-foreground text-xs'>No preset designed yet</Text>
          </View>
        )}
      </View>
    </Card>
  )
}
