import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetOrder = (orderId: string) => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['order', orderId, user?.userId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: isAuthenticated
  })
}
