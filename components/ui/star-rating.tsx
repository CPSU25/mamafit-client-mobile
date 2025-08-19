import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { cn } from '~/lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: number
  readonly?: boolean
  className?: string
}

const totalStars = 5

export default function StarRating({
  rating,
  onRatingChange,
  size = 24,
  readonly = false,
  className
}: StarRatingProps) {
  const handleStarPress = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex + 1)
    }
  }

  return (
    <View className={cn('flex-row items-center gap-1.5', className)}>
      {Array.from({ length: totalStars }).map((_, index) => {
        const isActive = index < rating

        if (readonly) {
          return (
            <FontAwesome
              key={index}
              name={isActive ? 'star' : 'star-o'}
              size={size}
              color={isActive ? '#f59e0b' : '#d1d5db'}
            />
          )
        }

        return (
          <TouchableOpacity key={index} onPress={() => handleStarPress(index)} activeOpacity={0.7}>
            <FontAwesome name={isActive ? 'star' : 'star-o'} size={size} color={isActive ? '#f59e0b' : '#d1d5db'} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
