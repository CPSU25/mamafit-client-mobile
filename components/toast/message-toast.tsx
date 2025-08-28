import { format } from 'date-fns'
import { router } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import { placeholderImage, styles } from '~/lib/constants/constants'
import { isValidUrl } from '~/lib/utils'
import { Message, MessageTypeDB } from '~/types/chat.type'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Text } from '../ui/text'

export default function MessageToast({ message }: { message: Message<MessageTypeDB> }) {
  const { senderName, senderAvatar, messageTimestamp, chatRoomId } = message
  const imageSource = senderAvatar && isValidUrl(senderAvatar) ? senderAvatar : placeholderImage

  return (
    <TouchableOpacity onPress={() => router.push(`/chat/${chatRoomId}`)}>
      <Card className='mx-2' style={[styles.container]}>
        <View className='flex-row items-center gap-2 px-3 py-1'>
          <View className='size-2 rounded-full bg-emerald-500' />
          <Text className='text-xs font-inter-medium'>Tin nhắn mới</Text>
        </View>
        <Separator />
        <View className='flex-row items-center gap-3 p-3'>
          <Avatar alt={senderName} className='size-10 border-2 border-emerald-500'>
            <AvatarImage source={{ uri: imageSource }} />
            <AvatarFallback>
              <Text>{senderName?.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className='flex-1'>
            <View className='flex-row items-center gap-2'>
              <Text className='text-sm font-inter-medium'>{senderName}</Text>
              <Text className='text-xs text-muted-foreground ml-auto'>{format(messageTimestamp, 'hh:mm a')}</Text>
            </View>
            <Text className='text-xs text-muted-foreground mr-1' numberOfLines={1}>
              {message.message}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  )
}
