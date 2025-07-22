import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetAddOns = () => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['add-ons', user?.userId],
    queryFn: () => orderService.getAddOns(),
    enabled: isAuthenticated
  })
}
