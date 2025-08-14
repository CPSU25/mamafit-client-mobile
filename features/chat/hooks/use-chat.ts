import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { formatRealtimeMessageType } from '~/lib/utils'
import chatHubService from '~/services/signalr/chat-hub.service'
import { ChatRoom, Message, MessageTypeDB, MessageTypeRealTime } from '~/types/chat.type'

export const useChat = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const sendMessage = useCallback(
    async (roomId: string, message: string, type: MessageTypeRealTime) => {
      try {
        await chatHubService.sendMessage(roomId, message, type)

        queryClient.setQueryData(['rooms', user?.userId], (oldData: ChatRoom[] | undefined) => {
          if (!oldData) return oldData

          const newRooms: ChatRoom[] = oldData.map((room) => {
            if (room.id === roomId) {
              const newRoom: Partial<ChatRoom> = {
                lastMessage: message,
                lastTimestamp: new Date().toISOString(),
                lastUserId: user?.userId ?? '',
                lastUserName: user?.username ?? 'You'
              }
              return { ...room, ...newRoom }
            }
            return room
          })

          return newRooms
        })

        queryClient.setQueryData(
          ['room-messages', roomId, user?.userId],
          (oldData: { pages: Message<MessageTypeDB>[][]; pageParams: number[] } | undefined) => {
            if (!oldData) return oldData

            const newMessage: Message<MessageTypeDB> = {
              id: `temp-${Date.now()}`,
              message,
              senderId: user?.userId ?? '',
              chatRoomId: roomId,
              type: formatRealtimeMessageType(type),
              messageTimestamp: new Date().toISOString(),
              senderName: user?.username ?? 'You',
              senderAvatar: '',
              isRead: false
            }

            const updatedPages = [...oldData.pages]
            if (updatedPages.length > 0) {
              updatedPages[0] = [...updatedPages[0], newMessage]
            } else {
              updatedPages.push([newMessage])
            }

            return {
              ...oldData,
              pages: updatedPages
            }
          }
        )
      } catch (error) {
        console.error(error)
      }
    },
    [queryClient, user?.userId, user?.username]
  )

  return { sendMessage }
}
