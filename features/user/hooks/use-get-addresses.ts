import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import userService from '~/services/user.service'

export const useGetAddresses = () => {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['addresses', user?.userId],
    queryFn: userService.getAddresses,
    enabled: isAuthenticated
  })
}
