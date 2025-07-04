import { format } from 'date-fns'
import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import { useAuth } from '~/hooks/use-auth'
import { cn } from '~/lib/utils'
import { Message } from '~/types/chat.type'

interface RoomMessageProps {
  message: Message
}

export default function RoomMessage({ message }: RoomMessageProps) {
  const { user } = useAuth()

  const isMe = message.senderId === user?.userId

  // TODO: Add message for image, file, etc.

  return (
    <View className={cn('flex-row', isMe ? 'justify-end' : 'justify-start')}>
      <View className={cn('max-w-[80%] rounded-2xl py-2 px-4', isMe ? 'bg-primary' : 'bg-muted')}>
        <Text className={cn('text-base', isMe ? 'text-white' : 'text-foreground')}>{message.message}</Text>

        <Text className={cn('text-xs mt-1', isMe ? 'text-white/50 text-right' : 'text-foreground/50 text-left')}>
          {format(message.messageTimestamp, 'HH:mm a')}
        </Text>
      </View>
    </View>
  )
}
