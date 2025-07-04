import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import authService from '~/services/auth.service'

export const useGetCurrentUser = () => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['current-user', user?.userId],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated
  })
}
