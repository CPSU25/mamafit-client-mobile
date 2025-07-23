import { Feather } from '@expo/vector-icons'
import { Image, TouchableOpacity, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { AddOnOptionItem } from '../../types'

interface PreviewAddOnOptionCardProps {
  option: AddOnOptionItem
  onRemove?: () => void
  iconSize: number
}

export default function PreviewAddOnOptionCard({ option, onRemove, iconSize }: PreviewAddOnOptionCardProps) {
  return (
    <View className='flex-row items-center gap-2 px-2 py-0.5 rounded-lg'>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} className='pr-1'>
          <Feather name='x-circle' color='lightgray' size={iconSize} />
        </TouchableOpacity>
      )}
      {option.type === 'IMAGE' && <Image source={{ uri: option.value }} className='w-8 h-8 rounded-lg' />}
      {option.type === 'TEXT' && <Image source={require('~/assets/icons/font.png')} className='w-8 h-8' />}
      {option.type === 'PATTERN' && <Image source={require('~/assets/icons/pattern.png')} className='w-8 h-8' />}
      <View className='flex-1'>
        <Text className='text-sm font-inter-medium' numberOfLines={1}>
          {option.name}{' '}
          {option.type === 'TEXT' && <Text className='text-xs text-muted-foreground'>({option.value})</Text>}
        </Text>
        <Text className='text-xs text-muted-foreground'>Position: {option.positionName}</Text>
      </View>

      <Text className='text-sm font-inter-medium text-primary'>
        +<Text className='underline font-inter-medium text-xs text-primary'>đ</Text>
        {option.price.toLocaleString('vi-VN')}
      </Text>
    </View>
  )
}
