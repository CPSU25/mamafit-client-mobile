import { Image, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/hooks/use-color-scheme'

export default function OrderItem() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <View className='flex flex-row items-center gap-3 h-20'>
      <Image source={require('~/assets/images/mesh.jpg')} className='aspect-square w-20 rounded-2xl' />
      <View className='flex-1'>
        <View className='flex-1'>
          <Text className={`text-sm ${isDarkColorScheme ? 'text-white/70' : 'text-black/70'}`} numberOfLines={1}>
            Váy bầu hiện đại, thanh lịch nhất năm 2025 dành cho các mẹ thích sự đơn giản
          </Text>
          <Text className='text-xs text-muted-foreground'>Navy</Text>
        </View>
        <View className='flex flex-row justify-between items-baseline'>
          <Text className='text-primary font-inter-medium'>
            <Text className='underline text-primary font-inter-medium text-sm'>đ</Text>19.499.999
          </Text>
          <Text className='text-muted-foreground text-xs'>x1</Text>
        </View>
      </View>
    </View>
  )
}
