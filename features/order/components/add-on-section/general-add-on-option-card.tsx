import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { PRIMARY_COLOR, styles } from '~/lib/constants/constants'
import { OptionMap } from '../../types'

interface GeneralAddOnOptionCardProps {
  option: OptionMap
  onPress: () => void
}

export default function GeneralAddOnOptionCard({ option, onPress }: GeneralAddOnOptionCardProps) {
  return (
    <Card key={option.name} style={[styles.container]}>
      <View className='p-4 gap-2'>
        <Text className='font-inter-medium mb-2'>{option.name}</Text>

        <View className='flex-row items-center gap-1.5 flex-wrap'>
          <View className='flex-row items-center gap-1.5'>
            <MaterialCommunityIcons name='map-marker' color='gray' size={14} />
            <Text className='text-xs text-muted-foreground font-inter-medium'>Vị Trí</Text>
          </View>
          {option.positions.map((pos) => (
            <View key={pos.positionId} className='px-2 py-0.5 bg-sky-100/50 rounded-lg flex-row items-center gap-2'>
              <Text className='text-xs font-inter-medium text-sky-600'>{pos.positionName}</Text>
            </View>
          ))}
        </View>

        <View className='flex-row items-center gap-1.5'>
          <View className='flex-row items-center gap-1.5'>
            <MaterialCommunityIcons name='resize' color='gray' size={14} />
            <Text className='text-xs text-muted-foreground font-inter-medium'>Kích Thước</Text>
          </View>
          {option.sizes.map((size) => (
            <View key={size.sizeId} className='px-2 py-0.5 bg-sky-100/50 rounded-lg flex-row items-center gap-2'>
              <Text className='text-xs font-inter-medium text-sky-600'>{size.sizeName}</Text>
            </View>
          ))}
        </View>
      </View>

      <Separator />
      <View className='p-2 flex-row justify-between items-center'>
        <View className='flex-row items-center gap-1.5 px-3 py-1.5 bg-emerald-100/50 rounded-lg mr-auto'>
          <View className='flex-row items-center gap-1'>
            <Text className='text-xs font-inter-medium text-emerald-600'>
              <Text className='underline text-xs font-inter-medium text-emerald-600'>đ</Text>
              {option.minPrice.toLocaleString('vi-VN')}
            </Text>
            <Text className='text-xs font-inter-medium text-emerald-600'>-</Text>
            <Text className='text-xs font-inter-medium text-emerald-600'>
              <Text className='underline text-xs font-inter-medium text-emerald-600'>đ</Text>
              {option.maxPrice.toLocaleString('vi-VN')}
            </Text>
          </View>
        </View>
        <TouchableOpacity className='rounded-xl flex-row items-center gap-1.5 pl-4 pr-2 h-full' onPress={onPress}>
          <Text className='text-primary font-inter-medium text-xs'>Áp Dụng Ngay</Text>
          <AntDesign name='arrowright' size={14} color={PRIMARY_COLOR.LIGHT} />
        </TouchableOpacity>
      </View>
    </Card>
  )
}
