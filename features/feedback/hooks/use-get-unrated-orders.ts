import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import feedbackService from '~/services/feedback.service'

export const useGetUnratedOrder = (enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['unrated-orders', user?.userId],
    queryFn: feedbackService.getUnratedOrders,
    enabled: isAuthenticated && enabled
  })
}
