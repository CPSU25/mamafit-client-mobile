import { Image, View } from 'react-native'
import { styles } from '~/lib/constants/constants'
import { cn } from '~/lib/utils'
import Ratings from '../ratings'
import { Card } from '../ui/card'
import { Text } from '../ui/text'

interface DressCardProps {
  className?: string
}

export default function DressCard({ className }: DressCardProps) {
  const originalImageUrl =
    'https://www.katebackdrop.com/cdn/shop/files/katarina-13_cc5731a9-d787-4f4e-a1df-43d9bc234493.webp?v=1742527601'

  return (
    <Card className={cn('gap-2 p-1', className)} style={styles.container}>
      <View className='w-full overflow-hidden relative h-44'>
        <Image
          source={{ uri: originalImageUrl }}
          style={{
            width: '100%',
            height: '100%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
          }}
        />
      </View>
      <View className='px-2 pb-2 gap-1'>
        <Ratings rating={4.5} ratingCount={295} />

        <Text className='font-inter-medium text-xs' numberOfLines={2}>
          Late Night Blush Pink Maternity Ruched One Shoulder Midi Dress
        </Text>

        <View className='mt-1'>
          <View className='flex flex-row items-center gap-2'>
            <Text className='text-primary font-inter-semibold flex-1'>
              <Text className='text-primary underline text-sm font-inter-semibold'>đ</Text>139.400
            </Text>
          </View>
          <Text className='text-muted-foreground text-[9px] self-end'>30 đã bán</Text>
        </View>
      </View>
    </Card>
  )
}
