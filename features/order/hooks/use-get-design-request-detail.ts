import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetDesignRequestDetail = (designRequestId: string, enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['design-request-detail', designRequestId, user?.userId],
    queryFn: () => orderService.getDesignRequestDetail(designRequestId),
    enabled: isAuthenticated && !!designRequestId && enabled
  })
}
