import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import chatService from '~/services/chat.service'

export const useGetRoomMessages = (roomId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['room-messages', roomId, user?.userId],
    queryFn: () => chatService.getRoomMessages(roomId),
    enabled: isAuthenticated
  })
}
