import { FontAwesome } from '@expo/vector-icons'
import { View } from 'react-native'
import { Text } from './ui/text'

interface RatingsProps {
  rating: number
  ratingCount?: number
  displayCount?: boolean
}

export default function Ratings({ rating, ratingCount, displayCount = true }: RatingsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const totalStars = 5

  return (
    <View className='flex-row items-center gap-2'>
      <View className='flex-row items-center gap-0.5 flex-1'>
        {Array.from({ length: totalStars }).map((_, index) => {
          if (index < fullStars) {
            return <FontAwesome key={index} name='star' size={12} color='#f59e0b' />
          } else if (index === fullStars && hasHalfStar) {
            return <FontAwesome key={index} name='star-half-full' size={12} color='#f59e0b' />
          } else {
            return <FontAwesome key={index} name='star-o' size={12} color='#f59e0b' />
          }
        })}
      </View>
      {displayCount ? (
        <View className='flex-row items-baseline gap-0.5'>
          <Text className='text-[9px] font-inter-medium'>{rating}</Text>
          <Text className='text-[8px] text-muted-foreground'>({ratingCount})</Text>
        </View>
      ) : null}
    </View>
  )
}
