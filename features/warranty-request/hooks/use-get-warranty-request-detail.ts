import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import warrantyService from '~/services/warranty.service'

export const useGetWarrantyRequestDetail = (orderId: string, enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['warranty-request-detail', orderId, user?.userId],
    queryFn: () => warrantyService.getWarrantyRequestDetail(orderId),
    enabled: isAuthenticated && Boolean(orderId) && enabled
  })
}
