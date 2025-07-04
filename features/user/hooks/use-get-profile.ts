import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/hooks/use-auth'
import userService from '~/services/user.service'

export const useGetProfile = (userId: string | undefined) => {
  const { isAuthenticated, user } = useAuth()

  return useQuery({
    queryKey: ['profile', userId, user?.userId],
    queryFn: () => userService.getProfile(userId),
    enabled: !!userId && isAuthenticated
  })
}
