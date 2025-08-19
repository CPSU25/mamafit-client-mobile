import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import feedbackService from '~/services/feedback.service'

export const useGetRatedOrders = (enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['rated-orders', user?.userId],
    queryFn: feedbackService.getRatedOrders,
    enabled: isAuthenticated && enabled
  })
}
