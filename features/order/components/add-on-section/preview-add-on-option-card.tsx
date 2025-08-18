import { Feather } from '@expo/vector-icons'
import { Image, TouchableOpacity, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { AddOnOptionItem } from '../../types'

interface PreviewAddOnOptionCardProps {
  option: AddOnOptionItem
  onRemove: () => void
  iconSize: number
  quantity: number
}

export default function PreviewAddOnOptionCard({ option, onRemove, iconSize, quantity }: PreviewAddOnOptionCardProps) {
  const finalPrice = option.price * quantity

  return (
    <View className='flex-row items-center gap-2 px-2 py-0.5 rounded-lg'>
      <TouchableOpacity onPress={onRemove} className='pr-1'>
        <Feather name='x-circle' color='lightgray' size={iconSize} />
      </TouchableOpacity>

      {option.type === 'IMAGE' && <Image source={{ uri: option.value }} className='w-8 h-8 rounded-lg' />}
      {option.type === 'TEXT' && <Image source={require('~/assets/icons/font.png')} className='w-8 h-8' />}
      {option.type === 'PATTERN' && <Image source={require('~/assets/icons/pattern.png')} className='w-8 h-8' />}
      <View className='flex-1'>
        <Text className='native:text-sm font-inter-medium' numberOfLines={1}>
          {option.name}{' '}
          {option.type === 'TEXT' && <Text className='native:text-xs text-muted-foreground'>({option.value})</Text>}
        </Text>
        <Text className='native:text-xs text-muted-foreground'>Vị trí: {option.positionName}</Text>
      </View>

      <Text className='native:text-sm font-inter-medium text-blue-600'>
        +<Text className='underline font-inter-medium native:text-xs text-blue-600'>đ</Text>
        {finalPrice.toLocaleString('vi-VN')}
        {quantity > 1 && ` (x${quantity})`}
      </Text>
    </View>
  )
}
