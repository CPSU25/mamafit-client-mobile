import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetOrderItemMilestones = (orderItemId: string, enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['order-item-milestones', orderItemId, user?.userId],
    queryFn: () => orderService.getOrderItemMilestones(orderItemId),
    enabled: isAuthenticated && !!orderItemId && enabled
  })
}
