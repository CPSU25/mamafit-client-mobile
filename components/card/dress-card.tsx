import { AntDesign } from '@expo/vector-icons'
import { Image, View } from 'react-native'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

interface DressCardProps {
  className?: string
  isLeftColumn?: boolean
  scrollY?: number
}

export default function DressCard({ className, isLeftColumn, scrollY = 0 }: DressCardProps) {
  const getCardHeight = () => {
    const baseHeight = 176

    if (isLeftColumn) {
      return baseHeight
    } else {
      // Right column gets taller as user scrolls down with very subtle interpolation
      const startScrollThreshold = 50 // Start effect earlier for smoother transition
      const maxScrollForEffect = 800 // Much longer distance for ultra-gradual effect
      const maxHeightIncrease = 2 // Smaller height increase for subtlety
      const maxHeight = baseHeight + 20

      if (scrollY < startScrollThreshold) {
        return baseHeight // No change until threshold is reached
      }

      const adjustedScrollY = scrollY - startScrollThreshold
      const scrollProgress = Math.min(adjustedScrollY / maxScrollForEffect, 1) // 0 to 1, capped at 1

      // Ultra-smooth interpolation with gentle sine easing for imperceptible changes
      const easedProgress = Math.sin(scrollProgress * Math.PI * 0.5) // Sine easing (smooth start, gradual end)
      const currentHeight = baseHeight + maxHeightIncrease * easedProgress // Interpolate correctly

      return Math.min(currentHeight, maxHeight) // Ensure we never exceed maxHeight
    }
  }

  const dynamicHeight = getCardHeight()

  return (
    <Card className={cn('flex flex-col gap-2 p-1', className)} style={styles.container}>
      <View className='w-full overflow-hidden relative' style={{ height: dynamicHeight }}>
        <Image
          source={{
            uri: 'https://www.katebackdrop.com/cdn/shop/files/katarina-13_cc5731a9-d787-4f4e-a1df-43d9bc234493.webp?v=1742527601'
          }}
          resizeMode='cover'
          className='w-full h-full rounded-t-xl rounded-b-lg'
        />
      </View>
      <View className='px-2 pb-2 gap-1'>
        <View className='border border-amber-200 bg-amber-50 rounded-lg mr-auto px-2 py-0.5 flex flex-row items-center gap-1'>
          <AntDesign name='star' size={12} color='#f59e0b' />
          <Text className='font-inter-medium text-xs'>5.0</Text>
          <Separator orientation='vertical' className='h-3.5 bg-amber-200 mx-0.5' />
          <Text className='font-inter-medium text-xs'>4.2k</Text>
        </View>

        <Text className='font-inter-medium text-xs' numberOfLines={2}>
          Late Night Blush Pink Maternity Ruched One Shoulder Midi Dress
        </Text>

        <View className='flex flex-row justify-between items-center'>
          <Text className='text-primary font-inter-medium'>
            <Text className='text-primary underline text-sm font-inter-medium'>đ</Text>139.400
          </Text>
          <Text className='text-muted-foreground text-xs'>30 sold</Text>
        </View>
      </View>
    </Card>
  )
}
