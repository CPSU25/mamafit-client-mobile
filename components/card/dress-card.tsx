import { Image } from 'expo-image'
import { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { styles } from '~/lib/constants/constants'
import { ImageUtils } from '~/lib/image-utils'
import { cn } from '~/lib/utils'
import Ratings from '../ratings'
import { Card } from '../ui/card'
import { Text } from '../ui/text'

interface DressCardProps {
  className?: string
}

export default function DressCard({ className }: DressCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const originalImageUrl =
    'https://www.katebackdrop.com/cdn/shop/files/katarina-13_cc5731a9-d787-4f4e-a1df-43d9bc234493.webp?v=1742527601'

  const imageSizes = ImageUtils.getResponsiveImageSizes(originalImageUrl)

  return (
    <Card className={cn('gap-2 p-1', className)} style={styles.container}>
      <View className='w-full overflow-hidden relative h-44'>
        {imageLoading && (
          <View className='absolute inset-0 bg-gray-100 flex items-center justify-center rounded-t-xl rounded-b-lg'>
            <ActivityIndicator size='small' color='#666' />
          </View>
        )}

        {imageError && (
          <View className='absolute inset-0 bg-gray-200 flex items-center justify-center rounded-t-xl rounded-b-lg'>
            <Text className='text-gray-500 text-xs'>Image unavailable</Text>
          </View>
        )}

        <Image
          source={{ uri: imageSizes.small }}
          style={{
            width: '100%',
            height: '100%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
          }}
          contentFit='cover'
          transition={300}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false)
            setImageError(true)
          }}
          placeholder={{
            blurhash: ImageUtils.getPlaceholderBlurhash('product')
          }}
          cachePolicy='memory-disk'
          priority='normal'
        />
      </View>
      <View className='px-2 pb-2 gap-1'>
        <Ratings rating={4.5} ratingCount={295} />

        <Text className='font-inter-medium text-xs' numberOfLines={2}>
          Late Night Blush Pink Maternity Ruched One Shoulder Midi Dress
        </Text>

        <View className='flex flex-row items-center gap-2 mt-1'>
          <Text className='text-primary font-inter-semibold text-sm flex-1'>
            <Text className='text-primary underline text-xs font-inter-semibold'>đ</Text>139.400
          </Text>
          <Text className='text-muted-foreground text-[9px]'>30 đã bán</Text>
        </View>
      </View>
    </Card>
  )
}
