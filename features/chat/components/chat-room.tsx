import { format } from 'date-fns'
import { View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'
import { placeholderImage } from '~/lib/constants/constants'
import { isValidUrl } from '~/lib/utils'
import { ChatRoom as ChatRoomType } from '~/types/chat.type'

interface ChatRoomProps {
  room: ChatRoomType
}

export default function ChatRoom({ room }: ChatRoomProps) {
  const { user } = useAuth()
  const sender = room.members.find((member) => member.memberId !== user?.userId) ?? room.members[0]
  const imageSource = sender?.memberAvatar && isValidUrl(sender?.memberAvatar) ? sender?.memberAvatar : placeholderImage

  const isMeLastMessage = room.lastUserId === user?.userId

  return (
    <View className='flex flex-row gap-4 items-center flex-1'>
      <Avatar alt={sender?.memberName} className='size-12'>
        <AvatarImage source={{ uri: imageSource }} />
        <AvatarFallback>
          <Text>{sender?.memberName?.charAt(0)}</Text>
        </AvatarFallback>
      </Avatar>
      <View className='flex flex-col flex-1'>
        <Text className='font-inter-medium'>{sender?.memberName}</Text>
        <Text className='text-sm text-muted-foreground' numberOfLines={1}>
          {isMeLastMessage ? 'You: ' : ''}
          {room.lastMessage}
        </Text>
      </View>
      <Text className='self-start text-xs text-muted-foreground'>{format(room.lastTimestamp, 'hh:mm a')}</Text>
    </View>
  )
}
