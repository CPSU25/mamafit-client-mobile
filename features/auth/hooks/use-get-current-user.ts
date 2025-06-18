import authApi from '~/apis/auth.api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'

export const useGetCurrentUser = () => {
  const { isAuthenticated, tokens } = useAuth()

  return useQuery({
    queryKey: ['current-user', tokens?.accessToken, tokens?.refreshToken],
    queryFn: authApi.currentUser,
    enabled: isAuthenticated
  })
}
