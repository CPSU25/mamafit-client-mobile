import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetDesignerInfo = (orderItemId: string, enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['designer-info', orderItemId, user?.userId],
    queryFn: () => orderService.getDesignerInfo(orderItemId),
    enabled: isAuthenticated && !!orderItemId && enabled
  })
}
