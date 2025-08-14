import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetOrderItem = (orderItemId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['order-item', orderItemId, user?.userId],
    queryFn: () => orderService.getOrderItem(orderItemId),
    enabled: isAuthenticated && Boolean(orderItemId)
  })
}
