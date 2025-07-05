import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export function useGetPaymentStatus(orderId: string) {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['payment-status', orderId, user?.userId],
    queryFn: () => orderService.getPaymentStatus(orderId),
    enabled: !!orderId && isAuthenticated
  })
}
