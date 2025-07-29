import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetOrdersCount = () => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['orders-count', user?.userId],
    queryFn: () => orderService.getOrdersCount(),
    enabled: isAuthenticated
  })
}
