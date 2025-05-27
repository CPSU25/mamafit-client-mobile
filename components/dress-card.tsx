import { Image, View } from 'react-native'
import { cn } from '~/lib/utils'
import { Card } from './ui/card'
import { Text } from './ui/text'

interface DressCardProps {
  className?: string
}

export default function DressCard({ className }: DressCardProps) {
  return (
    <Card className={cn('flex flex-col gap-2 min-h-40', className)}>
      <View className='w-full h-48 overflow-hidden relative'>
        <Image
          source={{
            uri: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/928220s.jpg?im=Resize,width=750'
          }}
          resizeMode='cover'
          className='w-full h-full rounded-t-[10px]'
        />
      </View>
      <View className='px-2 pb-2'>
        <Text className='font-inter-medium text-xs' numberOfLines={2}>
          Late Night Blush Pink Maternity Ruched One Shoulder Midi Dress
        </Text>
        <View className='flex flex-row justify-between items-center mt-3'>
          <Text className='text-primary font-inter-medium'>
            <Text className='text-primary underline font-inter-medium'>đ</Text>139.400
          </Text>
          <Text className='text-muted-foreground text-xs'>30 sold</Text>
        </View>
      </View>
    </Card>
  )
}
