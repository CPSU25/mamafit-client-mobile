import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import chatService from '~/services/chat.service'

export const useGetRooms = () => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['rooms', user?.userId],
    queryFn: chatService.getRooms,
    enabled: isAuthenticated
  })
}
