import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import feedbackService from '~/services/feedback.service'

export const useGetFeedbackStatus = (orderId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['feedback-status', orderId, user?.userId],
    queryFn: () => feedbackService.getFeedbackStatus(orderId),
    enabled: isAuthenticated && Boolean(orderId)
  })
}
