import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import warrantyService from '~/services/warranty.service'

export const useGetWarrantyItem = (orderItemId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['warranty-item', orderItemId, user?.userId],
    queryFn: () => warrantyService.getWarrantyItemByOrderItem(orderItemId),
    enabled: isAuthenticated && Boolean(orderItemId)
  })
}
