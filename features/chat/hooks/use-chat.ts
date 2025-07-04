import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useAuth } from '~/hooks/use-auth'
import chatHubService from '~/services/signalr/chat-hub.service'
import { ChatRoom, Message, MessageType } from '~/types/chat.type'

export const useChat = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const sendMessage = useCallback(
    async (roomId: string, message: string, type: MessageType) => {
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

        queryClient.setQueryData(['room-messages', roomId, user?.userId], (oldData: Message[]) => {
          const newMessage: Partial<Message> = {
            message,
            senderId: user?.userId ?? '',
            chatRoomId: roomId,
            type,
            messageTimestamp: new Date().toISOString()
          }

          return [...oldData, newMessage]
        })
      } catch (error) {
        console.error(error)
      }
    },
    [queryClient, user?.userId]
  )

  return { sendMessage }
}
