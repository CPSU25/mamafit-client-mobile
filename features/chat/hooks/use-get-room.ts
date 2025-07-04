import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import chatService from '~/services/chat.service'

export const useGetRoom = (roomId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['room', roomId, user?.userId],
    queryFn: () => chatService.getRoom(roomId),
    enabled: isAuthenticated
  })
}
