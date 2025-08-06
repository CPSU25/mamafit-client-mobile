import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import warrantyService from '~/services/warranty.service'

export const useGetWarrantyRequest = (orderItemId: string, enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['warranty-request', orderItemId, user?.userId],
    queryFn: () => warrantyService.getWarrantyRequests(orderItemId),
    enabled: isAuthenticated && Boolean(orderItemId) && enabled
  })
}
