import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import warrantyService from '~/services/warranty.service'

export const useGetOrderRequests = () => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['order-requests', user?.id],
    queryFn: () => warrantyService.getOrderRequests(),
    enabled: isAuthenticated
  })
}
