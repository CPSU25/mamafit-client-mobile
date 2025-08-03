import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetDesignRequest = (designRequestId: string) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['design-request', designRequestId, user?.userId],
    queryFn: () => orderService.getDesignRequest(designRequestId),
    enabled: isAuthenticated && Boolean(designRequestId)
  })
}
