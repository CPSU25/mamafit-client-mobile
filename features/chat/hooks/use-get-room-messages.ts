import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import chatService from '~/services/chat.service'

export const useGetRoomMessages = (roomId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useInfiniteQuery({
    queryKey: ['room-messages', roomId, user?.userId],
    queryFn: ({ pageParam = 1 }) => chatService.getRoomMessages(roomId, pageParam),
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 30) {
        return undefined
      }
      return allPages.length + 1
    }
  })
}
