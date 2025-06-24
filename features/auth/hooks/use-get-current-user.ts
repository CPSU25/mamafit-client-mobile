import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import authService from '~/services/auth.service'

export const useGetCurrentUser = () => {
  const { isAuthenticated, tokens } = useAuth()

  return useQuery({
    queryKey: ['current-user', tokens?.accessToken, tokens?.refreshToken],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated
  })
}
