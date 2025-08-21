import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetOrderForFeedback = (orderId: string) => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['order-for-feedback', orderId, user?.userId],
    queryFn: () => orderService.getOrderForFeedback(orderId),
    enabled: isAuthenticated
  })
}
