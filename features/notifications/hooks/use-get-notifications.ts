import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import notificationService from '~/services/notification.service'
import { NotificationType } from '~/types/notification.type'

export const useGetNotifications = (type?: NotificationType) => {
  const { isAuthenticated, user } = useAuth()

  return useInfiniteQuery({
    queryKey: ['notifications', user?.userId],
    queryFn: ({ pageParam }) => notificationService.getNotifications(pageParam, 10, type),
    enabled: isAuthenticated,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined
    }
  })
}
