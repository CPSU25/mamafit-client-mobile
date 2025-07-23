import { Feather } from '@expo/vector-icons'
import { Image, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { AddOnImageConfig, AddOnMap } from '../../types'

interface AddOnCardProps {
  addOn: AddOnMap
  getAddOnImage: (name: string) => AddOnImageConfig
}

export default function AddOnCard({ addOn, getAddOnImage }: AddOnCardProps) {
  return (
    <View className='p-2 flex-row items-center gap-3'>
      <View
        className='w-16 h-16 flex justify-center items-center rounded-xl'
        style={{ backgroundColor: getAddOnImage(addOn.name).color }}
      >
        <Image source={getAddOnImage(addOn.name).url} className='w-10 h-10' />
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-inter-medium'>{addOn.name}</Text>
        <Text className='text-xs text-muted-foreground' numberOfLines={1}>
          {addOn.description}
        </Text>

        <View className='flex-row items-center gap-1 mt-1'>
          <Text className='text-xs text-foreground/70'>Starting from:</Text>
          <Text className='text-xs font-inter-medium' style={{ color: getAddOnImage(addOn.name).textColor }}>
            ₫{addOn.minPrice.toLocaleString('vi-VN')}
          </Text>
          {addOn.minPrice !== addOn.maxPrice && (
            <>
              <Text className='text-xs text-muted-foreground'>to</Text>
              <Text className='text-xs font-inter-medium' style={{ color: getAddOnImage(addOn.name).textColor }}>
                ₫{addOn.maxPrice.toLocaleString('vi-VN')}
              </Text>
            </>
          )}
        </View>
      </View>
      <Feather name='chevron-right' size={18} color='lightgray' />
    </View>
  )
}
