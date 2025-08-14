import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import warrantyService from '~/services/warranty.service'

export const useGetWarrantyItems = (orderItemId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['warranty-items', orderItemId, user?.userId],
    queryFn: () => warrantyService.getWarrantyItemsByOrderItem(orderItemId),
    enabled: isAuthenticated && Boolean(orderItemId)
  })
}
