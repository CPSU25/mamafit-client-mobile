import { format } from 'date-fns'
import { useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { toast } from 'sonner-native'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { placeholderImage, styles } from '~/lib/constants/constants'
import { isValidUrl } from '~/lib/utils'
import signalRService from '~/services/signalr.service'
import { Message } from '~/types/chat.type'
import { useAuth } from './use-auth'

export const useSignalR = () => {
  const { isAuthenticated, user } = useAuth()

  const isAttemptedReconnect = useRef(false)
  const currentMessages = useRef(new Set<string>())

  // Function to display incoming messages from other users across the app
  const displayMessage = useCallback(
    (message: Message) => {
      const messageId = message.id || `${message.chatRoomId}-${message.messageTimestamp || Date.now()}`
      const imageSource =
        message.senderAvatar && isValidUrl(message.senderAvatar) ? message.senderAvatar : placeholderImage

      if (currentMessages.current.has(messageId)) {
        return
      }

      currentMessages.current.add(messageId)

      if (currentMessages.current.size > 1000) {
        const recentMessages = Array.from(currentMessages.current).slice(-1000)
        currentMessages.current = new Set(recentMessages)
      }

      const isNotMe = message.senderId !== user?.id

      if (isNotMe) {
        toast.custom(
          <Card className='mx-4 mt-2' style={[styles.container]}>
            <View className='flex-row items-center gap-2 px-3 py-1'>
              <View className='size-2 rounded-full bg-emerald-500' />
              <Text className='text-xs font-inter-medium'>New incoming message</Text>
            </View>
            <Separator />
            <View className='flex-row items-center gap-3 p-3'>
              <Avatar alt={message.senderName} className='size-10 border-2 border-primary'>
                <AvatarImage source={{ uri: imageSource }} />
                <AvatarFallback>
                  <Text>{message?.senderName?.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>
              <View className='flex-1'>
                <View className='flex-row items-center gap-2'>
                  <Text className='text-sm font-inter-medium'>{message.senderName}</Text>
                  <Text className='text-xs text-muted-foreground ml-auto'>
                    {format(message.messageTimestamp, 'HH:mm a')}
                  </Text>
                </View>
                <Text className='text-xs text-muted-foreground mr-1' numberOfLines={1}>
                  {message.message}
                </Text>
              </View>
            </View>
          </Card>
        )
      }
    },
    [user?.id]
  )

  // If the user is authenticated, listen for new messages
  useEffect(() => {
    if (isAuthenticated) {
      const messageHandler = (...args: unknown[]) => {
        const message = args[0] as Message
        displayMessage(message)
      }

      signalRService.on('ReceiveMessage', messageHandler)

      return () => {
        signalRService.off('ReceiveMessage', messageHandler)
      }
    }
  }, [isAuthenticated, displayMessage])

  // Automatically connect/disconnect SignalR based on authentication state
  useEffect(() => {
    let mounted = true

    const handleConnectionChange = () => {
      if (isAuthenticated) {
        if (!isAttemptedReconnect.current && !signalRService.isConnected) {
          isAttemptedReconnect.current = true
          signalRService.connect()
        }
      } else {
        if (signalRService.isConnected) {
          signalRService.disconnect()
          isAttemptedReconnect.current = false
          currentMessages.current.clear()
        }
      }
    }

    if (mounted) {
      handleConnectionChange()
    }

    return () => {
      mounted = false
    }
  }, [isAuthenticated])
}
