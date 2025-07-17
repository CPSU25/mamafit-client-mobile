import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import orderService from '~/services/order.service'

export const useGetBranches = () => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['branches', user?.userId],
    queryFn: () => orderService.getBranches(),
    enabled: isAuthenticated
  })
}
