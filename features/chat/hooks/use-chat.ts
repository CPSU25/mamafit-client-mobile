import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useAuth } from '~/hooks/use-auth'
import signalRService from '~/services/signalr.service'
import { Message, MessageType } from '~/types/chat.type'

export const useChat = () => {
  const queryClient = useQueryClient()
  // const [joinedRooms, setJoinedRooms] = useState<Set<string>>(new Set())
  const { user } = useAuth()

  // const joinRoom = useCallback(
  //   async (roomId: string) => {
  //     if (joinedRooms.has(roomId)) return

  //     try {
  //       await signalRService.joinRoom(roomId)
  //       setJoinedRooms((prev) => {
  //         const newSet = new Set(prev)
  //         newSet.add(roomId)
  //         return newSet
  //       })
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   },
  //   [joinedRooms]
  // )

  const sendMessage = useCallback(
    async (roomId: string, message: string, type: MessageType) => {
      try {
        await signalRService.sendMessage(roomId, message, type)
        queryClient.invalidateQueries({ queryKey: ['rooms'] })

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
