import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetDesignRequestPreset = (designRequestId: string, enabled: boolean) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['design-request-preset', designRequestId, user?.userId],
    queryFn: () => orderService.getDesignRequestPreset(designRequestId),
    enabled: isAuthenticated && !!designRequestId && enabled
  })
}
