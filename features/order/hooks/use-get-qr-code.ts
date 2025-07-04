import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetQRCode = (orderId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['qr-code', orderId, user?.userId],
    queryFn: () => orderService.getQRCode(orderId),
    enabled: isAuthenticated
  })
}
