import { Image, View } from 'react-native'
import Ratings from '~/components/ratings'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Dress } from '~/types/dress.type'

interface DressCardProps {
  className?: string
  dress: Dress
}

export default function DressCard({ dress, className }: DressCardProps) {
  const hasMultiplePrices = dress.price.length > 1

  const minPrice = Math.min(...dress.price)
  const maxPrice = Math.max(...dress.price)

  return (
    <Card className={cn('gap-2 p-1 flex-1', className)} style={styles.container}>
      <View className='w-full overflow-hidden relative h-44 rounded-xl'>
        <Image
          source={{ uri: dress.images[0] }}
          style={{
            width: '100%',
            height: '180%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            position: 'absolute',
            top: 0,
            left: 0
          }}
          resizeMode='cover'
        />
      </View>
      <View className='px-2 pb-2 gap-1'>
        <Ratings rating={dress.averageRating} ratingCount={dress.feedbackCount} />

        <Text className='font-inter-medium text-xs' numberOfLines={2}>
          {dress.name}
        </Text>

        <View>
          {hasMultiplePrices && minPrice !== maxPrice ? (
            <>
              <View className='flex-row items-center gap-1'>
                <Text className='text-primary font-inter-semibold text-sm'>
                  <Text className='text-primary underline text-xs font-inter-semibold'>đ</Text>
                  {minPrice.toLocaleString('vi-VN')} -
                </Text>
                <Text className='text-primary font-inter-semibold text-sm'>
                  <Text className='text-primary underline text-xs font-inter-semibold'>đ</Text>
                  {maxPrice.toLocaleString('vi-VN')}
                </Text>
              </View>
              <Text className='text-muted-foreground text-[9px] self-end mt-2'>{dress.soldCount} đã bán</Text>
            </>
          ) : (
            <>
              <Text className='text-primary font-inter-semibold text-sm'>
                <Text className='text-primary underline text-xs font-inter-semibold'>đ</Text>
                {dress.price[0] ? dress.price[0].toLocaleString('vi-VN') : '0'}
              </Text>
              <Text className='text-muted-foreground text-[9px] self-end mt-2'>{dress.soldCount} đã bán</Text>
            </>
          )}
        </View>
      </View>
    </Card>
  )
}
