import { Image, View } from 'react-native'
import { Text } from '~/components/ui/text'
import { DesignRequest } from '~/types/order.type'

interface DesignRequestOrderItemProps {
  designRequest: DesignRequest | null | undefined
  price: number | undefined
  quantity: number | undefined
}

export default function DesignRequestOrderItem({ designRequest, price, quantity }: DesignRequestOrderItemProps) {
  return (
    <View className='flex-row items-start gap-2 p-3'>
      <View className='w-20 h-20 rounded-xl overflow-hidden bg-muted/10'>
        <Image source={{ uri: designRequest?.images?.[0] }} className='w-full h-full' resizeMode='cover' />
      </View>
      <View className='flex-1 h-20 justify-between'>
        <View>
          <Text className='text-sm font-inter-medium'>Yêu Cầu Thiết Kế</Text>
          <View className='flex-row items-center justify-between'>
            <Text className='text-xs text-muted-foreground flex-1' numberOfLines={2}>
              {designRequest?.description}
            </Text>
            <Text className='text-xs text-muted-foreground'>x{quantity || 1}</Text>
          </View>
        </View>
        <View className='items-end'>
          <Text className='text-xs'>
            <Text className='text-xs underline'>đ</Text>
            {price ? price.toLocaleString('vi-VN') : '0'}
          </Text>
        </View>
      </View>
    </View>
  )
}
