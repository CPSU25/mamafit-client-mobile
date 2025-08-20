import { FontAwesome } from '@expo/vector-icons'
import { View } from 'react-native'
import { Text } from './ui/text'

interface RatingsProps {
  rating: number
  ratingCount?: number
  displayCount?: boolean
  size?: number
}

export default function Ratings({ rating, ratingCount, displayCount = true, size = 12 }: RatingsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const totalStars = 5

  return (
    <View className='flex-row items-center gap-1'>
      <View className='flex-row items-center gap-0.5'>
        {Array.from({ length: totalStars }).map((_, index) => {
          if (index < fullStars) {
            return <FontAwesome key={index} name='star' size={size} color='#f59e0b' />
          } else if (index === fullStars && hasHalfStar) {
            return <FontAwesome key={index} name='star-half-full' size={size} color='#f59e0b' />
          } else {
            return <FontAwesome key={index} name='star-o' size={size} color='#f59e0b' />
          }
        })}
      </View>
      {displayCount ? (
        <View className='flex-row items-baseline gap-0.5'>
          {rating > 0 ? <Text className='text-[9px] font-inter-medium'>{rating.toFixed(1)}</Text> : null}
          <Text className='text-[8px] text-muted-foreground'>({ratingCount} đánh giá)</Text>
        </View>
      ) : null}
    </View>
  )
}
